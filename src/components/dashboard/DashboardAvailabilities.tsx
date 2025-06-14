import React, { useEffect, useState } from 'react';
import { useGroup } from '../../context/GroupContext';
import { availabilityService } from '../../services/availabilityService';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
import { User } from '../../types/user';
import { Availability } from '../../types/availability';

const DashboardAvailabilities: React.FC = () => {
  const { selectedGroupId } = useGroup();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [employees, setEmployees] = useState<{ [key: number]: User }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailabilities();
  }, [selectedGroupId]);

  const loadAvailabilities = async () => {
    if (!selectedGroupId) return;
    try {
      const data = await availabilityService.getAvailabilities(parseInt(selectedGroupId));
      setAvailabilities(data);

      // Load employee data for each availability
      const employeeIds = Array.from(new Set(data.map(a => a.employeeId)));
      const employeeData = await Promise.all(
        employeeIds.map(id => userService.getEmployee(id))
      );
      
      const employeeMap = employeeData.reduce((acc, employee) => {
        acc[employee.id] = employee;
        return acc;
      }, {} as { [key: number]: User });
      
      setEmployees(employeeMap);
    } catch (error) {
      console.error('Failed to load availabilities:', error);
      toast.error('Failed to load availabilities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading availabilities...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Availabilities</h2>
      {availabilities.length === 0 ? (
        <p>No availabilities found</p>
      ) : (
        <div className="grid gap-4">
          {availabilities.map((availability) => (
            <div key={availability.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {employees[availability.employeeId]?.firstName} {employees[availability.employeeId]?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {availability.dayOfWeek} - {availability.startTime} to {availability.endTime}
                  </p>
                </div>
                <div className="text-sm">
                  {availability.isAvailable ? (
                    <span className="text-green-600">Available</span>
                  ) : (
                    <span className="text-red-600">Unavailable</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardAvailabilities; 