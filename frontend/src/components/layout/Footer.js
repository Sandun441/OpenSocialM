import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // 1. CHANGED BACKGROUND: 'dark:bg-gray-900' -> 'dark:bg-black' (Pitch black for contrast)
    // 2. ADDED BORDER: 'border-t' adds a line at the top to separate it from the body
    <footer className="bg-gray-800 dark:bg-black text-white dark:text-gray-300 border-t border-gray-700 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Community Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">OUSL Community</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed">
              Connect with students and lecturers from the Open University of Sri Lanka. 
              Built for collaboration and growth.
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-white transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/batch" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-white transition-colors">
                  Batch Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact</h3>
            <div className="text-gray-400 dark:text-gray-500 text-sm space-y-2">
              <p>Email: <a href="mailto:support@ouslcommunity.com" className="hover:text-white transition-colors">support@ouslcommunity.com</a></p>
              <p>Phone: <span className="hover:text-white transition-colors">+94 11 288 1000</span></p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700 dark:border-gray-900 text-center text-gray-500 dark:text-gray-600 text-xs">
          <p>&copy; {new Date().getFullYear()} OUSL Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;