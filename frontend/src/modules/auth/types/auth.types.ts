export interface SignUpFormData {
  companyName: string;
  adminName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginPayload {
  loginId: string;
  password: string;
  role: "admin" | "employee";
}

export interface AuthUser {
  id: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  mustChangePassword: boolean;
  name: string | null;
  employeeCode: string | null;
  jobTitle: string | null;
  department: string | null;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
