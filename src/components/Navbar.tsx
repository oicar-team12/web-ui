import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useGroup } from '../context/GroupContext';
import { config } from '../config';
import groupService from '../services/groupService';
import { Group } from '../types/group';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { selectedGroupId, setSelectedGroupId } = useGroup();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const data = await groupService.getGroups();
      setGroups(data);

      // If a group is already selected in context (from localStorage), try to find it.
      // Otherwise, select the first group from the fetched data.
      if (data.length > 0) {
        const initialGroup = selectedGroupId 
          ? data.find(g => g.id === selectedGroupId) 
          : data[0];
        
        if (initialGroup) {
          setSelectedGroupId(initialGroup.id);
        } else if (data.length > 0) { // Fallback if selectedGroupId from localStorage doesn't exist anymore
          setSelectedGroupId(data[0].id);
        }
      }
    };
    fetchGroups();
  }, [selectedGroupId, setSelectedGroupId]); // Add selectedGroupId to dependency array to re-run if it changes from external source

  const handleLogout = async () => {
    await logout();
    setSelectedGroupId(null); // Clear selected group on logout
    navigate('/login');
  };

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const groupId = event.target.value;
    setSelectedGroupId(groupId); // Update context (and localStorage via GroupContext)
  };

  return (
    <nav className="bg-gray-900 px-4 py-2 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-bold text-white tracking-tight">ShiftSync</Link>
        <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded transition">Dashboard</Link>
        <Link to="/schedule" className="text-gray-300 hover:text-white px-3 py-2 rounded transition">Schedule</Link>
        <Link to="/groups" className="text-gray-300 hover:text-white px-3 py-2 rounded transition">Groups</Link>
        {groups.length > 0 && (
          <select
            value={selectedGroupId || ''}
            onChange={handleGroupChange}
            className="ml-4 bg-gray-800 text-gray-200 border border-gray-700 rounded px-2 py-1"
          >
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="text-gray-300 hover:text-white px-3 py-2 rounded transition"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
        {config.mockMode && (
          <span className="text-yellow-400 text-sm px-2 py-1 bg-yellow-900/30 rounded">
            Mock Mode
          </span>
        )}
        <Link to="/profile" className="text-gray-300 hover:text-white px-3 py-2 rounded transition">Profile</Link>
        <button
          onClick={handleLogout}
          className="text-gray-300 hover:text-white px-3 py-2 rounded transition border border-gray-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
