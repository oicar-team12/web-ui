export interface Schedule {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  groupId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleCriteria {
  startDate?: string;
  endDate?: string;
  userId?: string;
} 