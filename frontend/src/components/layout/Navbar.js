import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
// Removed ThemeToggle import

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- FIXED LOGIC HERE ---
  // Check if we are on '/login' OR just '/' (root) OR '/register'
  const isLoginPage = location.pathname === '/login' || location.pathname === '/' || location.pathname === '/register';

  return (
    <nav className="bg-indigo-600 dark:bg-indigo-900 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex h-16 items-center ${isLoginPage ? 'justify-center' : 'justify-between'}`}>
          
          {/* LEFT SIDE */}
          <div className="flex items-center">
            
            {/* BRANDING */}
            <div className="flex-shrink-0 flex items-center gap-4">
              {/* Logo Text */}
              <Link 
                to="/" 
                className={`text-white dark:text-gray-100 font-bold text-xl tracking-wide hover:text-indigo-100 transition-colors ${isLoginPage ? 'text-2xl' : ''}`}
              >
                OUSL Community
              </Link>
            </div>

            {/* NAVIGATION LINKS (Hide on Login Page) */}
            {!isLoginPage && isAuthenticated && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to={`/faculty/${user?.faculty}`}>My Faculty</NavLink>
                <NavLink to="/batch">Batch</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/about">About Us</NavLink>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: User Info + Logout (Hide completely on Login Page) */}
          {!isLoginPage && (
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
          )}

        </div>
      </div>
    </nav>
  );
};

// Helper component
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="border-transparent text-indigo-100 hover:text-white hover:border-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;