import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null); // Para mensajes de éxito o error
  const [error, setError] = useState(null); // Para errores específicos
  const [isLoading, setIsLoading] = useState(false); // Para estado de carga

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    console.log('Solicitando restablecimiento de contraseña para:', email); // Lógica de backend pendiente

    // Aquí iría la lógica para llamar a tu API de backend
    // try {
    //   const response = await fetch('/api/forgot-password', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email }),
    //   });
    //   const data = await response.json();

    //   if (response.ok) {
    //     setMessage(data.message || 'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.');
    //   } else {
    //     setError(data.message || 'Ocurrió un error. Inténtalo de nuevo.');
    //   }
    // } catch (err) {
    //   setError('Error de conexión. Inténtalo más tarde.');
    // } finally {
    //   setIsLoading(false);
    // }

    // Simulación de respuesta (eliminar esto cuando implementes la lógica de backend)
    setTimeout(() => {
      setIsLoading(false);
      setMessage('Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.');
       setEmail(''); // Limpiar el campo después de enviar (opcional)
    }, 2000); // Simula una llamada a API de 2 segundos
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Restablecer Contraseña
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Introduce tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className="text-green-500 text-sm text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 