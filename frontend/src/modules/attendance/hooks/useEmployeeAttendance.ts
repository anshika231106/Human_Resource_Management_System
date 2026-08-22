import { useState, useEffect, useCallback, useMemo } from "react";
import type { AttendanceRecord } from "../types/attendance.types";
import { fetchEmployeeAttendance } from "../services/attendanceApi";
import { loadSession } from "../../auth/services/authApi";

export function useEmployeeAttendance() {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monthString = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = String(selectedMonth.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }, [selectedMonth]);

  const loadData = useCallback(async () => {
    const session = loadSession();
    if (!session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchEmployeeAttendance(session.user.id, monthString);
      setRecords(data);
    } catch {
      setError("Failed to load attendance data.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [monthString]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const goNextMonth = useCallback(() => {
    setSelectedMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  }, []);

  const goPrevMonth = useCallback(() => {
    setSelectedMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  }, []);

  return {
    selectedMonth,
    records,
    loading,
    error,
    goNextMonth,
    goPrevMonth,
  };
}
