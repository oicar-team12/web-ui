import React, { useState, useEffect } from 'react';
import { User } from '../../types/user';
import shiftService from '../../services/shiftService';
import { CreateShiftRequest } from '../../types/shift';
import { toast } from 'react-toastify';
import { ShiftStatus } from '../../types/shift';

interface CreateShiftModalProps {
  onClose: () => void;
  onShiftCreated: () => void;
  employees: User[];
  groupId: string;
}

const CreateShiftModal: React.FC<CreateShiftModalProps> = ({ onClose, onShiftCreated, employees, groupId }) => {
  const [shiftName, setShiftName] = useState('');
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [notes, setNotes] = useState('');
  // const [employees, setEmployees] = useState<User[]>([]); // Removed internal state

  // No need to fetch employees here, they are passed as a prop
  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/employees');
  //       if (response.ok) {
  //         const data = await response.json();
  //         setEmployees(data);
  //       } else {
  //         console.error('Error fetching employees');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching employees:', error);
  //     }
  //   };

  //   fetchEmployees();
  // }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployeeId || !groupId) {
      toast.error('Please select an employee and ensure a group is selected.');
      return;
    }

    const newShift: CreateShiftRequest = {
      groupId,
      employeeId: selectedEmployeeId,
      name: shiftName,
      date: new Date().toISOString().split('T')[0], // Assuming today's date for simplicity
      startTime: shiftStart,
      endTime: shiftEnd,
      notes,
      status: ShiftStatus.SCHEDULED, // Default status
      // position: '' // Position is not part of CreateShiftRequest
    };

    try {
      await shiftService.createShift(groupId, newShift);
      toast.success('Shift created successfully!');
      onShiftCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create shift:', error);
      toast.error('Failed to create shift.');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg max-w-lg w-full shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-gray-200">Create New Shift</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="shiftName" className="block text-sm font-medium text-gray-300">Shift Name</label>
            <input
              type="text"
              id="shiftName"
              value={shiftName}
              onChange={(e) => setShiftName(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg mt-1 bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter shift name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-300">Employee</label>
            <select
              id="employeeId"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg mt-1 bg-gray-700 text-white"
              required
            >
              <option value="" disabled>Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="shiftStart" className="block text-sm font-medium text-gray-300">Shift Start (Hour)</label>
            <input
              type="time"
              id="shiftStart"
              value={shiftStart}
              onChange={(e) => setShiftStart(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg mt-1 bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="shiftEnd" className="block text-sm font-medium text-gray-300">Shift End (Hour)</label>
            <input
              type="time"
              id="shiftEnd"
              value={shiftEnd}
              onChange={(e) => setShiftEnd(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg mt-1 bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg mt-1 bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter any additional notes"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors duration-200"
            >
              Create Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShiftModal;
