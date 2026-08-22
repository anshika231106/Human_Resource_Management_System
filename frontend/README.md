# Dayflow HRMS — Frontend

The frontend for Dayflow is a modern, single-page application built with React, TypeScript, and Vite. It serves as the user interface for both Employees and Administrators.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** React Router v6
- **Styling:** TailwindCSS v4 with semantic CSS variables
- **State & Data Fetching:** React Hooks + Axios
- **Theming:** Custom Light/Dark mode integration

## Module Architecture

The frontend follows a domain-driven module architecture to keep features decoupled and maintainable:

```text
src/
├── modules/
│   ├── auth/          # Authentication flows (Sign In, Sign Up)
│   ├── dashboard/     # Employee directory, profiles, and time-off requests
│   └── attendance/    # Attendance tracking, check-ins, and calendar views
├── styles/            # Global stylesheets and theme variables
└── types/             # Shared TypeScript definitions
```

## Features Implemented

### Authentication
- Role-based login (Admin vs Employee).
- JWT session management using `localStorage`.

### Dashboards & Profiles
- Dynamic role-based dashboards.
- Employee card grids with search functionality.
- Detailed employee profiles containing Personal, Resume, and Security sections.
- Secure "Change Password" functionality (only visible to the owning employee).

### Attendance
- Administrative view showing attendance logs for all employees.
- Employee view showing a personalized calendar of their own attendance.
- Quick Check-in/Check-out widget integrated into the Navbar.
- Real-time work hour calculations based on check-in/out times.

### Time-Off
- A Time-Off request calendar displaying leave history.
- An intuitive modal for employees to submit new leave requests.
- Admin capabilities to Approve or Reject leave requests.

### Theming
- Fully responsive styling with custom Tailwind v4 components.
- Persistent Light and Dark mode toggle utilizing CSS `color-mix()` for seamless contrast adjustments.

## Getting Started

1. Ensure the backend server is running and accessible at `http://localhost:3000`.
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser (typically `http://localhost:5173`).