import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ onRegister, error }) => {
  const [formData, setFormData] = useState({
    correo_electronico: '',
    nombre: '',
    contrasena: '',
    confirmPassword: '',
    rol: 1 // Valor por defecto para pasajero
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.contrasena !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Crear un nuevo objeto con solo los campos que necesita el backend
    const userData = {
      correo_electronico: formData.correo_electronico,
      nombre: formData.nombre,
      contrasena: formData.contrasena,
      rol: parseInt(formData.rol) // Asegurarnos de que el rol sea un número
    };
    const result = await onRegister(userData);
    if (result) {
      setSuccess(true);
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
          <p className="text-xs text-slate-400 font-medium tracking-wider uppercase mt-0.5">Crear Nueva Cuenta</p>
        </div>

        {/* Glassmorphic Auth Card */}
        <div className="rounded-3xl bg-white/85 dark:bg-slate-900/65 backdrop-blur-2xl shadow-glass-lg border border-slate-200/80 dark:border-white/20 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"></div>

          <div className="p-6 sm:p-8">
            {/* Tabs Selector */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1 shadow-inner backdrop-blur-xl">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
                >
                  Iniciar Sesión
                </Link>
                <span className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_2px_12px_rgba(14,165,233,0.35)] border border-white/20">
                  Registrarse
                </span>
              </div>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-2xl mb-4 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">¡Registro Exitoso!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Redirigiendo a la pantalla de inicio de sesión...</p>
                <div className="w-8 h-8 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin mx-auto"></div>
              </div>
            ) : (
              <>
                <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Únete a CHEEMS
                </h2>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mb-6">Completa los datos para registrar tu perfil</p>

                {error && (
                  <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-rose-700 dark:text-rose-300 text-xs text-center font-medium shadow-[0_0_15px_rgba(251,113,133,0.2)]">
                    {error}
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="correo_electronico" className="field-label text-xs uppercase tracking-wider">Correo Electrónico</label>
                    <input
                      id="correo_electronico"
                      name="correo_electronico"
                      type="email"
                      required
                      className="field"
                      placeholder="ejemplo@transporte.com"
                      value={formData.correo_electronico}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="nombre" className="field-label text-xs uppercase tracking-wider">Nombre Completo</label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      required
                      className="field"
                      placeholder="Tu nombre y apellido"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="contrasena" className="field-label text-xs uppercase tracking-wider">Contraseña</label>
                      <input
                        id="contrasena"
                        name="contrasena"
                        type="password"
                        required
                        className="field"
                        placeholder="••••••••"
                        value={formData.contrasena}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="field-label text-xs uppercase tracking-wider">Confirmar</label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="field"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rol" className="field-label text-xs uppercase tracking-wider">Tipo de Cuenta / Rol</label>
                    <select
                      id="rol"
                      name="rol"
                      required
                      className="field"
                      value={formData.rol}
                      onChange={handleChange}
                    >
                      <option value="1">Pasajero</option>
                      <option value="2">Conductor</option>
                      <option value="3">Administrador</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 w-full btn-primary py-3 rounded-2xl text-sm font-bold tracking-wide"
                  >
                    Crear Cuenta
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Bottom link */}
        <div className="mt-6 text-center text-xs text-slate-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-sky-400 hover:text-sky-300 underline underline-offset-4">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 