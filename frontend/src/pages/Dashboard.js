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
    <div className="h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
            Welcome back, {user?.firstName} 👋
          </h1>
        </div>
      </div>

      {/* Dashboard Grid Section */}
      <section className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4">
        <DashboardCard
          title="My Profile"
          description="Update your account and view your details"
          to="/profile"
          icon={<User className="w-10 h-10 text-blue-500" />}
        />
        <DashboardCard
          title="Faculty"
          description="Explore your faculty's announcements and events"
          to={`/faculty/${user?.faculty}`}
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
          to="/Events"
          icon={<CalendarDays className="w-10 h-10 text-pink-500" />}
        />
        <DashboardCard
          title="Discussion Forum"
          description="Ask questions and help others in the community"
          to="/Discussion"
          icon={<MessageSquare className="w-10 h-10 text-yellow-500" />}
        />
        <DashboardCard
          title="Academic Progress"
          description="Track your course completion and grades"
          to="/academicprogress"
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
      // I have added dark:hover:from-gray-700 and dark:hover:to-gray-800 below
      className="h-full cursor-pointer bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-8 rounded-2xl shadow-lg 
                 hover:shadow-xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-800
                 transition transform hover:-translate-y-1 hover:scale-105 duration-300
                 flex flex-col items-center justify-center text-center"
    >
      {/* 1. Icon Container: flex + justify-center makes the SVG center itself */}
      <div className="mb-4 flex justify-center w-full">{icon}</div>

      {/* 2. Title: No 'ml-4' here, just the text */}
      <h2 className="text-2xl font-semibold mb-2 w-full dark:text-white">
        {title}
      </h2>

      {/* 3. Description */}
      <p className="text-base text-gray-600 dark:text-gray-300 max-w-xs">
        {description}
      </p>
    </div>
  );
}
