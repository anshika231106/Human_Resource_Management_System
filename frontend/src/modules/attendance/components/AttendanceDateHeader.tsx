interface AttendanceDateHeaderProps {
  date: Date;
}

export const AttendanceDateHeader = ({ date }: AttendanceDateHeaderProps) => {
  const formatted = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="attendance-date-header flex items-center justify-center my-4">
      <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-foreground/3 border border-foreground/7 backdrop-blur-md">
        <svg
          className="w-4 h-4 text-[#cb6af0]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="text-sm font-semibold text-foreground/80 tracking-wide">
          {formatted}
        </span>
      </div>
    </div>
  );
};
