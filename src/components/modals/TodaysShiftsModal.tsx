// src/components/modals/TodaysShiftsModal.tsx
import React from 'react';
import { Shift } from '../../types/shift';

interface TodaysShiftsModalProps {
  onClose: () => void;
  shifts: Shift[];
}

const TodaysShiftsModal: React.FC<TodaysShiftsModalProps> = ({ onClose, shifts }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Today's Shifts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <h3 className="font-medium">
                  {shift.employee?.firstName} {shift.employee?.lastName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{shift.employee?.email}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Shift Time</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(`1970-01-01T${shift.startTime}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} -{' '}
                  {new Date(`1970-01-01T${shift.endTime}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status: {shift.status.toLowerCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodaysShiftsModal;
