import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Group, GroupUser, GroupUserRole } from '../../types/group';
import { Shift } from '../../types/shift';
import { Availability } from '../../types/availability';
import { groupService } from '../../services/groupService';
import { shiftService } from '../../services/shiftService';
import { availabilityService } from '../../services/availabilityService';
import { ShiftManagement } from './ShiftManagement';
import { AvailabilityManagement } from './AvailabilityManagement';

export const GroupDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupUser[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'shifts' | 'availability' | 'members'>('shifts');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<GroupUserRole>(GroupUserRole.MEMBER);

  useEffect(() => {
    if (groupId) {
      loadGroupData();
    }
  }, [groupId]);

  const loadGroupData = async () => {
    try {
      const [groupData, membersData, shiftsData, availabilityData] = await Promise.all([
        groupService.getGroup(Number(groupId)),
        groupService.getGroupUsers(Number(groupId)),
        shiftService.getShifts(Number(groupId)),
        availabilityService.getAvailability(Number(groupId))
      ]);

      setGroup(groupData);
      setMembers(membersData);
      setShifts(shiftsData);
      setAvailability(availabilityData);
    } catch (err) {
      setError('Failed to load group data');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    try {
      const newMember = await groupService.addUserToGroup(Number(groupId), newMemberEmail, newMemberRole);
      setMembers([...members, newMember]);
      setNewMemberEmail('');
      setNewMemberRole(GroupUserRole.MEMBER);
    } catch (err) {
      setError('Failed to add member');
    }
  };

  const handleUpdateMemberRole = async (userId: number, role: GroupUserRole) => {
    try {
      const updatedMember = await groupService.updateUserRole(Number(groupId), userId, role);
      setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
    } catch (err) {
      setError('Failed to update member role');
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      await groupService.removeUserFromGroup(Number(groupId), userId);
      setMembers(members.filter(m => m.user.id !== userId));
    } catch (err) {
      setError('Failed to remove member');
    }
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{group.name}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="border-b">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('shifts')}
              className={`py-2 px-4 border-b-2 font-medium ${
                activeTab === 'shifts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Shifts
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`py-2 px-4 border-b-2 font-medium ${
                activeTab === 'availability'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Availability
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-2 px-4 border-b-2 font-medium ${
                activeTab === 'members'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Members
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'shifts' && (
        <ShiftManagement
          groupId={Number(groupId)}
          shifts={shifts}
          onShiftsChange={setShifts}
        />
      )}

      {activeTab === 'availability' && (
        <AvailabilityManagement
          groupId={Number(groupId)}
          availability={availability}
          onAvailabilityChange={setAvailability}
        />
      )}

      {activeTab === 'members' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Members</h2>
          
          <form onSubmit={handleAddMember} className="mb-8">
            <div className="flex gap-4">
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter member email"
                className="flex-1 px-4 py-2 border rounded"
                required
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value as GroupUserRole)}
                className="px-4 py-2 border rounded"
              >
                <option value={GroupUserRole.MANAGER}>Manager</option>
                <option value={GroupUserRole.MEMBER}>Member</option>
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Member
              </button>
            </div>
          </form>

          <div className="grid gap-4">
            {members.map((member) => (
              <div key={member.id} className="border rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{member.user.firstName} {member.user.lastName}</p>
                  <p className="text-gray-500">{member.user.email}</p>
                  <p className="text-sm">Role: {member.role}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={member.role}
                    onChange={(e) => handleUpdateMemberRole(member.user.id, e.target.value as GroupUserRole)}
                    className="border rounded px-2 py-1"
                  >
                    <option value={GroupUserRole.MANAGER}>Manager</option>
                    <option value={GroupUserRole.MEMBER}>Member</option>
                  </select>
                  <button
                    onClick={() => handleRemoveMember(member.user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 