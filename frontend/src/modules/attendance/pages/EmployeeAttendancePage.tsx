import { useNavigate } from "react-router-dom";
import { Navbar } from "../../../modules/dashboard/components/Navbar";
import { useEmployeeAttendance } from "../hooks/useEmployeeAttendance";
import { AttendanceStatusBadge } from "../components/AttendanceStatusBadge";
import "../styles/Attendance.css";

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB"); // "dd/mm/yyyy"
}

export const EmployeeAttendancePage = () => {
  const navigate = useNavigate();
  const {
    selectedMonth,
    records,
    loading,
    error,
    goNextMonth,
    goPrevMonth,
  } = useEmployeeAttendance();

  const handleLogout = () => {
    localStorage.removeItem("dayflow.session");
    navigate("/signin");
  };

  const presentCount = records.filter(
    (r) => r.status === "PRESENT" || r.status === "HALF_DAY"
  ).length;
  const leaveCount = records.filter((r) => r.status === "LEAVE").length;
  const totalWorkingDays = records.length;

  const monthName = selectedMonth.toLocaleString("default", { month: "short", year: "numeric" });
  
  return (
    <div className="attendance-page employee-attendance-page min-h-screen bg-[#0a0a0a] flex flex-col text-white">
      <Navbar onLogout={handleLogout} />

      <main className="attendance-main employee-attendance-main flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="employee-attendance-heading">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Attendance</h1>
            <p className="text-white/50 text-sm">View your monthly attendance records and statistics.</p>
        </div>

        {/* Toolbar */}
        <div className="employee-attendance-toolbar flex flex-wrap items-center gap-4 bg-[#141414] p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={goPrevMonth}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-white/10 text-white/70"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="px-4 py-2 border border-white/10 rounded-lg font-medium text-sm w-32 text-center bg-white/5">
              {monthName}
            </div>
            <button
              onClick={goNextMonth}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-white/10 text-white/70"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="hidden sm:block w-px h-8 bg-white/10 mx-2" />

          <div className="employee-attendance-stats flex gap-4 flex-1">
            <div className="employee-attendance-stat flex-1 px-4 py-2 border border-white/10 rounded-lg bg-white/5 flex flex-col justify-center items-center">
              <span className="text-xs text-white/50 uppercase text-center mb-1">Count of days present</span>
              <span className="text-lg font-bold text-emerald-400">{presentCount}</span>
            </div>
            <div className="employee-attendance-stat flex-1 px-4 py-2 border border-white/10 rounded-lg bg-white/5 flex flex-col justify-center items-center">
              <span className="text-xs text-white/50 uppercase text-center mb-1">Leaves count</span>
              <span className="text-lg font-bold text-sky-400">{leaveCount}</span>
            </div>
            <div className="employee-attendance-stat flex-1 px-4 py-2 border border-white/10 rounded-lg bg-white/5 flex flex-col justify-center items-center">
              <span className="text-xs text-white/50 uppercase text-center mb-1">Total working days</span>
              <span className="text-lg font-bold text-white/90">{totalWorkingDays}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="attendance-table-shell employee-attendance-table w-full overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/2">
                  <th className="py-4 px-6 font-semibold text-xs text-white/50 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 font-semibold text-xs text-white/50 uppercase tracking-wider">Check In</th>
                  <th className="py-4 px-6 font-semibold text-xs text-white/50 uppercase tracking-wider">Check Out</th>
                  <th className="py-4 px-6 font-semibold text-xs text-white/50 uppercase tracking-wider">Work Hours</th>
                  <th className="py-4 px-6 font-semibold text-xs text-white/50 uppercase tracking-wider">Extra hours</th>
                  <th className="py-4 px-6 font-semibold text-xs text-white/50 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-white/50">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-red-400">{error}</td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-white/50">No records found for {monthName}.</td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="group hover:bg-white/3 transition-colors duration-150">
                      <td className="py-4 px-6 whitespace-nowrap font-medium text-white/90">
                        {formatDate(record.date)}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-sm font-medium">
                        <span className={record.checkIn ? "text-emerald-400" : "text-white/20"}>
                          {formatTime(record.checkIn)}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-sm font-medium">
                        <span className={record.checkOut ? "text-rose-400" : "text-white/20"}>
                          {formatTime(record.checkOut)}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-sm font-medium text-white/80">
                        {record.workHours ?? "—"}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-sm font-medium">
                        <span className={record.extraHours && record.extraHours !== "00:00" ? "text-amber-400 font-semibold" : "text-white/20"}>
                          {record.extraHours ?? "00:00"}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <AttendanceStatusBadge status={record.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
