import React, { useState, useEffect } from 'react';
import { Group } from '../types/group';
import groupService from '../services/groupService';

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const fetchedGroups = await groupService.getGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName) return;
    try {
      await groupService.createGroup({ name: newGroupName, description: newGroupDescription });
      setNewGroupName('');
      setNewGroupDescription('');
      loadGroups();
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleUpdateGroupName = async (groupId: number) => {
    if (!editingGroupName) return;
    try {
      await groupService.updateGroupName(groupId, editingGroupName);
      setEditingGroupId(null);
      setEditingGroupName('');
      loadGroups();
    } catch (error) {
      console.error('Failed to update group name:', error);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    try {
      setIsDeleting(groupId);
      await groupService.deleteGroup(groupId);
      await loadGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Group Management</h2>
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="New Group Name"
            className="flex-1 px-3 py-2 border rounded"
          />
          <input
            type="text"
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
            placeholder="New Group Description"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button 
            onClick={handleCreateGroup}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Group
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="border rounded p-4">
            {editingGroupId === group.id ? (
              <div className="flex gap-4">
                <input
                  type="text"
                  value={editingGroupName}
                  onChange={(e) => setEditingGroupName(e.target.value)}
                  placeholder="Edit Group Name"
                  className="flex-1 px-3 py-2 border rounded"
                />
                <button 
                  onClick={() => handleUpdateGroupName(group.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button 
                  onClick={() => setEditingGroupId(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  {group.description && (
                    <p className="text-gray-600">{group.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setEditingGroupId(group.id); setEditingGroupName(group.name); }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteGroup(group.id)}
                    disabled={isDeleting === group.id}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    {isDeleting === group.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupManagement; 