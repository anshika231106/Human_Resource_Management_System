## Authentication — Frontend Screens

### Sign In Page
Standard credential login. Fields:
- **Login ID / Email** — accepts either the system-generated Login ID or the employee's email
- **Password**

On submit, calls `POST /api/auth/signin`. Invalid credentials surface a field-level
error rather than a generic alert. Successful login redirects by role: employees to
`/dashboard`, admins to `/admin/dashboard`.

Footer link routes to Sign Up.

### Sign Up Page — Admin/HR Only
**This is not public self-registration.** Per the wireframe note, a normal user
cannot create their own account. This screen is used by an Admin/HR Officer to
provision a new employee. It must be gated behind `requireRole('ADMIN')`, not
exposed as an open route.

Fields:
| Field | Notes |
|---|---|
| Company Name | with logo upload |
| Name | employee's full name |
| Email | employee's email |
| Phone | |
| Password | pre-filled/disabled — see auto-generation below |
| Confirm Password | |

On submit, calls an admin-scoped endpoint (e.g. `POST /api/employees` — **not**
`/api/auth/signup`) and creates both the `User` and `EmployeeProfile` records.

### Login ID auto-generation
The system generates the Login ID; it is never entered manually. Format: