import type { Employee } from "../types/dashboard.types";

interface EmployeeCardProps {
  employee: Employee;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export const EmployeeCard = ({ employee, selected, onSelect }: EmployeeCardProps) => {
  const initials = employee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Generate a consistent color from the employee name
  const hue = employee.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div className={`employee-card${selected ? " employee-card--selected" : ""}`}>
      <div className="employee-card-left">
        <div
          className="employee-avatar"
          style={{ background: `hsl(${hue}, 30%, 22%)`, color: `hsl(${hue}, 50%, 65%)` }}
        >
          {initials}
        </div>
        <div className="employee-info">
          <span className="employee-name">{employee.name}</span>
          <span className="employee-role">{employee.role}</span>
        </div>
      </div>
      <button
        className={`employee-select-btn${selected ? " active" : ""}`}
        onClick={() => onSelect?.(employee.id)}
        aria-label={`Select ${employee.name}`}
      >
        <span className="select-circle" />
      </button>
    </div>
  );
};
