import { Router, Request, Response } from 'express';

const router = Router();

// TODO: Implement user management routes (CRUD, profile, etc.)
router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'users route' });
});

export default router;
