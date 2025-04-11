import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#0e1320] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-white text-2xl font-bold tracking-tight">
            ShiftSync
          </Link>

          {/* Mobile hamburger menu */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300 focus:outline-none"
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
          <div className="hidden sm:flex space-x-20 text-sm text-gray-300 items-center">
            <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link to="/groups" className="hover:text-white">Groups</Link>
            <Link to="/schedule" className="hover:text-white">Schedule</Link>
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
          <div className="sm:hidden mt-2 space-y-2 text-sm text-gray-300">
            <Link to="/dashboard" className="block hover:text-white">Dashboard</Link>
            <Link to="/groups" className="block hover:text-white">Groups</Link>
            <Link to="/schedule" className="block hover:text-white">Schedule</Link>            <button
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
