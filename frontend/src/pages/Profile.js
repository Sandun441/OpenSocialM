import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/authContext';
import axios from '../utils/api'; 
import { 
  Loader2, CheckCircle, XCircle, Camera, Mail, 
  GraduationCap, Users, BookOpen, School, 
  Facebook, Instagram, MessageCircle
} from 'lucide-react';

const Profile = () => {
  const { user, loadUser } = useContext(AuthContext);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // 1. Integrated Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    degreeProgram: '',
    faculty: '',
    batch: ''
  });

  const [links, setLinks] = useState({
    facebook: '',
    instagram: '',
    whatsapp: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  // 2. Sync Data from Context
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        degreeProgram: user.degreeProgram || '',
        faculty: user.faculty || '',
        batch: user.batch || ''
      });
      setLinks({
        facebook: user.socialLinks?.facebook || '',
        instagram: user.socialLinks?.instagram || '',
        whatsapp: user.socialLinks?.whatsapp || ''
      });
      setAvatarPreview(user.avatar || '');
      setCoverPreview(user.coverImage || '');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    const MAX_SIZE = 1 * 1024 * 1024; // 1MB

    if (file) {
      if (file.size > MAX_SIZE) {
        setMessage({ type: 'error', text: 'Image too large (Max 1MB)' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') setAvatarPreview(reader.result);
        if (type === 'cover') setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Single Save Function for Everything
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToSend = {
        ...formData,
        avatar: avatarPreview,
        coverImage: coverPreview,
        socialLinks: links 
      };

      await axios.put('/api/users/profile', dataToSend);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      if (loadUser) await loadUser(); 
    } catch (err) {
      const errorMsg = err.response?.status === 413 
        ? 'Images are too large for the server.' 
        : (err.response?.data?.msg || 'Update failed');
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 1. FULL PAGE WRAPPER & FONT: Lato font and global background
    <div className="min-h-screen w-full bg-[#F5F7FA] dark:bg-slate-900 transition-colors duration-300 py-12 font-['Lato']">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 animate-fade-in-up">
        
        {/* CARD CONTAINER */}
        <div className="bg-white dark:bg-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-[24px] overflow-hidden border border-slate-100 dark:border-slate-700">
          
          {/* COVER PHOTO */}
          <div className="relative h-64 bg-slate-200 dark:bg-slate-700">
            <img 
              src={coverPreview || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80'} 
              className="w-full h-full object-cover" alt="Cover"
            />
            {isEditing && (
              <button onClick={() => coverInputRef.current.click()} className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 shadow-lg transition-all hover:scale-105">
                <Camera className="w-5 h-5" />
              </button>
            )}
            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} />
          </div>

          {/* PROFILE HEADER (Adjusted Layout) */}
          <div className="px-8 pb-10">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
              {/* AVATAR (Pulled up using negative margin) */}
              <div className="relative group -mt-20 z-10">
                <img
                  className="w-40 h-40 rounded-[24px] border-[6px] border-white dark:border-slate-800 object-cover bg-white dark:bg-slate-800 shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1A237E&color=fff&size=200`}
                  alt="Avatar"
                />
                {isEditing && (
                  <button onClick={() => avatarInputRef.current.click()} className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-[24px] opacity-0 group-hover:opacity-100 transition-all duration-300 border-[6px] border-transparent">
                    <Camera className="text-white w-10 h-10" />
                  </button>
                )}
                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'avatar')} />
              </div>

              {/* EDIT BUTTON (Positioned to the right on desktop) */}
              {!isEditing && (
                <div className="mt-6 md:mt-0 w-full md:w-auto flex justify-center md:justify-end">
                  <button onClick={() => setIsEditing(true)} className="w-full md:w-auto bg-[#1A237E] hover:bg-[#151b60] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 tracking-wide text-sm">
                    EDIT PROFILE
                  </button>
                </div>
              )}
            </div>
            
            {/* NAME & DEGREE (Pushed down below the avatar) */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white tracking-tight mb-2">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="flex items-center justify-center md:justify-start text-slate-500 dark:text-slate-400 font-medium text-lg tracking-wide">
                <School className="w-5 h-5 mr-2 text-[#1A237E] dark:text-indigo-400" /> 
                {user?.degreeProgram || 'University Student'}
              </p>
            </div>
            
          </div>

          {/* CONTENT AREA */}
          <div className="p-8 md:p-10 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            
            {/* ALERT MESSAGE */}
            {message.text && (
              <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 font-medium ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800/50'}`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span>{message.text}</span>
              </div>
            )}

            {isEditing ? (
              // --- EDIT MODE FORM ---
              <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                  <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                  <InputField label="Degree Program" name="degreeProgram" value={formData.degreeProgram} onChange={handleChange} />
                  <InputField label="Faculty" name="faculty" value={formData.faculty} onChange={handleChange} />
                  <InputField label="Batch Year" name="batch" value={formData.batch} onChange={handleChange} />
                </div>

                {/* SOCIAL LINKS INPUTS */}
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 md:p-8 rounded-[24px] space-y-5 border border-slate-100 dark:border-slate-600">
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest">Connect Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SocialInput icon={<Facebook size={18}/>} label="Facebook URL" value={links.facebook} onChange={(val) => setLinks({...links, facebook: val})} />
                    <SocialInput icon={<Instagram size={18}/>} label="Insta Username" value={links.instagram} onChange={(val) => setLinks({...links, instagram: val})} />
                    <SocialInput icon={<MessageCircle size={18}/>} label="WhatsApp Number" value={links.whatsapp} onChange={(val) => setLinks({...links, whatsapp: val})} placeholder="e.g. 94771234567" />
                  </div>
                </div>
                
                {/* BIO INPUT */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Biography</label>
                  <textarea 
                    name="bio" rows={4} value={formData.bio} onChange={handleChange} 
                    className="w-full p-5 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 font-medium leading-relaxed resize-none" 
                    placeholder="Tell the community a little bit about yourself..."
                  />
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3.5 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-white transition-colors text-sm tracking-wide">
                    CANCEL
                  </button>
                  <button type="submit" disabled={isLoading} className="bg-[#1A237E] hover:bg-[#151b60] text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95 text-sm tracking-wide disabled:opacity-70">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null} 
                    {isLoading ? 'SAVING...' : 'SAVE PROFILE'}
                  </button>
                </div>
              </form>
            ) : (
              // --- VIEW MODE ---
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in-up">
                 {/* Details Column */}
                 <div className="lg:col-span-1 space-y-8 bg-slate-50 dark:bg-slate-700/30 p-8 rounded-[24px] border border-slate-100 dark:border-slate-700/50">
                    <DetailItem icon={<Mail/>} label="Email Address" value={user?.email} />
                    <DetailItem icon={<BookOpen/>} label="Faculty" value={user?.faculty} />
                    <DetailItem icon={<Users/>} label="Batch Year" value={user?.batch} />
                 </div>
                 
                 {/* Bio Column */}
                 <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 h-full">
                      <h3 className="text-2xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white mb-4 tracking-tight">Biography</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-base leading-loose font-medium whitespace-pre-wrap">
                        {user?.bio || <span className="text-slate-400 italic font-light">This user hasn't added a biography yet.</span>}
                      </p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
    <input 
      type="text" 
      name={name} 
      value={value} 
      onChange={onChange} 
      className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all font-medium" 
    />
  </div>
);

const SocialInput = ({ icon, label, value, onChange, placeholder }) => (
  <div className="relative">
    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 group-focus-within:text-[#1A237E] dark:group-focus-within:text-indigo-400 transition-colors">
        {icon}
      </div>
      <input 
        type="text" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} 
        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-600 rounded-xl border border-slate-200 dark:border-slate-500 focus:border-transparent focus:ring-2 focus:ring-[#1A237E] outline-none text-slate-900 dark:text-white transition-all font-medium placeholder-slate-400" 
      />
    </div>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-4">
    <div className="p-3.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-[#1A237E] dark:text-indigo-400 shadow-inner">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase mb-1 tracking-widest">{label}</p>
      <p className="text-slate-900 dark:text-white font-bold text-lg">{value || '---'}</p>
    </div>
  </div>
);

export default Profile;