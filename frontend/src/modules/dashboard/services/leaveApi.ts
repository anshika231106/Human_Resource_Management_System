// src/modules/dashboard/services/leaveApi.ts
import axios from 'axios';
import { loadSession } from '../../auth/services/authApi';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

function authHeaders() {
  const session = loadSession();
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
}

/** Employee's own leave balances */
export const fetchLeaveBalance = async (): Promise<any[]> => {
  const res = await axios.get(`${API_BASE}/leave/balance`, { headers: authHeaders() });
  return res.data.balances ?? [];
};

/** Employee's own leave request history */
export const fetchLeaveHistory = async (): Promise<any[]> => {
  const res = await axios.get(`${API_BASE}/leave/history`, { headers: authHeaders() });
  return res.data.requests ?? [];
};

/** Admin: all employees' leave requests */
export const fetchAllLeaveRequests = async (): Promise<any[]> => {
  const res = await axios.get(`${API_BASE}/leave/all`, { headers: authHeaders() });
  return res.data.requests ?? [];
};

export const createLeaveRequest = async (payload: {
  type: string;
  startDate: string;
  endDate: string;
  remarks?: string;
}) => {
  const res = await axios.post(`${API_BASE}/leave/request`, payload, { headers: authHeaders() });
  return res.data.request;
};

export const approveLeaveRequest = async (id: string) => {
  const res = await axios.patch(`${API_BASE}/leave/${id}/approve`, {}, { headers: authHeaders() });
  return res.data.request;
};

export const rejectLeaveRequest = async (id: string) => {
  const res = await axios.patch(`${API_BASE}/leave/${id}/reject`, {}, { headers: authHeaders() });
  return res.data.request;
};
