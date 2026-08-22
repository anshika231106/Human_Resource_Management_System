interface AttendanceEmptyStateProps {
  searchQuery: string;
}

export const AttendanceEmptyState = ({ searchQuery }: AttendanceEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-[fadeIn_0.4s_ease-out]">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5">
        <svg
          className="w-7 h-7 text-white/20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>

      <p className="text-white/40 text-[15px] font-medium mb-1">
        No attendance records found
      </p>
      <p className="text-white/25 text-sm">
        {searchQuery
          ? `No results matching "${searchQuery}"`
          : "There are no records for this date."}
      </p>
    </div>
  );
};
