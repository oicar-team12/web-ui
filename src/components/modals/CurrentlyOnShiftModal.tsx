import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: string;
  name: string;
  shiftStart: string;
  shiftEnd: string;
}

interface ModalProps {
  employees: Employee[];
  onClose: () => void;
}

const CurrentlyOnShiftModal: React.FC<ModalProps> = ({ employees, onClose }) => {
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/employee/${id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1e2433] p-6 rounded-lg w-[90%] max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Currently on Shift</h2>
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {employees.map((emp) => (
            <li
              key={emp.id}
              className="bg-[#2a3145] p-3 rounded cursor-pointer hover:bg-[#3a415b]"
              onClick={() => handleClick(emp.id)}
            >
              <p className="font-medium">{emp.name}</p>
              <p className="text-sm text-gray-400">
                {new Date(emp.shiftStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {new Date(emp.shiftEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 text-blue-400 hover:text-blue-300">
          Close
        </button>
      </div>
    </div>
  );
};

export default CurrentlyOnShiftModal;
