import React, { useState } from 'react';

interface Employee {
  id: string;
  name: string;
  position: string;
}

const ScheduleManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const mockEmployees: Employee[] = [
    { id: '1', name: 'John Doe', position: 'Front Desk' },
    { id: '2', name: 'Jane Smith', position: 'Bartender' },
    { id: '3', name: 'Mike Johnson', position: 'Kitchen Staff' },
    { id: '4', name: 'Sarah Williams', position: 'Server' },
    { id: '5', name: 'David Brown', position: 'Cleaner' },
  ];

  const weekDays = [
    'SUN, MAR 16',
    'MON, MAR 17',
    'TUE, MAR 18',
    'WED, MAR 19',
    'THU, MAR 20',
    'FRI, MAR 21',
    'SAT, MAR 22',
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Schedule Management</h1>
          <p className="text-gray-400">Create and manage employee shifts</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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

        <div className="grid grid-cols-7 gap-4 mb-6">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-white font-medium">{day.split(',')[0]}</p>
              <p className="text-gray-400 text-sm">{day.split(',')[1]}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center p-4 bg-[#252b3b] rounded">
              <p className="text-gray-400">No shifts</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-white font-medium mb-4">Create New Shift</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-400 mb-2">Date</label>
              <input
                type="date"
                className="w-full bg-[#252b3b] text-white p-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Shift Position</label>
              <input
                type="text"
                className="w-full bg-[#252b3b] text-white p-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                placeholder="Enter position"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Start Time</label>
              <input
                type="time"
                className="w-full bg-[#252b3b] text-white p-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">End Time</label>
              <input
                type="time"
                className="w-full bg-[#252b3b] text-white p-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Assign Employees</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center space-x-3 p-3 bg-[#252b3b] rounded cursor-pointer hover:bg-[#2a2f3e]"
                >
                  <input
                    type="checkbox"
                    id={`employee-${employee.id}`}
                    className="rounded bg-[#1e2433] border-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                  <div>
                    <label
                      htmlFor={`employee-${employee.id}`}
                      className="text-white cursor-pointer"
                    >
                      {employee.name}
                    </label>
                    <p className="text-gray-400 text-sm">{employee.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement; 