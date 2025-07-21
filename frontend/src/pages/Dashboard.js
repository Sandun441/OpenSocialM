import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  User,
  GraduationCap,
  Users,
  MessageSquare,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Welcome back, {user?.firstName} 👋
          </h1>
        </div>
      </div>

      {/* Dashboard Grid Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <DashboardCard
          title="My Profile"
          description="Update your account and view your details"
          to="/profile"
          icon={<User className="w-10 h-10 text-blue-500" />}
        />
        <DashboardCard
          title="Faculty"
          description="Explore your faculty's announcements and events"
          to="/faculty/science"
          icon={<GraduationCap className="w-10 h-10 text-green-500" />}
        />
        <DashboardCard
          title="Batch Community"
          description="Chat with students from your batch"
          to="/batch"
          icon={<Users className="w-10 h-10 text-purple-500" />}
        />
        <DashboardCard
          title="Events & Calendar"
          description="View upcoming academic and university events"
          to="/calendar"
          icon={<CalendarDays className="w-10 h-10 text-pink-500" />}
        />
        <DashboardCard
          title="Discussion Forum"
          description="Ask questions and help others in the community"
          to="/forum"
          icon={<MessageSquare className="w-10 h-10 text-yellow-500" />}
        />
        <DashboardCard
          title="Academic Progress"
          description="Track your course completion and grades"
          to="/progress"
          icon={<GraduationCap className="w-10 h-10 text-indigo-500" />}
        />
      </section>
    </div>
  );
}

function DashboardCard({ title, description, to, icon }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(to)}
      className="cursor-pointer bg-white text-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transition transform hover:-translate-y-1 hover:scale-105 duration-300"
    >
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-2xl font-semibold ml-4">{title}</h2>
      </div>
      <p className="text-base text-gray-600">{description}</p>
    </div>
  );
}
