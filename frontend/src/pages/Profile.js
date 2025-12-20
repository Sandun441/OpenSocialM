import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/authContext';
import axios from '../utils/api';
import { 
  Loader2, CheckCircle, XCircle, Camera, Mail, 
  GraduationCap, Users, BookOpen, School, MapPin 
} from 'lucide-react';

const Profile = () => {
  const { user, loadUser } = useContext(AuthContext);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // 1. Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    degreeProgram: '',
    faculty: '',
    batch: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // 2. Image Preview States
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  // Sync data from Context when it loads
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
      setAvatarPreview(user.avatar || '');
      setCoverPreview(user.coverImage || '');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Image Selection & Base64 Conversion
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') setAvatarPreview(reader.result);
        if (type === 'cover') setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 4. Save to Backend
 const handleSubmit = async (e) => {
  e.preventDefault();
  
  const token = sessionStorage.getItem('token'); 
  
  // --- DEBUG LOGS ---
  console.log("1. Raw Token from SessionStorage:", token);
  console.log("2. Type of token:", typeof token);
  console.log("3. Token Length:", token ? token.length : 0);
  // ------------------

  if (!token || token === "undefined" || token === "null") {
     alert("Token is missing or invalid in Session Storage");
     return;
  }

  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token.trim()}` // .trim() removes accidental spaces
      }
    };

    const res = await axios.put('/api/users/profile', formData, config);
    
    setMessage({ type: 'success', text: 'Profile updated!' });
    setIsEditing(false);
    await loadUser(); 
  } catch (err) {
    console.error(err);
    setMessage({ type: 'error', text: err.response?.data?.msg || 'Update failed' });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        
        {/* COVER PHOTO SECTION */}
        <div className="relative h-56 bg-gray-200 group">
          <img 
            src={coverPreview || 'https://images.unsplash.com/photo-1557683316-973673baf926'} 
            className="w-full h-full object-cover" 
            alt="Cover"
          />
          {isEditing && (
            <button 
              onClick={() => coverInputRef.current.click()}
              className="absolute top-4 right-4 p-3 bg-black/60 rounded-full text-white hover:bg-black/80 transition shadow-lg"
            >
              <Camera className="w-5 h-5" />
            </button>
          )}
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} />
        </div>

        {/* PROFILE HEADER SECTION */}
        <div className="relative px-8 pb-8">
          <div className="flex flex-col md:flex-row items-end -mt-20 md:space-x-6">
            <div className="relative group">
              <img
                className="w-40 h-40 rounded-3xl border-8 border-white object-cover bg-white shadow-xl"
                src={avatarPreview || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=4f46e5&color=fff&size=200`}
                alt="Avatar"
              />
              {isEditing && (
                <button 
                  onClick={() => avatarInputRef.current.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
                >
                  <Camera className="text-white w-10 h-10" />
                </button>
              )}
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'avatar')} />
            </div>
            
            <div className="mt-6 md:mt-0 flex-grow pb-2">
              <h1 className="text-4xl font-extrabold text-gray-900">{user?.firstName} {user?.lastName}</h1>
              <p className="flex items-center text-indigo-600 font-bold text-lg mt-1">
                <School className="w-5 h-5 mr-2" />
                {user?.degreeProgram || 'Degree Program'}
              </p>
            </div>

            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="mt-4 md:mt-0 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200 active:scale-95"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* MAIN CONTENT SECTION */}
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
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">About Yourself (Bio)</label>
                <textarea 
                  name="bio" 
                  rows={4} 
                  value={formData.bio} 
                  onChange={handleChange} 
                  className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700" 
                  placeholder="Share a bit about your academic journey..."
                />
              </div>

              <div className="flex justify-end items-center gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="px-6 py-2 text-gray-500 font-bold hover:text-gray-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2 hover:bg-indigo-700 transition-all"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="md:col-span-1 space-y-8">
                  <DetailItem icon={<Mail/>} label="Email Address" value={user?.email} />
                  <DetailItem icon={<BookOpen/>} label="Faculty" value={user?.faculty} />
                  <DetailItem icon={<Users/>} label="Batch" value={user?.batch} />
               </div>
               <div className="md:col-span-2">
                  <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Biography</h3>
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line italic">
                      {user?.bio || "You haven't added a bio yet. Tell the OUSL community a bit about yourself!"}
                    </p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
    <input 
      type="text" 
      name={name} 
      value={value} 
      onChange={onChange} 
      className="w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
    />
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-4">
    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">{icon}</div>
    <div>
      <p className="text-xs text-gray-400 font-black uppercase mb-1 tracking-tighter">{label}</p>
      <p className="text-gray-900 font-bold text-lg">{value || '---'}</p>
    </div>
  </div>
);

export default Profile;