import { PrismaClient, Role, LeaveType, LeaveStatus, AttendanceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const FIRST_NAMES = ['Aarav', 'Diya', 'Kabir', 'Ishaan', 'Ananya', 'Vihaan', 'Meera', 'Rohan', 'Sara', 'Aditya', 'Neha', 'Kunal'];
const LAST_NAMES = ['Sharma', 'Verma', 'Iyer', 'Reddy', 'Nair', 'Gupta', 'Rao', 'Joshi', 'Mehta', 'Singh', 'Das', 'Pillai'];
const DEPARTMENTS = ['Engineering', 'HR', 'Sales', 'Design'];

function generateEmployeeCode(firstName: string, lastName: string, joinYear: number, serial: number) {
  const initials = (firstName.slice(0, 2) + lastName.slice(0, 2)).toUpperCase();
  return `OI${initials}${joinYear}${String(serial).padStart(4, '0')}`;
}

async function main() {
  console.log('Seeding...');

  // 1 Admin
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@dayflow.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      mustChangePassword: false,
      emailVerifiedAt: new Date(),
      profile: {
        create: {
          employeeCode: generateEmployeeCode('Priya', 'Kapoor', 2022, 1),
          name: 'Priya Kapoor',
          phone: '9876543210',
          jobTitle: 'HR Manager',
          department: 'HR',
          joinDate: new Date('2022-01-10'),
        },
      },
    },
    include: { profile: true },
  });

  // 12 Employees
  const employees = [];
  for (let i = 0; i < 12; i++) {
    const firstName = FIRST_NAMES[i];
    const lastName = LAST_NAMES[i];
    const joinYear = 2023 + (i % 3);
    const passwordHash = await bcrypt.hash('Welcome@123', 10);

    const user = await prisma.user.create({
      data: {
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@dayflow.com`,
        passwordHash,
        role: Role.EMPLOYEE,
        mustChangePassword: true,
        emailVerifiedAt: new Date(),
        profile: {
          create: {
            employeeCode: generateEmployeeCode(firstName, lastName, joinYear, i + 1),
            name: `${firstName} ${lastName}`,
            phone: `98765${String(10000 + i).slice(-5)}`,
            jobTitle: ['Software Engineer', 'Product Designer', 'Sales Associate'][i % 3],
            department: DEPARTMENTS[i % DEPARTMENTS.length],
            joinDate: new Date(`${joinYear}-0${(i % 9) + 1}-15`),
            managerId: adminUser.profile?.id,
          },
        },
      },
      include: { profile: true },
    });
    employees.push(user);

    // Leave balance for current year
    await prisma.leaveBalance.create({
      data: {
        employeeId: user.profile!.id,
        year: 2026,
        paidDays: 24,
        sickDays: 12,
      },
    });

    // Salary structure
    await prisma.salaryStructure.create({
      data: {
        employeeId: user.profile!.id,
        basicSalary: 40000 + i * 2000,
        hraPercent: 50,
        pfPercent: 12,
        effectiveFrom: new Date(`${joinYear}-01-01`),
      },
    });

    // 60 days of attendance history
    for (let d = 0; d < 60; d++) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      // skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const rand = Math.random();
      const status = rand < 0.85 ? AttendanceStatus.PRESENT : rand < 0.92 ? AttendanceStatus.HALF_DAY : rand < 0.97 ? AttendanceStatus.ABSENT : AttendanceStatus.LEAVE;

      await prisma.attendanceRecord.create({
        data: {
          employeeId: user.profile!.id,
          date,
          checkIn: status === AttendanceStatus.ABSENT ? null : new Date(date.setHours(9, Math.floor(Math.random() * 30), 0)),
          checkOut: status === AttendanceStatus.ABSENT ? null : new Date(date.setHours(18, Math.floor(Math.random() * 30), 0)),
          status,
        },
      });
    }
  }

  // Leave requests in all 3 states
  const leaveStates = [LeaveStatus.PENDING, LeaveStatus.APPROVED, LeaveStatus.REJECTED];
  for (let i = 0; i < 6; i++) {
    const emp = employees[i];
    const status = leaveStates[i % 3];
    const start = new Date();
    start.setDate(start.getDate() + 3 + i);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    await prisma.leaveRequest.create({
      data: {
        employeeId: emp.profile!.id,
        type: [LeaveType.PAID, LeaveType.SICK, LeaveType.UNPAID][i % 3],
        startDate: start,
        endDate: end,
        remarks: 'Personal work',
        status,
        reviewerId: status !== LeaveStatus.PENDING ? adminUser.id : null,
        reviewComments: status === LeaveStatus.APPROVED ? 'Approved, enjoy your leave' : status === LeaveStatus.REJECTED ? 'Team understaffed this week' : null,
      },
    });
  }

  console.log('Seed complete:', {
    admin: adminUser.email,
    employees: employees.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });