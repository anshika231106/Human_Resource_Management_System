import { useNavigate } from "react-router-dom";
import { Navbar } from "../../../modules/dashboard/components/Navbar";
import { useAttendance } from "../hooks/useAttendance";
import { AttendanceToolbar } from "../components/AttendanceToolbar";
import { AttendanceDateHeader } from "../components/AttendanceDateHeader";
import { AttendanceTable } from "../components/AttendanceTable";
import { AttendanceEmptyState } from "../components/AttendanceEmptyState";
import "../styles/Attendance.css";

import { loadSession } from "../../auth/services/authApi";
import { EmployeeAttendancePage } from "./EmployeeAttendancePage";

const AdminAttendancePage = () => {
  const navigate = useNavigate();
  const {
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    filteredRecords,
    loading,
    error,
    goNext,
    goPrev,
  } = useAttendance();

  const handleLogout = () => {
    localStorage.removeItem("dayflow.session");
    navigate("/signin");
  };

  const presentCount = filteredRecords.filter((r) => r.status === "PRESENT").length;
  const absentCount = filteredRecords.filter((r) => r.status === "ABSENT").length;
  const halfDayCount = filteredRecords.filter((r) => r.status === "HALF_DAY").length;
  const leaveCount = filteredRecords.filter((r) => r.status === "LEAVE").length;

  const statCards = [
    {
      label: "Present",
      count: presentCount,
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      label: "Absent",
      count: absentCount,
      color: "text-rose-400",
      border: "border-rose-500/20",
      bg: "bg-rose-500/5",
      iconBg: "bg-rose-500/10 text-rose-400",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ),
    },
    {
      label: "Half Day",
      count: halfDayCount,
      color: "text-amber-400",
      border: "border-amber-500/20",
      bg: "bg-amber-500/5",
      iconBg: "bg-amber-500/10 text-amber-400",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      label: "On Leave",
      count: leaveCount,
      color: "text-sky-400",
      border: "border-sky-500/20",
      bg: "bg-sky-500/5",
      iconBg: "bg-sky-500/10 text-sky-400",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="attendance-page min-h-screen bg-[#0a0a0a] flex flex-col text-white">
      <Navbar onLogout={handleLogout} />

      <main className="attendance-main flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Toolbar */}
        <AttendanceToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onPrev={goPrev}
          onNext={goNext}
        />

        {/* Date Header Pill */}
        <AttendanceDateHeader date={selectedDate} />

        {/* Summary Stat Cards */}
        <div className="attendance-stats grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`attendance-stat-card rounded-2xl border p-5 ${card.bg} ${card.border} flex items-center justify-between shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-[1.01]`}
            >
              <div>
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className={`text-3xl font-extrabold tracking-tight mt-1 ${card.color}`}>
                  {card.count}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Main Attendance Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[#141414] rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 text-white/50">
              <svg
                className="w-6 h-6 animate-spin text-[#cb6af0]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-sm font-medium">Loading attendance data...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 bg-[#141414] rounded-2xl border border-red-500/20">
            <div className="text-red-400 text-sm font-medium">
              {error}
            </div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-[#141414] rounded-2xl border border-white/10 p-6">
            <AttendanceEmptyState searchQuery={searchQuery} />
          </div>
        ) : (
          <AttendanceTable records={filteredRecords} />
        )}
      </main>
    </div>
  );
};

export const AttendancePage = () => {
  const session = loadSession();
  if (session?.user?.role === "EMPLOYEE") {
    return <EmployeeAttendancePage />;
  }
  return <AdminAttendancePage />;
};
