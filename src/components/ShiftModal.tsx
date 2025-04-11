import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Employee {
  id: string;
  name: string;
  position: string;
}

interface Shift {
  id: string;
  date: string;
  position: string;
  start: string;
  end: string;
  assignedEmployees: string[];
}

interface ShiftModalProps {
  onClose: () => void;
  onSave: (shift: Shift) => void;
  employees: Employee[];
  initialShift?: Shift | null;
}

const ShiftModal: React.FC<ShiftModalProps> = ({
  onClose,
  onSave,
  employees,
  initialShift,
}) => {
  const [form, setForm] = useState({
    id: initialShift?.id || uuidv4(),
    date: initialShift?.date || '',
    position: initialShift?.position || '',
    start: initialShift?.start || '',
    end: initialShift?.end || '',
    assignedEmployees: initialShift?.assignedEmployees || [],
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEmployee = (id: string) => {
    setForm((prev) => ({
      ...prev,
      assignedEmployees: prev.assignedEmployees.includes(id)
        ? prev.assignedEmployees.filter((e) => e !== id)
        : [...prev.assignedEmployees, id],
    }));
  };

  const handleSubmit = () => {
    if (!form.date || !form.position || !form.start || !form.end) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.assignedEmployees.length === 0) {
      setError('Please assign at least one employee.');
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
          />
          <input
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#252b3b] text-white border border-gray-700"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="start"
              type="time"
              value={form.start}
              onChange={handleChange}
              className="p-2 rounded bg-[#252b3b] text-white border border-gray-700"
            />
            <input
              name="end"
              type="time"
              value={form.end}
              onChange={handleChange}
              className="p-2 rounded bg-[#252b3b] text-white border border-gray-700"
            />
          </div>

          <div>
            <p className="text-white font-medium mb-2">Assign Employees</p>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {employees.map((emp) => (
                <label
                  key={emp.id}
                  className="flex items-center space-x-2 bg-[#252b3b] p-2 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.assignedEmployees.includes(emp.id)}
                    onChange={() => toggleEmployee(emp.id)}
                  />
                  <span className="text-white text-sm">{emp.name}</span>
                </label>
              ))}
            </div>
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
