import React, { useState } from 'react';
import { Availability } from '../../types/availability';
import { availabilityService } from '../../services/availabilityService';
import { useAuth } from '../../context/AuthContext';

interface AvailabilityManagementProps {
  groupId: number;
  availability: Availability[];
  onAvailabilityChange: (availability: Availability[]) => void;
}

export const AvailabilityManagement: React.FC<AvailabilityManagementProps> = ({
  groupId,
  availability,
  onAvailabilityChange
}) => {
  const { user } = useAuth();
  const [newAvailability, setNewAvailability] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      const availabilityWithUser = {
        ...newAvailability,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      };
      const addedAvailability = await availabilityService.addAvailability(groupId, availabilityWithUser);
      onAvailabilityChange([...availability, addedAvailability]);
      setNewAvailability({ date: '', startTime: '', endTime: '' });
    } catch (err) {
      setError('Failed to add availability');
    }
  };

  const handleUpdateAvailability = async (availabilityId: number, updatedAvailability: Omit<Availability, 'id' | 'user'>) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      const availabilityWithUser = {
        ...updatedAvailability,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      };
      const avail = await availabilityService.updateAvailability(groupId, availabilityId, availabilityWithUser);
      onAvailabilityChange(availability.map(a => a.id === availabilityId ? avail : a));
    } catch (err) {
      setError('Failed to update availability');
    }
  };

  const handleDeleteAvailability = async (availabilityId: number) => {
    if (!window.confirm('Are you sure you want to delete this availability?')) return;

    try {
      await availabilityService.deleteAvailability(groupId, availabilityId);
      onAvailabilityChange(availability.filter(a => a.id !== availabilityId));
    } catch (err) {
      setError('Failed to delete availability');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Availability</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleAddAvailability} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            value={newAvailability.date}
            onChange={(e) => setNewAvailability({ ...newAvailability, date: e.target.value })}
            className="px-4 py-2 border rounded"
            required
          />
          <input
            type="time"
            value={newAvailability.startTime}
            onChange={(e) => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
            className="px-4 py-2 border rounded"
            required
          />
          <input
            type="time"
            value={newAvailability.endTime}
            onChange={(e) => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
            className="px-4 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Availability
        </button>
      </form>

      <div className="grid gap-4">
        {availability.map((avail) => (
          <div key={avail.id} className="border rounded p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="date"
                value={avail.date}
                onChange={(e) => handleUpdateAvailability(avail.id, { ...avail, date: e.target.value })}
                className="px-4 py-2 border rounded"
              />
              <input
                type="time"
                value={avail.startTime}
                onChange={(e) => handleUpdateAvailability(avail.id, { ...avail, startTime: e.target.value })}
                className="px-4 py-2 border rounded"
              />
              <div className="flex gap-2">
                <input
                  type="time"
                  value={avail.endTime}
                  onChange={(e) => handleUpdateAvailability(avail.id, { ...avail, endTime: e.target.value })}
                  className="px-4 py-2 border rounded"
                />
                <button
                  onClick={() => handleDeleteAvailability(avail.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 