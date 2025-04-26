import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import GroupManagement from './components/GroupManagement';
import ScheduleManagement from './components/ScheduleManagement';
import EmployeeDetailPage from './components/pages/EmployeeDetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#141824]">
      <Navbar onLogout={() => {  }} />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups" element={<GroupManagement />} />
            <Route path="/schedule" element={<ScheduleManagement />} />
            <Route path="/employee/:id" element={<EmployeeDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 