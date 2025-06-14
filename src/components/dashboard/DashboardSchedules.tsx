import React, { useEffect, useState } from 'react';
import { useGroup } from '../../context/GroupContext';
import scheduleService from '../../services/scheduleService';
import { Schedule } from '../../types/schedule';
import { toast } from 'react-toastify';

const DashboardSchedules: React.FC = () => {
  const { selectedGroupId } = useGroup();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedGroupId) {
      loadSchedules();
    }
  }, [selectedGroupId]);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getSchedules(selectedGroupId!);
      setSchedules(data);
    } catch (error) {
      toast.error('Failed to load schedules');
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
      <h2 className="text-xl font-semibold mb-4">Schedules</h2>
      {schedules.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No schedules found</p>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{schedule.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{schedule.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(schedule.startDate).toLocaleDateString()} - {new Date(schedule.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardSchedules; 