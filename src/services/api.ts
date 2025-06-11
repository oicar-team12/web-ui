import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface Group {
  id: string;
  name: string;
  memberCount: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department?: string;
  phoneNumber?: string;
  hireDate?: string;
  // Fields used by Dashboard.tsx and other components
  shiftStart?: string;
  shiftEnd?: string;
  daysOff?: string[];
  notes?: string;
  group?: Group;
}

export interface Schedule {
  id: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  date: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post<{ token: string }>('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string }) =>
    api.post<{ token: string }>('/auth/register', userData),
};

// Group endpoints
export const groupAPI = {
  getGroups: () => api.get<Group[]>('/group'),
  createGroup: (groupData: { name: string }) => api.post<Group>('/group', groupData),
  updateGroup: (groupId: string, groupData: { name: string }) =>
    api.put<Group>(`/group/${groupId}`, groupData),
  deleteGroup: (groupId: string) => api.delete(`/group/${groupId}`),
  addMemberToGroup: (groupId: string, employeeId: string) =>
    api.post<Group>(`/group/${groupId}/members`, { employeeId }),
  removeMemberFromGroup: (groupId: string, employeeId: string) =>
    api.delete(`/group/${groupId}/members/${employeeId}`),
};

// Employee endpoints
export const employeeAPI = {
  getEmployees: () => api.get<Employee[]>('/user'),
  getEmployee: (id: string) => api.get<Employee>(`/user/${id}`),
  createEmployee: (employeeData: Omit<Employee, 'id'>) => api.post<Employee>('/user', employeeData),
  updateEmployee: (id: string, employeeData: Partial<Employee>) =>
    api.put<Employee>(`/user/${id}`, employeeData),
  deleteEmployee: (id: string) => api.delete(`/user/${id}`),
};

// Schedule endpoints
export const scheduleAPI = {
  getSchedules: (groupId: string) => api.get<Schedule[]>(`/group/${groupId}/schedules`),
  createSchedule: (groupId: string, scheduleData: Omit<Schedule, 'id'>) => api.post<Schedule>(`/group/${groupId}/schedules`, scheduleData),
  updateSchedule: (groupId: string, id: string, scheduleData: Partial<Schedule>) =>
    api.put<Schedule>(`/group/${groupId}/schedules/${id}`, scheduleData),
  deleteSchedule: (groupId: string, id: string) => api.delete(`/group/${groupId}/schedules/${id}`),
};

export default api; 