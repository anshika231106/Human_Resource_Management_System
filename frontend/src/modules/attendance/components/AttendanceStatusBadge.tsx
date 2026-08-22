import type { AttendanceStatus } from "../types/attendance.types";

const statusConfig: Record<
  AttendanceStatus,
  { label: string; dot: string; bg: string; text: string; border: string }
> = {
  PRESENT: {
    label: "Present",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
  },
  ABSENT: {
    label: "Absent",
    dot: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
  },
  HALF_DAY: {
    label: "Half Day",
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
  },
  LEAVE: {
    label: "Leave",
    dot: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    text: "text-sky-400",
  },
};

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
}

export const AttendanceStatusBadge = ({ status }: AttendanceStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.border} ${config.text} transition-all duration-200`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
