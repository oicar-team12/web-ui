import { Availability, CreateAvailabilityRequest, UpdateAvailabilityRequest } from '../types/availability';
import { shouldUseMock, simulateApiDelay } from '../config';
import axiosInstance from './axiosConfig';

export const availabilityService = {
  async createAvailability(groupId: number, availability: CreateAvailabilityRequest): Promise<Availability> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      throw new Error('Mock creation not supported');
    }
    try {
      const response = await axiosInstance.post<Availability>(`/group/${groupId}/availability`, availability);
      return response.data;
    } catch (error) {
      console.error('Failed to create availability:', error);
      throw new Error('Failed to create availability');
    }
  },

  async getAvailability(groupId: number, employeeId: number): Promise<Availability> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      throw new Error('Mock not supported');
    }
    try {
      const response = await axiosInstance.get<Availability>(`/group/${groupId}/availability/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get availability:', error);
      throw new Error('Failed to get availability');
    }
  },

  async updateAvailability(groupId: number, availabilityId: number, availability: UpdateAvailabilityRequest): Promise<Availability> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      throw new Error('Mock update not supported');
    }
    try {
      const response = await axiosInstance.put<Availability>(`/group/${groupId}/availability/${availabilityId}`, availability);
      return response.data;
    } catch (error) {
      console.error('Failed to update availability:', error);
      throw new Error('Failed to update availability');
    }
  },

  async getAvailabilities(groupId: number): Promise<Availability[]> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      return [];
    }
    try {
      const response = await axiosInstance.get<Availability[]>(`/group/${groupId}/availabilities`);
      return response.data;
    } catch (error) {
      console.error('Failed to get availabilities:', error);
      throw new Error('Failed to get availabilities');
    }
  },

  async deleteAvailability(groupId: number, availabilityId: number): Promise<void> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      throw new Error('Mock deletion not supported');
    }
    try {
      await axiosInstance.delete(`/group/${groupId}/availability/${availabilityId}`);
    } catch (error) {
      console.error('Failed to delete availability:', error);
      throw new Error('Failed to delete availability');
    }
  }
}; 