import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

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
    registrationNumber: '',
    faculty: '',
    degreeProgram: '',
    batch: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearErrors();
  };

  const onSubmit = async e => {
    e.preventDefault();
    clearErrors();
    setIsLoading(true);
    try {
      const success = await register(formData);
      if (success) navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your OUSL Social account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Please verify your university details
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-700 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={onChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={onChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={onChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={onChange}
                  required
                  minLength={6}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                OUSL Registration Number
              </label>
              <div className="mt-1">
                <input
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  value={formData.registrationNumber}
                  onChange={onChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Faculty</label>
              <select
                id="faculty"
                name="faculty"
                value={formData.faculty}
                onChange={onChange}
                required
                className=" mt-1 block w-full px-3 py-2 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              >
                <option value="">Select your faculty</option>
                {faculties.map(fac => (
                  <option key={fac} value={fac}>{fac}</option>
                ))}
              </select>
            </div>

            {formData.faculty && (
              <div>
                <label htmlFor="degreeProgram" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Degree Program</label>
                <select
                  id="degreeProgram"
                  name="degreeProgram"
                  value={formData.degreeProgram}
                  onChange={onChange}
                  required
                  className=" mt-1 block w-full px-3 py-2 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                >
                  <option value="">Select your degree program</option>
                  {degreeProgramMap[formData.faculty]?.map(deg => (
                    <option key={deg} value={deg}>{deg}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="batch" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Batch Year (e.g., 2022)
              </label>
              <div className="mt-1">
                <input
                  id="batch"
                  name="batch"
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  value={formData.batch}
                  onChange={onChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
//confirm pasword field
export default Register;