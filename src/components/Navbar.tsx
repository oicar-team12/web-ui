import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <nav className="bg-light-primary dark:bg-dark-primary border-b border-light-accent dark:border-dark-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-light-text dark:text-dark-text text-2xl font-bold tracking-tight">
              ShiftSync
            </Link>
            <div className="flex space-x-4">
              <Link to="/login" className="text-light-text dark:text-dark-text hover:text-blue-400">
                Login
              </Link>
              <Link to="/register" className="text-light-text dark:text-dark-text hover:text-blue-400">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-light-primary dark:bg-dark-primary border-b border-light-accent dark:border-dark-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-light-text dark:text-dark-text text-2xl font-bold tracking-tight">
            ShiftSync
          </Link>

          {/* Mobile hamburger menu */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-light-text dark:text-dark-text focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex space-x-4 text-sm text-light-text dark:text-dark-text items-center">
            <Link to="/dashboard" className="hover:text-light-accent dark:hover:text-dark-accent">Dashboard</Link>
            <Link to="/groups" className="hover:text-light-accent dark:hover:text-dark-accent">Groups</Link>
            <Link to="/schedule" className="hover:text-light-accent dark:hover:text-dark-accent">Schedule</Link>
            <Link to="/profile" className="hover:text-light-accent dark:hover:text-dark-accent">Profile</Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-light-accent dark:hover:bg-dark-accent"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden mt-2 space-y-2 text-sm text-light-text dark:text-dark-text">
            <Link to="/dashboard" className="block hover:text-light-accent dark:hover:text-dark-accent">Dashboard</Link>
            <Link to="/groups" className="block hover:text-light-accent dark:hover:text-dark-accent">Groups</Link>
            <Link to="/schedule" className="block hover:text-light-accent dark:hover:text-dark-accent">Schedule</Link>
            <Link to="/profile" className="block hover:text-light-accent dark:hover:text-dark-accent">Profile</Link>
            <button
              onClick={toggleTheme}
              className="w-full text-left px-3 py-2 hover:bg-light-accent dark:hover:bg-dark-accent rounded"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-white"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
