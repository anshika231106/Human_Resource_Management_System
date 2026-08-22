import axios from 'axios';
import { loadSession } from '../../auth/services/authApi';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export async function createEmployee(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  joinDate: string;
}) {
  const session = loadSession();
  if (!session?.token) throw new Error('Not authenticated');

  const response = await axios.post(`${API_BASE_URL}/users/employee`, data, {
    headers: { Authorization: `Bearer ${session.token}` }
  });
  return response.data;
}

export async function fetchEmployees() {
  const session = loadSession();
  if (!session?.token) throw new Error('Not authenticated');

  const response = await axios.get(`${API_BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${session.token}` }
  });
  return response.data;
}

export async function fetchEmployeeById(id: string) {
  const session = loadSession();
  if (!session?.token) throw new Error('Not authenticated');

  const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${session.token}` }
  });
  return response.data;
}

