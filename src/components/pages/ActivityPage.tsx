import React from 'react';
import { motion } from 'framer-motion';

const ActivityPage: React.FC = () => {
  // Mock data - replace with actual data from your backend
  const activities = [
    { id: 1, type: 'shift', employee: 'John Doe', action: 'started', time: '2024-04-29 09:00' },
    { id: 2, type: 'shift', employee: 'Jane Smith', action: 'ended', time: '2024-04-29 17:00' },
    { id: 3, type: 'group', employee: 'Admin', action: 'created group', time: '2024-04-29 10:30' },
    { id: 4, type: 'schedule', employee: 'Manager', action: 'updated schedule', time: '2024-04-29 11:15' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">Activity Log</h1>
      
      <div className="bg-light-primary dark:bg-dark-primary rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-light-accent dark:divide-dark-accent">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-light-text dark:text-dark-text uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-light-text dark:text-dark-text uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-light-text dark:text-dark-text uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-light-text dark:text-dark-text uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-accent dark:divide-dark-accent">
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-light-accent dark:hover:bg-dark-accent">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text dark:text-dark-text">
                    {activity.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text dark:text-dark-text">
                    {activity.employee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text dark:text-dark-text">
                    {activity.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text dark:text-dark-text">
                    {activity.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityPage; 