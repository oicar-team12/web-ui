import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => (
  <div className="bg-[#1e2433] p-4 rounded-lg">
    <h3 className="text-gray-400 text-sm">{title}</h3>
    <p className="text-white text-2xl font-bold">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const mockStats = {
    totalStaff: 12,
    availableToday: 8,
    currentlyOnShift: 3,
    timeOff: 1,
  };

  const mockShifts = [
    {
      name: 'John Doe',
      position: 'Front Desk',
      time: '9:00 AM - 5:00 PM',
      date: '2023-05-15',
    },
    {
      name: 'Jane Smith',
      position: 'Barista',
      time: '2:00 PM - 10:00 PM',
      date: '2023-05-15',
    },
    {
      name: 'Mike Johnson',
      position: 'Kitchen Staff',
      time: '9:00 AM - 5:00 PM',
      date: '2023-05-15',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, Manager</h1>
        <p className="text-gray-400">Here's what's happening with your team today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Staff" value={mockStats.totalStaff} />
        <StatsCard title="Available Today" value={mockStats.availableToday} />
        <StatsCard title="Currently on Shift" value={mockStats.currentlyOnShift} />
        <StatsCard title="Time Off" value={mockStats.timeOff} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1e2433] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-lg font-semibold">Today's Shifts</h2>
            <button className="text-blue-400 hover:text-blue-300">View All</button>
          </div>
          <div className="space-y-4">
            {mockShifts.map((shift, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-[#252b3b] rounded">
                <div>
                  <h3 className="text-white font-medium">{shift.name}</h3>
                  <p className="text-gray-400 text-sm">{shift.position}</p>
                </div>
                <div className="text-right">
                  <p className="text-white">{shift.time}</p>
                  <p className="text-gray-400 text-sm">{shift.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1e2433] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-lg font-semibold">Recent Activity</h2>
            <button className="text-blue-400 hover:text-blue-300">View All Activity</button>
          </div>
          <div className="space-y-4">
            <div className="text-gray-400">
              <p>Jane Smith marked availability for next week</p>
              <p className="text-sm">2 hours ago</p>
            </div>
            <div className="text-gray-400">
              <p>John Doe requested time off on May 20</p>
              <p className="text-sm">5 hours ago</p>
            </div>
            <div className="text-gray-400">
              <p>You created a new shift assignment</p>
              <p className="text-sm">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-[#1e2433] p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white font-medium">Need to create a new shift?</h2>
            <p className="text-gray-400">Quickly assign shifts to your team members</p>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create New Shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 