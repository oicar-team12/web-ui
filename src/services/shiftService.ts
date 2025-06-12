import { Shift, CreateShiftRequest, UpdateShiftRequest } from '../types/shift';
import { shouldUseMock, simulateApiDelay } from '../config';
import axiosInstance from './axiosConfig';

class ShiftService {
  private shifts: Shift[] = [];

  async getShifts(groupId: string): Promise<Shift[]> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      return this.shifts.filter(shift => shift.groupId === groupId);
    }
    try {
      const response = await axiosInstance.get<Shift[]>(`/group/${groupId}/shifts`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch shifts:', error);
      return this.shifts.filter(shift => shift.groupId === groupId);
    }
  }

  async getGroupShifts(groupId: string): Promise<Shift[]> {
    const response = await axiosInstance.get<Shift[]>(`/group/${groupId}/shifts`);
    return response.data;
  }

  async getShift(groupId: string, shiftId: string): Promise<Shift> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const shift = this.shifts.find(s => s.id === shiftId && s.groupId === groupId);
      if (!shift) throw new Error('Shift not found');
      return shift;
    }
    try {
      const response = await axiosInstance.get<Shift>(`/group/${groupId}/shift/${shiftId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch shift:', error);
      const shift = this.shifts.find(s => s.id === shiftId && s.groupId === groupId);
      if (!shift) throw new Error('Shift not found');
      return shift;
    }
  }

  async createShift(groupId: string, shiftData: CreateShiftRequest): Promise<Shift> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const newShift: Shift = {
        ...shiftData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.shifts.push(newShift);
      return newShift;
    }
    try {
      const response = await axiosInstance.post<Shift>(`/group/${groupId}/shift`, shiftData);
      return response.data;
    } catch (error) {
      console.error('Failed to create shift:', error);
      throw error;
    }
  }

  async updateShift(groupId: string, shiftId: string, shiftData: UpdateShiftRequest): Promise<Shift> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const index = this.shifts.findIndex(s => s.id === shiftId && s.groupId === groupId);
      if (index === -1) throw new Error('Shift not found');
      this.shifts[index] = {
        ...this.shifts[index],
        ...shiftData,
        updatedAt: new Date().toISOString(),
      };
      return this.shifts[index];
    }
    try {
      const response = await axiosInstance.put<Shift>(`/group/${groupId}/shift/${shiftId}`, shiftData);
      return response.data;
    } catch (error) {
      console.error('Failed to update shift:', error);
      throw error;
    }
  }

  async deleteShift(groupId: string, shiftId: string): Promise<void> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const index = this.shifts.findIndex(s => s.id === shiftId && s.groupId === groupId);
      if (index === -1) throw new Error('Shift not found');
      this.shifts.splice(index, 1);
      return;
    }
    try {
      await axiosInstance.delete(`/group/${groupId}/shift/${shiftId}`);
    } catch (error) {
      console.error('Failed to delete shift:', error);
      throw error;
    }
  }

  async getEmployeeShifts(employeeId: string): Promise<Shift[]> {
    const response = await axiosInstance.get<Shift[]>(`/user/${employeeId}/shifts`);
    return response.data;
  }
}

export default new ShiftService(); 