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

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />  
            <Route path="/faculty/:facultyName" element={<Faculty />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/batch" element={<Batch />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;