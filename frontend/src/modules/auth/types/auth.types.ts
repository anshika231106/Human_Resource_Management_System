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
