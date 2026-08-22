import { Router, Request, Response } from 'express';

const router = Router();

// TODO: Implement authentication routes (login, register, logout, etc.)
router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'auth route' });
});

export default router;
