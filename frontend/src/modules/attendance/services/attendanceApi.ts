import axios from "axios";
import type { AttendanceRecord } from "../types/attendance.types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

/**
 * Fetch attendance records for a specific date.
 * @param date - ISO date string (YYYY-MM-DD)
 */
export async function fetchAttendance(date: string): Promise<AttendanceRecord[]> {
  const session = localStorage.getItem("dayflow.session");
  const token = session ? JSON.parse(session)?.token : null;

  const { data } = await axios.get<AttendanceRecord[]>(
    `${API_BASE_URL}/attendance`,
    {
      params: { date },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );

  if (!Array.isArray(data)) {
    throw new Error("Attendance API returned an invalid response");
  }

  return data;
}

/**
 * Fetch attendance records for a specific employee by month.
 * @param employeeId - Employee or User ID
 * @param month - ISO month string (YYYY-MM)
 */
export async function fetchEmployeeAttendance(employeeId: string, month: string): Promise<AttendanceRecord[]> {
  const session = localStorage.getItem("dayflow.session");
  const token = session ? JSON.parse(session)?.token : null;

  const { data } = await axios.get<AttendanceRecord[]>(
    `${API_BASE_URL}/attendance/employee/${employeeId}`,
    {
      params: { month },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );

  if (!Array.isArray(data)) {
    throw new Error("Attendance API returned an invalid response");
  }

  return data;
}
