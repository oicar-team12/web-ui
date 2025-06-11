export interface Availability {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface AvailabilityCriteria {
  startDate?: string;
  endDate?: string;
  userId?: number;
} 