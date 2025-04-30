import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-light-primary dark:bg-dark-primary rounded-lg shadow-lg p-6 animate-fade-in">
      <div className="flex flex-col items-center space-y-4">
        {/* Profile Picture Placeholder */}
        <div className="w-24 h-24 rounded-full bg-light-accent dark:bg-dark-accent flex items-center justify-center">
          <span className="text-3xl text-light-text dark:text-dark-text">
            {user.name.charAt(0)}
          </span>
        </div>

        {/* User Info */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
            {user.name}
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            {user.email}
          </p>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 w-full mt-6">
          <div className="bg-light-secondary dark:bg-dark-secondary p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-light-text dark:text-dark-text">12</p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Shifts</p>
          </div>
          <div className="bg-light-secondary dark:bg-dark-secondary p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-light-text dark:text-dark-text">3</p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Groups</p>
          </div>
          <div className="bg-light-secondary dark:bg-dark-secondary p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-light-text dark:text-dark-text">8</p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Hours</p>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full mt-6 space-y-2">
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200">
            Edit Profile
          </button>
          <button className="w-full bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text py-2 rounded hover:bg-opacity-80 transition-colors duration-200">
            View Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 