import React, { useState } from 'react';
import { Shift } from '../../types/shift';
import { shiftService } from '../../services/shiftService';

interface ShiftManagementProps {
  groupId: number;
  shifts: Shift[];
  onShiftsChange: (shifts: Shift[]) => void;
}

export const ShiftManagement: React.FC<ShiftManagementProps> = ({
  groupId,
  shifts,
  onShiftsChange
}) => {
  const [newShift, setNewShift] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addedShift = await shiftService.addShift(groupId, newShift);
      onShiftsChange([...shifts, addedShift]);
      setNewShift({ date: '', startTime: '', endTime: '' });
    } catch (err) {
      setError('Failed to add shift');
    }
  };

  const handleUpdateShift = async (shiftId: number, updatedShift: Omit<Shift, 'id'>) => {
    try {
      const shift = await shiftService.updateShift(groupId, shiftId, updatedShift);
      onShiftsChange(shifts.map(s => s.id === shiftId ? shift : s));
    } catch (err) {
      setError('Failed to update shift');
    }
  };

  const handleDeleteShift = async (shiftId: number) => {
    if (!window.confirm('Are you sure you want to delete this shift?')) return;

    try {
      await shiftService.deleteShift(groupId, shiftId);
      onShiftsChange(shifts.filter(s => s.id !== shiftId));
    } catch (err) {
      setError('Failed to delete shift');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Shifts</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleAddShift} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            value={newShift.date}
            onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
            className="px-4 py-2 border rounded"
            required
          />
          <input
            type="time"
            value={newShift.startTime}
            onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
            className="px-4 py-2 border rounded"
            required
          />
          <input
            type="time"
            value={newShift.endTime}
            onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
            className="px-4 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Shift
        </button>
      </form>

      <div className="grid gap-4">
        {shifts.map((shift) => (
          <div key={shift.id} className="border rounded p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="date"
                value={shift.date}
                onChange={(e) => handleUpdateShift(shift.id, { ...shift, date: e.target.value })}
                className="px-4 py-2 border rounded"
              />
              <input
                type="time"
                value={shift.startTime}
                onChange={(e) => handleUpdateShift(shift.id, { ...shift, startTime: e.target.value })}
                className="px-4 py-2 border rounded"
              />
              <div className="flex gap-2">
                <input
                  type="time"
                  value={shift.endTime}
                  onChange={(e) => handleUpdateShift(shift.id, { ...shift, endTime: e.target.value })}
                  className="px-4 py-2 border rounded"
                />
                <button
                  onClick={() => handleDeleteShift(shift.id)}
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