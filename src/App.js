import React, { useState } from 'react';
import AuthLoginForm from './components/AuthLoginForm';
import AuthRegisterForm from './components/AuthRegisterForm';
import AuthForgotPassword from './components/AuthForgotPassword';
import TransportDashboard from './components/TransportDashboard';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (credentials) => {
    // Validar credenciales del administrador
    if (credentials.email === 'jorgemoreno062006@gmail.com' && credentials.password === '12345678') {
      const authenticatedUser = {
        email: credentials.email,
        role: 'admin'
      };
      setUser(authenticatedUser);
      alert('Has iniciado sesión como Administrador');
      setCurrentView('dashboard');
    } else {
      // Permitir el inicio de sesión para cualquier otro usuario registrado (simulación)
      const authenticatedUser = {
        email: credentials.email,
        role: 'user'
      };
      setUser(authenticatedUser);
      alert('Has iniciado sesión como Usuario');
      setCurrentView('dashboard');
    }
  };

  const handleRegister = (credentials) => {
    // Registrar siempre como usuario normal
    const registeredUser = {
      email: credentials.email,
      role: 'user' // Asegurarse de que siempre se registre como 'user'
    };
    setUser(registeredUser);
    alert('Te has registrado y has iniciado sesión como Usuario');
    setCurrentView('dashboard');
  };

  const handleResetPassword = (email) => {
    // Simular recuperación de contraseña
    alert(`Se han enviado instrucciones a ${email}`);
    setCurrentView('login');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {currentView === 'login' && (
        <AuthLoginForm
          onLogin={handleLogin}
          onForgotPassword={() => setCurrentView('forgot')}
          onRegister={() => setCurrentView('register')}
        />
      )}
      {currentView === 'register' && (
        <AuthRegisterForm
          onRegister={handleRegister}
          onLogin={() => setCurrentView('login')}
        />
      )}
      {currentView === 'forgot' && (
        <AuthForgotPassword
          onResetPassword={handleResetPassword}
          onLogin={() => setCurrentView('login')}
        />
      )}
      {currentView === 'dashboard' && user && (
        <TransportDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;

// DONE