# Dayflow — Human Resource Management System

> Every workday, perfectly aligned.

Dayflow is a role-based Human Resource Management System (HRMS) that digitizes and streamlines core HR operations, including onboarding, profile management, attendance tracking, leave management, payroll visibility, and approval workflows for both employees and HR administrators.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
---

## Overview

Dayflow provides a single platform on which employees manage their own profile, attendance, and leave requests, while HR and administrative users retain full visibility and control over the workforce. Approvals, payroll, and reporting are consolidated into one dashboard.

### Definitions

| Term | Meaning |
|---|---|
| **Administrator / HR Officer** | A user granted management and approval privileges. |
| **Employee** | A standard user with limited, self-service access. |
| **Time-Off** | Any category of leave, including paid leave, sick leave, and unpaid leave. |

---

## Features

### Authentication and Authorization

- Registration using Employee ID, email address, password, and role (Employee or HR).
- Enforced password complexity rules and mandatory email verification.
- Sign-in with explicit error handling for invalid credentials.
- Role-based redirection to the appropriate dashboard upon successful authentication.

### Dashboards

- **Employee.** Quick-access cards for profile, attendance, and leave requests, together with recent activity and alerts.
- **Administrator / HR.** A consolidated employee directory, attendance records, pending leave approvals, and the ability to switch between individual employee views.

### Profile Management

- Access to personal details, job details, salary structure, supporting documents, and profile photograph.
- Employees may edit a restricted set of fields, namely address, telephone number, and profile photograph.
- Administrators may edit all employee details.

### Attendance Management

- Daily and weekly attendance views.
- Check-in and check-out functionality for employees.
- Status tracking across four states: Present, Absent, Half-day, and Leave.
- Employees may view only their own records; administrators may view records for all employees.

### Leave and Time-Off Management

- Submission of leave applications specifying type, date range, and supporting remarks.
- Request status tracking across three states: Pending, Approved, and Rejected.
- An administrative approval workflow supporting reviewer comments, with outcomes reflected immediately in the relevant employee record.

### Payroll and Salary Management

- Read-only payroll view for employees.
- Administrative access to view and update salary structures across the organization.

### Notifications and Reports

- Email and in-application notification alerts.
- An analytics dashboard providing salary slips and attendance reports.

---

## User Roles

The following matrix defines the capabilities available to each role.

| Capability | Employee | Administrator / HR |
|---|:---:|:---:|
| View own profile | Yes | Yes |
| Edit own profile (restricted fields) | Yes | Not applicable |
| Edit any employee's profile | No | Yes |
| View own attendance | Yes | Yes |
| View attendance for all employees | No | Yes |
| Submit a leave application | Yes | Not applicable |
| Approve or reject a leave application | No | Yes |
| View own payroll (read-only) | Yes | Yes |
| Edit payroll | No | Yes |
| View analytics and reports | No | Yes |

Entries marked *Not applicable* denote capabilities that are superseded by broader administrative privileges listed elsewhere in the matrix.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, TailwindCSS v4, React Router |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Authentication | JSON Web Tokens (JWT) |
| Version Control | Git and GitHub |

---

## Getting Started

### Prerequisites

- Node.js (v20+ recommended).
- PostgreSQL database running locally or remotely.
- Git.

### Installation

```bash
# Clone the repository
git clone https://github.com/AtharvaKanade/dayflow-hrms.git
cd dayflow-hrms

# Configure Backend environment variables
cd backend
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Install backend dependencies
npm install

# Run database migrations and seed data
npx prisma migrate dev
npx prisma db seed

# Start the backend server
npm run dev

# In a new terminal, configure and start the frontend
cd ../frontend
npm install
npm run dev
```

---

## Project Structure

```text
├── backend/                  # Express.js REST API
│   ├── prisma/               # Database schema and seeders
│   └── src/
│       ├── routes/           # API Endpoints (auth, dashboard, attendance)
│       └── ...
└── frontend/                 # React frontend application
    ├── src/
    │   ├── modules/          # Feature-based architecture (auth, dashboard, attendance)
    │   ├── styles/           # Global and component styles
    │   └── ...
```

---

## Contributing

Contributors are asked to observe the following process.

1. Create a feature branch from `main` using the command `git checkout -b feature/<name>`.
2. Commit changes with clear and descriptive commit messages.
3. Push the branch and open a pull request for review.
4. All team members are expected to commit to and manage the repository directly; ownership is shared rather than assigned to any single individual.

---

## Roadmap

Planned milestones and future enhancements will be documented in this section as the project scope is confirmed.
