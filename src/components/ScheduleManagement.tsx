import React, { useState } from 'react';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';
import ShiftModal from './ShiftModal';

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

const ScheduleManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const mockEmployees: Employee[] = [
    { id: '1', name: 'John Doe', position: 'Front Desk' },
    { id: '2', name: 'Jane Smith', position: 'Bartender' },
    { id: '3', name: 'Mike Johnson', position: 'Kitchen Staff' },
    { id: '4', name: 'Sarah Williams', position: 'Server' },
    { id: '5', name: 'David Brown', position: 'Cleaner' },
  ];

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  };

  const openModal = (shift?: Shift) => {
    setEditingShift(shift || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingShift(null);
    setShowModal(false);
  };

  const saveShift = (newShift: Shift) => {
    setShifts(prev => {
      const exists = prev.find(shift => shift.id === newShift.id);
      if (exists) {
        return prev.map(shift => (shift.id === newShift.id ? newShift : shift));
      }
      return [...prev, newShift];
    });
    closeModal();
  };

  const removeShift = (shiftToRemove: Shift) => {
    setShifts(prev => prev.filter(shift => shift.id !== shiftToRemove.id));
  };

  const renderShifts = (dayShifts: Shift[]) => {
    if (dayShifts.length === 0) {
      return <p className="text-gray-400 text-sm">No shifts</p>;
    }

    return dayShifts.map((shift, i) => (
      <div key={i} className="mb-2 text-white text-sm border-b border-gray-600 pb-1">
        <div className="flex justify-between items-center">
          <div>
            <strong>{shift.position}</strong> ({shift.start} - {shift.end})<br />
            <span className="text-gray-400 text-xs">
              {shift.assignedEmployees
                .map(id => mockEmployees.find(e => e.id === id)?.name)
                .join(', ')}
            </span>
          </div>
          <div className="flex space-x-2 text-xs">
            <button onClick={() => openModal(shift)} className="text-blue-400">Edit</button>
            <button onClick={() => removeShift(shift)} className="text-red-400">Remove</button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">Schedule Management</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Create and manage employee shifts</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Shift
        </button>
      </div>

      <div className="bg-[#1e2433] rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg font-semibold">Weekly Schedule</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-1 rounded ${
                viewMode === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#252b3b] text-gray-400 hover:bg-[#2a2f3e]'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-1 rounded ${
                viewMode === 'day'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#252b3b] text-gray-400 hover:bg-[#2a2f3e]'
              }`}
            >
              Day View
            </button>
          </div>
        </div>

        {viewMode === 'week' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            {getWeekDays().map((day, index) => {
              const dayShifts = shifts.filter(shift =>
                isSameDay(new Date(shift.date), day)
              );
              return (
                <div key={index} className="p-4 bg-[#252b3b] rounded text-left">
                  <p className="text-white font-medium mb-2">
                    {format(day, 'EEE, MMM d')}
                  </p>
                  {renderShifts(dayShifts)}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mb-6">
            <select
              value={selectedDate.toISOString()}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="bg-[#252b3b] text-white p-2 rounded border border-gray-700"
            >
              {getWeekDays().map((day, index) => (
                <option key={index} value={day.toISOString()}>
                  {format(day, 'EEEE, MMM d')}
                </option>
              ))}
            </select>

            <div className="mt-4 p-4 bg-[#252b3b] rounded text-left">
              {renderShifts(
                shifts.filter(shift =>
                  isSameDay(new Date(shift.date), selectedDate)
                )
              )}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ShiftModal
          onClose={closeModal}
          onSave={saveShift}
          employees={mockEmployees}
          initialShift={editingShift}
        />
      )}
    </div>
  );
};

export default ScheduleManagement;
