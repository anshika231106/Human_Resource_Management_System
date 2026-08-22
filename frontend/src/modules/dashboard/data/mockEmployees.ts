import type { Employee } from "../types/dashboard.types.ts";

const employees: Employee[] = [
  { id: "1", name: "Jane Doe", role: "Software Engineer" },
  { id: "2", name: "John Smith", role: "Product Manager" },
  { id: "3", name: "Alice Johnson", role: "UX Designer" },
  { id: "4", name: "Robert Lee", role: "Data Analyst" },
  { id: "5", name: "Michael Chen", role: "DevOps Engineer" },
  { id: "6", name: "Sarah Williams", role: "HR Specialist" },
  { id: "7", name: "David Kim", role: "Marketing Manager" },
  { id: "8", name: "Emily Davis", role: "Sales Executive" },
  { id: "9", name: "James Wilson", role: "Financial Analyst" },
];

export const mockEmployees: Employee[] = employees.map((employee, index) => ({
  ...employee,
  department: ["Engineering", "Product", "Design", "Finance"][index % 4],
  employeeCode: `OI${String(index + 1).padStart(4, "0")}`,
  email: `${employee.name.toLowerCase().replace(" ", ".")}@staffcontrol.com`,
  phone: `+91 98765 ${String(10000 + index)}`,
  address: "Bengaluru, Karnataka",
  joinDate: `${2022 + (index % 3)}-${String((index % 9) + 1).padStart(2, "0")}-15`,
  manager: "Priya Kapoor",
  status: "Active",
  basicSalary: 65000 + index * 5000,
  hraPercent: 50,
  pfPercent: 12,
  documents: [
    { name: "Employment agreement.pdf", uploadedAt: "12 Jan 2025" },
    { name: "Identity proof.pdf", uploadedAt: "12 Jan 2025" },
  ],
}));
