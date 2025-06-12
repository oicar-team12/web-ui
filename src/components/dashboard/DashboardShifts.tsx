import React, { useEffect, useState } from 'react';
import { useGroup } from '../../context/GroupContext';
import  shiftService   from '../../services/shiftService';
import { Shift } from '../../types/shift';
import { toast } from 'react-toastify';

const DashboardShifts: React.FC = () => {
  const { selectedGroupId } = useGroup();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedGroupId) {
      loadShifts();
    }
  }, [selectedGroupId]);

  const loadShifts = async () => {
    try {
      setLoading(true);
      const data = await shiftService.getGroupShifts(selectedGroupId!);
      setShifts(data);
    } catch (error) {
      toast.error('Failed to load shifts');
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
      <h2 className="text-xl font-semibold mb-4">Shifts</h2>
      {shifts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No shifts found</p>
      ) : (
        <div className="space-y-4">
          {shifts.map((shift) => (
            <div key={shift.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{shift.employee?.firstName} {shift.employee?.lastName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(shift.startTime).toLocaleString()} - {new Date(shift.endTime).toLocaleString()}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {shift.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardShifts; 