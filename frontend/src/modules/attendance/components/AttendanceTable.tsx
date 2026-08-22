import type { AttendanceRecord } from "../types/attendance.types";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function nameToHue(name: string): number {
  return name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
}

export const AttendanceTable = ({ records }: AttendanceTableProps) => {
  return (
    <div className="attendance-table-shell w-full overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          {/* Header */}
          <thead>
            <tr className="border-b border-foreground/10 bg-foreground/2">
              <th scope="col" className="py-4 px-6 font-semibold text-xs text-foreground/50 uppercase tracking-wider min-w-60">
                Emp
              </th>
              <th scope="col" className="py-4 px-6 font-semibold text-xs text-foreground/50 uppercase tracking-wider">
                Check In
              </th>
              <th scope="col" className="py-4 px-6 font-semibold text-xs text-foreground/50 uppercase tracking-wider">
                Check Out
              </th>
              <th scope="col" className="py-4 px-6 font-semibold text-xs text-foreground/50 uppercase tracking-wider">
                Work Hours
              </th>
              <th scope="col" className="py-4 px-6 font-semibold text-xs text-foreground/50 uppercase tracking-wider">
                Extra hours
              </th>
              <th scope="col" className="py-4 px-6 font-semibold text-xs text-foreground/50 uppercase tracking-wider text-right">
                Status
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-foreground/6">
            {records.map((record) => {
              const hue = nameToHue(record.employee.name);
              const initials = getInitials(record.employee.name);

              return (
                <tr
                  key={record.id}
                  className="group hover:bg-foreground/3 transition-colors duration-150"
                >
                  {/* Employee Info */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-inner"
                        style={{
                          background: `hsl(${hue}, 35%, 22%)`,
                          color: `hsl(${hue}, 60%, 70%)`,
                          border: `1px solid hsl(${hue}, 40%, 30%)`,
                        }}
                      >
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground group-hover:text-[#cb6af0] transition-colors text-sm truncate">
                          {record.employee.name}
                        </span>
                        <span className="text-xs text-foreground/40 truncate">
                          {record.employee.department} · {record.employee.jobTitle}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Check In */}
                  <td className="py-4 px-6 whitespace-nowrap font-mono text-sm font-medium">
                    <span className={record.checkIn && record.status !== "LEAVE" ? "text-emerald-400" : "text-foreground/20"}>
                      {record.status === "LEAVE" ? "—" : formatTime(record.checkIn)}
                    </span>
                  </td>

                  {/* Check Out */}
                  <td className="py-4 px-6 whitespace-nowrap font-mono text-sm font-medium">
                    <span className={record.checkOut && record.status !== "LEAVE" ? "text-rose-400" : "text-foreground/20"}>
                      {record.status === "LEAVE" ? "—" : formatTime(record.checkOut)}
                    </span>
                  </td>

                  {/* Work Hours */}
                  <td className="py-4 px-6 whitespace-nowrap font-mono text-sm font-medium text-foreground/80">
                    {record.status === "LEAVE" ? "—" : (record.workHours ?? "—")}
                  </td>

                  {/* Extra Hours */}
                  <td className="py-4 px-6 whitespace-nowrap font-mono text-sm font-medium">
                    <span
                      className={
                        record.extraHours && record.extraHours !== "00:00" && record.status !== "LEAVE"
                          ? "text-amber-400 font-semibold"
                          : "text-foreground/20"
                      }
                    >
                      {record.status === "LEAVE" ? "—" : (record.extraHours ?? "00:00")}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <AttendanceStatusBadge status={record.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
