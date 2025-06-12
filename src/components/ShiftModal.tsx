import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Shift, ShiftStatus } from '../types/shift'; // Import global Shift type
import { User } from '../types/user'; // Import global User type

interface ShiftModalProps {
  onClose: () => void;
  onSave: (shift: Partial<Shift>) => void; // Expect Partial<Shift> compatible with CreateShiftRequest
  employees: User[]; // Use User type for employees
  initialShift?: Partial<Shift> | null;
}

const ShiftModal: React.FC<ShiftModalProps> = ({
  onClose,
  onSave,
  employees,
  initialShift,
}) => {
  const [form, setForm] = useState<Partial<Shift>>({
    id: initialShift?.id || uuidv4(),
    date: initialShift?.date || '',
    startTime: initialShift?.startTime || '',
    endTime: initialShift?.endTime || '',
    employeeId: initialShift?.employeeId || '',
    status: initialShift?.status || ShiftStatus.SCHEDULED, // Default status
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value as ShiftStatus })); // Explicitly cast value to ShiftStatus
  };

  const handleSubmit = () => {
    if (!form.date || !form.startTime || !form.endTime || !form.employeeId) {
      setError('Please fill in all fields.');
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#1e2433] p-4 sm:p-6 rounded-lg w-full max-w-lg mx-4 sm:mx-auto shadow-xl">
        <h2 className="text-white text-lg font-bold mb-4">
          {initialShift ? 'Edit Shift' : 'Create Shift'}
        </h2>

        {error && <p className="text-red-400 mb-2 text-sm">{error}</p>}

        <div className="space-y-3">
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#252b3b] text-white border border-gray-700"
            required
          />
          {/* Removed position input as it's not in your Shift type */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
              className="p-2 rounded bg-[#252b3b] text-white border border-gray-700"
              required
            />
            <input
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={handleChange}
              className="p-2 rounded bg-[#252b3b] text-white border border-gray-700"
              required
            />
          </div>

          <div>
            <label htmlFor="employeeId" className="block text-white font-medium mb-2">Assign Employee</label>
            <select
              name="employeeId"
              id="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#252b3b] text-white border border-gray-700"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.position})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-white font-medium mb-2">Status</label>
            <select
              name="status"
              id="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#252b3b] text-white border border-gray-700"
              required
            >
              {(Object.values(ShiftStatus) as ShiftStatus[]).map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Save Shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftModal;
