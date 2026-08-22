import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import attendanceRoutes from './routes/attendance';
import leaveRoutes from './routes/leave';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);

app.get('/api/health', (_req: Request, res: Response) =>
  res.json({ ok: true, service: 'dayflow-hrms-api' })
);

// Typed error handler so a thrown error doesn't crash the demo
const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
app.use(errorHandler);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () =>
  console.log(`Dayflow API running on http://localhost:${PORT}`)
);

export default app;
