import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TransportDashboard from './components/TransportDashboard';
import { login, register, logout } from './services/authService';
import ForgotPassword from './components/ForgotPassword';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const userData = await login(email, password);
      console.log('Login successful:', userData);
      setUser(userData);
      setError('');
    } catch (err) {
      console.error('Login error:', err);
      setError('Credenciales inválidas');
    }
  };

  const handleRegister = async (userData) => {
    try {
      const newUser = await register(userData);
      console.log('Register successful:', newUser);
      setError('');
      setRegistrationSuccess(true);
      navigate('/');
    } catch (err) {
      console.error('Register error:', err);
      setError('Error al registrar usuario');
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/register" element={<Register onRegister={handleRegister} error={error} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="*" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login 
                onLogin={handleLogin} 
                error={error} 
                registrationSuccess={registrationSuccess}
                setRegistrationSuccess={setRegistrationSuccess}
              />
            )
          }
        />
        {user && (
          <Route path="/dashboard" element={<TransportDashboard user={user} onLogout={handleLogout} />} />
        )}
      </Routes>
    </div>
  );
}

export default App;

// DONE