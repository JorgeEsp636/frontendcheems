import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('cheems_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Si no hay preferencia guardada, verificar preferencia del sistema operativo
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('cheems_theme', theme);
    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', theme);
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('theme-light');
      body.classList.remove('theme-dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('theme-dark');
      body.classList.remove('theme-light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser utilizado dentro de un ThemeProvider');
  }
  return context;
};

export default ThemeContext;
