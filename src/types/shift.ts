export interface Shift {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ShiftCriteria {
  startDate?: string;
  endDate?: string;
} 