import { Router, Request, Response } from 'express';

const router = Router();

// TODO: Implement attendance routes (check-in, check-out, history, etc.)
router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'attendance route' });
});

export default router;
