import { User } from './user';

export interface Availability {
  id: number;
  userId: number;
  user?: User;
  employeeId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  date: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityDto {
  userId: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
}

export interface UpdateAvailabilityDto {
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
}

export interface AvailabilityCriteria {
  startDate?: string;
  endDate?: string;
  userId?: number;
}

export interface CreateAvailabilityRequest {
  startTime: string;
  endTime: string;
  date: string;
  dayOfWeek: number;
  isAvailable: boolean;
}

export interface UpdateAvailabilityRequest {
  startTime?: string;
  endTime?: string;
  date?: string;
  dayOfWeek?: number;
  isAvailable?: boolean;
} 