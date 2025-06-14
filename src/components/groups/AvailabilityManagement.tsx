import React, { useState, useEffect } from 'react';
import { Availability, CreateAvailabilityRequest } from '../../types/availability';
import { availabilityService } from '../../services/availabilityService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface AvailabilityManagementProps {
  groupId: number;
}

export const AvailabilityManagement: React.FC<AvailabilityManagementProps> = ({
  groupId
}) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [newAvailability, setNewAvailability] = useState<CreateAvailabilityRequest>({
    startTime: '',
    endTime: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    dayOfWeek: new Date().getDay(),
    isAvailable: true
  });

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const data = await availabilityService.getAvailabilities(groupId);
        setAvailabilities(data);
      } catch (error) {
        console.error('Error fetching availabilities:', error);
        toast.error('Failed to fetch availabilities');
      }
    };

    fetchAvailabilities();
  }, [groupId]);

  const handleAddAvailability = async () => {
    try {
      const createdAvailability = await availabilityService.createAvailability(groupId, newAvailability);
      setAvailabilities([...availabilities, createdAvailability]);
      setNewAvailability({
        startTime: '',
        endTime: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        dayOfWeek: new Date().getDay(),
        isAvailable: true
      });
      toast.success('Availability added successfully');
    } catch (error) {
      console.error('Error adding availability:', error);
      toast.error('Failed to add availability');
    }
  };

  const handleDeleteAvailability = async (id: number) => {
    try {
      await availabilityService.deleteAvailability(groupId, id);
      setAvailabilities(availabilities.filter(avail => avail.id !== id));
      toast.success('Availability deleted successfully');
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast.error('Failed to delete availability');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input
              type="date"
              value={newAvailability.date}
              onChange={(e) => setNewAvailability({ ...newAvailability, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
            <input
              type="time"
              value={newAvailability.startTime}
              onChange={(e) => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
            <input
              type="time"
              value={newAvailability.endTime}
              onChange={(e) => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Available</label>
            <select
              value={newAvailability.isAvailable ? 'true' : 'false'}
              onChange={(e) => setNewAvailability({ ...newAvailability, isAvailable: e.target.value === 'true' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleAddAvailability}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Availability
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Current Availabilities</h2>
        <div className="space-y-4">
          {availabilities.map((availability) => (
            <div
              key={availability.id}
              className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {format(new Date(availability.date), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {availability.startTime} - {availability.endTime}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status: {availability.isAvailable ? 'Available' : 'Unavailable'}
                </p>
              </div>
              <button
                onClick={() => handleDeleteAvailability(availability.id)}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 focus:outline-none"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 