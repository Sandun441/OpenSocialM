import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { User, Lock, Moon, Sun, Eye, EyeOff } from 'lucide-react'; 
 
export default function Login() {
  const [formData, setFormData] = useState({
    email: localStorage.getItem('rememberedEmail') || '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  
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
                // CHANGE 1: Make type dynamic
                type={showPassword ? "text" : "password"} 
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                // CHANGE 2: Updated pr-4 to pr-12 to make room for the eye icon
                className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium tracking-wide"
              />
              
              {/* CHANGE 3: Add the toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#1A237E] dark:hover:text-blue-400 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="text-left">
              <Link to="/forgot-password" className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#1A237E] dark:hover:text-blue-400 transition-colors uppercase tracking-wider">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1A237E] hover:bg-[#151b60] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 tracking-wider text-sm"
            >
              {isLoading ? 'SIGNING IN...' : 'LOGIN'}
            </button>
          </form>
          <div className="mt-8 text-center text-xs text-gray-500">
            Don't have an account? <Link to="/register" className="font-bold text-[#1A237E] dark:text-blue-400 hover:underline tracking-wide">CREATE ACCOUNT</Link>
          </div>

        </div>
      </div>
    </div>
  );
}