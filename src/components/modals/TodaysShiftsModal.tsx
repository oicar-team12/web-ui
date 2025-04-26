// src/components/modals/TodaysShiftsModal.tsx
import React from 'react';


interface Employee {
    id: string;
    name: string;
    position: string;
    email: string;
    shiftStart: string;
    shiftEnd: string;
    daysOff: string[];
    notes: string;
  }
interface TodaysShiftsModalProps {
  employees: Employee[];
  onClose: () => void;
}

const TodaysShiftsModal: React.FC<TodaysShiftsModalProps> = ({ employees, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1e2433] p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold">Today's Shifts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {employees.length === 0 ? (
          <p className="text-gray-400">No shifts scheduled for today.</p>
        ) : (
          <div className="space-y-4">
            {employees.map((employee) => (
              <div key={employee.id} className="flex justify-between items-center p-3 bg-[#252b3b] rounded">
                <div>
                  <h3 className="text-white font-medium">{employee.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {employee.position} 
                  </p>
                  <p className="text-gray-500 text-xs">{employee.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-white">
                    {new Date(employee.shiftStart).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(employee.shiftEnd).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(employee.shiftStart).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysShiftsModal;
