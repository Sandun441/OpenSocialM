import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-black text-white dark:text-gray-300 border-t border-gray-700 dark:border-gray-800 transition-colors duration-200 font-['Lato'] z-50 relative">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Column 1: Community Info */}
          <div className="md:pr-8">
            {/* Brand Name - OpenSocialM */}
            <h3 className="text-2xl font-bold mb-4 font-['Playfair_Display'] text-white tracking-wide">
              OpenSocialM
            </h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed font-light">
              Connect with students and lecturers from your university. 
              Built for collaboration, networking, and academic growth.
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <h3 className="text-sm font-bold mb-6 text-white tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/dashboard" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-white transition-colors tracking-wide">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-white transition-colors tracking-wide">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/batch" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-white transition-colors tracking-wide">
                  Batch Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-sm font-bold mb-6 text-white tracking-wider uppercase">
              Contact
            </h3>
            <div className="text-gray-400 dark:text-gray-500 text-sm space-y-3 font-medium tracking-wide">
              <p>
                Email:{' '}
                <a href="mailto:support@opensocialm.com" className="hover:text-white transition-colors">
                  support@opensocialm.com
                </a>
              </p>
              <p>
                Phone:{' '}
                <span className="hover:text-white transition-colors">+1 (555) 123-4567</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-700 dark:border-gray-900 text-center text-gray-500 dark:text-gray-600 text-xs font-medium tracking-wider uppercase">
          <p>&copy; {new Date().getFullYear()} OpenSocialM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;