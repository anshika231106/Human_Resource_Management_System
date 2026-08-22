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
  const targetDate = date
    ? (() => {
        const [year, month, day] = String(date).split('-').map(Number);
        return new Date(year, month - 1, day);
      })()
    : new Date();
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
/**
 * GET /api/attendance/employee/:id?month=YYYY-MM
 * Returns all attendance records for a specific employee in a given month.
 */
router.get('/employee/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { month } = req.query; // format: 'YYYY-MM'

  if (!month || typeof month !== 'string') {
    return res.status(400).json({ error: 'Month parameter is required (YYYY-MM).' });
  }

  const [yearStr, monthStr] = month.split('-');
  const yearNum = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10) - 1;

  if (isNaN(yearNum) || isNaN(monthNum)) {
    return res.status(400).json({ error: 'Invalid month format (YYYY-MM).' });
  }

  const startDate = new Date(yearNum, monthNum, 1);
  const endDate = new Date(yearNum, monthNum + 1, 0);

  // find employee
  const profile = await prisma.employeeProfile.findFirst({
    where: { OR: [{ id }, { userId: id }] },
  });

  if (!profile) {
    return res.status(404).json({ error: 'Employee not found.' });
  }

  const records = await prisma.attendanceRecord.findMany({
    where: {
      employeeId: profile.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
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
    orderBy: { date: 'asc' },
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
