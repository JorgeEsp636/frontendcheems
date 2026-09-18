import React, { useState } from 'react';

const AuthForgotPassword = ({ onResetPassword, onLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onResetPassword(email);
  };

  return (
    <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-slate-900/65 backdrop-blur-2xl border border-slate-200/80 dark:border-white/20 shadow-glass-lg text-slate-800 dark:text-slate-100">
      <h2 className="text-xl font-bold mb-6 text-center text-slate-900 dark:text-white">Recuperar Contraseña</h2>
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
        <button
          type="submit"
          className="w-full btn-primary py-3 rounded-2xl text-sm font-bold"
        >
          Enviar Instrucciones
        </button>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onLogin}
            className="text-xs text-sky-400 hover:text-sky-300 underline underline-offset-4"
          >
            Volver a Iniciar Sesión
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForgotPassword;