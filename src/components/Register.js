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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear una cuenta
          </h2>
        </div>
        {success ? (
          <div className="text-center">
            <div className="text-green-600 text-lg mb-4">
              ¡Registro exitoso! Redirigiendo al inicio de sesión...
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="correo_electronico" className="sr-only">Correo electrónico</label>
                <input
                  id="correo_electronico"
                  name="correo_electronico"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Correo electrónico"
                  value={formData.correo_electronico}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="nombre" className="sr-only">Nombre de usuario</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Nombre de usuario"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="contrasena" className="sr-only">Contraseña</label>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                  value={formData.contrasena}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirmar contraseña</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="rol" className="sr-only">Rol</label>
                <select
                  id="rol"
                  name="rol"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  value={formData.rol}
                  onChange={handleChange}
                >
                  <option value="1">Pasajero</option>
                  <option value="2">Conductor</option>
                  <option value="3">Administrador</option>
                </select>
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
                Registrarse
              </button>
            </div>

            <div className="text-sm text-center">
              <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register; 