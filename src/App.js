import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TransportDashboard from './components/TransportDashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import authService from './services/authService';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const location = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          const userInfo = JSON.parse(storedUser);
          setUser(userInfo);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      setError('');
      const userData = await authService.login(credentials);
      if (userData) {
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Error al iniciar sesión');
      return false;
    }
  };

  const handleRegister = async (userData) => {
    try {
      setError('');
      await authService.register(userData);
      setRegistrationSuccess(true);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Error al registrar usuario');
      return false;
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className={`min-h-screen relative flex items-center justify-center ${isDark ? 'bg-[#040911] text-white' : 'bg-slate-100 text-slate-900'}`}>
        <div className="ambient-glow-wrapper">
          <div className="ambient-orb ambient-orb-1"></div>
          <div className="ambient-orb ambient-orb-2"></div>
        </div>
        <div className="surface rounded-3xl p-8 max-w-xs w-full text-center relative z-10 border border-white/15 shadow-glass-lg">
          <div className="relative mx-auto w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-sky-400/20 animate-ping"></div>
            <div className="w-14 h-14 rounded-full border-4 border-t-sky-400 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="mt-5 text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300">Cargando CHEEMS...</p>
        </div>
      </div>
    );
  }

  const isAuthRequired = !['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);
  const isAuthenticated = !!user;

  if (isAuthRequired && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && !isAuthRequired) {
    return <Navigate to="/dashboard" replace />;
  }

  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <div className={`min-h-screen relative selection:bg-sky-500/30 selection:text-sky-200 transition-colors duration-300 ${
      isDark ? 'bg-[#040911] text-slate-100' : 'bg-[#f1f5f9] text-slate-800'
    }`}>
      {/* Ambient background light orbs for global glassmorphism depth */}
      <div className="ambient-glow-wrapper">
        <div className="ambient-orb ambient-orb-1"></div>
        <div className="ambient-orb ambient-orb-2"></div>
        <div className="ambient-orb ambient-orb-3"></div>
        <div className="ambient-orb ambient-orb-4"></div>
      </div>

      {/* Floating Theme Toggle on Auth Pages */}
      {isAuthPage && (
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
          <ThemeToggle showLabel={false} size="md" className="shadow-lg" />
        </div>
      )}

      <div className="relative z-10">
        <Routes>
          <Route 
            path="/login" 
            element={
              <Login 
                onLogin={handleLogin}
                error={error}
                registrationSuccess={registrationSuccess}
                setRegistrationSuccess={setRegistrationSuccess}
              />
            } 
          />
          <Route 
            path="/register" 
            element={
              <Register 
                onRegister={handleRegister}
                error={error}
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <TransportDashboard 
                user={user}
                onLogout={handleLogout}
              />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
          />
          <Route 
            path="/forgot-password" 
            element={<ForgotPassword />} 
          />
          <Route 
            path="/reset-password" 
            element={<ResetPassword />} 
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;


// DONE