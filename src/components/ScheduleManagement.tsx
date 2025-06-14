import React, { useState, useEffect } from 'react';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';
import ShiftModal from './ShiftModal';
import { useGroup } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';
import shiftService from '../services/shiftService';
import groupService from '../services/groupService';
import groupMemberService from '../services/groupMemberService';
import { Shift, CreateShiftRequest } from '../types/shift';
import { User } from '../types/user';
import { GroupUser } from '../types/group';
import { toast } from 'react-toastify';

const ScheduleManagement: React.FC = () => {
  const { selectedGroupId, triggerShiftRefresh } = useGroup();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupUser[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      if (!selectedGroupId) {
        setShifts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const startDate = format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        const endDate = format(addDays(startOfWeek(selectedDate, { weekStartsOn: 1 }), 6), 'yyyy-MM-dd');
        const [fetchedShifts, members] = await Promise.all([
          shiftService.getShifts(parseInt(selectedGroupId), startDate, endDate),
          groupMemberService.getGroupMembers(selectedGroupId)
        ]);
        setShifts(fetchedShifts);
        setGroupMembers(members);
      } catch (err) {
        console.error('Failed to fetch schedule data:', err);
        setError('Failed to load schedule. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchScheduleData();
  }, [selectedGroupId, triggerShiftRefresh, selectedDate]);

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

  const handleSaveShift = async (shiftToSave: CreateShiftRequest) => {
    if (!selectedGroupId) return;

    try {
      if (editingShift && editingShift.id) {
        await shiftService.updateShift(parseInt(selectedGroupId), editingShift.id, shiftToSave);
        toast.success('Shift updated successfully!');
      } else {
        await shiftService.createShift(parseInt(selectedGroupId), shiftToSave);
        toast.success('Shift created successfully!');
      }

      if (selectedGroupId) {
        const startDate = format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        const endDate = format(addDays(startOfWeek(selectedDate, { weekStartsOn: 1 }), 6), 'yyyy-MM-dd');
        const fetchedShifts = await shiftService.getShifts(parseInt(selectedGroupId), startDate, endDate);
        setShifts(fetchedShifts);
        triggerShiftRefresh();
      }
      closeModal();
    } catch (err) {
      toast.error('Failed to save shift.');
      console.error('Error saving shift:', err);
    }
  };

  const handleRemoveShift = async (shiftToRemove: Shift) => {
    if (!selectedGroupId) return;
    try {
      await shiftService.deleteShift(parseInt(selectedGroupId), shiftToRemove.id);
      toast.success('Shift deleted successfully!');

      if (selectedGroupId) {
        const startDate = format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        const endDate = format(addDays(startOfWeek(selectedDate, { weekStartsOn: 1 }), 6), 'yyyy-MM-dd');
        const fetchedShifts = await shiftService.getShifts(parseInt(selectedGroupId), startDate, endDate);
        setShifts(fetchedShifts);
        triggerShiftRefresh();
      }
    } catch (err) {
      toast.error('Failed to delete shift.');
      console.error('Error deleting shift:', err);
    }
  };

  const renderShifts = (dayShifts: Shift[]) => {
    if (!selectedGroupId) {
      return <p className="text-yellow-400 text-sm">Select a group to view shifts.</p>;
    }
    if (dayShifts.length === 0) {
      return <p className="text-gray-400 text-sm">No shifts</p>;
    }

    return dayShifts.map((shift) => (
      <div key={shift.id} className="mb-2 text-white text-sm border-b border-gray-600 pb-1">
        <div className="flex justify-between items-center">
          <div>
            <strong>
              {shift.employee ? `${shift.employee.firstName} ${shift.employee.lastName}` : 'Unassigned'}
            </strong>
            <br />
            <span className="text-gray-400">
              {new Date(`1970-01-01T${shift.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
              {new Date(`1970-01-01T${shift.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {shift.location && <div className="text-gray-400">Location: {shift.location}</div>}
            {shift.notes && <div className="text-gray-400">Notes: {shift.notes}</div>}
          </div>
          <div className="flex space-x-2 text-xs">
            <button onClick={() => openModal(shift)} className="text-blue-400">Edit</button>
            <button onClick={() => handleRemoveShift(shift)} className="text-red-400">Remove</button>
          </div>
        </div>
      </div>
    ));
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

      {!selectedGroupId && (
        <div className="mb-8 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No Group Selected</strong>
          <span className="block sm:inline"> Select a group from the navigation menu to view schedule.</span>
        </div>
      )}

      {selectedGroupId && (
        <div className="bg-[#1e2433] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-white text-lg font-semibold">Weekly Schedule</h2>
              <p className="text-gray-400 text-sm">Assign employees to shifts for the selected period</p>
            </div>
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
      )}

      {showModal && selectedGroupId && (
        <ShiftModal
          onClose={closeModal}
          onSave={handleSaveShift}
          initialShift={editingShift}
          groupId={parseInt(selectedGroupId)}
          employees={groupMembers}
        />
      )}
    </div>
  );
};

export default ScheduleManagement;
