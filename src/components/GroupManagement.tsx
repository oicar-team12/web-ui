import React, { useState, useMemo, useEffect } from 'react';
import { groupAPI, employeeAPI, Employee, Group } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GroupManagement: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Employee[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);

  // Fetch groups and employees on component mount
  useEffect(() => {
    fetchGroups();
    fetchEmployees();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await groupAPI.getGroups();
      setGroups(response.data);
      if (response.data.length > 0 && !selectedGroup) {
        setSelectedGroup(response.data[0].name);
      }
    } catch (error) {
      toast.error('Failed to fetch groups');
      console.error('Error fetching groups:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getEmployees();
      setAvailableEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = new Set<string>();
    [...members, ...availableEmployees].forEach(emp => {
      if (emp.position) roles.add(emp.position);
    });
    return ['all', ...Array.from(roles)];
  }, [members, availableEmployees]);

  // Filter and search employees
  const filteredAvailableEmployees = useMemo(() => {
    return availableEmployees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (emp.position && emp.position.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = filterRole === 'all' || emp.position === filterRole;
      
      return matchesSearch && matchesRole;
    });
  }, [availableEmployees, searchTerm, filterRole]);

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (member.position && member.position.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = filterRole === 'all' || member.position === filterRole;
      
      return matchesSearch && matchesRole;
    });
  }, [members, searchTerm, filterRole]);

  const handleCreateGroup = async () => {
    if (newGroupName.trim()) {
      try {
        const response = await groupAPI.createGroup({ name: newGroupName });
        setGroups([...groups, response.data]);
        setNewGroupName('');
        setShowCreateModal(false);
        toast.success('Group created successfully');
      } catch (error) {
        toast.error('Failed to create group');
        console.error('Error creating group:', error);
      }
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await groupAPI.deleteGroup(groupId);
        const updatedGroups = groups.filter(group => group.id !== groupId);
        setGroups(updatedGroups);
        if (updatedGroups.length > 0) {
          setSelectedGroup(updatedGroups[0].name);
        }
        toast.success('Group deleted successfully');
      } catch (error) {
        toast.error('Failed to delete group');
        console.error('Error deleting group:', error);
      }
    }
  };

  const handleAddMember = async (employee: Employee) => {
    try {
      const selectedGroupData = groups.find(group => group.name === selectedGroup);
      if (selectedGroupData) {
        await groupAPI.addMemberToGroup(selectedGroupData.id, employee.id);
        setMembers([...members, employee]);
        setAvailableEmployees(availableEmployees.filter(emp => emp.id !== employee.id));
        
        // Update member count
        const updatedGroups = groups.map(group => {
          if (group.name === selectedGroup) {
            return { ...group, memberCount: group.memberCount + 1 };
          }
          return group;
        });
        setGroups(updatedGroups);
        toast.success('Member added successfully');
      }
    } catch (error) {
      toast.error('Failed to add member');
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (employee: Employee) => {
    try {
      const selectedGroupData = groups.find(group => group.name === selectedGroup);
      if (selectedGroupData) {
        await groupAPI.removeMemberFromGroup(selectedGroupData.id, employee.id);
        setMembers(members.filter(member => member.id !== employee.id));
        setAvailableEmployees([...availableEmployees, employee]);
        
        // Update member count
        const updatedGroups = groups.map(group => {
          if (group.name === selectedGroup) {
            return { ...group, memberCount: group.memberCount - 1 };
          }
          return group;
        });
        setGroups(updatedGroups);
        toast.success('Member removed successfully');
      }
    } catch (error) {
      toast.error('Failed to remove member');
      console.error('Error removing member:', error);
    }
  };

  const handleStartEdit = (group: Group) => {
    setEditingGroup(group.id);
    setEditGroupName(group.name);
  };

  const handleSaveEdit = async (groupId: string) => {
    if (editGroupName.trim()) {
      try {
        await groupAPI.updateGroup(groupId, { name: editGroupName });
        const updatedGroups = groups.map(group => {
          if (group.id === groupId) {
            return { ...group, name: editGroupName };
          }
          return group;
        });
        setGroups(updatedGroups);
        setEditingGroup(null);
        setEditGroupName('');
        toast.success('Group updated successfully');
      } catch (error) {
        toast.error('Failed to update group');
        console.error('Error updating group:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditGroupName('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">Group Management</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Create and manage employee groups</p>
        </div>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Group
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-light-primary dark:bg-dark-primary p-6 rounded-lg w-96 shadow-xl animate-slide-up">
            <h2 className="text-light-text dark:text-dark-text text-xl font-bold mb-4">Create New Group</h2>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group Name"
              className="w-full p-2 mb-4 bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded border border-light-border dark:border-dark-border focus:outline-none focus:border-blue-500 transition-colors duration-200"
            />
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text rounded hover:bg-opacity-80 transition-colors duration-200"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                onClick={handleCreateGroup}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-6 shadow-sm border border-light-border dark:border-dark-border">
          <h2 className="text-light-text dark:text-dark-text text-lg font-semibold mb-4">Groups</h2>
          <div className="space-y-2">
            {groups.map((group) => (
              <div
                key={group.id}
                className={`w-full p-3 rounded flex justify-between items-center transition-colors duration-200 ${
                  selectedGroup === group.name 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-light-secondary dark:bg-dark-secondary hover:bg-light-accent dark:hover:bg-dark-accent'
                }`}
              >
                {editingGroup === group.id ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={editGroupName}
                      onChange={(e) => setEditGroupName(e.target.value)}
                      className="flex-1 p-1 bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text rounded border border-light-border dark:border-dark-border focus:outline-none focus:border-blue-500 transition-colors duration-200"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(group.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <button
                      onClick={() => handleSaveEdit(group.id)}
                      className="text-green-500 hover:text-green-400 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-500 hover:text-red-400 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectedGroup(group.name)}
                      className="flex-1 text-left"
                    >
                      <span className="text-light-text dark:text-dark-text">{group.name}</span>
                    </button>
                    <div className="flex items-center space-x-2">
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">{group.memberCount} members</span>
                      <button
                        onClick={() => handleStartEdit(group)}
                        className="text-light-text-secondary dark:text-dark-text-secondary hover:text-blue-400 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-light-primary dark:bg-dark-primary rounded-lg p-6 shadow-sm border border-light-border dark:border-dark-border">
          {selectedGroup && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-light-text dark:text-dark-text text-lg font-semibold">{selectedGroup}</h2>
                <button 
                  className="text-red-500 hover:text-red-400 transition-colors duration-200"
                  onClick={() => handleDeleteGroup(selectedGroup)}
                >
                  Delete Group
                </button>
              </div>

              {/* Search and Filter Controls */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded border border-light-border dark:border-dark-border focus:outline-none focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full p-2 bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded border border-light-border dark:border-dark-border focus:outline-none focus:border-blue-500 transition-colors duration-200"
                  >
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-light-text dark:text-dark-text font-medium mb-4">Members</h3>
                {filteredMembers.length > 0 ? (
                  <div className="space-y-2">
                    {filteredMembers.map((member) => (
                      <div key={member.id} className="flex justify-between items-center p-3 bg-light-secondary dark:bg-dark-secondary rounded border border-light-border dark:border-dark-border hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-200">
                        <div>
                          <p className="text-light-text dark:text-dark-text">{member.name}</p>
                          <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">{member.email}</p>
                          {member.position && (
                            <p className="text-light-text-secondary dark:text-dark-text-secondary text-xs">{member.position}</p>
                          )}
                        </div>
                        <button 
                          className="text-light-text-secondary dark:text-dark-text-secondary hover:text-red-400 transition-colors duration-200"
                          onClick={() => handleRemoveMember(member)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">No members found</p>
                )}
              </div>

              <div>
                <h3 className="text-light-text dark:text-dark-text font-medium mb-4">Available Employees</h3>
                {filteredAvailableEmployees.length > 0 ? (
                  <div className="space-y-2">
                    {filteredAvailableEmployees.map((employee) => (
                      <div key={employee.id} className="flex justify-between items-center p-3 bg-light-secondary dark:bg-dark-secondary rounded border border-light-border dark:border-dark-border hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-200">
                        <div>
                          <p className="text-light-text dark:text-dark-text">{employee.name}</p>
                          <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">{employee.email}</p>
                          {employee.position && (
                            <p className="text-light-text-secondary dark:text-dark-text-secondary text-xs">{employee.position}</p>
                          )}
                        </div>
                        <button 
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          onClick={() => handleAddMember(employee)}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">No available employees found</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupManagement; 