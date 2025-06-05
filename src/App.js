import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TransportDashboard from './components/TransportDashboard';
import { login, register, logout } from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

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
      setUser(newUser);
      setError('');
    } catch (err) {
      console.error('Register error:', err);
      setError('Error al registrar usuario');
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (!user) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/register" element={<Register onRegister={handleRegister} error={error} />} />
            <Route path="*" element={<Login onLogin={handleLogin} error={error} />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<TransportDashboard user={user} onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// DONE