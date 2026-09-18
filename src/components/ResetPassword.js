import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const query = useQuery();
  const token = query.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!password || !confirmPassword) {
      setError('Por favor ingresa y confirma tu nueva contraseña.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/auth/restablecer-contrasena/?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nueva_contrasena: password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.confirmación || '¡Contraseña restablecida exitosamente!');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Ocurrió un error. Intenta de nuevo.');
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo más tarde.');
    } finally {
      setIsLoading(false);
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
          <p className="text-xs text-slate-400 font-medium tracking-wider uppercase mt-0.5">Crear Nueva Contraseña</p>
        </div>

        {/* Glassmorphic Card */}
        <div className="rounded-3xl bg-white/85 dark:bg-slate-900/65 backdrop-blur-2xl shadow-glass-lg border border-slate-200/80 dark:border-white/20 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"></div>

          <div className="p-6 sm:p-8">
            <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white mb-2">
              Restablecer Contraseña
            </h2>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mb-6">
              Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
            </p>

            {message && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-700 dark:text-emerald-300 text-xs text-center font-medium shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-rose-700 dark:text-rose-300 text-xs text-center font-medium shadow-[0_0_15px_rgba(251,113,133,0.2)]">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="field-label text-xs uppercase tracking-wider">Nueva contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="field-label text-xs uppercase tracking-wider">Confirmar contraseña</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="field"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full btn-primary py-3 rounded-2xl text-sm font-bold tracking-wide"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    Restableciendo...
                  </span>
                ) : (
                  'Restablecer Contraseña'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom link */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <Link to="/login" className="font-semibold text-sky-400 hover:text-sky-300 underline underline-offset-4 flex items-center justify-center gap-1">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 