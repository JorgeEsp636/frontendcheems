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
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md z-10">
        {/* Logo / Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500/30 to-indigo-500/30 backdrop-blur-2xl flex items-center justify-center border border-white/25 shadow-[0_0_30px_rgba(56,189,248,0.3)]">
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-sky-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]"
              aria-hidden="true"
            >
              <path
                d="M12 2.25 20.25 6.9V17.1L12 21.75 3.75 17.1V6.9L12 2.25Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 2.25V12m0 0 8.25-5.1M12 12 3.75 6.9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-widest brand-gradient-text uppercase">CHEEMS</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wider uppercase mt-0.5">Sistema de Transporte Inteligente</p>
        </div>

        {/* Glassmorphic Auth Card */}
        <div className="rounded-3xl bg-white/85 dark:bg-slate-900/65 backdrop-blur-2xl shadow-glass-lg border border-slate-200/80 dark:border-white/20 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"></div>

          <div className="p-6 sm:p-8">
            {/* Tabs Selector */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1 shadow-inner backdrop-blur-xl">
                <span className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_2px_12px_rgba(14,165,233,0.35)] border border-white/20">
                  Iniciar Sesión
                </span>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
                  onClick={() => setRegistrationSuccess?.(false)}
                >
                  Registrarse
                </Link>
              </div>
            </div>

            <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white mb-2">
              Bienvenido de nuevo
            </h2>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mb-6">Ingresa tus credenciales para acceder a la plataforma</p>

            {registrationSuccess && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-700 dark:text-emerald-300 text-xs text-center font-medium shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                ✓ Registro exitoso. Por favor inicia sesión.
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-rose-700 dark:text-rose-300 text-xs text-center font-medium shadow-[0_0_15px_rgba(251,113,133,0.2)]">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="correo_electronico" className="field-label text-xs uppercase tracking-wider">Correo Electrónico</label>
                <div className="relative">
                  <input
                    id="correo_electronico"
                    name="correo_electronico"
                    type="email"
                    required
                    className="field"
                    placeholder="ejemplo@transporte.com"
                    value={formData.correo_electronico}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="contrasena" className="field-label mb-0 text-xs uppercase tracking-wider">Contraseña</label>
                  <Link to="/forgot-password" className="text-xs text-sky-400 hover:text-sky-300 transition-colors">
                    ¿La olvidaste?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="contrasena"
                    name="contrasena"
                    type="password"
                    required
                    className="field"
                    placeholder="••••••••"
                    value={formData.contrasena}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full btn-primary py-3 rounded-2xl text-sm font-bold tracking-wide"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    Validando...
                  </span>
                ) : (
                  'Ingresar al Sistema'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom footer text */}
        <div className="mt-6 text-center text-xs text-slate-400">
          ¿Aún no tienes una cuenta?{' '}
          <Link to="/register" className="font-semibold text-sky-400 hover:text-sky-300 underline underline-offset-4">
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 