import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Step: 'email' | 'otp' | 'done'
  const [step, setStep] = useState('email');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ── Step 1: Send OTP ─────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/auth/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || 'Something went wrong. Please try again.');
      } else {
        setMessage(`A 6-digit OTP has been sent to ${email}`);
        setStep('otp');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP Input helpers ────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      document.getElementById('otp-5')?.focus();
    }
    e.preventDefault();
  };

  // ── Step 2: Verify OTP & Reset Password ─────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    if (otpString.length < 6) {
      return setError('Please enter the complete 6-digit OTP.');
    }
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/resetpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || 'Invalid or expired OTP. Please try again.');
      } else {
        setStep('done');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    setError('');
    setMessage('');
    setOtp(['', '', '', '', '', '']);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || 'Could not resend OTP.');
      } else {
        setMessage('A new OTP has been sent to your email.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#8CABFF] dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center p-4 font-['Lato'] py-12">
      <div className="bg-white dark:bg-slate-800 rounded-[30px] shadow-2xl w-full max-w-md p-8 md:p-12 transform transition-all hover:shadow-3xl relative">

        {/* BACK BUTTON */}
        {step !== 'done' && (
          <button
            onClick={() => step === 'otp' ? setStep('email') : navigate('/login')}
            className="absolute top-8 left-8 text-gray-400 hover:text-[#1A237E] dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-bold tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> BACK
          </button>
        )}

        {/* ── STEP INDICATOR ─────────────────────────────────────────────── */}
        {step !== 'done' && (
          <div className="flex items-center justify-center gap-2 mb-8 mt-6">
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 'email' ? 'w-8 bg-[#1A237E]' : 'w-4 bg-[#1A237E] opacity-60'}`} />
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 'otp' ? 'w-8 bg-[#1A237E]' : 'w-4 bg-gray-200 dark:bg-slate-600'}`} />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            STEP 1 — EMAIL INPUT
        ════════════════════════════════════════════════════════════════════ */}
        {step === 'email' && (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#f0f4ff] dark:bg-indigo-900/30 mb-5">
                <Mail className="w-8 h-8 text-[#1A237E] dark:text-indigo-300" />
              </div>
              <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white mb-2 tracking-tight">
                Reset Password
              </h2>
              <p className="text-gray-400 dark:text-gray-400 text-sm font-medium tracking-wide">
                Enter your email and we'll send you an OTP
              </p>
            </div>

            {error && <AlertBox type="error">{error}</AlertBox>}

            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium tracking-wide"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A237E] hover:bg-[#151b60] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 tracking-wider text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner /> SENDING OTP...
                  </span>
                ) : 'SEND OTP'}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-gray-500">
              Remember your password?{' '}
              <Link to="/login" className="font-bold text-[#1A237E] dark:text-blue-400 hover:underline tracking-wide">
                LOGIN
              </Link>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            STEP 2 — OTP + NEW PASSWORD
        ════════════════════════════════════════════════════════════════════ */}
        {step === 'otp' && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#f0f4ff] dark:bg-indigo-900/30 mb-5">
                <KeyRound className="w-8 h-8 text-[#1A237E] dark:text-indigo-300" />
              </div>
              <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white mb-2 tracking-tight">
                Verify OTP
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                Enter the 6-digit code sent to<br />
                <span className="text-[#1A237E] dark:text-indigo-300 font-semibold">{email}</span>
              </p>
            </div>

            {message && <AlertBox type="success">{message}</AlertBox>}
            {error && <AlertBox type="error">{error}</AlertBox>}

            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* OTP BOXES */}
              <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-14 text-center text-xl font-bold bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 text-[#1A237E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-[#1A237E] outline-none transition-all"
                  />
                ))}
              </div>

              {/* NEW PASSWORD */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#1A237E] transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#1A237E] transition-colors">
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A237E] hover:bg-[#151b60] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 tracking-wider text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner /> RESETTING...
                  </span>
                ) : 'RESET PASSWORD'}
              </button>
            </form>

            {/* RESEND */}
            <div className="mt-6 text-center text-xs text-gray-500">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="font-bold text-[#1A237E] dark:text-blue-400 hover:underline tracking-wide disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            STEP 3 — SUCCESS
        ════════════════════════════════════════════════════════════════════ */}
        {step === 'done' && (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/30 mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white mb-3 tracking-tight">
              Password Reset!
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Your password has been updated successfully.<br />
              You can now log in with your new password.
            </p>
            <Link
              to="/login"
              className="inline-block w-full bg-[#1A237E] hover:bg-[#151b60] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 tracking-wider text-sm text-center"
            >
              GO TO LOGIN
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function AlertBox({ type, children }) {
  const styles = type === 'error'
    ? 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 border border-red-100 dark:border-red-800'
    : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 border border-green-100 dark:border-green-800';
  return (
    <div className={`mb-5 p-4 rounded-xl text-sm text-center font-medium leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
