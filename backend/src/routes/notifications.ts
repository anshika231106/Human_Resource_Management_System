// src/routes/notifications.ts
import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Get notifications for the logged‑in user
router.get('/', async (req: Request, res: Response) => {
  const userId = (req as any).user?.sub;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const notes = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ notifications: notes });
});

export default router;
