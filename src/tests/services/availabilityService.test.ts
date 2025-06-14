import { availabilityService } from '../../services/availabilityService';
import { Availability, CreateAvailabilityRequest, UpdateAvailabilityRequest } from '../../types/availability';

describe('AvailabilityService', () => {
  beforeEach(() => {
    // Reset mock data before each test
    localStorage.clear();
  });

  describe('createAvailability', () => {
    it('should create a new availability', async () => {
      const groupId = 1;
      const availability: CreateAvailabilityRequest = {
        startTime: '09:00',
        endTime: '17:00',
        date: '2024-03-20',
        dayOfWeek: 1,
        isAvailable: true
      };

      const result = await availabilityService.createAvailability(groupId, availability);
      expect(result).toHaveProperty('id');
      expect(result.employeeId).toBeDefined();
    });
  });

  describe('getAvailability', () => {
    it('should get availability by id', async () => {
      const groupId = 1;
      const employeeId = 1;
      const availability = await availabilityService.getAvailability(groupId, employeeId);
      expect(availability).toHaveProperty('id');
      expect(availability.employeeId).toBe(employeeId);
    });
  });

  describe('updateAvailability', () => {
    it('should update availability', async () => {
      const groupId = 1;
      const availabilityId = 1;
      const updateData: UpdateAvailabilityRequest = {
        startTime: '10:00',
        endTime: '18:00',
        dayOfWeek: 2,
        isAvailable: true
      };

      const updated = await availabilityService.updateAvailability(groupId, availabilityId, updateData);
      expect(updated.startTime).toBe(updateData.startTime);
      expect(updated.endTime).toBe(updateData.endTime);
      expect(updated.dayOfWeek).toBe(updateData.dayOfWeek);
    });
  });

  describe('getAvailabilities', () => {
    it('should get all availabilities for a group', async () => {
      const groupId = 1;

      const availabilities = await availabilityService.getAvailabilities(groupId);
      expect(Array.isArray(availabilities)).toBe(true);
      availabilities.forEach((availability: Availability) => {
        expect(availability.employeeId).toBeDefined();
      });
    });
  });
}); 