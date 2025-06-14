import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGroup } from '../context/GroupContext';
import groupService from '../services/groupService';
import shiftService from '../services/shiftService';
import { availabilityService } from '../services/availabilityService';
import { User } from '../types/user';
import { Group } from '../types/group';
import { Shift, ShiftStatus } from '../types/shift';
import { Availability } from '../types/availability';
import TotalStaffModal from './modals/TotalStaffModal';
import AvailableTodayModal from './modals/AvailableTodayModal';
import CurrentlyOnShiftModal from './modals/CurrentlyOnShiftModal';
import TimeOffModal from './modals/TimeOffModal';
import TodaysShiftsModal from './modals/TodaysShiftsModal';
import { CreateShiftModal } from './modals/CreateShiftModal';
import RecentActivityModal from './modals/RecentActivityModal';
import { GroupUser } from '../types/group';

interface StatsCardProps {
  title: string;
  value: number;
  onClick: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
  >
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedGroupId } = useGroup();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [members, setMembers] = useState<GroupUser[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const currentDayOfWeek = new Date().getDay();

  const fetchData = useCallback(async () => {
    if (!selectedGroupId) {
      setShifts([]);
      setMembers([]);
      setAvailabilities([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [groupShifts, groupMembers, groupAvailabilities] = await Promise.all([
        shiftService.getShifts(parseInt(selectedGroupId)),
        groupService.getGroupMembers(parseInt(selectedGroupId)),
        availabilityService.getAvailabilities(parseInt(selectedGroupId))
      ]);

      setShifts(groupShifts);
      setMembers(groupMembers);
      setAvailabilities(groupAvailabilities);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedGroupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCardClick = (type: string) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleCreateShift = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
    setModalData(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const stats = {
    totalStaff: members.length,
    availableToday: availabilities.filter(a => a.date === today && a.isAvailable).length,
    currentlyOnShift: shifts.filter(s => s.date === today && s.status === ShiftStatus.IN_PROGRESS).length,
    timeOff: availabilities.filter(a => a.date === today && !a.isAvailable).length
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

      {showModal && (
        <>
          {modalType === 'Total Staff' && <TotalStaffModal onClose={handleCloseModal} employees={members} />}
          {modalType === 'Available Today' && <AvailableTodayModal onClose={handleCloseModal} employees={members} />}
          {modalType === 'Currently on Shift' && <CurrentlyOnShiftModal onClose={handleCloseModal} employees={members} shifts={shifts} />}
          {modalType === 'Time Off' && <TimeOffModal onClose={handleCloseModal} employees={members} />}
        </>
      )}

      {showCreateModal && selectedGroupId && (
        <CreateShiftModal
          onClose={handleCloseCreateModal}
          onShiftCreated={fetchData}
          employees={members}
          groupId={parseInt(selectedGroupId)}
        />
      )}
    </div>
  );
};

export default Dashboard;
