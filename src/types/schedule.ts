export interface Schedule {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleCriteria {
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export interface CreateScheduleRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface UpdateScheduleRequest {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
} 