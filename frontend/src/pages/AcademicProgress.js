import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  BookOpen, 
  PlusCircle, 
  AlertCircle,
  Search,
  X,
  CheckCircle, 
  XCircle,
  Trash2,
  AlertTriangle 
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
  
  // --- DELETE CONFIRMATION STATE ---
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, code: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- AUTOCOMPLETE STATE ---
  const [courseCatalog, setCourseCatalog] = useState([]); 
  const [suggestions, setSuggestions] = useState([]);     
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null); 

  // Form State
  const [searchInput, setSearchInput] = useState('');
  const [pendingResults, setPendingResults] = useState([]);
  const [batchSemester, setBatchSemester] = useState('1');

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
  const handleSearchChange = (e) => {
    const input = e.target.value.toUpperCase();
    setSearchInput(input);
    if (input.length > 0) {
      const matches = courseCatalog.filter(course => 
        (course.code.includes(input) || course.name.toUpperCase().includes(input)) &&
        !pendingResults.some(r => r.courseCode === course.code)
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const addCourseToBatch = (course) => {
    const newEntry = {
      id: Date.now(),
      courseCode: course.code,
      courseName: course.name,
      grade: 'A',
      semester: batchSemester
    };
    setPendingResults([...pendingResults, newEntry]);
    setSearchInput('');
    setShowSuggestions(false);
  };

  const updateEntry = (id, field, value) => {
    setPendingResults(pendingResults.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeEntry = (id) => {
    setPendingResults(pendingResults.filter(item => item.id !== id));
  };

  const handleBatchSave = async (e) => {
    e.preventDefault();
    if (pendingResults.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      
      const payload = {
        results: pendingResults.map(r => ({
          courseCode: r.courseCode,
          grade: r.grade,
          semester: r.semester
        }))
      };
      
      await axios.post('http://localhost:5000/api/academic/add-results-batch', payload, config);
      await fetchProgress(); 
      setShowAddModal(false);
      setPendingResults([]);
      showToast(`Successfully saved ${pendingResults.length} results!`, "success");
    } catch (err) {
      showToast("Failed to save results.", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      
      await axios.delete(`http://localhost:5000/api/academic/result/${deleteModal.id}`, config);
      
      await fetchProgress(); 
      setDeleteModal({ show: false, id: null, code: '' }); 
      showToast("Course result deleted.", "success");
      
    } catch (err) {
      showToast("Failed to delete result.", "error");
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
      
      {/* TOAST NOTIFICATION */}
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
          <div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 font-bold"
            >
              <PlusCircle size={20} />
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
              <span className="text-5xl font-extrabold text-gray-900 dark:text-white">{data.gpa}</span>
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
              <span className="text-4xl font-bold text-gray-900 dark:text-white">{data.completedCredits}</span>
              <span className="text-lg text-gray-400 mb-1">/ {data.totalCreditsRequired} Credits</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(data.completedCredits / data.totalCreditsRequired) * 100}%` }}
              ></div>
            </div>
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
                  <th className="p-5 font-semibold text-right">Action</th>
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
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-800">
                          {course.semester || '?'}
                        </span>
                      </td>
                      <td className="p-5 text-gray-600 dark:text-gray-300">{course.credits}</td>
                      <td className="p-5">
                        {course.status === 'Completed' ? (
                          <span className="text-xs font-medium text-green-600 flex items-center gap-1">✓ Completed</span>
                        ) : (
                          <span className="text-xs font-medium text-yellow-600 flex items-center gap-1">⏳ {course.status}</span>
                        )}
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-md text-sm font-bold border ${getGradeColor(course.grade)}`}>
                          {course.grade}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button 
                          onClick={() => setDeleteModal({ show: true, id: course.id, code: course.code })}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Delete Result"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-400">
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

      {/* --- BATCH RESULT MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Batch Result Entry</h3>
                <p className="text-sm text-gray-500 mt-1">Add one or multiple subjects at once.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="flex gap-4 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                 <div className="flex-1">
                   <label className="block text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1">
                     Default Semester
                   </label>
                   <select 
                     className="w-full p-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                     value={batchSemester}
                     onChange={(e) => setBatchSemester(e.target.value)}
                   >
                     {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                   </select>
                 </div>
                 <div className="flex-[3]">
                    <label className="block text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1">
                      Search & Add Course
                    </label>
                    <div className="relative" ref={wrapperRef}>
                      <input 
                        type="text" 
                        placeholder="Type Code (e.g. EEX3467) or Name..."
                        className="w-full p-2 pl-9 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                        value={searchInput}
                        onChange={handleSearchChange}
                      />
                      <Search className="absolute left-2.5 top-2.5 text-blue-400" size={16} />
                      
                      {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                          {suggestions.map((course) => (
                            <li 
                              key={course._id}
                              onClick={() => addCourseToBatch(course)}
                              className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-50 dark:border-gray-700 last:border-0 flex justify-between items-center"
                            >
                              <div>
                                <span className="font-bold text-gray-800 dark:text-white text-sm">{course.code}</span>
                                <span className="mx-2 text-gray-300">|</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{course.name}</span>
                              </div>
                              <PlusCircle size={16} className="text-blue-500" />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                {pendingResults.length > 0 ? (
                  pendingResults.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in-up">
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 dark:text-white">{item.courseCode}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{item.courseName}</div>
                      </div>
                      <select 
                        className="w-24 p-2 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none"
                        value={item.semester}
                        onChange={(e) => updateEntry(item.id, 'semester', e.target.value)}
                      >
                         {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                      </select>
                      <select 
                        className={`w-20 p-2 text-sm font-bold border rounded-lg outline-none ${
                           item.grade.startsWith('A') ? 'text-green-600 border-green-200 bg-green-50' : 
                           item.grade.startsWith('B') ? 'text-blue-600 border-blue-200 bg-blue-50' :
                           item.grade.startsWith('C') ? 'text-yellow-600 border-yellow-200 bg-yellow-50' :
                           'text-red-600 border-red-200 bg-red-50'
                        }`}
                        value={item.grade}
                        onChange={(e) => updateEntry(item.id, 'grade', e.target.value)}
                      >
                        {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => removeEntry(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                    <BookOpen className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-gray-400 text-sm">No subjects added yet.<br/>Search above to build your list.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">
                {pendingResults.length} Result{pendingResults.length !== 1 && 's'} ready to save
              </span>
              <div className="flex gap-3">
                <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl font-medium transition shadow-sm">Cancel</button>
                <button 
                  onClick={handleBatchSave}
                  disabled={pendingResults.length === 0}
                  className={`px-6 py-2.5 text-white rounded-xl font-medium transition shadow-lg shadow-blue-500/30 flex items-center gap-2 ${
                    pendingResults.length === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <CheckCircle size={18} />
                  Save All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[70] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center animate-fade-in-up border border-gray-100 dark:border-gray-700">
             <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-500" size={32} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Result?</h3>
             <p className="text-gray-500 mt-2 mb-6">
               Are you sure you want to remove <strong className="text-gray-800 dark:text-white">{deleteModal.code}</strong> from your history? 
               <br/><span className="text-xs text-red-400">This action cannot be undone.</span>
             </p>
             <div className="flex gap-3">
               <button 
                 onClick={() => setDeleteModal({ show: false, id: null, code: '' })}
                 className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmDelete}
                 className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition shadow-lg shadow-red-500/30"
               >
                 Yes, Delete
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicProgress;