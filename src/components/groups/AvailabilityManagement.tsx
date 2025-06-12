import React, { useState } from 'react';
import { Availability, CreateAvailabilityRequest } from '../../types/availability';
import  availabilityService  from '../../services/availabilityService';
import { toast } from 'react-toastify';

const DAYS_OF_WEEK = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

interface AvailabilityManagementProps {
  groupId: string;
  availability: Availability[];
  onAvailabilityChange: (availability: Availability[]) => void;
}

export const AvailabilityManagement: React.FC<AvailabilityManagementProps> = ({
  groupId,
  availability,
  onAvailabilityChange,
}) => {
  const [newAvailability, setNewAvailability] = useState<CreateAvailabilityRequest>({
    groupId,
    employeeId: '', // Set to current user's id if available
    dayOfWeek: 1, // Monday
    startTime: '',
    endTime: '',
    isAvailable: true,
  });

  const handleAddAvailability = async () => {
    try {
      const createdAvailability = await availabilityService.createAvailability(groupId, newAvailability);
      onAvailabilityChange([...availability, createdAvailability]);
      setNewAvailability({
        groupId,
        employeeId: '', // Set to current user's id if available
        dayOfWeek: 1,
        startTime: '',
        endTime: '',
        isAvailable: true,
      });
      toast.success('Availability added successfully');
    } catch (error) {
      toast.error('Failed to add availability');
    }
  };

  const handleDeleteAvailability = async (availabilityId: string) => {
    try {
      await availabilityService.deleteAvailability(groupId, availabilityId);
      onAvailabilityChange(availability.filter(a => a.id !== availabilityId));
      toast.success('Availability deleted successfully');
    } catch (error) {
      toast.error('Failed to delete availability');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Availability</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
              Day of Week
            </label>
            <select
              id="dayOfWeek"
              value={newAvailability.dayOfWeek}
              onChange={(e) => setNewAvailability({ ...newAvailability, dayOfWeek: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {DAYS_OF_WEEK.map((day, index) => (
                <option key={day} value={index}>
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              value={newAvailability.startTime}
              onChange={(e) => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              value={newAvailability.endTime}
              onChange={(e) => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              checked={newAvailability.isAvailable}
              onChange={(e) => setNewAvailability({ ...newAvailability, isAvailable: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
              Available
            </label>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleAddAvailability}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Availability
          </button>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Availability</h3>
          <div className="space-y-4">
            {availability.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {DAYS_OF_WEEK[item.dayOfWeek].charAt(0) + DAYS_OF_WEEK[item.dayOfWeek].slice(1).toLowerCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.startTime} - {item.endTime}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteAvailability(item.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 