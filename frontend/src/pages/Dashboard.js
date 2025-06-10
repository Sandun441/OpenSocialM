import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, User, GraduationCap, Users, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {currentUser?.name || 'OUSL Student'} 👋</h1>
          <p className="text-gray-600 mt-1">You're logged in as <strong>{currentUser?.email}</strong></p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded shadow"
        >
          Log out
        </button>
      </div>

      {/* Section with red background */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-200 p-4 rounded-4xl">
        <DashboardCard 
          title="My Profile"
          description="Update your account and view your details"
          to="/profile"
          icon={<User className="w-6 h-6" />}
        />
        <DashboardCard 
          title="Faculty"
          description="Explore your faculty's announcements and events"
          to="/faculty/science"
          icon={<GraduationCap className="w-6 h-6" />}
        />
        <DashboardCard 
          title="Batch Community"
          description="Chat with students from your batch"
          to="/batch"
          icon={<Users className="w-6 h-6" />}
        />
        <DashboardCard 
          title="Events & Calendar"
          description="View upcoming academic and university events"
          to="/calendar"
          icon={<CalendarDays className="w-6 h-6" />}
        />
        <DashboardCard 
          title="Discussion Forum"
          description="Ask questions and help others in the community"
          to="/forum"
          icon={<MessageSquare className="w-6 h-6" />}
        />
        <DashboardCard 
          title="Academic Progress"
          description="Track your course completion and grades"
          to="/progress"
          icon={<GraduationCap className="w-6 h-6" />}
        />
      </section>

      {/* Footer */}

    </div>
  );
}

function DashboardCard({ title, description, to, icon }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(to)}
      className="cursor-pointer bg-white text-gray-800 p-6 rounded-xl shadow hover:bg-gray-100 transition transform hover:-translate-y-1 hover:scale-105 duration-300"
    >
      <div className="flex items-center mb-3">
        {icon}
        <h2 className="text-lg font-semibold ml-2">{title}</h2>
      </div>
      <p className="text-sm">{description}</p>
    </div>
  );
}
