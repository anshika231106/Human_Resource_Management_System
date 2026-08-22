import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavbarProps {
  onLogout?: () => void;
}

const navTabs = [
  { label: "Employees", path: "/dashboard" },
  { label: "Attendance", path: "/attendance" },
  { label: "Time Off", path: "/timeoff" },
];

export const Navbar = ({ onLogout }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(() => {
    return localStorage.getItem("dayflow.is_checked_in") === "true";
  });
  const [checkInTime, setCheckInTime] = useState<string | null>(() => {
    return localStorage.getItem("dayflow.check_in_time");
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setIsCheckedIn(true);
    setCheckInTime(now);
    localStorage.setItem("dayflow.is_checked_in", "true");
    localStorage.setItem("dayflow.check_in_time", now);
    setIsOpen(false);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
    localStorage.setItem("dayflow.is_checked_in", "false");
    localStorage.removeItem("dayflow.check_in_time");
    setIsOpen(false);
  };

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-left">
        <span className="navbar-brand">StaffControl</span>
        <div className="navbar-tabs">
          {navTabs.map((tab) => (
            <button
              key={tab.path}
              className={`nav-tab ${location.pathname === tab.path ? "active" : ""}`}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="navbar-right">
        {/* Check-In / Check-Out Widget */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="attendance-action-trigger flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all cursor-pointer text-xs font-medium text-white/80"
            title={isCheckedIn ? "Click to Check Out" : "Click to Check In"}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isCheckedIn
                  ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)] animate-pulse"
                  : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)]"
              }`}
            />
            <span>{isCheckedIn ? "Checked In" : "Checked Out"}</span>
          </button>

          {/* Popover Menu */}
          {isOpen && (
            <div className="attendance-action-popover absolute right-0 mt-2 w-64 p-4 rounded-2xl bg-[#141414] border border-white/10 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div>
                  <h4 className="text-sm font-semibold text-white">Attendance Action</h4>
                  <p className="text-xs text-white/40 mt-0.5">
                    {isCheckedIn ? `Checked in at ${checkInTime}` : "You are currently offline"}
                  </p>
                </div>
                <span
                  className={`w-3 h-3 rounded-full ${
                    isCheckedIn
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                      : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                  }`}
                />
              </div>

              {isCheckedIn ? (
                <button
                  type="button"
                  onClick={handleCheckOut}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Check Out Now
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCheckIn}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Check In Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <button className="navbar-avatar-btn" onClick={onLogout} title="Logout" aria-label="Profile">
          <div className="navbar-avatar">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </button>
      </div>
    </nav>
  );
};
