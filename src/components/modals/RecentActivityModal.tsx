// src/components/modals/RecentActivityModal.tsx

import React from 'react';

interface RecentActivityModalProps {
  onClose: () => void;
  activities: string[];
}

const RecentActivityModal: React.FC<RecentActivityModalProps> = ({ onClose, activities }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1e2433] p-6 rounded-lg w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">Recent Activity</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="text-gray-300">
                <p>{activity}</p>
                <p className="text-gray-500 text-sm">{Math.floor(Math.random() * 10) + 1} hours ago</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent activity.</p>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          
        </div>
      </div>
    </div>
  );
};

export default RecentActivityModal;
