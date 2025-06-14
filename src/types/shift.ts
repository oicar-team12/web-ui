import { User } from './user';

export enum ShiftStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Shift {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  employee: User;
  status: ShiftStatus;
  name: string;
  location: string;
  notes?: string;
}

export interface CreateShiftRequest {
  groupId: number;
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes?: string;
}

export interface UpdateShiftRequest {
  employeeId?: number;
  name?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  status?: ShiftStatus;
}

export interface ShiftCriteria {
  startDate?: string;
  endDate?: string;
} 