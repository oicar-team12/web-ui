import { User } from './user';

export enum ShiftStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Shift {
  id: string;
  groupId: string;
  employeeId: string;
  employee?: User;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ShiftStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftRequest {
  groupId: string;
  employeeId: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ShiftStatus;
  notes?: string;
}

export interface UpdateShiftRequest {
  employeeId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: ShiftStatus;
  notes?: string;
}

export interface ShiftCriteria {
  startDate?: string;
  endDate?: string;
} 