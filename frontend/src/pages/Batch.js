import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { Link } from 'react-router-dom';
import axios from '../utils/api';
import { MessageSquare, User as UserIcon, Users } from 'lucide-react';

const degreeProgramMap = {
  'Engineering Technology': [
    'Bachelor of Software Engineering',
    'Bachelor of Technology (Engineering)',
    'Bachelor of Industrial Studies (Honours)',
    'M.Sc. in Structural Engineering',
    'Master of Energy Management',
  ],
  'Natural Sciences': [
    'Bachelor of Science (B.Sc.)',
    'B.Sc. in Information Technology',
    'M.Sc. in Environmental Sciences',
    'Bachelor of Education (Honours) in Natural Sciences',
  ],
  'Health Sciences': [
    'M.Sc. in Medical Entomology and Applied Parasitology',
    'Master of Nursing',
  ],
  'Humanities and Social Sciences': [
    'Bachelor of Arts',
    'B.A. in Social Sciences',
    'Ph.D. in English',
    'M.Phil. in English',
    'M.A. in English Teaching',
    'M.A. in Literature Teaching in Second Language Context',
    'Postgraduate Diploma in Bilingual Education',
    'Postgraduate Diploma in Professional Practice in English',
  ],
  'Education': [
    'Bachelor of Education (Honours) in Special Needs Education',
    'Postgraduate Diploma in Education',
    'Postgraduate Diploma in Special Needs Education',
    'Master of Education (M.Ed.)',
    'M.Ed. in Special Needs Education',
    'Master of Teacher Education',
  ],
  'Management Studies': [
    'Bachelor of Management Studies',
    'Master of Business Administration (MBA) in Human Resource Management',
    'Commonwealth Executive MBA/MPA',
    'Master of Arts in Development Studies & Public Policy',
    'Master of Laws (LL.M.) in Criminal Justice Administration',
    'Bachelor of Laws (LL.B.)',
  ]
};

const faculties = Object.keys(degreeProgramMap);

const Batch = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filters, setFilters] = useState({
    faculty: '',
    batch: '', 
    degreeProgram: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      // If faculty changes, reset degree program
      ...(name === 'faculty' ? { degreeProgram: '' } : {})
    }));
  };

  useEffect(() => {
    const fetchFilteredUsers = async () => {
      // Prevent searching if batch is incomplete (e.g. typing "20")
      if (filters.batch.length > 0 && filters.batch.length < 4) return;

      setLoading(true);
      try {
        const query = new URLSearchParams(filters).toString();
        const res = await axios.get(`/api/users?${query}`);
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredUsers();
  }, [filters]);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F7FA] dark:bg-slate-900">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#1A237E] dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    // 1. FULL WIDTH WRAPPER & FONT: Lato font and global background
    <div className="min-h-screen w-full bg-[#F5F7FA] dark:bg-slate-900 transition-colors duration-300 font-['Lato'] pb-16">
      
      {/* 2. CENTERED CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          {/* Elegant Font Applied Here */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A237E] dark:text-white tracking-tight font-['Playfair_Display'] mb-3">
            Student Directory
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Built by students, for students. Find your peers.
          </p>
          
          {/* Filter Card */}
          <div className="mt-10 bg-white dark:bg-slate-800 p-8 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-700 grid grid-cols-1 gap-6 md:grid-cols-3 transition-colors duration-300">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Faculty</label>
              <select 
                name="faculty" 
                value={filters.faculty} 
                onChange={handleFilterChange} 
                className="block w-full border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all text-sm p-4 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white font-medium appearance-none cursor-pointer"
              >
                <option value="">All Faculties</option>
                {faculties.map(fac => <option key={fac} value={fac}>{fac}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Degree Program</label>
              <select 
                name="degreeProgram" 
                value={filters.degreeProgram} 
                onChange={handleFilterChange} 
                disabled={!filters.faculty}
                className={`block w-full border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all text-sm p-4 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white font-medium appearance-none cursor-pointer ${!filters.faculty ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">All Programs</option>
                {filters.faculty && degreeProgramMap[filters.faculty].map(deg => (
                  <option key={deg} value={deg}>{deg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Batch Year</label>
              <input 
                type="number" 
                name="batch" 
                placeholder="e.g. 2024"
                value={filters.batch} 
                onChange={handleFilterChange} 
                className="block w-full border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all text-sm p-4 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white font-medium placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Loading & Grid Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#1A237E] dark:border-indigo-400"></div>
            <p className="mt-6 text-slate-500 dark:text-slate-400 font-medium tracking-wide">Searching for students...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users.map(u => (
              <div key={u._id} className="group bg-white dark:bg-slate-800 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-700 flex flex-col">
                {/* Elegant Top Border Line */}
                <div className="h-1.5 bg-[#1A237E] dark:bg-indigo-500 w-full opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                {/* User Card Content */}
                <div className="p-8 flex flex-col items-center flex-grow">
                  <div className="relative mb-5">
                    {u.avatar ? (
                      <img 
                        src={u.avatar} 
                        alt={u.firstName} 
                        className="h-24 w-24 rounded-full object-cover ring-4 ring-slate-50 dark:ring-slate-700/50 shadow-md transition-transform duration-300 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-blue-50 dark:bg-indigo-900/20 flex items-center justify-center text-[#1A237E] dark:text-indigo-300 text-3xl font-bold font-['Playfair_Display'] shadow-inner transition-transform duration-300 group-hover:scale-105">
                        {u.firstName?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 h-5 w-5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm"></div>
                  </div>

                  {/* Elegant Font Applied Here */}
                  <h3 className="text-xl font-bold font-['Playfair_Display'] text-slate-900 dark:text-white group-hover:text-[#1A237E] dark:group-hover:text-indigo-400 transition-colors tracking-wide">
                     {u.firstName} {u.lastName}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium text-center mt-2 px-2 line-clamp-2 leading-relaxed">
                    {u.degreeProgram}
                  </p>
                  <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-[#1A237E] dark:text-indigo-300 uppercase tracking-wider">
                    Batch {u.batch}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex gap-3">
                  <Link to={`/profile/${u._id}`} className="flex-1 flex justify-center items-center py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
                    <UserIcon className="w-4 h-4 mr-2" /> Profile
                  </Link>
                  <Link to={`/chat/${u._id}`} className="flex-1 flex justify-center items-center py-2.5 bg-[#1A237E] hover:bg-[#151b60] dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all transform active:scale-95">
                    <MessageSquare className="w-4 h-4 mr-2" /> Chat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-[24px] p-20 text-center shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="mx-auto w-24 h-24 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Users className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold font-['Playfair_Display'] text-slate-900 dark:text-white tracking-tight mb-2">No students found</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Try adjusting your filters to find more peers.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Batch;