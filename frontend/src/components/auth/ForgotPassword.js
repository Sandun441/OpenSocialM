import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowLeft, Moon, Sun, Eye, EyeOff } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- THEME STATE ---
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const navigate = useNavigate();

  // --- EFFECT: HANDLE DARK MODE ---
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('OTP sent to your email! Please check your inbox.');
        setStep(2);
      } else {
        setError(data.msg || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Password reset successfully!');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } else {
        setError(data.msg || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#8CABFF] dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center p-4 relative font-['Lato']">
      
      {/* THEME TOGGLE BUTTON */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg text-slate-600 dark:text-yellow-400 transition-all transform hover:scale-110 z-50"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* MAIN CARD */}
      <div className="bg-white dark:bg-slate-800 rounded-[30px] shadow-2xl overflow-hidden flex w-full max-w-[500px] min-h-[500px] transition-colors duration-300">
        
        <div className="w-full bg-white dark:bg-slate-800 p-8 md:p-12 flex flex-col justify-center transition-colors duration-300 relative">
          
          <Link to="/login" className="absolute top-8 left-8 text-gray-400 hover:text-[#1A237E] dark:hover:text-blue-400 transition-colors flex items-center text-sm font-bold uppercase tracking-wider">
            <ArrowLeft size={16} className="mr-1" /> Back
          </Link>

          <div className="text-center mb-8 mt-6">
            <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white mb-2 tracking-tight">
              {step === 1 ? 'Forgot Password' : 'Reset Password'}
            </h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              {step === 1 ? "We'll send you an OTP" : "Enter OTP and new password"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 text-sm text-center border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          {success && (
             <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-sm text-center border border-green-100 dark:border-green-800">
              {success}
             </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              {/* EMAIL */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium tracking-wide"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A237E] hover:bg-[#151b60] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 tracking-wider text-sm"
              >
                {isLoading ? 'SENDING OTP...' : 'REQUEST OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* OTP */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
                </div>
                <input
                  id="otp"
                  type="text"
                  required
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium tracking-wide text-center uppercase tracking-widest"
                />
              </div>

              {/* NEW PASSWORD */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"} 
                  required
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#1A237E] dark:hover:text-blue-400 transition-colors focus:outline-none"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"} 
                  required
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#1A237E] dark:hover:text-blue-400 transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A237E] hover:bg-[#151b60] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 tracking-wider text-sm"
              >
                {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
