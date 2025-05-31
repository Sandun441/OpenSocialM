import { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearErrors = () => setError(null);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const res = await axios.get('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem('token');
      setError(err.response?.data?.msg || 'Error loading user');
    }
  };
  const register = async (formData) => {
    try {
      setLoading(true);
      clearErrors();
      
      const res = await axios.post('/api/auth/register', formData);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        await loadUser();
        return true;
      } else {
        setError('Registration failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.msg || 
                          'Registration failed. Please try again.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      setLoading(true);
      clearErrors(); // Now properly defined
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      await loadUser();
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        loadUser,
        clearErrors // 2. Make sure to include it in the context value
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};