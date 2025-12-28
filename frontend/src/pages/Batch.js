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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    // 1. FULL WIDTH WRAPPER: This fixes the background color issue
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      {/* 2. CENTERED CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight italic">
            Student Directory
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 italic">
            Built by students, for students. Find your peers.
          </p>
          
          {/* Filter Card */}
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Faculty</label>
              <select 
                name="faculty" 
                value={filters.faculty} 
                onChange={handleFilterChange} 
                className="block w-full border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Faculties</option>
                {faculties.map(fac => <option key={fac} value={fac}>{fac}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Degree Program</label>
              <select 
                name="degreeProgram" 
                value={filters.degreeProgram} 
                onChange={handleFilterChange} 
                disabled={!filters.faculty}
                className="block w-full border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              >
                <option value="">All Programs</option>
                {filters.faculty && degreeProgramMap[filters.faculty].map(deg => (
                  <option key={deg} value={deg}>{deg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Batch Year</label>
              <input 
                type="number" 
                name="batch" 
                placeholder="e.g. 2022"
                value={filters.batch} 
                onChange={handleFilterChange} 
                className="block w-full border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Loading & Grid Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Searching for students...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users.map(u => (
              <div key={u._id} className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col">
                <div className="h-2 bg-indigo-600"></div>
                
                {/* User Card Content */}
                <div className="p-6 flex flex-col items-center flex-grow">
                  <div className="relative mb-4">
                    {u.avatar ? (
                      <img 
                        src={u.avatar} 
                        alt={u.firstName} // Fixed undefined name bug
                        className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-50 dark:ring-gray-700 shadow-lg" 
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-3xl font-black shadow-inner">
                        {u.firstName?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                     {u.firstName} {u.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center mt-1 px-4 line-clamp-2">
                    {u.degreeProgram}
                  </p>
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 uppercase">
                    Batch {u.batch}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                  <Link to={`/profile/${u._id}`} className="flex-1 flex justify-center items-center py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                    <UserIcon className="w-4 h-4 mr-2" /> Profile
                  </Link>
                  <Link to={`/chat/${u._id}`} className="flex-1 flex justify-center items-center py-2 bg-indigo-600 dark:bg-indigo-700 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none transition-all">
                    <MessageSquare className="w-4 h-4 mr-2" /> Chat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-20 text-center shadow-sm border border-dashed border-gray-300 dark:border-gray-600">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No students found</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters to find more OUSL peers.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Batch;