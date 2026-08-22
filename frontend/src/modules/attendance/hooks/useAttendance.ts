import { useState, useEffect, useCallback, useMemo } from "react";
import type { AttendanceRecord, ViewMode } from "../types/attendance.types";
import { fetchAttendance } from "../services/attendanceApi";

function toISODate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}

export function useAttendance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (viewMode === "day") {
        const data = await fetchAttendance(toISODate(selectedDate));
        setRecords(data);
      } else {
        // Week view: fetch 7 days starting from selectedDate (Monday-aligned)
        const dayOfWeek = selectedDate.getDay();
        const monday = addDays(selectedDate, dayOfWeek === 0 ? -6 : 1 - dayOfWeek);

        const promises = Array.from({ length: 7 }, (_, i) =>
          fetchAttendance(toISODate(addDays(monday, i)))
        );
        const results = await Promise.all(promises);
        setRecords(results.flat());
      }
    } catch {
      setError("Failed to load attendance data.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, viewMode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter(
      (r) =>
        r.employee.name.toLowerCase().includes(q) ||
        r.employee.employeeCode.toLowerCase().includes(q) ||
        r.employee.department.toLowerCase().includes(q)
    );
  }, [records, searchQuery]);

  const goNext = useCallback(() => {
    setSelectedDate((d) => addDays(d, viewMode === "day" ? 1 : 7));
  }, [viewMode]);

  const goPrev = useCallback(() => {
    setSelectedDate((d) => addDays(d, viewMode === "day" ? -1 : -7));
  }, [viewMode]);

  return {
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    records,
    filteredRecords,
    loading,
    error,
    goNext,
    goPrev,
  };
}
