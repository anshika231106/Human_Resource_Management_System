import type { ViewMode } from "../types/attendance.types";

interface AttendanceToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const AttendanceToolbar = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  selectedDate,
  onDateChange,
  onPrev,
  onNext,
}: AttendanceToolbarProps) => {
  const dateInputValue = selectedDate.toISOString().split("T")[0];

  return (
    <div className="attendance-toolbar flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-2">
      {/* Left section: Title + Search */}
      <div className="attendance-toolbar-main flex flex-1 items-center gap-6">
        <h1 className="text-2xl font-bold text-white tracking-tight shrink-0">
          Attendance
        </h1>

        {/* Searchbar */}
        <div className="attendance-search relative flex-1 max-w-sm">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Searchbar"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#141414] border border-white/10 text-white text-sm placeholder:text-white/30 outline-none transition-all duration-200 focus:border-[#cb6af0] focus:ring-2 focus:ring-[#cb6af0]/20"
          />
        </div>
      </div>

      {/* Right section: Controls (< > Date v Day/Week) */}
      <div className="attendance-controls flex items-center gap-3 shrink-0">
        {/* Navigation Buttons: < and > */}
        <div className="flex items-center gap-1 bg-[#141414] border border-white/10 rounded-xl p-1">
          <button
            type="button"
            onClick={onPrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Previous Day"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Next Day"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Date Picker (Date v) */}
        <div className="relative">
          <input
            type="date"
            value={dateInputValue}
            onChange={(e) => {
              const d = new Date(e.target.value + "T00:00:00");
              if (!isNaN(d.getTime())) onDateChange(d);
            }}
            className="h-10 px-3.5 rounded-xl bg-[#141414] border border-white/10 text-white/80 text-sm font-medium outline-none cursor-pointer transition-colors hover:border-white/20 focus:border-[#cb6af0] [color-scheme:dark]"
          />
        </div>

        {/* View Mode Switcher (Day / Week) */}
        <div className="flex items-center bg-[#141414] border border-white/10 rounded-xl p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("day")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "day"
                ? "bg-[#cb6af0] text-white shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("week")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "week"
                ? "bg-[#cb6af0] text-white shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            Week
          </button>
        </div>
      </div>
    </div>
  );
};
