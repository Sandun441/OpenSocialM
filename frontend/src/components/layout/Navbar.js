import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if we are on the auth pages OR the root '/'
  const isAuthPage = 
    location.pathname === '/login' || 
    location.pathname === '/' || 
    location.pathname === '/register' || 
    location.pathname === '/forgot-password';

  return (
    <nav className="bg-[#1A237E] dark:bg-slate-900 shadow-lg transition-colors duration-300 font-['Lato'] z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex h-16 items-center ${isAuthPage ? 'justify-center' : 'justify-between'}`}>
          
          {/* --- LEFT SIDE: LOGO --- */}
          <div className="flex items-center">
            {/* Logo Text - OpenSocialM */}
            <Link 
              to="/" 
              className={`text-white font-bold tracking-wide hover:text-blue-100 transition-colors font-['Playfair_Display'] ${isAuthPage ? 'text-3xl' : 'text-2xl'}`}
            >
              OpenSocialM
            </Link>

            {/* Navigation Links - Hidden on Auth Pages */}
            {!isAuthPage && isAuthenticated && (
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to={`/faculty/${user?.faculty}`}>My Faculty</NavLink>
                <NavLink to="/batch">Batch</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/about">About Us</NavLink>
              </div>
            )}
          </div>

          {/* --- RIGHT SIDE: LOGOUT ONLY (Hidden if not logged in) --- */}
          {!isAuthPage && isAuthenticated && (
            <div className="flex items-center">
              <div className="flex items-center space-x-5">
                <span className="text-indigo-100 text-sm hidden md:block tracking-wide">
                  Hello, <span className="font-bold text-white">{user?.firstName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-[#1A237E] px-5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all shadow-sm transform hover:-translate-y-0.5 tracking-wider"
                >
                  LOGOUT
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

// Helper component for links
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="border-transparent text-indigo-100 hover:text-white hover:border-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors tracking-wide"
  >
    {children}
  </Link>
);

export default Navbar;