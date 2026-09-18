import React, { useState } from 'react';
import authService from '../services/authService';

const AuthLoginForm = ({ onLogin, onForgotPassword, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await authService.login(email, password);
      onLogin({ email, role: response.role || 'user' });
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-slate-900/65 backdrop-blur-2xl border border-slate-200/80 dark:border-white/20 shadow-glass-lg text-slate-800 dark:text-slate-100">
      <h2 className="text-xl font-bold mb-6 text-center text-slate-900 dark:text-white">Iniciar Sesión</h2>
      {error && (
        <div className="mb-4 p-3 bg-rose-500/15 border border-rose-400/40 text-rose-700 dark:text-rose-300 rounded-2xl text-xs text-center font-medium shadow-[0_0_12px_rgba(251,113,133,0.2)]">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label text-xs uppercase tracking-wider">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            placeholder="ejemplo@transporte.com"
            required
          />
        </div>
        <div>
          <label className="field-label text-xs uppercase tracking-wider">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <button
          type="submit"
          className="w-full btn-primary py-3 rounded-2xl text-sm font-bold"
        >
          Ingresar
        </button>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onRegister}
            className="text-xs text-sky-400 hover:text-sky-300 underline underline-offset-4"
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthLoginForm;