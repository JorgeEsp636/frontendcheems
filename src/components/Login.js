import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Login = ({ onLogin, error, registrationSuccess, setRegistrationSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (registrationSuccess) {
      // Optionally clear the success message after a few seconds
      const timer = setTimeout(() => {
        setRegistrationSuccess(false);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, setRegistrationSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Intentando iniciar sesión con:', { email, password });
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
        </div>

        {registrationSuccess && (
          <div className="text-green-500 text-sm text-center mb-4">
            ¡Usuario registrado correctamente! Por favor, inicia sesión.
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Iniciar Sesión
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>

          {/* Link de Olvidé mi contraseña */}
          <div className="text-sm text-center mt-2">
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 