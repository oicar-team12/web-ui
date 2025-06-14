import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import { ThemeProvider, useTheme } from './context/ThemeContext';
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

// Unauthorized component
const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
    <p className="text-gray-600 dark:text-gray-300 mb-4">You don't have permission to access this resource.</p>
    <button
      onClick={() => window.history.back()}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Go Back
    </button>
  </div>
);

// Loading component with improved styling
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-light-primary dark:bg-dark-primary transition-colors duration-200">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// ThemedApp component that uses theme context
const ThemedApp: React.FC = () => {
  const { theme } = useTheme();
  
  return (
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
        theme={theme}
      />
    </div>
  );
};

// App Routes component
const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/groups" element={
          <ProtectedRoute>
            <GroupManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/schedule" element={
          <ProtectedRoute>
            <ScheduleManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/employee/:id" element={
          <ProtectedRoute>
            <EmployeeDetailPage />
          </ProtectedRoute>
        } />
        
        <Route path="/activity" element={
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <GroupProvider>
            <ThemedApp />
          </GroupProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App; 