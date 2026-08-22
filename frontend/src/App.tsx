import { Routes, Route, Navigate } from "react-router-dom";
import { SignUpPage, SignInPage } from "./modules/auth";
import { DashboardPage } from "./modules/dashboard";
import { AttendancePage } from "./modules/attendance";
import { TimeOffPage } from "./modules/dashboard/pages/TimeOffPage";
import { EmployeeProfilePage } from "./modules/dashboard/pages/EmployeeProfilePage";
import { AdminProfilePage } from "./modules/dashboard/pages/AdminProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/profile" element={<AdminProfilePage />} />
      <Route path="/dashboard/employees/:employeeId" element={<EmployeeProfilePage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/timeoff" element={<TimeOffPage />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

export default App;
