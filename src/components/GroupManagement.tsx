import React, { useState } from 'react';

interface Employee {
  id: string;
  name: string;
  email: string;
  position?: string;
}

interface Group {
  id: string;
  name: string;
  memberCount: number;
}

const GroupManagement: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('Housekeeping');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [groups, setGroups] = useState<Group[]>([
    { id: '1', name: 'Front Desk', memberCount: 2 },
    { id: '2', name: 'Kitchen Staff', memberCount: 3 },
    { id: '3', name: 'Housekeeping', memberCount: 2 },
  ]);
  
  const [members, setMembers] = useState<Employee[]>([
    { id: '1', name: 'Emily Davis', email: 'emily@example.com', position: 'Receptionist' },
    { id: '2', name: 'Robert Wilson', email: 'robert@example.com', position: 'Front Desk Manager' },
  ]);

  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([
    { id: '3', name: 'Lisa Taylor', email: 'lisa@example.com', position: 'Housekeeper' },
    { id: '4', name: 'Michael Anderson', email: 'michael@example.com', position: 'Chef' },
    { id: '5', name: 'Jessica Thomas', email: 'jessica@example.com', position: 'Server' },
  ]);

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: newGroupName,
        memberCount: 0
      };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setShowCreateModal(false);
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      const updatedGroups = groups.filter(group => group.id !== groupId);
      setGroups(updatedGroups);
      if (updatedGroups.length > 0) {
        setSelectedGroup(updatedGroups[0].name);
      }
    }
  };

  const handleAddMember = (employee: Employee) => {
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
  };

  const handleRemoveMember = (employee: Employee) => {
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
  };

  const selectedGroupData = groups.find(group => group.name === selectedGroup);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Group Management</h1>
          <p className="text-gray-400">Create and manage employee groups</p>
        </div>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Group
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1e2433] p-6 rounded-lg w-96">
            <h2 className="text-white text-xl font-bold mb-4">Create New Group</h2>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group Name"
              className="w-full p-2 mb-4 bg-[#252b3b] text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleCreateGroup}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e2433] rounded-lg p-6">
          <h2 className="text-white text-lg font-semibold mb-4">Groups</h2>
          <div className="space-y-2">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.name)}
                className={`w-full text-left p-3 rounded flex justify-between items-center ${
                  selectedGroup === group.name ? 'bg-blue-500' : 'bg-[#252b3b] hover:bg-[#2a2f3e]'
                }`}
              >
                <span className="text-white">{group.name}</span>
                <span className="text-gray-400">{group.memberCount} members</span>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-[#1e2433] rounded-lg p-6">
          {selectedGroupData && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-lg font-semibold">{selectedGroup}</h2>
                <button 
                  className="text-red-500 hover:text-red-400"
                  onClick={() => handleDeleteGroup(selectedGroupData.id)}
                >
                  Delete Group
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-white font-medium mb-4">Members</h3>
                {members.length > 0 ? (
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div key={member.id} className="flex justify-between items-center p-3 bg-[#252b3b] rounded">
                        <div>
                          <p className="text-white">{member.name}</p>
                          <p className="text-gray-400 text-sm">{member.email}</p>
                          {member.position && (
                            <p className="text-gray-500 text-xs">{member.position}</p>
                          )}
                        </div>
                        <button 
                          className="text-gray-400 hover:text-red-400"
                          onClick={() => handleRemoveMember(member)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No members in this group</p>
                )}
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Available Employees</h3>
                {availableEmployees.length > 0 ? (
                  <div className="space-y-2">
                    {availableEmployees.map((employee) => (
                      <div key={employee.id} className="flex justify-between items-center p-3 bg-[#252b3b] rounded">
                        <div>
                          <p className="text-white">{employee.name}</p>
                          <p className="text-gray-400 text-sm">{employee.email}</p>
                          {employee.position && (
                            <p className="text-gray-500 text-xs">{employee.position}</p>
                          )}
                        </div>
                        <button 
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => handleAddMember(employee)}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No available employees to add</p>
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