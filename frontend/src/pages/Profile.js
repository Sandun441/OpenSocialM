import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/authContext';
import axios from '../utils/api'; // Using your custom axios with interceptors
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
        socialLinks: links // Sending links object to backend
      };
      console.log("Data being sent to server:", dataToSend);

      // No need for manual headers; your interceptor handles the Token
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
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        
        {/* COVER PHOTO */}
        <div className="relative h-56 bg-gray-200">
          <img 
            src={coverPreview || 'https://images.unsplash.com/photo-1557683316-973673baf926'} 
            className="w-full h-full object-cover" alt="Cover"
          />
          {isEditing && (
            <button onClick={() => coverInputRef.current.click()} className="absolute top-4 right-4 p-3 bg-black/60 rounded-full text-white hover:bg-black/80 shadow-lg transition">
              <Camera className="w-5 h-5" />
            </button>
          )}
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} />
        </div>

        {/* PROFILE HEADER */}
        <div className="relative px-8 pb-8">
          <div className="flex flex-col md:flex-row items-end -mt-20 md:space-x-6">
            <div className="relative group">
              <img
                className="w-40 h-40 rounded-3xl border-8 border-white object-cover bg-white shadow-xl"
                src={avatarPreview || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=4f46e5&color=fff&size=200`}
                alt="Avatar"
              />
              {isEditing && (
                <button onClick={() => avatarInputRef.current.click()} className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300">
                  <Camera className="text-white w-10 h-10" />
                </button>
              )}
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'avatar')} />
            </div>
            
            <div className="mt-6 md:mt-0 flex-grow pb-2">
              <h1 className="text-4xl font-extrabold text-gray-900">{user?.firstName} {user?.lastName}</h1>
              <p className="flex items-center text-indigo-600 font-bold text-lg mt-1">
                <School className="w-5 h-5 mr-2" /> {user?.degreeProgram || 'OUSL Student'}
              </p>
            </div>

            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg active:scale-95">
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8 border-t border-gray-50">
          {message.text && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                <InputField label="Degree Program" name="degreeProgram" value={formData.degreeProgram} onChange={handleChange} />
                <InputField label="Faculty" name="faculty" value={formData.faculty} onChange={handleChange} />
                <InputField label="Batch Year" name="batch" value={formData.batch} onChange={handleChange} />
              </div>

              {/* SOCIAL LINKS INPUTS */}
              <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Connect Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SocialInput icon={<Facebook size={18}/>} label="Facebook URL" value={links.facebook} onChange={(val) => setLinks({...links, facebook: val})} />
                  <SocialInput icon={<Instagram size={18}/>} label="Insta Username" value={links.instagram} onChange={(val) => setLinks({...links, instagram: val})} />
                  <SocialInput icon={<MessageCircle size={18}/>} label="WhatsApp Number" value={links.whatsapp} onChange={(val) => setLinks({...links, whatsapp: val})} placeholder="e.g. 94771234567" />
                </div>
              </div>
              
              <textarea 
                name="bio" rows={4} value={formData.bio} onChange={handleChange} 
                className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                placeholder="Write your bio..."
              />

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 text-gray-400 font-bold">Cancel</button>
                <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2">
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />} Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="md:col-span-1 space-y-8">
                  <DetailItem icon={<Mail/>} label="Email" value={user?.email} />
                  <DetailItem icon={<BookOpen/>} label="Faculty" value={user?.faculty} />
                  <DetailItem icon={<Users/>} label="Batch" value={user?.batch} />
               </div>
               <div className="md:col-span-2">
                  <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 h-full">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Biography</h3>
                    <p className="text-gray-700 text-lg italic">{user?.bio || "No bio added yet."}</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// HELPER COMPONENTS
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} className="w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" />
  </div>
);

const SocialInput = ({ icon, label, value, onChange, placeholder }) => (
  <div className="relative">
    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
      <input 
        type="text" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} 
        className="w-full pl-11 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
      />
    </div>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-4">
    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">{icon}</div>
    <div>
      <p className="text-xs text-gray-400 font-black uppercase mb-1 tracking-widest">{label}</p>
      <p className="text-gray-900 font-bold text-lg">{value || '---'}</p>
    </div>
  </div>
);

export default Profile;