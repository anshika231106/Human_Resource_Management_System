import { Router, Request, Response } from 'express';

const router = Router();

// TODO: Implement leave management routes (apply, approve, history, etc.)
router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'leave route' });
});

export default router;
