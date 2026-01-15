import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { User, Lock, Facebook, Moon, Sun } from 'lucide-react'; 

export default function Login() {
  const [formData, setFormData] = useState({
    email: localStorage.getItem('rememberedEmail') || '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // --- CAROUSEL STATE ---
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // --- THEME STATE ---
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- CAROUSEL CONTENT ---
  const slides = [
    {
      title: "Welcome \nBack!",
      text: "Connect with your university community, track your academics, and stay updated with OpenSocialM."
    },
    {
      title: "Join the \nConversation",
      text: "Participate in faculty discussions, share ideas, and collaborate with peers in real-time."
    },
    {
      title: "Never Miss \nan Update",
      text: "Get instant notifications about exams, events, and important announcements directly on your dashboard."
    }
  ];

  // --- EFFECT: AUTO-SCROLL SLIDES ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [slides.length]);

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

  // --- EFFECT: SAFE LOGIN REDIRECT ---
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    localStorage.setItem('rememberedEmail', formData.email);

    try {
      const success = await login(formData);
      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 1. BACKGROUND (Added Global Font Family 'Lato')
    <div className="min-h-screen bg-[#8CABFF] dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center p-4 relative font-['Lato']">
      
      {/* THEME TOGGLE BUTTON */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg text-slate-600 dark:text-yellow-400 transition-all transform hover:scale-110 z-50"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* 2. MAIN CARD */}
      <div className="bg-white dark:bg-slate-800 rounded-[30px] shadow-2xl overflow-hidden flex w-full max-w-[1000px] min-h-[600px] transition-colors duration-300">
        
        {/* --- LEFT SIDE: DYNAMIC CAROUSEL --- */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#1A237E] to-[#3949AB] dark:from-indigo-900 dark:to-slate-900 items-center justify-center relative p-12 text-white overflow-hidden transition-all duration-500">
          
          {/* Animated Content */}
          <div className="relative z-10 w-full animate-fade-in-up">
            {/* Elegant Font Applied Here */}
            <h1 className="text-5xl font-bold font-['Playfair_Display'] mb-6 leading-tight whitespace-pre-line transition-all duration-500 tracking-wide">
              {slides[currentSlide].title}
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed opacity-90 min-h-[80px] transition-all duration-500 font-light">
              {slides[currentSlide].text}
            </p>
            
            {/* Carousel Dots */}
            <div className="mt-12 flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'w-8 bg-white opacity-100' 
                      : 'w-2 bg-white opacity-40 hover:opacity-70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Abstract circles decoration */}
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 rounded-full bg-white opacity-5 animate-pulse"></div>
          <div className="absolute bottom-[-20px] right-[-20px] w-60 h-60 rounded-full bg-white opacity-5"></div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="w-full md:w-1/2 bg-white dark:bg-slate-800 p-8 md:p-12 flex flex-col justify-center transition-colors duration-300">
          
          <div className="text-center mb-10">
            {/* Elegant Font Applied Here */}
            <h2 className="text-4xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white mb-2 tracking-tight">
              OpenSocialM
            </h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Welcome back
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 text-sm text-center border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* EMAIL */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Username or Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium tracking-wide"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#1A237E] transition-colors" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium tracking-wide"
              />
            </div>

            <div className="text-left">
              <a href="#" className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#1A237E] dark:hover:text-blue-400 transition-colors uppercase tracking-wider">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1A237E] hover:bg-[#151b60] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 tracking-wider text-sm"
            >
              {isLoading ? 'SIGNING IN...' : 'LOGIN'}
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <div className="mt-10">
            <div className="relative flex justify-center text-sm">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-700"></div>
              </div>
              <span className="relative px-2 bg-white dark:bg-slate-800 text-gray-400 text-xs font-bold uppercase tracking-wider">Or continue with</span>
            </div>
            
            <div className="mt-6 flex gap-4 justify-center">
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group bg-white dark:bg-slate-700 shadow-sm">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Google</span>
              </button>
              
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group bg-white dark:bg-slate-700 shadow-sm">
                <Facebook className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" fill="#1877F2" />
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Facebook</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            Don't have an account? <Link to="/register" className="font-bold text-[#1A237E] dark:text-blue-400 hover:underline tracking-wide">CREATE ACCOUNT</Link>
          </div>

        </div>
      </div>
    </div>
  );
}