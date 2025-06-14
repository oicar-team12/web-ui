import React, { useState, useEffect } from 'react';
import { Shift, CreateShiftRequest, ShiftStatus } from '../../types/shift';
import shiftService from '../../services/shiftService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import groupMemberService from '../../services/groupMemberService';
import { GroupUser } from '../../types/group';

interface ShiftManagementProps {
  groupId: number;
}

export const ShiftManagement: React.FC<ShiftManagementProps> = ({
  groupId,
}) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupUser[]>([]);
  const [newShift, setNewShift] = useState<CreateShiftRequest>({
    groupId,
    userId: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    const fetchShiftsAndMembers = async () => {
      try {
        const startDate = format(new Date(), 'yyyy-MM-dd');
        const endDate = format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
        const shiftsData = await shiftService.getShifts(groupId, startDate, endDate);
        setShifts(shiftsData);

        console.log('Fetching group members for groupId:', groupId);
        const membersData = await groupMemberService.getGroupMembers(groupId.toString());
        console.log('Fetched group members:', membersData);
        setGroupMembers(membersData);

        if (membersData.length > 0) {
          setNewShift(prev => ({ ...prev, userId: membersData[0].id }));
        }

      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load shifts or group members');
      }
    };
    fetchShiftsAndMembers();
  }, [groupId]);

  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newShift.userId === 0) {
      toast.error('Please select an employee for the shift.');
      return;
    }

    try {
      // Format the date and time for the backend
      const startDateTime = `${newShift.date}T${newShift.startTime}:00Z`;
      const endDateTime = `${newShift.date}T${newShift.endTime}:00Z`;

      const shiftData: CreateShiftRequest = {
        groupId: groupId,
        userId: newShift.userId,
        date: newShift.date,
        startTime: startDateTime,
        endTime: endDateTime,
        location: newShift.location,
        notes: newShift.notes
      };

      console.log('Creating shift with data:', shiftData);
      const createdShift = await shiftService.createShift(groupId, shiftData);
      console.log('Created shift:', createdShift);

      setShifts([...shifts, createdShift]);
      setNewShift({
        groupId,
        userId: groupMembers.length > 0 ? groupMembers[0].id : 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '',
        endTime: '',
        location: '',
        notes: ''
      });
      toast.success('Shift created successfully');
    } catch (err) {
      console.error('Error creating shift:', err);
      toast.error('Failed to create shift');
    }
  };

  const handleDeleteShift = async (shiftId: number) => {
    try {
      await shiftService.deleteShift(groupId, shiftId);
      setShifts(shifts.filter((shift) => shift.id !== shiftId));
      toast.success('Shift deleted successfully');
    } catch (err) {
      toast.error('Failed to delete shift');
      console.error('Error deleting shift:', err);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddShift} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
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
        </div>
        <div>
          <label htmlFor="employee" className="block text-sm font-medium text-gray-700">
            Assign Employee
          </label>
          <select
            id="employee"
            value={newShift.userId}
            onChange={(e) => setNewShift({ ...newShift, userId: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="0" disabled>Select an employee</option>
            {groupMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.firstName} {member.lastName} ({member.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={newShift.location}
            onChange={(e) => setNewShift({ ...newShift, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Main Office, Branch A"
            required
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            value={newShift.notes}
            onChange={(e) => setNewShift({ ...newShift, notes: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Any specific instructions or details for this shift"
          ></textarea>
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
                    {format(new Date(shift.date), 'EEEE, MMMM d, yyyy')} {shift.startTime} - {shift.endTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    {shift.name} - Assigned to: {shift.employee.firstName} {shift.employee.lastName}
                  </p>
                  {shift.notes && <p className="text-sm text-gray-500">Notes: {shift.notes}</p>}
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