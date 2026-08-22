import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * GET /api/attendance?date=YYYY-MM-DD
 * Returns all employee attendance records for the given date,
 * including computed work hours and extra hours.
 */
router.get('/', async (req: Request, res: Response) => {
  const { date } = req.query;

  // Default to today if no date provided
  const targetDate = date ? new Date(date as string) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  if (isNaN(targetDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  const records = await prisma.attendanceRecord.findMany({
    where: { date: targetDate },
    include: {
      employee: {
        select: {
          id: true,
          employeeCode: true,
          name: true,
          department: true,
          jobTitle: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { employee: { name: 'asc' } },
  });

  const STANDARD_HOURS = 9;

  const mapped = records.map((rec) => {
    let workHours: string | null = null;
    let extraHours: string | null = null;

    if (rec.checkIn && rec.checkOut) {
      const diffMs = rec.checkOut.getTime() - rec.checkIn.getTime();
      const totalHours = diffMs / (1000 * 60 * 60);
      const hrs = Math.floor(totalHours);
      const mins = Math.round((totalHours - hrs) * 60);
      workHours = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

      const extra = totalHours - STANDARD_HOURS;
      if (extra > 0) {
        const eHrs = Math.floor(extra);
        const eMins = Math.round((extra - eHrs) * 60);
        extraHours = `${String(eHrs).padStart(2, '0')}:${String(eMins).padStart(2, '0')}`;
      } else {
        extraHours = '00:00';
      }
    }

    return {
      id: rec.id,
      date: rec.date.toISOString().split('T')[0],
      checkIn: rec.checkIn?.toISOString() ?? null,
      checkOut: rec.checkOut?.toISOString() ?? null,
      status: rec.status,
      note: rec.note,
      workHours,
      extraHours,
      employee: rec.employee,
    };
  });

  return res.json(mapped);
});

export default router;
