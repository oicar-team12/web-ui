import React, { useEffect, useState } from 'react';
import { Group } from '../../types/group';
import { groupService } from '../../services/groupService';
import { useNavigate } from 'react-router-dom';

export const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (err) {
      setError('Failed to load groups');
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const newGroup = await groupService.createGroup(newGroupName);
      setGroups([...groups, newGroup]);
      setNewGroupName('');
    } catch (err) {
      setError('Failed to create group');
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;

    try {
      await groupService.deleteGroup(groupId);
      setGroups(groups.filter(g => g.id !== groupId));
    } catch (err) {
      setError('Failed to delete group');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Groups</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateGroup} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter group name"
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Group
          </button>
        </div>
      </form>

      <div className="grid gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{group.name}</h2>
              <p className="text-gray-500 text-sm">
                Created: {new Date(group.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/groups/${group.id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                View
              </button>
              <button
                onClick={() => handleDeleteGroup(group.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 