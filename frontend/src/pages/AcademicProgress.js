import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Trophy, 
  TrendingUp, 
  BookOpen, 
  PlusCircle, 
  Calculator, 
  AlertCircle,
  Search,
  X,
  CheckCircle, 
  XCircle
} from 'lucide-react';

const AcademicProgress = () => {
  // --- STATE ---
  const [data, setData] = useState({
    gpa: '0.00',
    degreeClass: 'Pending',
    totalCreditsRequired: 130,
    completedCredits: 0,
    levelBreakdown: { 3: 0, 4: 0, 5: 0, 6: 0 },
    courses: []
  });

  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  // --- TOAST STATE (CENTERED) ---
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- AUTOCOMPLETE STATE ---
  const [courseCatalog, setCourseCatalog] = useState([]); 
  const [suggestions, setSuggestions] = useState([]);     
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null); 

  // Form State (Default to Semester 1)
  const [newResult, setNewResult] = useState({ courseCode: '', grade: 'A', semester: '1' });

  // --- HELPER: SHOW TOAST ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // --- FETCH DATA ---
  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      
      const res = await axios.get('http://localhost:5000/api/academic/progress', config);
      setData(res.data);
      
      const catalogRes = await axios.get('http://localhost:5000/api/academic/catalog', config);
      setCourseCatalog(catalogRes.data);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HANDLERS ---
  const handleCodeChange = (e) => {
    const input = e.target.value.toUpperCase();
    setNewResult({ ...newResult, courseCode: input });

    if (input.length > 0) {
      const matches = courseCatalog.filter(course => 
        course.code.includes(input) || 
        course.name.toUpperCase().includes(input)
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (course) => {
    setNewResult({ ...newResult, courseCode: course.code });
    setShowSuggestions(false);
  };

  const handleAddResult = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      
      await axios.post('http://localhost:5000/api/academic/add-result', newResult, config);
      
      await fetchProgress(); 
      setShowAddModal(false);
      setNewResult({ courseCode: '', grade: 'A', semester: '1' }); // Reset to Sem 1
      
      showToast("Result added successfully!", "success");

    } catch (err) {
      showToast(err.response?.data?.msg || "Failed to add result.", "error");
    }
  };

  // --- STYLES ---
  const getDegreeClassColor = (degreeClass) => {
    if (degreeClass.includes('First')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (degreeClass.includes('Upper')) return 'bg-green-100 text-green-700 border-green-200';
    if (degreeClass.includes('Lower')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (degreeClass.includes('Pass')) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-200 relative">
      
      {/* --- 🔥 CENTERED TOAST NOTIFICATION --- */}
      {toast.show && (
        <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] flex items-center gap-4 px-8 py-6 rounded-2xl shadow-2xl border animate-fade-in-up transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800 text-gray-800 dark:text-white ring-4 ring-green-50 dark:ring-green-900/20' 
            : 'bg-white dark:bg-gray-800 border-red-200 dark:border-red-800 text-gray-800 dark:text-white ring-4 ring-red-50 dark:ring-red-900/20'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="text-green-500" size={32} />
          ) : (
            <XCircle className="text-red-500" size={32} />
          )}
          <div>
            <h4 className={`text-xl font-bold ${toast.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {toast.type === 'success' ? 'Success!' : 'Error'}
            </h4>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-1">{toast.message}</p>
          </div>
          <button onClick={() => setToast({...toast, show: false})} className="ml-6 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Academic Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Bachelor of Software Engineering Honours
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowSimulator(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm font-medium"
            >
              <Calculator size={18} />
              Simulator
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
            >
              <PlusCircle size={18} />
              Add Result
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={64} className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current GPA</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                {data.gpa}
              </span>
              <span className="text-sm text-gray-400">/ 4.00</span>
            </div>
            <div className="mt-4">
               <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getDegreeClassColor(data.degreeClass)}`}>
                 {data.degreeClass}
               </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Degree Completion</p>
              <BookOpen size={20} className="text-gray-400" />
            </div>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {data.completedCredits}
              </span>
              <span className="text-lg text-gray-400 mb-1">
                / {data.totalCreditsRequired} Credits
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(data.completedCredits / data.totalCreditsRequired) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">
              {Math.round((data.completedCredits / data.totalCreditsRequired) * 100)}% Completed
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center gap-3">
             <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Credits by Level</p>
             {[3, 4, 5, 6].map(level => (
               <div key={level} className="flex items-center gap-3 text-sm">
                 <span className="w-12 font-medium text-gray-600 dark:text-gray-300">Lvl {level}</span>
                 <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${level >= 5 ? 'bg-purple-500' : 'bg-blue-500'}`} 
                      style={{ width: `${Math.min((data.levelBreakdown[level] / 30) * 100, 100)}%` }}
                    ></div>
                 </div>
                 <span className="w-8 text-right text-gray-500">{data.levelBreakdown[level]}</span>
               </div>
             ))}
          </div>
        </div>

        {/* COURSE HISTORY */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Course History</h3>
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded">
              {data.courses.length} Courses Found
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-5 font-semibold">Course</th>
                  <th className="p-5 font-semibold">Sem</th>
                  <th className="p-5 font-semibold">Credits</th>
                  <th className="p-5 font-semibold">Status</th>
                  <th className="p-5 font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {data.courses.length > 0 ? (
                  data.courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                      <td className="p-5">
                        <div className="font-bold text-gray-800 dark:text-white">{course.code}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{course.name}</div>
                      </td>
                      <td className="p-5 text-gray-600 dark:text-gray-300">
                        {/* If semester is saved, show it, otherwise show Level */}
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-800">
                          {course.semester || '?'}
                        </span>
                      </td>
                      <td className="p-5 text-gray-600 dark:text-gray-300">{course.credits}</td>
                      <td className="p-5">
                        {course.status === 'Completed' ? (
                          <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                             ✓ Completed
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-yellow-600 flex items-center gap-1">
                             ⏳ {course.status}
                          </span>
                        )}
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-md text-sm font-bold border ${getGradeColor(course.grade)}`}>
                          {course.grade}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle size={32} />
                        <p>No results found. Add your first result to see stats!</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL: ADD RESULT (FIXED: SEMESTER 1-8) --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Exam Result</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddResult} className="p-6 space-y-4">
              
              {/* AUTOCOMPLETE INPUT */}
              <div className="relative" ref={wrapperRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Code</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type code or name (e.g. EEX...)"
                    className="w-full p-3 pl-10 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                    value={newResult.courseCode}
                    onChange={handleCodeChange}
                    required
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>

                {/* SUGGESTION LIST */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {suggestions.map((course) => (
                      <li 
                        key={course._id}
                        onClick={() => selectSuggestion(course)}
                        className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-50 dark:border-gray-700 last:border-0"
                      >
                        <div className="font-bold text-gray-800 dark:text-white text-sm">{course.code}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{course.name}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade</label>
                   <select 
                     className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                     value={newResult.grade}
                     onChange={(e) => setNewResult({...newResult, grade: e.target.value})}
                   >
                     {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E'].map(g => (
                       <option key={g} value={g}>{g}</option>
                     ))}
                   </select>
                </div>
                <div>
                   {/* ✅ FIXED: DROPDOWN FOR SEMESTER 1-8 */}
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
                   <select 
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newResult.semester}
                    onChange={(e) => setNewResult({...newResult, semester: e.target.value})}
                   >
                     {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                       <option key={s} value={s}>Semester {s}</option>
                     ))}
                   </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition shadow-lg shadow-blue-500/30"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIMULATOR MODAL */}
      {showSimulator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
              <Trophy size={48} className="text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">GPA Simulator</h3>
              <p className="text-gray-500 mt-2 mb-6">
                Use this tool to predict how future grades will affect your GPA.
              </p>
              <button 
                onClick={() => setShowSimulator(false)}
                className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium"
              >
                Close
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AcademicProgress;