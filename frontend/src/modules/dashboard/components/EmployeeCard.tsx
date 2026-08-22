import type { Employee } from "../types/dashboard.types";

interface EmployeeCardProps {
  employee: Employee;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onView?: (id: string) => void;
}

export const EmployeeCard = ({ employee, selected, onView }: EmployeeCardProps) => {
  const initials = employee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const hue = employee.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <article
      className={`employee-card${selected ? " employee-card--selected" : ""}`}
      onClick={() => onView?.(employee.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onView?.(employee.id);
      }}
      role="button"
      tabIndex={0}
    >
      <div className="employee-card-left">
        <div className="employee-avatar" style={{ background: `hsl(${hue}, 30%, 22%)`, color: `hsl(${hue}, 50%, 65%)` }}>
          {employee.avatar ? <img src={employee.avatar} alt="" /> : initials}
        </div>
        <div className="employee-info">
          <span className="employee-name">{employee.name}</span>
          <span className="employee-role">{employee.role}</span>
        </div>
      </div>
      <div 
        className={`employee-status-icon status-${(employee.todayStatus || 'absent').toLowerCase()}`}
        title={
          employee.todayStatus === 'PRESENT' || employee.todayStatus === 'HALF_DAY'
            ? "Present in office"
            : employee.todayStatus === 'LEAVE'
            ? "On leave"
            : "Absent"
        }
      >
        {employee.todayStatus === 'LEAVE' ? '✈️' : employee.todayStatus === 'PRESENT' || employee.todayStatus === 'HALF_DAY' ? '🟢' : '🟡'}
      </div>
    </article>
  );
};
