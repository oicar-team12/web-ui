import { Schedule, ScheduleCriteria, CreateScheduleRequest, UpdateScheduleRequest } from '../types/schedule';
import { shouldUseMock, simulateApiDelay } from '../config';
import axiosInstance from './axiosConfig';

class ScheduleService {
  async getSchedules(groupId: string, userId?: string, shiftId?: string, startDate?: string, endDate?: string): Promise<Schedule[]> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      return [];
    }
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (shiftId) params.append('shiftId', shiftId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axiosInstance.get<Schedule[]>(`/group/${groupId}/schedules`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      throw new Error('Failed to fetch schedules');
    }
  }

  async getSchedule(groupId: string, scheduleId: string): Promise<Schedule> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      throw new Error('Mock schedule not found');
    }
    try {
      const response = await axiosInstance.get<Schedule>(`/group/${groupId}/schedule/${scheduleId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
      throw new Error('Failed to fetch schedule');
    }
  }

  async createSchedule(groupId: string, schedule: CreateScheduleRequest): Promise<Schedule> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      throw new Error('Mock creation not supported');
    }
    try {
      const response = await axiosInstance.post<Schedule>(`/group/${groupId}/schedule`, schedule);
      return response.data;
    } catch (error) {
      console.error('Failed to create schedule:', error);
      throw new Error('Failed to create schedule');
    }
  }

  async updateSchedule(groupId: string, scheduleId: string, schedule: UpdateScheduleRequest): Promise<Schedule> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      throw new Error('Mock update not supported');
    }
    try {
      const response = await axiosInstance.put<Schedule>(`/group/${groupId}/schedule/${scheduleId}`, schedule);
      return response.data;
    } catch (error) {
      console.error('Failed to update schedule:', error);
      throw new Error('Failed to update schedule');
    }
  }

  async deleteSchedule(groupId: string, scheduleId: string): Promise<void> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      throw new Error('Mock deletion not supported');
    }
    try {
      await axiosInstance.delete(`/group/${groupId}/schedule/${scheduleId}`);
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      throw new Error('Failed to delete schedule');
    }
  }
}

export default new ScheduleService(); 