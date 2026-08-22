export type AttendanceStatus = "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE";

export type ViewMode = "day" | "week";

export interface AttendanceEmployee {
  id: string;
  employeeCode: string;
  name: string;
  department: string;
  jobTitle: string;
  avatarUrl: string | null;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  note: string | null;
  workHours: string | null;
  extraHours: string | null;
  employee: AttendanceEmployee;
}
