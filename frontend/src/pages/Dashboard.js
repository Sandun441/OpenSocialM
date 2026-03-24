import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  User,
  GraduationCap,
  Users,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    // 1. BACKGROUND & FONT: Clean background with the elegant Lato font
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-slate-900 p-6 md:p-12 flex flex-col font-['Lato'] transition-colors duration-300">
      
      {/* 2. HEADER SECTION */}
      <div className="mb-10 mt-2">
        <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white mb-3 tracking-tight">
          Welcome back, {user?.firstName} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
          Manage your academics and connect with your community.
        </p>
      </div>

      {/* 3. DASHBOARD GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        <DashboardCard
          title="My Profile"
          description="Update your account and view your details"
          to="/profile"
          // Icon Box Color: Soft Blue
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          icon={<User className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
        />
        
        <DashboardCard
          title="My Faculty"
          description="Explore announcements and faculty events"
          to={`/faculty/${user?.faculty}`}
          // Icon Box Color: Soft Emerald
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
          icon={<GraduationCap className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
        />
        
        <DashboardCard
          title="Batch Community"
          description="Chat and collaborate with your batch"
          to="/batch"
          // Icon Box Color: Soft Purple
          iconBg="bg-purple-50 dark:bg-purple-900/20"
          icon={<Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
        />
        
        <DashboardCard
          title="Events & Calendar"
          description="View upcoming academic and university events"
          to="/events"
          // Icon Box Color: Soft Pink
          iconBg="bg-pink-50 dark:bg-pink-900/20"
          icon={<CalendarDays className="w-8 h-8 text-pink-600 dark:text-pink-400" />}
        />
        
        <DashboardCard
          title="Discussion Forum"
          description="Ask questions and help others in the community"
          to="/discussion"
          // Icon Box Color: Soft Amber
          iconBg="bg-amber-50 dark:bg-amber-900/20"
          icon={<MessageSquare className="w-8 h-8 text-amber-600 dark:text-amber-400" />}
        />
        
        <DashboardCard
          title="Academic Progress"
          description="Track your course completion and grades"
          to="/academicprogress"
          // Icon Box Color: Soft Indigo
          iconBg="bg-indigo-50 dark:bg-indigo-900/20"
          icon={<TrendingUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />}
        />
        
      </section>
    </div>
  );
}

// --- ELEGANT CARD COMPONENT ---
function DashboardCard({ title, description, to, icon, iconBg }) {
  const navigate = useNavigate();
  
  return (
    <div
      onClick={() => navigate(to)}
      className="group bg-white dark:bg-slate-800 rounded-[24px] p-8 shadow-sm border border-slate-100 dark:border-slate-700
                 cursor-pointer transition-all duration-300 
                 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-6">
        {/* Icon with Circle Background */}
        <div className={`p-4 rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold font-['Playfair_Display'] text-slate-800 dark:text-white mb-2 group-hover:text-[#1A237E] dark:group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}