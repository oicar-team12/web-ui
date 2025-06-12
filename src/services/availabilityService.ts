import { Availability } from '../types/availability';
import { mockAvailabilities } from '../mockData';
import { shouldUseMock, simulateApiDelay } from '../config';
import axiosInstance from './axiosConfig';

class AvailabilityService {
  private availabilities: Availability[] = [...mockAvailabilities];

  async getAvailabilities(groupId: string): Promise<Availability[]> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      return this.availabilities.filter(avail => avail.groupId === groupId);
    }
    try {
      const response = await axiosInstance.get<Availability[]>(`/group/${groupId}/availabilities`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch availabilities:', error);
      return this.availabilities.filter(avail => avail.groupId === groupId);
    }
  }

  async getAvailability(groupId: string, availabilityId: string): Promise<Availability> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const availability = this.availabilities.find(a => a.id === availabilityId && a.groupId === groupId);
      if (!availability) throw new Error('Availability not found');
      return availability;
    }
    try {
      const response = await axiosInstance.get<Availability>(`/group/${groupId}/availability/${availabilityId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch availability:', error);
      const availability = this.availabilities.find(a => a.id === availabilityId && a.groupId === groupId);
      if (!availability) throw new Error('Availability not found');
      return availability;
    }
  }

  async createAvailability(groupId: string, availability: Omit<Availability, 'id' | 'createdAt' | 'updatedAt'>): Promise<Availability> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const newAvailability: Availability = {
        ...availability,
        id: Math.random().toString(36).substr(2, 9),
        groupId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.availabilities.push(newAvailability);
      return newAvailability;
    }
    try {
      const response = await axiosInstance.post<Availability>(`/group/${groupId}/availability`, availability);
      return response.data;
    } catch (error) {
      console.error('Failed to create availability:', error);
      throw error;
    }
  }

  async updateAvailability(groupId: string, availabilityId: string, availability: Partial<Availability>): Promise<Availability> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const index = this.availabilities.findIndex(a => a.id === availabilityId && a.groupId === groupId);
      if (index === -1) throw new Error('Availability not found');
      this.availabilities[index] = {
        ...this.availabilities[index],
        ...availability,
        updatedAt: new Date().toISOString(),
      };
      return this.availabilities[index];
    }
    try {
      const response = await axiosInstance.put<Availability>(`/group/${groupId}/availability/${availabilityId}`, availability);
      return response.data;
    } catch (error) {
      console.error('Failed to update availability:', error);
      throw error;
    }
  }

  async deleteAvailability(groupId: string, availabilityId: string): Promise<void> {
    if (shouldUseMock()) {
      await simulateApiDelay();
      const index = this.availabilities.findIndex(a => a.id === availabilityId && a.groupId === groupId);
      if (index === -1) throw new Error('Availability not found');
      this.availabilities.splice(index, 1);
      return;
    }
    try {
      await axiosInstance.delete(`/group/${groupId}/availability/${availabilityId}`);
    } catch (error) {
      console.error('Failed to delete availability:', error);
      throw error;
    }
  }
}

export default new AvailabilityService(); 