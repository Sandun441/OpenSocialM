import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MessageSquare, GraduationCap, 
  Clock, Facebook, Instagram 
} from 'lucide-react';
import axios from '../utils/api';

// Custom WhatsApp SVG for a more professional look
const WhatsAppIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`/api/users/${id}`);
        setStudent(res.data);
      } catch (err) {
        console.error("Could not find student");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 font-bold">Student profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* 1. Header & Cover Photo */}
      <div className="relative h-60 w-full bg-gradient-to-r from-indigo-600 to-purple-700">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all z-20"
        >
          <ChevronLeft size={24} />
        </button>
        {student.coverImage && <img src={student.coverImage} className="w-full h-full object-cover" alt="" />}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 z-10 flex flex-col md:flex-row md:items-end md:space-x-8 mb-8">
          {/* Avatar */}
          <div className="relative group mx-auto md:mx-0">
            {student.avatar ? (
              <img src={student.avatar} className="w-44 h-44 rounded-[2.5rem] border-8 border-white object-cover bg-white shadow-2xl" alt="" />
            ) : (
              <div className="w-44 h-44 rounded-[2.5rem] border-8 border-white bg-indigo-50 flex items-center justify-center text-5xl font-bold text-indigo-600 shadow-2xl">
                {student.firstName?.[0]}
              </div>
            )}
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
          </div>

          {/* Name and Quick Actions - Adjusted pt-10 to move name down */}
          <div className="flex-1 text-center md:text-left pt-10 md:pt-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {student.firstName} {student.lastName}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-gray-600 font-medium">
              <span className="flex items-center"><GraduationCap size={18} className="mr-1.5 text-indigo-600" /> {student.degreeProgram}</span>
            </div>
          </div>

          <div className="mt-6 md:mb-2 flex justify-center space-x-3">
            <button 
              onClick={() => navigate(`/chat/${student._id}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center transform hover:scale-105"
            >
              <MessageSquare size={20} className="mr-2" /> Message
            </button>
          </div>
        </div>

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                <GraduationCap size={20} className="mr-2 text-indigo-600" /> Academic Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-2xl">
                   <Clock size={18} className="text-gray-400 mr-3" />
                   <div>
                     <p className="text-[10px] uppercase text-gray-400 font-bold leading-none mb-1">Status</p>
                     <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Batch {student.batch}</p>
                   </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-2xl">
                   <GraduationCap size={18} className="text-gray-400 mr-3" />
                   <div>
                     <p className="text-[10px] uppercase text-gray-400 font-bold leading-none mb-1">Faculty</p>
                     <p className="text-sm font-semibold text-gray-700">{student.faculty}</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Connect</h3>
              <div className="flex space-x-4">
                {/* Facebook */}
                <a 
                  href={student.socialLinks?.facebook || "#"} 
                  target="_blank" 
                  rel="noreferrer"
                  disabled={!student.socialLinks?.facebook}
                  className={`p-4 rounded-2xl transition-all duration-300 flex-1 flex justify-center ${
                    student.socialLinks?.facebook 
                      ? "bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white shadow-sm" 
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Facebook size={22} />
                </a>

                {/* Instagram */}
                <a 
                  href={student.socialLinks?.instagram ? `https://instagram.com/${student.socialLinks.instagram}` : "#"} 
                  target="_blank" 
                  rel="noreferrer"
                  disabled={!student.socialLinks?.instagram}
                  className={`p-4 rounded-2xl transition-all duration-300 flex-1 flex justify-center ${
                    student.socialLinks?.instagram 
                      ? "bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white shadow-sm" 
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Instagram size={22} />
                </a>

                {/* WhatsApp */}
                <a 
                  href={student.socialLinks?.whatsapp ? `https://wa.me/${student.socialLinks.whatsapp}` : "#"} 
                  target="_blank" 
                  rel="noreferrer"
                  disabled={!student.socialLinks?.whatsapp}
                  className={`p-4 rounded-2xl transition-all duration-300 flex-1 flex justify-center ${
                    student.socialLinks?.whatsapp 
                      ? "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white shadow-sm" 
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <WhatsAppIcon size={22} />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Biography</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {student.bio || `${student.firstName} is a dedicated student at Open University of Sri Lanka.`}
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              </div>
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-100 rounded-3xl">
                <p className="text-sm text-gray-400">Activity from the Faculty feed will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;