import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 dark:bg-indigo-900 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* LEFT SIDE: Toggle + Logo + Links */}
          <div className="flex">
            
            {/* 1. BRANDING SECTION (Aligned Left) */}
            <div className="flex-shrink-0 flex items-center gap-4">
              {/* Toggle is first (Left Corner) */}
              <ThemeToggle />
              
              {/* Logo Text (Fixed <p> to <Link>) */}
              <Link to="/" className="text-white dark:text-gray-100 font-bold text-xl tracking-wide hover:text-indigo-100 transition-colors">
                OUSL Community
              </Link>
            </div>

            {/* NAVIGATION LINKS */}
            {isAuthenticated && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to={`/faculty/${user?.faculty}`}>My Faculty</NavLink>
                <NavLink to="/batch">Batch</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/about">About Us</NavLink>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: User Info + Logout */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-indigo-100 text-sm">
                  Hello, <span className="font-bold text-white">{user?.firstName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Helper component to keep the main code clean
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="border-transparent text-indigo-100 hover:text-white hover:border-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;