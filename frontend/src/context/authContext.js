import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearErrors = () => setError(null);


  useEffect(() => {
  const initAuth = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await axios.get('/api/auth/user'); 
        setUser(res.data);
        setIsAuthenticated(true); // <--- Add this
      } catch (err) {
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
    setLoading(false); 
  };
  initAuth();
}, []);

  const loadUser = async () => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    const res = await axios.get('/api/auth/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data);
    setIsAuthenticated(true); // <--- Critical update
    setLoading(false);        // <--- Critical update
  } catch (err) {
    sessionStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  }
};
  const register = async (formData) => {
    try {
      setLoading(true);
      clearErrors();
      
      const res = await axios.post('/api/auth/register', formData);
      
      if (res.data.token) {
        sessionStorage.setItem('token', res.data.token);
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

  const login = async (formData,rememberMe) => {
    try {
      setLoading(true);
      clearErrors(); // Now properly defined
      const res = await axios.post('/api/auth/login', formData);

      if (rememberMe) {
        sessionStorage.setItem('token', res.data.token); // Permanent
      } else {
        sessionStorage.setItem('token', res.data.token); // Temporary
      }

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
    sessionStorage.removeItem('token');
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