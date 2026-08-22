export interface Employee {
  id: string;
  name: string;
  role: string;
  department?: string;
  employeeCode?: string;
  email?: string;
  phone?: string;
  address?: string;
  joinDate?: string;
  manager?: string;
  status?: "Active" | "Inactive";
  basicSalary?: number;
  hraPercent?: number;
  pfPercent?: number;
  documents?: { name: string; uploadedAt: string }[];
  avatar?: string;
  selected?: boolean;
}
