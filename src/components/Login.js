import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const Login = ({ onLogin, error: propError, registrationSuccess, setRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    correo_electronico: '',
    contrasena: ''
  });
  const [error, setError] = useState(propError || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar si ya hay una sesión activa
    if (authService.isAuthenticated()) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    }
  }, [navigate, location]);

  useEffect(() => {
    setError(propError || '');
  }, [propError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await onLogin(formData);
      if (success) {
        // Verificar que el usuario esté almacenado antes de redirigir
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        } else {
          setError('Error al iniciar sesión. Por favor, intente nuevamente.');
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-10">
      {/* Fondo tipo mockup (sin tocar lógica) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B3B57] to-[#061E2C]" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/15">
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
              aria-hidden="true"
            >
              <path
                d="M12 2.25 20.25 6.9V17.1L12 21.75 3.75 17.1V6.9L12 2.25Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 2.25V12m0 0 8.25-5.1M12 12 3.75 6.9"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div className="mt-3 text-white font-semibold tracking-[0.2em]">CHEEMS</div>
        </div>

        <div className="rounded-[28px] bg-white/90 backdrop-blur shadow-2xl border border-white/60 overflow-hidden">
          <div className="p-6 sm:p-7">
            {/* Tabs (solo navegación) */}
            <div className="flex items-center justify-center">
              <div className="inline-flex rounded-full bg-slate-200/70 p-1">
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-[#0B3B57] text-white">
                  Log In
                </span>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-800"
                  onClick={() => setRegistrationSuccess?.(false)}
                >
                  Sing Up
                </Link>
              </div>
            </div>

            <h2 className="mt-5 text-center text-lg font-semibold text-slate-800">
              Bienvenido a CHEEMS
            </h2>

            {registrationSuccess && (
              <div className="mt-2 text-center text-sm text-green-700">
                Registro exitoso. Por favor inicia sesión.
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="correo_electronico" className="sr-only">Correo</label>
                <input
                  id="correo_electronico"
                  name="correo_electronico"
                  type="email"
                  required
                  className="w-full bg-transparent border-0 border-b border-slate-300 px-1 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-[#0B3B57]"
                  placeholder="Correo"
                  value={formData.correo_electronico}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="contrasena" className="sr-only">Contraseña</label>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  required
                  className="w-full bg-transparent border-0 border-b border-slate-300 px-1 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-[#0B3B57]"
                  placeholder="Contraseña"
                  value={formData.contrasena}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`mt-2 w-full rounded-full py-3 text-sm font-semibold text-white transition ${
                  loading ? 'bg-[#0B3B57]/60' : 'bg-[#0B3B57] hover:bg-[#083248]'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B3B57]`}
              >
                {loading ? 'Iniciando sesión...' : 'Inicia Sesión'}
              </button>

              <div className="text-center pt-2">
                <Link to="/forgot-password" className="text-xs text-[#0B3B57] hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* CTA inferior tipo mockup */}
        <div className="mt-6 text-center text-sm text-white/90">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-semibold underline underline-offset-4">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 