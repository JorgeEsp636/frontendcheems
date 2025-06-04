import React, { useState } from 'react';

const PqrsForm = () => {
  const [requestType, setRequestType] = useState('Petición');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario, por ejemplo, enviarlo a un backend
    console.log('Enviando PQRS:', { requestType, message });
    alert('Tu PQRS ha sido enviada.');
    // Reiniciar el formulario
    setRequestType('Petición');
    setMessage('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Enviar PQRS</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="requestType" className="block text-sm font-medium text-gray-700">Tipo de Solicitud:</label>
          <select
            id="requestType"
            name="requestType"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm rounded-md"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
          >
            <option value="Petición">Petición</option>
            <option value="Queja">Queja</option>
            <option value="Reclamo">Reclamo</option>
            <option value="Sugerencia">Sugerencia</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje:</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PqrsForm; 