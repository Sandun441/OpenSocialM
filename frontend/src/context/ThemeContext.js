import React, { createContext, useState, useEffect } from 'react';

// 1. Keep this as a named export (for useContext)
export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // Check local storage or default to light
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Logic to toggle the class on the <html> tag
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save preference to storage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 2. THIS IS THE FIX: Export it as Default so App.js can read it
export default ThemeProvider;