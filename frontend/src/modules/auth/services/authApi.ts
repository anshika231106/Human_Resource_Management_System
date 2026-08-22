import axios from "axios";
import type { AuthUser, LoginPayload, LoginResponse } from "../types/auth.types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const { data } = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, payload);
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && typeof err.response?.data?.error === "string") {
      throw new AuthError(err.response.data.error);
    }
    throw new AuthError("Unable to reach the server. Please try again.");
  }
}

const SESSION_KEY = "dayflow.session";

export function saveSession(session: LoginResponse) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): LoginResponse | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LoginResponse;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export type { AuthUser, LoginPayload, LoginResponse };
