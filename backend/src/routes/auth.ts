import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

router.post('/login', async (req: Request, res: Response) => {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const { loginId, password, role } = req.body ?? {};

  if (typeof loginId !== 'string' || typeof password !== 'string' || !loginId.trim() || !password) {
    return res.status(400).json({ error: 'Login ID and password are required' });
  }

  // Find user by employeeCode (Login ID)
  const profile = await prisma.employeeProfile.findUnique({
    where: { employeeCode: loginId.trim().toUpperCase() },
    include: { user: true },
  });

  if (!profile || !profile.user) {
    return res.status(401).json({ error: 'Invalid Login ID or password' });
  }

  const user = profile.user;

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid Login ID or password' });
  }

  if (role && role.toUpperCase() !== user.role) {
    return res.status(403).json({
      error: `This account is not registered as ${role === 'admin' ? 'an Administrator' : 'an Employee'}`,
    });
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      name: profile.name ?? null,
      employeeCode: profile.employeeCode ?? null,
      jobTitle: profile.jobTitle ?? null,
      department: profile.department ?? null,
    },
  });
});

export default router;
