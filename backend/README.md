# Dayflow Backend

## Stack
Express 5 + TypeScript · Prisma 7 · PostgreSQL 16 (Docker) · Socket.IO

## Setup

**1. Start Postgres** (from repo root):
```bash
docker compose up -d
```

**2. Install dependencies:**
```bash
cd backend
npm install
```

**3. Set up environment variables:**
```bash
cp .env.example .env
```

**4. Apply database migrations:**
```bash
npx prisma migrate deploy
```

**5. Generate Prisma Client:**
```bash
npx prisma generate
```

**6. (Optional) Seed demo data** — 1 admin, 12 employees, 60 days attendance, leave history:
```bash
npx prisma db seed
```

**7. Verify database** (opens Prisma Studio):
```bash
npx prisma studio
```

## Database
Schema source of truth: `prisma/schema.prisma`

10 models: User, EmployeeProfile, Document, AttendanceRecord, LeaveRequest, LeaveBalance, SalaryStructure, Payslip, Notification, AuditLog.

