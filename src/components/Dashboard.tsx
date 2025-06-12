import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGroup } from '../context/GroupContext';
import groupService from '../services/groupService';
import shiftService from '../services/shiftService';
import availabilityService from '../services/availabilityService';
import { User } from '../types/user';
import { Group } from '../types/group';
import { Shift } from '../types/shift';
import { Availability } from '../types/availability';
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedGroupId } = useGroup();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const currentDayOfWeek = new Date().getDay(); // Get current day of week (0-6)

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (selectedGroupId) {
        const groupShifts = await shiftService.getShifts(selectedGroupId);
        setShifts(groupShifts);
        const groupMembers = await groupService.getGroupMembers(selectedGroupId);
        setMembers(groupMembers.map(m => m.user));
        const groupAvailabilities = await availabilityService.getAvailabilities(selectedGroupId);
        setAvailabilities(groupAvailabilities);
      } else {
        setShifts([]);
        setMembers([]);
        setAvailabilities([]);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedGroupId]);

  const stats = {
    totalStaff: members.length,
    availableToday: members.filter(member =>
      availabilities.some(avail =>
        avail.employeeId === member.id &&
        avail.dayOfWeek === currentDayOfWeek &&
        avail.isAvailable
      )
    ).length,
    currentlyOnShift: shifts.filter(shift => {
      const now = new Date();
      const shiftDate = new Date(shift.date);
      const [startHour, startMinute] = shift.startTime.split(':').map(Number);
      const [endHour, endMinute] = shift.endTime.split(':').map(Number);

      const shiftStart = new Date(shiftDate);
      shiftStart.setHours(startHour, startMinute, 0, 0);

      const shiftEnd = new Date(shiftDate);
      shiftEnd.setHours(endHour, endMinute, 0, 0);

      if (shiftEnd < shiftStart) {
        shiftEnd.setDate(shiftEnd.getDate() + 1); // Shift spans midnight
      }

      return now >= shiftStart && now <= shiftEnd;
    }).length,
    timeOff: members.filter(member =>
      availabilities.some(avail =>
        avail.employeeId === member.id &&
        avail.dayOfWeek === currentDayOfWeek &&
        !avail.isAvailable
      )
    ).length,
  };

  const handleCardClick = (type: string) => {
    let data: any = [];

    switch (type) {
      case 'Total Staff':
        data = members;
        break;
      case 'Available Today':
        data = members.filter(member =>
          availabilities.some(avail =>
            avail.employeeId === member.id &&
            avail.dayOfWeek === currentDayOfWeek &&
            avail.isAvailable
          )
        );
        break;
      case 'Currently on Shift':
        data = shifts.filter(shift => {
          const now = new Date();
          const shiftDate = new Date(shift.date);
          const [startHour, startMinute] = shift.startTime.split(':').map(Number);
          const [endHour, endMinute] = shift.endTime.split(':').map(Number);

          const shiftStart = new Date(shiftDate);
          shiftStart.setHours(startHour, startMinute, 0, 0);

          const shiftEnd = new Date(shiftDate);
          shiftEnd.setHours(endHour, endMinute, 0, 0);

          if (shiftEnd < shiftStart) {
            shiftEnd.setDate(shiftEnd.getDate() + 1); // Shift spans midnight
          }

          return now >= shiftStart && now <= shiftEnd;
        });
        break;
      case 'Time Off':
        data = members.filter(member =>
          availabilities.some(avail =>
            avail.employeeId === member.id &&
            avail.dayOfWeek === currentDayOfWeek &&
            !avail.isAvailable
          )
        );
        break;
      case "Today's Shifts":
        data = shifts.filter(shift => shift.date === today);
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

  const handleShiftCreatedOrUpdated = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Here's what's happening with your team today
        </p>
      </div>

      {!selectedGroupId && (
        <div className="mb-8 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No Group Selected</strong>
          <span className="block sm:inline"> Select a group from the navigation menu to view group-specific information.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Staff" value={stats.totalStaff} onClick={() => handleCardClick('Total Staff')} />
        <StatsCard title="Available Today" value={stats.availableToday} onClick={() => handleCardClick('Available Today')} />
        <StatsCard title="Currently on Shift" value={stats.currentlyOnShift} onClick={() => handleCardClick('Currently on Shift')} />
        <StatsCard title="Time Off" value={stats.timeOff} onClick={() => handleCardClick('Time Off')} />
      </div>

      {selectedGroupId && (
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
              {shifts
                .filter(shift => shift.date === today)
                .map((shift) => (
                  <div key={shift.id} className="flex justify-between items-center p-3 bg-light-accent dark:bg-dark-accent rounded">
                    <div>
                      <h3 className="text-light-text dark:text-dark-text font-medium">
                        {shift.employee?.firstName} {shift.employee?.lastName}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {shift.employee?.position}
                      </p>
                      <p className="text-gray-500 text-xs">{shift.employee?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-light-text dark:text-dark-text">
                        {new Date(`1970-01-01T${shift.startTime}`).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} -{' '}
                        {new Date(`1970-01-01T${shift.endTime}`).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-gray-400 text-sm">{new Date(shift.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-6 flex flex-col items-center justify-center">
            <h2 className="text-light-text dark:text-dark-text text-lg font-semibold mb-4">Manage Shifts</h2>
            <button
              onClick={() => navigate('/schedule')}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition shadow-md"
            >
              Create New Shift
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <>
          {modalType === 'Total Staff' && (
            <TotalStaffModal
              onClose={closeModal}
              employees={modalData}
            />
          )}
          {modalType === 'Available Today' && (
            <AvailableTodayModal
              onClose={closeModal}
              employees={modalData}
            />
          )}
          {modalType === 'Currently on Shift' && (
            <CurrentlyOnShiftModal
              onClose={closeModal}
              employees={modalData}
              shifts={shifts}
            />
          )}
          {modalType === 'Time Off' && (
            <TimeOffModal
              onClose={closeModal}
              employees={modalData}
            />
          )}
          {modalType === "Today's Shifts" && (
            <TodaysShiftsModal
              onClose={closeModal}
              shifts={modalData}
            />
          )}
        </>
      )}

      {showCreateModal && (
        <CreateShiftModal
          onClose={() => setShowCreateModal(false)}
          onShiftCreated={handleShiftCreatedOrUpdated}
          employees={members}
          groupId={selectedGroupId!}
        />
      )}
    </div>
  );
};

export default Dashboard;
