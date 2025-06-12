import React, { useEffect, useState } from 'react';
import groupService from '../../services/groupService';
import { Group, GroupUser, GroupUserRole } from '../../types/group';
import { User } from '../../types/user';
import { toast } from 'react-toastify';

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupUser[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<User[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      const data = await groupService.getGroups();
      setGroups(data);
      if (data.length > 0) {
        setSelectedGroup(data[0]);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedGroup) {
        setMembers(await groupService.getGroupMembers(selectedGroup.id));
        setAvailableEmployees(await groupService.getAvailableEmployees(selectedGroup.id));
      }
    };
    fetchDetails();
  }, [selectedGroup]);

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newGroup = await groupService.createGroup({
        name: newGroupName,
        description: newGroupDescription,
      });
      const updatedGroups = await groupService.getGroups();
      setGroups(updatedGroups);
      const createdOrFirstGroup = updatedGroups.find(g => g.id === newGroup.id) || updatedGroups[0];
      setSelectedGroup(createdOrFirstGroup);
      setNewGroupName('');
      setNewGroupDescription('');
      toast.success('Group created successfully!');
    } catch (error) {
      console.error('Failed to create group:', error);
      toast.error('Failed to create group.');
    }
  };

  const handleAdd = (user: User) => {
    // Mock add: just move user from availableEmployees to members
    setAvailableEmployees(prev => prev.filter(u => u.id !== user.id));
    setMembers(prev => [...prev, { id: user.id, user, role: GroupUserRole.MEMBER, createdAt: '', updatedAt: '' }]);
  };

  const handleRemove = (userId: string) => {
    // Mock remove: just move user from members to availableEmployees
    const member = members.find(m => m.user.id === userId);
    if (member) {
      setMembers(prev => prev.filter(m => m.user.id !== userId));
      setAvailableEmployees(prev => [...prev, member.user]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      <div className="w-full md:w-1/3 bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Groups</h2>
        <div className="flex flex-col gap-2">
          {groups.map(group => (
            <button
              key={group.id}
              className={`flex justify-between items-center px-4 py-2 rounded-lg text-left ${selectedGroup?.id === group.id ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => handleGroupSelect(group)}
            >
              <span>{group.name}</span>
              <span className="text-sm opacity-70">{(group.members?.length || 0)} members</span>
            </button>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-white mt-6 mb-4">Create New Group</h2>
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label htmlFor="newGroupName" className="block text-sm font-medium text-gray-300">Group Name</label>
            <input
              type="text"
              id="newGroupName"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg mt-1 bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter group name"
              required
            />
          </div>
          <div>
            <label htmlFor="newGroupDescription" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              id="newGroupDescription"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg mt-1 bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter group description (optional)"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors duration-200"
          >
            Create Group
          </button>
        </form>
      </div>
      <div className="w-full md:w-2/3 bg-gray-900 rounded-lg p-6">
        {selectedGroup && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">{selectedGroup.name}</h2>
              <button className="text-red-400 hover:text-red-600">Delete Group</button>
            </div>
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-200 mb-2">Members</h3>
              <div className="flex flex-col gap-2">
                {members.map(member => (
                  <div key={member.user.id} className="flex justify-between items-center bg-gray-800 rounded px-4 py-2">
                    <div>
                      <div className="text-white font-medium">{member.user.firstName} {member.user.lastName}</div>
                      <div className="text-gray-400 text-sm">{member.user.email}</div>
                      <div className="text-gray-500 text-xs">{member.role === 'MANAGER' ? 'Manager' : 'Member'}</div>
                    </div>
                    <button
                      className="text-red-400 hover:text-red-600"
                      onClick={() => handleRemove(member.user.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-200 mb-2">Available Employees</h3>
              <div className="flex flex-col gap-2">
                {availableEmployees.map(user => (
                  <div key={user.id} className="flex justify-between items-center bg-gray-800 rounded px-4 py-2">
                    <div>
                      <div className="text-white font-medium">{user.firstName} {user.lastName}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                    <button
                      className="text-blue-400 hover:text-blue-600"
                      onClick={() => handleAdd(user)}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupManagement; 