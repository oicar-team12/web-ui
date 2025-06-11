import axiosInstance from './axiosConfig';
import { Shift, ShiftCriteria } from '../types/shift';

export const shiftService = {
  // Get shifts for a group with optional criteria
  getShifts: async (groupId: number, criteria?: ShiftCriteria): Promise<Shift[]> => {
    const response = await axiosInstance.get<Shift[]>(`/group/${groupId}/shift`, { params: criteria });
    return response.data;
  },

  // Add a new shift
  addShift: async (groupId: number, shift: Omit<Shift, 'id'>): Promise<Shift> => {
    const response = await axiosInstance.post<Shift>(`/group/${groupId}/shift`, shift);
    return response.data;
  },

  // Update an existing shift
  updateShift: async (groupId: number, shiftId: number, shift: Omit<Shift, 'id'>): Promise<Shift> => {
    const response = await axiosInstance.put<Shift>(`/group/${groupId}/shift/${shiftId}`, shift);
    return response.data;
  },

  // Delete a shift
  deleteShift: async (groupId: number, shiftId: number): Promise<void> => {
    await axiosInstance.delete(`/group/${groupId}/shift/${shiftId}`);
  }
}; 