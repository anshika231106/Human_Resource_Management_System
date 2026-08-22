import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateEmployeeCode } from '../lib/generateLoginId';
import { generatePassword } from '../lib/generatePassword';
import { sendCredentialsEmail } from '../lib/sendCredentialsEmail';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Basic admin auth middleware
export const requireAdmin = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden. Admin only.' });
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/employee', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, jobTitle, department, joinDate } = req.body;
    
    if (!firstName || !lastName || !email || !jobTitle || !department || !joinDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const year = new Date(joinDate).getFullYear();
    if (isNaN(year)) return res.status(400).json({ error: 'Invalid joinDate' });

    // Transaction to ensure atomic creation
    const newEmployee = await prisma.$transaction(async (tx) => {
      // Find the count of employees joined in this year to generate the serial
      const count = await tx.employeeProfile.count({
        where: {
          joinDate: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
        },
      });

      const serial = count + 1;
      const employeeCode = generateEmployeeCode(firstName, lastName, year, serial);
      const tempPassword = generatePassword(10);
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      const user = await tx.user.create({
        data: {
          email: email.trim().toLowerCase(),
          passwordHash,
          role: 'EMPLOYEE',
          mustChangePassword: true,
          profile: {
            create: {
              employeeCode,
              name: `${firstName} ${lastName}`,
              phone: phone || '',
              jobTitle,
              department,
              joinDate: new Date(joinDate),
            },
          },
        },
        include: { profile: true },
      });

      return { user, tempPassword };
    });

    // Fire & Forget email
    sendCredentialsEmail(
      newEmployee.user.email,
      newEmployee.user.profile!.name,
      newEmployee.user.profile!.employeeCode,
      newEmployee.tempPassword
    ).catch(console.error);

    return res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        id: newEmployee.user.profile!.id,
        name: newEmployee.user.profile!.name,
        employeeCode: newEmployee.user.profile!.employeeCode,
        jobTitle: newEmployee.user.profile!.jobTitle,
        department: newEmployee.user.profile!.department,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    console.error('Error creating employee:', error);
    return res.status(500).json({ error: 'Failed to create employee' });
  }
});

// GET /api/users - Fetch all employees from database
router.get('/', async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const profiles = await prisma.employeeProfile.findMany({
      orderBy: { name: 'asc' },
      include: {
        user: { select: { id: true, email: true, role: true } },
        manager: { select: { id: true, name: true } },
        salaryStructures: { orderBy: { effectiveFrom: 'desc' }, take: 1 },
        attendance: {
          where: { date: today }
        }
      },
    });

    const employees = profiles.map((p) => {
      const salary = p.salaryStructures[0];
      return {
        id: p.id,
        userId: p.userId,
        employeeCode: p.employeeCode,
        name: p.name,
        email: p.user.email,
        phone: p.phone,
        role: p.jobTitle,
        department: p.department,
        joinDate: p.joinDate.toISOString().split('T')[0],
        address: p.address || '123 Enterprise Way, Tech Park',
        manager: p.manager?.name || 'Priya Kapoor (HR Manager)',
        basicSalary: salary ? Number(salary.basicSalary) : 40000,
        hraPercent: salary ? Number(salary.hraPercent) : 50,
        pfPercent: salary ? Number(salary.pfPercent) : 12,
        avatar: p.avatarUrl || null,
        status: p.isActive ? 'Active' : 'Inactive',
        todayStatus: p.attendance[0]?.status || 'ABSENT',
      };
    });

    return res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// GET /api/users/:id - Fetch single employee details from database
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { id } = req.params;
    const profile = await prisma.employeeProfile.findFirst({
      where: { OR: [{ id }, { userId: id }, { employeeCode: id }] },
      include: {
        user: { select: { id: true, email: true, role: true } },
        manager: { select: { id: true, name: true } },
        salaryStructures: { orderBy: { effectiveFrom: 'desc' }, take: 1 },
        documents: true,
        attendance: {
          where: { date: today }
        }
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const salary = profile.salaryStructures[0];
    return res.json({
      id: profile.id,
      userId: profile.userId,
      employeeCode: profile.employeeCode,
      name: profile.name,
      email: profile.user.email,
      phone: profile.phone,
      role: profile.jobTitle,
      department: profile.department,
      joinDate: profile.joinDate.toISOString().split('T')[0],
      address: profile.address || '123 Enterprise Way, Tech Park',
      manager: profile.manager?.name || 'Priya Kapoor (HR Manager)',
      basicSalary: salary ? Number(salary.basicSalary) : 40000,
      hraPercent: salary ? Number(salary.hraPercent) : 50,
      pfPercent: salary ? Number(salary.pfPercent) : 12,
      avatar: profile.avatarUrl || null,
      status: profile.isActive ? 'Active' : 'Inactive',
      todayStatus: profile.attendance[0]?.status || 'ABSENT',
      documents: profile.documents.map((d) => ({
        name: d.name,
        fileUrl: d.fileUrl,
        uploadedAt: d.uploadedAt.toISOString().split('T')[0],
      })),
    });
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    return res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

export default router;
