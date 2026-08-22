// src/modules/dashboard/services/leaveApi.ts
import axios from 'axios';

export const fetchLeaveBalance = async () => {
  const res = await axios.get('/api/leave/balance');
  return res.data.balances;
};

export const fetchLeaveHistory = async () => {
  const res = await axios.get('/api/leave/history');
  return res.data.requests;
};

export const createLeaveRequest = async (payload: {
  type: string;
  startDate: string;
  endDate: string;
  remarks?: string;
}) => {
  const res = await axios.post('/api/leave/request', payload);
  return res.data.request;
};

export const approveLeaveRequest = async (id: string) => {
  const res = await axios.patch(`/api/leave/${id}/approve`);
  return res.data.request;
};

export const rejectLeaveRequest = async (id: string) => {
  const res = await axios.patch(`/api/leave/${id}/reject`);
  return res.data.request;
};
