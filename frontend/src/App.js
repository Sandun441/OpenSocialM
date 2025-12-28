import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import Faculty from './pages/Faculty';
import Profile from './pages/Profile';
import Batch from './pages/Batch';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Register from './components/auth/Register';
import AboutUs from './pages/AboutUs';
import Chat from './pages/Chat';
import UserProfile from './pages/UserProfile';
import Events from './pages/Events';
import Discussion from './pages/Discussion';
import AcademicProgress from './pages/AcademicProgress';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route index element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/profile/:id" element={<UserProfile />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/faculty/:facultyName" element={<Faculty />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/batch" element={<Batch />} />
              <Route path="/events" element={<Events />} />
              <Route path="/discussion" element={<Discussion />} />
              <Route path="/AcademicProgress" element={<AcademicProgress />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
