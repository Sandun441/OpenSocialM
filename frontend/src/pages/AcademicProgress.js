// src/pages/AcademicProgress.js
import React, { useState } from 'react';

const AcademicProgress = () => {
  // --- 1. Main Page Data (Mock) ---
  const [academicData] = useState({
    gpa: 3.65,
    totalCredits: 120,
    completedCredits: 45,
    courses: [
      {
        id: 1,
        code: 'CS101',
        name: 'Intro to Computer Science',
        credits: 3,
        grade: 'A',
        status: 'Completed',
        progress: 100,
      },
      {
        id: 2,
        code: 'MATH202',
        name: 'Discrete Mathematics',
        credits: 3,
        grade: 'B+',
        status: 'Completed',
        progress: 100,
      },
      {
        id: 3,
        code: 'WEB300',
        name: 'Full Stack Development',
        credits: 4,
        grade: '-',
        status: 'In Progress',
        progress: 65,
      },
      {
        id: 4,
        code: 'DB400',
        name: 'Database Systems',
        credits: 3,
        grade: '-',
        status: 'In Progress',
        progress: 40,
      },
      {
        id: 5,
        code: 'ENG101',
        name: 'Professional Communication',
        credits: 2,
        grade: 'A-',
        status: 'Completed',
        progress: 100,
      },
    ],
  });

  // --- 2. Calculator State ---
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcCourses, setCalcCourses] = useState([]);
  const [entry, setEntry] = useState({ credits: '', grade: 'A' });

  // --- 3. Helper Functions ---
  const getGradeColor = (grade) => {
    if (grade.startsWith('A'))
      return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
    if (grade.startsWith('B'))
      return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
    if (grade.startsWith('C'))
      return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
    return 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600';
  };

  const overallProgress =
    (academicData.completedCredits / academicData.totalCredits) * 100;

  // --- 4. Calculator Logic ---
  const gradePoints = {
    'A+': 4.0,
    A: 4.0,
    'A-': 3.7,
    'B+': 3.3,
    B: 3.0,
    'B-': 2.7,
    'C+': 2.3,
    C: 2.0,
    'C-': 1.7,
    'D+': 1.3,
    D: 1.0,
    E: 0.0,
    F: 0.0,
  };

  const addCourseToCalc = (e) => {
    e.preventDefault();
    if (!entry.credits) return;
    setCalcCourses([
      ...calcCourses,
      {
        id: Date.now(),
        credits: parseFloat(entry.credits),
        grade: entry.grade,
      },
    ]);
    setEntry({ ...entry, credits: '' }); // Reset input
  };

  const removeCalcCourse = (id) => {
    setCalcCourses(calcCourses.filter((c) => c.id !== id));
  };

  const calculateTotalGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    calcCourses.forEach((course) => {
      const points = gradePoints[course.grade] || 0;
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    });

    return totalCredits === 0
      ? '0.00'
      : (totalPoints / totalCredits).toFixed(2);
  };

  return (
    // FULL PAGE WRAPPER
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Academic Progress
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Track your grades, GPA, and course completion.
            </p>
          </div>
          {/* CALCULATE GPA BUTTON */}
          <button
            onClick={() => setShowCalculator(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg transition flex items-center gap-2 font-medium"
          >
            <span>🧮</span> Calculate GPA
          </button>
        </div>

        {/* --- STATS SUMMARY --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between transition-colors">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Current GPA</p>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mt-1">
                {academicData.gpa}
              </h2>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-2xl text-blue-600 dark:text-blue-300">
              🎓
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between transition-colors">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Credits Earned</p>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mt-1">
                {academicData.completedCredits}{' '}
                <span className="text-lg text-gray-400 dark:text-gray-500 font-normal">
                  / {academicData.totalCredits}
                </span>
              </h2>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center text-2xl text-green-600 dark:text-green-300">
              📜
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
              Degree Completion
            </p>
            <div className="flex items-end gap-2 mb-2">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
                {Math.round(overallProgress)}%
              </h2>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* --- COURSE LIST --- */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Course History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Course Code</th>
                  <th className="p-4 font-semibold">Subject Name</th>
                  <th className="p-4 font-semibold">Credits</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {academicData.courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-200">
                      {course.code}
                    </td>
                    <td className="p-4 text-gray-800 dark:text-white font-medium">
                      {course.name}
                      {course.status === 'In Progress' && (
                        <div className="mt-2 w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{course.credits}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.status === 'Completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block w-10 text-center py-1 rounded border text-sm font-bold ${getGradeColor(
                          course.grade
                        )}`}
                      >
                        {course.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- GPA CALCULATOR MODAL --- */}
        {showCalculator && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in-up">
              <div className="bg-blue-600 dark:bg-blue-700 p-4 flex justify-between items-center text-white">
                <h3 className="text-lg font-bold">GPA Calculator</h3>
                <button
                  onClick={() => setShowCalculator(false)}
                  className="text-white hover:text-gray-200 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                {/* Input Form */}
                <form onSubmit={addCourseToCalc} className="flex gap-2 mb-6">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                      Credits
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 3"
                      className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={entry.credits}
                      onChange={(e) =>
                        setEntry({ ...entry, credits: e.target.value })
                      }
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                      Grade
                    </label>
                    <select
                      className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={entry.grade}
                      onChange={(e) =>
                        setEntry({ ...entry, grade: e.target.value })
                      }
                    >
                      {Object.keys(gradePoints).map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white p-2 rounded w-full transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </form>

                {/* Added List */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto border border-gray-100 dark:border-gray-700">
                  {calcCourses.length > 0 ? (
                    calcCourses.map((c) => (
                      <div
                        key={c.id}
                        className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 last:border-0 py-2"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {c.credits} Credits • Grade {c.grade}
                        </span>
                        <button
                          onClick={() => removeCalcCourse(c.id)}
                          className="text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 dark:text-gray-500 text-sm">
                      Add courses to calculate GPA
                    </p>
                  )}
                </div>

                {/* Result */}
                <div className="text-center pt-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">
                    Calculated GPA
                  </p>
                  <h2 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                    {calculateTotalGPA()}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicProgress;