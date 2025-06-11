import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-light-primary dark:bg-dark-primary rounded-lg shadow-lg p-6"
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Profile Picture Placeholder */}
          <div className="w-32 h-32 rounded-full bg-light-accent dark:bg-dark-accent flex items-center justify-center">
            <span className="text-4xl text-light-text dark:text-dark-text">
              {user.firstName.charAt(0)}
            </span>
          </div>

          {/* User Info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
              {`${user.firstName} ${user.lastName}`}
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
              {user.email}
            </p>
            {user.role && (
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 w-full">
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
          <div className="w-full space-y-3">
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200">
              Edit Profile
            </button>
            <button className="w-full bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text py-2 rounded hover:bg-opacity-80 transition-colors duration-200">
              View Schedule
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile; 