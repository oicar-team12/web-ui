import React from 'react';
import { User } from '../../types/user';
import { Shift } from '../../types/shift';

interface CurrentlyOnShiftModalProps {
  onClose: () => void;
  employees: User[];
  shifts: Shift[];
}

const CurrentlyOnShiftModal: React.FC<CurrentlyOnShiftModalProps> = ({ onClose, employees, shifts }) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const getShiftTime = (shift: Shift) => {
    const startHour = parseInt(shift.startTime.split(':')[0]);
    const startMinute = parseInt(shift.startTime.split(':')[1]);
    const endHour = parseInt(shift.endTime.split(':')[0]);
    const endMinute = parseInt(shift.endTime.split(':')[1]);

    const shiftStart = new Date();
    shiftStart.setHours(startHour, startMinute, 0, 0);

    const shiftEnd = new Date();
    shiftEnd.setHours(endHour, endMinute, 0, 0);

    if (shiftEnd < shiftStart) {
      shiftEnd.setDate(shiftEnd.getDate() + 1); // Shift spans midnight
    }

    const currentShiftTime = new Date();
    currentShiftTime.setHours(currentHour, currentMinute, 0, 0);

    const isCurrentlyOnShift = currentShiftTime >= shiftStart && currentShiftTime <= shiftEnd;
    const isToday = new Date(shift.date).toDateString() === now.toDateString();

    return {
      isCurrentlyOnShift: isCurrentlyOnShift && isToday,
      timeDisplay: `${new Date(`1970-01-01T${shift.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(`1970-01-01T${shift.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
  };

  const employeesOnShift = employees.filter(employee =>
    shifts.some(shift =>
      shift.employee?.id === employee.id && getShiftTime(shift).isCurrentlyOnShift
    )
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Currently On Shift</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {employeesOnShift.length > 0 ? (
            employeesOnShift.map((employee) => {
              const activeShift = shifts.find(shift => shift.employee?.id === employee.id && getShiftTime(shift).isCurrentlyOnShift);
              return (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{`${employee.firstName} ${employee.lastName}`}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{employee.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Current Shift</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{activeShift ? getShiftTime(activeShift).timeDisplay : 'N/A'}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No employees currently on shift.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentlyOnShiftModal;
