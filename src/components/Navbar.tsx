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
    if (user) {
      loadGroups();
    }
  }, [user]);

  const loadGroups = async () => {
    try {
      const fetchedGroups = await groupService.getGroups();
      setGroups(fetchedGroups);
      if (fetchedGroups.length > 0 && !selectedGroupId) {
        setSelectedGroupId(fetchedGroups[0].id.toString());
      }
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setSelectedGroupId(null); // Clear selected group on logout
    setGroups([]); // Clear groups on logout
    navigate('/login');
  };

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroupId(event.target.value);
  };

  return (
    <nav className="bg-light-primary dark:bg-dark-primary px-4 py-2 flex items-center justify-between shadow-md border-b border-light-border dark:border-dark-border">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-bold text-light-text dark:text-dark-text tracking-tight">ShiftSync</Link>
        {user && (
          <>
            <Link to="/dashboard" className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text px-3 py-2 rounded transition">Dashboard</Link>
            <Link to="/schedule" className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text px-3 py-2 rounded transition">Schedule</Link>
            <Link to="/groups" className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text px-3 py-2 rounded transition">Groups</Link>
            {groups.length > 0 && selectedGroupId && (
              <select
                value={selectedGroupId}
                onChange={handleGroupChange}
                className="ml-4 bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text border border-light-border dark:border-dark-border rounded px-2 py-1"
              >
                {groups.map(group => (
                  <option key={group.id} value={group.id.toString()}>{group.name}</option>
                ))}
              </select>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">
              {user.firstName} {user.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text px-3 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
