import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeAPI, Employee, Group } from '../services/api';
import TotalStaffModal from './modals/TotalStaffModal';
import AvailableTodayModal from './modals/AvailableTodayModal';
import CurrentlyOnShiftModal from './modals/CurrentlyOnShiftModal';
import TimeOffModal from './modals/TimeOffModal';
import TodaysShiftsModal from './modals/TodaysShiftsModal';
import CreateShiftModal from './modals/CreateShiftModal';
import RecentActivityModal from './modals/RecentActivityModal';

interface StatsCardProps {
  title: string;
  value: number;
  onClick: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, onClick }) => (
  <div
    className="bg-[#1e2433] p-4 rounded-lg cursor-pointer hover:bg-[#2a3247] transition"
    onClick={onClick}
  >
    <h3 className="text-gray-400 text-sm">{title}</h3>
    <p className="text-white text-2xl font-bold">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalData, setModalData] = useState<Employee[] | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const isValidDate = (date: string | undefined) => date && !isNaN(Date.parse(date));

  const stats = {
    totalStaff: employees.length,
    availableToday: employees.filter((emp) => emp.daysOff && !emp.daysOff.includes(today)).length,
    currentlyOnShift: employees.filter((emp) => {
      if (!isValidDate(emp.shiftStart)) return false;
      const shiftDate = new Date(emp.shiftStart!).toISOString().split('T')[0];
      return shiftDate === today;
    }).length,
    timeOff: employees.filter((emp) => emp.daysOff && emp.daysOff.includes(today)).length,
  };

  const handleCardClick = (type: string) => {
    let data: Employee[] = [];

    switch (type) {
      case 'Total Staff':
        data = employees;
        break;
      case 'Available Today':
        data = employees.filter((emp) => emp.daysOff && !emp.daysOff.includes(today));
        break;
      case 'Currently on Shift':
        data = employees.filter(
          (emp) => isValidDate(emp.shiftStart) && new Date(emp.shiftStart!).toISOString().split('T')[0] === today
        );
        break;
      case 'Time Off':
        data = employees.filter((emp) => emp.daysOff && emp.daysOff.includes(today));
        break;
      case "Today's Shifts":
        data = employees.filter(
          (emp) => isValidDate(emp.shiftStart) && new Date(emp.shiftStart!).toISOString().split('T')[0] === today
        );
        break;
    }

    setModalType(type);
    setModalData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setModalData(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">Welcome back, Manager</h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">Here's what's happening with your team today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Staff" value={stats.totalStaff} onClick={() => handleCardClick('Total Staff')} />
        <StatsCard title="Available Today" value={stats.availableToday} onClick={() => handleCardClick('Available Today')} />
        <StatsCard title="Currently on Shift" value={stats.currentlyOnShift} onClick={() => handleCardClick('Currently on Shift')} />
        <StatsCard title="Time Off" value={stats.timeOff} onClick={() => handleCardClick('Time Off')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-light-text dark:text-dark-text text-lg font-semibold">Today's Shifts</h2>
            <button
              onClick={() => handleCardClick("Today's Shifts")}
              className="text-blue-400 hover:text-blue-300"
            >
              View All
            </button>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {employees
              .filter((emp) => isValidDate(emp.shiftStart) && new Date(emp.shiftStart!).toISOString().split('T')[0] === today)
              .map((employee) => (
                <div key={employee.id} className="flex justify-between items-center p-3 bg-light-accent dark:bg-dark-accent rounded">
                  <div>
                    <h3 className="text-light-text dark:text-dark-text font-medium">{employee.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {employee.position} • {employee.group?.name}
                    </p>
                    <p className="text-gray-500 text-xs">{employee.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-light-text dark:text-dark-text">
                      {employee.shiftStart && new Date(employee.shiftStart).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })} -{' '}
                      {employee.shiftEnd && new Date(employee.shiftEnd).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-gray-400 text-sm">{employee.shiftStart && new Date(employee.shiftStart).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-light-text dark:text-dark-text text-lg font-semibold">Recent Activity</h2>
            <Link
              to="/activity"
              className="text-blue-400 hover:text-blue-300"
            >
              View All Activity
            </Link>
          </div>
          <div className="space-y-4 text-gray-400">
            <div>
              <p>Jane Smith marked availability for next week</p>
              <p className="text-sm">2 hours ago</p>
            </div>
            <div>
              <p>John Doe requested time off on April 18</p>
              <p className="text-sm">5 hours ago</p>
            </div>
            <div>
              <p>You created a new shift assignment</p>
              <p className="text-sm">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-light-primary dark:bg-dark-primary p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-light-text dark:text-dark-text font-medium">Need to create a new shift?</h2>
            <p className="text-gray-400">Quickly assign shifts to your team members</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Shift
          </button>
        </div>
      </div>

      {showModal && modalData && (
        <>
          {modalType === 'Total Staff' && <TotalStaffModal employees={modalData} onClose={closeModal} />}
          {modalType === 'Available Today' && <AvailableTodayModal employees={modalData} onClose={closeModal} />}
          {modalType === 'Currently on Shift' && <CurrentlyOnShiftModal employees={modalData} onClose={closeModal} />}
          {modalType === 'Time Off' && <TimeOffModal employees={modalData} onClose={closeModal} />}
          {modalType === "Today's Shifts" && <TodaysShiftsModal employees={modalData} onClose={closeModal} />}
        </>
      )}

      {showCreateModal && (
        <CreateShiftModal
          onClose={() => setShowCreateModal(false)}
          onShiftCreated={fetchEmployees}
        />
      )}
    </div>
  );
};

export default Dashboard;
