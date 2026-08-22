import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAdmin } from '../routes/users';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// Get leave balance for the logged-in employee
router.get('/balance', async (req: Request, res: Response) => {
  const userId = (req as any).user?.sub;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const profile = await prisma.employeeProfile.findUnique({
    where: { userId },
    include: { leaveBalances: true },
  });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json({ balances: profile.leaveBalances });
});

// Get leave request history for the logged-in employee
router.get('/history', async (req: Request, res: Response) => {
  const userId = (req as any).user?.sub;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const profile = await prisma.employeeProfile.findUnique({ where: { userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const requests = await prisma.leaveRequest.findMany({
    where: { employeeId: profile.id },
    orderBy: { createdAt: 'desc' },
    include: { employee: { select: { name: true, employeeCode: true } } },
  });
  res.json({ requests });
});

// Admin: get ALL employees' leave requests
router.get('/all', requireAdmin, async (_req: Request, res: Response) => {
  const requests = await prisma.leaveRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      employee: { select: { name: true, employeeCode: true } },
    },
  });
  res.json({ requests });
});

// Employee creates a new leave request
router.post('/request', async (req: Request, res: Response) => {
  const userId = (req as any).user?.sub;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { type, startDate, endDate, remarks } = req.body;
  if (!type || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const profile = await prisma.employeeProfile.findUnique({ where: { userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const newReq = await prisma.leaveRequest.create({
    data: {
      employeeId: profile.id,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      remarks: remarks || '',
      status: 'PENDING',
    },
    include: { employee: { select: { name: true, employeeCode: true } } },
  });
  res.status(201).json({ request: newReq });
});

// Admin approves a leave request
router.patch('/:id/approve', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const reviewerId = (req as any).user?.sub;
  const updated = await prisma.$transaction(async (tx) => {
    const request = await tx.leaveRequest.update({
      where: { id },
      data: { status: 'APPROVED', reviewerId },
      include: { employee: { include: { user: true } } },
    });

    const startDate = new Date(request.startDate.toISOString().slice(0, 10) + 'T00:00:00');
    const endDate = new Date(request.endDate.toISOString().slice(0, 10) + 'T00:00:00');
    for (const date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      await tx.attendanceRecord.upsert({
        where: {
          employeeId_date: { employeeId: request.employeeId, date: new Date(date) },
        },
        update: { status: 'LEAVE', checkIn: null, checkOut: null, note: request.remarks },
        create: {
          employeeId: request.employeeId,
          date: new Date(date),
          status: 'LEAVE',
          note: request.remarks,
        },
      });
    }

    return request;
  });
  await prisma.notification.create({
    data: {
      userId: updated.employee.user.id,
      message: `Your leave request (${updated.type}) from ${updated.startDate.toDateString()} to ${updated.endDate.toDateString()} has been approved.`,
    },
  });
  res.json({ request: updated });
});

// Admin rejects a leave request
router.patch('/:id/reject', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const reviewerId = (req as any).user?.sub;
  const updated = await prisma.leaveRequest.update({
    where: { id },
    data: { status: 'REJECTED', reviewerId },
    include: { employee: { include: { user: true } } },
  });
  await prisma.notification.create({
    data: {
      userId: updated.employee.user.id,
      message: `Your leave request (${updated.type}) from ${updated.startDate.toDateString()} to ${updated.endDate.toDateString()} has been rejected.`,
    },
  });
  res.json({ request: updated });
});

export default router;
