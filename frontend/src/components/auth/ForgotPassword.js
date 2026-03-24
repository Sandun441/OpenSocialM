import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react'; 

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Simulate an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setMessage('If an account exists with this email, a password reset link has been sent.');
      setEmail(''); // Clear the input
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 1. BACKGROUND
    <div className="min-h-screen bg-[#8CABFF] dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center p-4 font-['Lato'] py-12">
      
      {/* 2. MAIN CARD (Single Centered Card) */}
      <div className="bg-white dark:bg-slate-800 rounded-[30px] shadow-2xl w-full max-w-md p-8 md:p-12 transform transition-all hover:shadow-3xl relative">
        
        {/* BACK BUTTON */}
        <Link 
          to="/login" 
          className="absolute top-8 left-8 text-gray-400 hover:text-[#1A237E] dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-bold tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> BACK
        </Link>

        {/* HEADER */}
        <div className="text-center mb-10 mt-8">
          <h2 className="text-4xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white mb-3 tracking-tight">
            Reset Password
          </h2>
          <p className="text-gray-400 dark:text-gray-400 text-sm font-medium tracking-wide">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-sm text-center border border-green-100 dark:border-green-800 font-medium leading-relaxed">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 text-sm text-center border border-red-100 dark:border-red-800 font-medium">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
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
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium tracking-wide"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || message}
            className={`w-full bg-[#1A237E] hover:bg-[#151b60] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 tracking-wider text-sm ${
              (isLoading || message) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
          </button>
        </form>

      </div>
    </div>
  );
}