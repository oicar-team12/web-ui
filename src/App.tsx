import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load components
const Home = React.lazy(() => import('./components/Home'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const GroupManagement = React.lazy(() => import('./components/GroupManagement'));
const ScheduleManagement = React.lazy(() => import('./components/ScheduleManagement'));
const EmployeeDetailPage = React.lazy(() => import('./components/pages/EmployeeDetailPage'));
const ActivityPage = React.lazy(() => import('./components/pages/ActivityPage'));

// Loading component with improved styling
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-light-primary dark:bg-dark-primary transition-colors duration-200">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/groups" element={<PageTransition><GroupManagement /></PageTransition>} />
        <Route path="/schedule" element={<PageTransition><ScheduleManagement /></PageTransition>} />
        <Route path="/employee/:id" element={<PageTransition><EmployeeDetailPage /></PageTransition>} />
        <Route path="/activity" element={<PageTransition><ActivityPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-light-secondary dark:bg-dark-secondary transition-colors duration-200">
          <Navbar onLogout={() => { }} />
          <main>
            <Suspense fallback={<Loading />}>
              <AppRoutes />
            </Suspense>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App; 