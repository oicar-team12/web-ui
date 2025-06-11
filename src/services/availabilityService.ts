import axiosInstance from './axiosConfig';
import { Availability, AvailabilityCriteria } from '../types/availability';

export const availabilityService = {
  // Get availability for a group with optional criteria
  getAvailability: async (groupId: number, criteria?: AvailabilityCriteria): Promise<Availability[]> => {
    const response = await axiosInstance.get<Availability[]>(`/group/${groupId}/availability`, { params: criteria });
    return response.data;
  },

  // Get grouped availability for a group
  getGroupedAvailability: async (groupId: number): Promise<Record<string, Availability[]>> => {
    const response = await axiosInstance.get<Record<string, Availability[]>>(`/group/${groupId}/availability/grouped`);
    return response.data;
  },

  // Add availability
  addAvailability: async (groupId: number, availability: Omit<Availability, 'id'>): Promise<Availability> => {
    const response = await axiosInstance.post<Availability>(`/group/${groupId}/availability`, availability);
    return response.data;
  },

  // Update availability
  updateAvailability: async (groupId: number, availabilityId: number, availability: Omit<Availability, 'id'>): Promise<Availability> => {
    const response = await axiosInstance.put<Availability>(`/group/${groupId}/availability/${availabilityId}`, availability);
    return response.data;
  },

  // Delete availability
  deleteAvailability: async (groupId: number, availabilityId: number): Promise<void> => {
    await axiosInstance.delete(`/group/${groupId}/availability/${availabilityId}`);
  }
}; 