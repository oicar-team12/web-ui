import React from 'react';
import { User } from '../../types/user';

interface AvailableTodayModalProps {
  onClose: () => void;
  employees: User[];
}

const AvailableTodayModal: React.FC<AvailableTodayModalProps> = ({ onClose, employees }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Available Today</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{`${employee.firstName} ${employee.lastName}`}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{employee.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{employee.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableTodayModal;
