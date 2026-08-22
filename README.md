# Dayflow — Human Resource Management System
 
> Every workday, perfectly aligned.
 
Dayflow is a role-based HRMS that digitizes and streamlines core HR operations — onboarding, profile management, attendance tracking, leave management, payroll visibility, and approval workflows for both employees and HR admins.
 
---
 
## 📋 Table of Contents
 
- [Overview](#overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Guidelines](#project-guidelines)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
---
 
## Overview
 
Dayflow provides a single platform where employees can manage their own profile, attendance, and leave requests, while HR/Admin users get full visibility and control over the workforce — approvals, payroll, and reporting — all in one dashboard.
 
### Definitions
 
| Term | Meaning |
|---|---|
| **Admin / HR Officer** | User with management and approval privileges |
| **Employee** | Regular user with limited, self-service access |
| **Time-Off** | Paid leave, sick leave, unpaid leave, etc. |
 
---
 
## Features
 
### 🔐 Authentication & Authorization
- Sign up with Employee ID, Email, Password, and Role (Employee / HR)
- Secure password rules + email verification
- Sign in with error handling for invalid credentials
- Role-based redirect to the appropriate dashboard
### 📊 Dashboards
- **Employee:** quick-access cards for Profile, Attendance, Leave Requests, and recent activity/alerts
- **Admin/HR:** employee list, attendance records, leave approvals, and the ability to switch between employees
### 👤 Profile Management
- View personal details, job details, salary structure, documents, and profile picture
- Employees can edit limited fields (address, phone, profile picture)
- Admins can edit all employee details
### 🕒 Attendance Management
- Daily and weekly attendance views
- Check-in / check-out for employees
- Status tracking: Present, Absent, Half-day, Leave
- Employees see only their own records; Admins see everyone's
### 🌴 Leave & Time-Off Management
- Apply for leave (type, date range, remarks)
- Track request status: Pending, Approved, Rejected
- Admin approval workflow with comments, reflected immediately in employee records
### 💰 Payroll / Salary Management
- Read-only payroll view for employees
- Admins can view and update salary structures across the organization
### 📈 Notifications & Reports
- Email and in-app notification alerts
- Analytics dashboard with reports (salary slips, attendance reports)
---
 
## User Roles
 
| Capability | Employee | Admin / HR |
|---|:---:|:---:|
| View own profile | ✅ | ✅ |
| Edit own profile (limited) | ✅ | — |
| Edit any employee's profile | ❌ | ✅ |
| View own attendance | ✅ | ✅ |
| View all employees' attendance | ❌ | ✅ |
| Apply for leave | ✅ | — |
| Approve / reject leave | ❌ | ✅ |
| View own payroll (read-only) | ✅ | ✅ |
| Edit payroll | ❌ | ✅ |
| View analytics & reports | ❌ | ✅ |
 
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | TBD |
| Backend | TBD |
| Database | TBD |
| Auth | TBD |
| Version Control | Git & GitHub |
 
---
