import { User } from './user';

export interface Availability {
  id: string;
  groupId: string;
  employeeId: string;
  employee?: User;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityCriteria {
  startDate?: string;
  endDate?: string;
  userId?: number;
}

export interface CreateAvailabilityRequest {
  groupId: string;
  employeeId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface UpdateAvailabilityRequest {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
} 