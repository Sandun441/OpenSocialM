import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { User, Mail, Lock, BookOpen, Calendar } from 'lucide-react'; 

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

const Register = () => {
  const { register, error, clearErrors } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '', 
    registrationNumber: '',
    faculty: '',
    degreeProgram: '',
    batch: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearErrors();
    if (localError) setLocalError('');
  };

  const onSubmit = async e => {
    e.preventDefault();
    clearErrors();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      const success = await register(dataToSend);
      if (success) navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 1. BACKGROUND
    <div className="min-h-screen bg-[#8CABFF] dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center p-4 font-['Lato'] py-12">
      
      {/* 2. MAIN CARD */}
      <div className="bg-white dark:bg-slate-800 rounded-[30px] shadow-2xl w-full max-w-2xl p-8 md:p-12 transform transition-all hover:shadow-3xl">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white mb-3 tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-400 dark:text-gray-400 text-sm font-medium tracking-wide uppercase">
            Join the University Community
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {(error || localError) && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 text-sm text-center border border-red-100 dark:border-red-800 animate-pulse font-medium">
            {error || localError}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={onSubmit}>
          
          {/* NAME FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
              </div>
              <input
                name="firstName"
                type="text"
                required
                placeholder="First Name"
                value={formData.firstName}
                onChange={onChange}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium"
              />
            </div>
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
              </div>
              <input
                name="lastName"
                type="text"
                required
                placeholder="Last Name"
                value={formData.lastName}
                onChange={onChange}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
            </div>
            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
              value={formData.email}
              onChange={onChange}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium"
            />
          </div>

          {/* REGISTRATION NUMBER */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <BookOpen className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
            </div>
            <input
              name="registrationNumber"
              type="text"
              required
              placeholder="Student Registration Number"
              value={formData.registrationNumber}
              onChange={onChange}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium"
            />
          </div>

          {/* FACULTY & DEGREE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <select
                name="faculty"
                value={formData.faculty}
                onChange={onChange}
                required
                className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="">Select Faculty</option>
                {faculties.map(fac => <option key={fac} value={fac}>{fac}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">▼</div>
            </div>

            <div className="relative group">
              <select
                name="degreeProgram"
                value={formData.degreeProgram}
                onChange={onChange}
                required
                disabled={!formData.faculty}
                className={`w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all font-medium appearance-none cursor-pointer ${!formData.faculty ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">Select Degree</option>
                {formData.faculty && degreeProgramMap[formData.faculty]?.map(deg => (
                  <option key={deg} value={deg}>{deg}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">▼</div>
            </div>
          </div>

          {/* BATCH YEAR */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
            </div>
            <input
              name="batch"
              type="number"
              min="2000"
              max={new Date().getFullYear()}
              required
              placeholder="Batch Year (e.g. 2024)"
              value={formData.batch}
              onChange={onChange}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium"
            />
          </div>

          {/* PASSWORD FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
              </div>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Password"
                value={formData.password}
                onChange={onChange}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
              </div>
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={onChange}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A237E] hover:bg-[#151b60] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 tracking-wide text-sm mt-4"
          >
            {isLoading ? 'CREATING ACCOUNT...' : 'REGISTER'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
          Already have an account? 
          <Link to="/login" className="font-bold text-[#1A237E] dark:text-blue-400 hover:underline ml-1 tracking-wide">
            LOGIN HERE
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;