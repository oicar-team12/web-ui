import React, { useEffect, useState } from 'react';
import groupService from '../../services/groupService';
import groupMemberService from '../../services/groupMemberService';
import { Group, GroupUser, GroupUserRole } from '../../types/group';
import { User } from '../../types/user';
import { toast } from 'react-toastify';
import { userService } from '../../services/userService';

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupUser[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

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
        const groupMembers = await groupMemberService.getGroupMembers(selectedGroup.id.toString());
        setMembers(groupMembers);
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

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await userService.getAllEmployees();
      const filteredResults = results.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Failed to search users:', error);
      toast.error('Failed to search users.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMember = async (user: User) => {
    if (!selectedGroup) return;
    try {
      await groupService.addGroupUserByEmail(selectedGroup.id, user.email);
      const updatedMembers = await groupMemberService.getGroupMembers(selectedGroup.id.toString());
      setMembers(updatedMembers);
      setSearchQuery('');
      setSearchResults([]);
      toast.success('Member added successfully!');
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error('Failed to add member.');
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!selectedGroup) return;
    try {
      await groupMemberService.removeMember(selectedGroup.id.toString(), userId);
      const updatedMembers = await groupMemberService.getGroupMembers(selectedGroup.id.toString());
      setMembers(updatedMembers);
      toast.success('Member removed successfully!');
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member.');
    }
  };

  const handleUpdateMemberRole = async (userId: number, role: GroupUserRole) => {
    if (!selectedGroup) return;
    try {
      await groupMemberService.updateMemberRole(selectedGroup.id.toString(), userId, role);
      const updatedMembers = await groupMemberService.getGroupMembers(selectedGroup.id.toString());
      setMembers(updatedMembers);
      toast.success('Member role updated successfully!');
    } catch (error) {
      console.error('Failed to update member role:', error);
      toast.error('Failed to update member role.');
    }
  };

  const handleAddMemberByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !newMemberEmail.trim()) return;

    try {
      await groupService.addGroupUserByEmail(selectedGroup.id, newMemberEmail.trim());
      const updatedMembers = await groupMemberService.getGroupMembers(selectedGroup.id.toString());
      setMembers(updatedMembers);
      setNewMemberEmail('');
      toast.success('Member added successfully!');
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error('Failed to add member. Please check if the email is correct and the user exists.');
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
              <span className="text-sm opacity-70">{members.length} members</span>
            </button>
          ))}
        </div>
        <form onSubmit={handleCreateGroup} className="mt-6">
          <h2 className="text-lg font-semibold text-white mb-4">Create New Group</h2>
          <div className="space-y-4">
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
          </div>
        </form>
      </div>

      <div className="w-full md:w-2/3 bg-gray-800 rounded-lg p-6">
        {selectedGroup && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">{selectedGroup.name}</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-200 mb-2">Add Members</h3>
              
              {/* Direct Email Input */}
              <form onSubmit={handleAddMemberByEmail} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Enter member's email"
                    className="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                  >
                    Add by Email
                  </button>
                </div>
              </form>

              {/* Search Users */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Or Search Users</h4>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users by name or email"
                    className="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  />
                  <button
                    onClick={handleSearchUsers}
                    disabled={isSearching}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Search Results</h4>
                    <div className="space-y-2">
                      {searchResults.map(user => (
                        <div key={user.id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                    <div>
                            <div className="text-white">{user.firstName} {user.lastName}</div>
                            <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                    <button
                            onClick={() => handleAddMember(user)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500"
                    >
                            Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
                )}
              </div>

              {/* Current Members */}
              <h3 className="text-md font-semibold text-gray-200 mb-2">Current Members</h3>
              <div className="space-y-2">
                {members.map(member => (
                  <div key={member.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                    <div>
                      <div className="text-white font-medium">{member.firstName} {member.lastName}</div>
                      <div className="text-gray-400 text-sm">{member.email}</div>
                      <div className="text-gray-500 text-xs">{member.role}</div>
                    </div>
                    <div className="flex space-x-2">
                      <select
                        value={member.role}
                        onChange={(e) => handleUpdateMemberRole(member.id, e.target.value as GroupUserRole)}
                        className="bg-gray-600 text-white px-2 py-1 rounded"
                      >
                        <option value={GroupUserRole.MANAGER}>Manager</option>
                        <option value={GroupUserRole.EMPLOYEE}>Employee</option>
                      </select>
                    <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                    >
                        Remove
                    </button>
                    </div>
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