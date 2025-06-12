import React, { useState } from 'react';
import { Shift, CreateShiftRequest, ShiftStatus } from '../../types/shift';
import shiftService from '../../services/shiftService';
import { toast } from 'react-toastify';

interface ShiftManagementProps {
  groupId: string;
  shifts: Shift[];
  onShiftsChange: (shifts: Shift[]) => void;
}

export const ShiftManagement: React.FC<ShiftManagementProps> = ({
  groupId,
  shifts,
  onShiftsChange,
}) => {
  const [newShift, setNewShift] = useState<CreateShiftRequest>({
    groupId,
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    employeeId: '',
    status: ShiftStatus.SCHEDULED,
  });

  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdShift = await shiftService.createShift(groupId, newShift);
      onShiftsChange([...shifts, createdShift]);
      setNewShift({
        groupId,
        name: '',
        date: '',
        startTime: '',
        endTime: '',
        employeeId: '',
        status: ShiftStatus.SCHEDULED,
      });
      toast.success('Shift created successfully');
    } catch (err) {
      toast.error('Failed to create shift');
      console.error('Error creating shift:', err);
    }
  };

  const handleUpdateShift = async (shiftId: string, updatedData: Partial<Shift>) => {
    try {
      const updatedShift = await shiftService.updateShift(groupId, shiftId, updatedData);
      onShiftsChange(shifts.map((shift) => (shift.id === shiftId ? updatedShift : shift)));
      toast.success('Shift updated successfully');
    } catch (err) {
      toast.error('Failed to update shift');
      console.error('Error updating shift:', err);
    }
  };

  const handleDeleteShift = async (shiftId: string) => {
    try {
      await shiftService.deleteShift(groupId, shiftId);
      onShiftsChange(shifts.filter((shift) => shift.id !== shiftId));
      toast.success('Shift deleted successfully');
    } catch (err) {
      toast.error('Failed to delete shift');
      console.error('Error deleting shift:', err);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddShift} className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={newShift.date}
              onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              value={newShift.startTime}
              onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              value={newShift.endTime}
              onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              value={newShift.employeeId}
              onChange={(e) => setNewShift({ ...newShift, employeeId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Shift
        </button>
      </form>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {shifts.map((shift) => (
            <li key={shift.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(shift.date).toLocaleDateString()} {shift.startTime} - {shift.endTime}
                  </p>
                  <p className="text-sm text-gray-500">Employee ID: {shift.employeeId}</p>
                  <p className="text-sm text-gray-500">Status: {shift.status}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleDeleteShift(shift.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 