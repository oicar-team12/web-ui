import { Shift, CreateShiftRequest, UpdateShiftRequest, ShiftStatus } from '../types/shift';
import { shouldUseMock, simulateApiDelay } from '../config';
import axiosInstance from './axiosConfig';

class ShiftService {
  private shifts: Shift[] = [];

  async getShifts(groupId: number, startDate?: string, endDate?: string): Promise<Shift[]> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      return [];
    }
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await axiosInstance.get<Shift[]>(`/group/${groupId}/shifts`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch shifts:', error);
      throw new Error('Failed to fetch shifts');
    }
  }

  async getGroupShifts(groupId: string): Promise<Shift[]> {
    const response = await axiosInstance.get<Shift[]>(`/group/${groupId}/shifts`);
    return response.data;
  }

  async getShift(groupId: number, shiftId: number): Promise<Shift> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      throw new Error('Mock shift not found');
    }
    try {
      const response = await axiosInstance.get<Shift>(`/group/${groupId}/shift/${shiftId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch shift:', error);
      throw new Error('Failed to fetch shift');
    }
  }

  async createShift(groupId: number, shiftData: CreateShiftRequest): Promise<Shift> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const newShift: Shift = {
        id: Math.floor(Math.random() * 1000000),
        date: shiftData.date,
        startTime: shiftData.startTime,
        endTime: shiftData.endTime,
        employee: {
          id: shiftData.userId,
          email: 'mock@example.com',
          firstName: 'Mock',
          lastName: 'User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        status: ShiftStatus.SCHEDULED,
        name: shiftData.location,
        location: shiftData.location,
        notes: shiftData.notes
      };
      this.shifts.push(newShift);
      return newShift;
    }
    try {
      const response = await axiosInstance.post<Shift>(`/group/${groupId}/shift`, shiftData);
      return response.data;
    } catch (error) {
      console.error('Failed to create shift:', error);
      throw new Error('Failed to create shift');
    }
  }

  async updateShift(groupId: number, shiftId: number, shiftData: UpdateShiftRequest): Promise<Shift> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      throw new Error('Mock update not supported');
    }
    try {
      const response = await axiosInstance.put<Shift>(`/group/${groupId}/shift/${shiftId}`, shiftData);
      return response.data;
    } catch (error) {
      console.error('Failed to update shift:', error);
      throw new Error('Failed to update shift');
    }
  }

  async deleteShift(groupId: number, shiftId: number): Promise<void> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      throw new Error('Mock deletion not supported');
    }
    try {
      await axiosInstance.delete(`/group/${groupId}/shift/${shiftId}`);
    } catch (error) {
      console.error('Failed to delete shift:', error);
      throw new Error('Failed to delete shift');
    }
  }

  async getEmployeeShifts(employeeId: string): Promise<Shift[]> {
    const response = await axiosInstance.get<Shift[]>(`/user/${employeeId}/shifts`);
    return response.data;
  }
}

export default new ShiftService(); 