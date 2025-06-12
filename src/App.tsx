import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import DashboardShifts from './components/dashboard/DashboardShifts';
import DashboardSchedules from './components/dashboard/DashboardSchedules';
import DashboardAvailabilities from './components/dashboard/DashboardAvailabilities';
import DashboardMembers from './components/dashboard/DashboardMembers';
import { GroupProvider } from './context/GroupContext';
import GroupManagement from './components/groups/GroupManagement';
import ScheduleManagement from './components/ScheduleManagement';

// Lazy load components
const Home = React.lazy(() => import('./components/Home'));
const EmployeeDetailPage = React.lazy(() => import('./components/pages/EmployeeDetailPage'));
const ActivityPage = React.lazy(() => import('./components/pages/ActivityPage'));

// Loading component with improved styling
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-light-primary dark:bg-dark-primary transition-colors duration-200">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PageTransition><Dashboard /></PageTransition>
            </PrivateRoute>
          }
        />
        <Route 
          path="/dashboard/shifts" 
          element={
            <PrivateRoute>
              <PageTransition><DashboardShifts /></PageTransition>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/schedules" 
          element={
            <PrivateRoute>
              <PageTransition><DashboardSchedules /></PageTransition>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/availabilities" 
          element={
            <PrivateRoute>
              <PageTransition><DashboardAvailabilities /></PageTransition>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/members" 
          element={
            <PrivateRoute>
              <PageTransition><DashboardMembers /></PageTransition>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/employee/:id" 
          element={
            <PrivateRoute>
              <PageTransition><EmployeeDetailPage /></PageTransition>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/activity" 
          element={
            <PrivateRoute>
              <PageTransition><ActivityPage /></PageTransition>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <PageTransition><UserProfile /></PageTransition>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/groups" 
          element={
            <PrivateRoute>
              <PageTransition><GroupManagement /></PageTransition>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/schedule" 
          element={
            <PrivateRoute>
              <PageTransition><ScheduleManagement /></PageTransition>
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <GroupProvider>
            <div className="min-h-screen bg-light-secondary dark:bg-dark-secondary transition-colors duration-200">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Suspense fallback={<Loading />}>
                  <AppRoutes />
                </Suspense>
              </main>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </GroupProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App; 