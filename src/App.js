import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TransportDashboard from './components/TransportDashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import authService from './services/authService';

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const location = useLocation();

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
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

  return (
    <div className="min-h-screen bg-gray-100">
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
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

// DONE