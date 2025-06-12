import React, { useEffect, useState } from 'react';
import { useGroup } from '../../context/GroupContext';
import  availabilityService  from '../../services/availabilityService';
import { Availability } from '../../types/availability';
import { toast } from 'react-toastify';

const DashboardAvailabilities: React.FC = () => {
  const { selectedGroupId } = useGroup();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedGroupId) {
      loadAvailabilities();
    }
  }, [selectedGroupId]);

  const loadAvailabilities = async () => {
    try {
      setLoading(true);
      const data = await availabilityService.getAvailabilities(selectedGroupId!);
      setAvailabilities(data);
    } catch (error) {
      toast.error('Failed to load availabilities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Availabilities</h2>
      {availabilities.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No availabilities found</p>
      ) : (
        <div className="space-y-4">
          {availabilities.map((availability) => (
            <div key={availability.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{availability.employee?.firstName} {availability.employee?.lastName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][availability.dayOfWeek]}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {availability.startTime} - {availability.endTime}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${availability.isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {availability.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardAvailabilities; 