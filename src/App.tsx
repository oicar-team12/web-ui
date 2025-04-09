import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import GroupManagement from './components/GroupManagement';
import ScheduleManagement from './components/ScheduleManagement';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#141824]">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups" element={<GroupManagement />} />
            <Route path="/schedule" element={<ScheduleManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 