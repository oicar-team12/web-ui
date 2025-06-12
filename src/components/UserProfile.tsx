import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DeleteAccountModal from './modals/DeleteAccountModal';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-light-background dark:bg-dark-background transition-colors duration-200"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-light-primary dark:bg-dark-primary rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">Profile</h1>
          
          {user && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text">Name</label>
                <p className="mt-1 text-light-text dark:text-dark-text">{user.firstName} {user.lastName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text">Email</label>
                <p className="mt-1 text-light-text dark:text-dark-text">{user.email}</p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onDelete={() => {}}
        />
      )}
    </motion.div>
  );
};

export default UserProfile; 