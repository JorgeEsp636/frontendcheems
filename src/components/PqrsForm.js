import React, { useState } from 'react';

const PqrsForm = ({ onSubmit }) => {
  const [requestType, setRequestType] = useState('Petición');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type: requestType,
      message: message,
      date: new Date().toISOString(),
      status: 'Pendiente'
    });
    // Reiniciar el formulario
    setRequestType('Petición');
    setMessage('');
  };

  return (
    <div className="card card-pad">
      <h2 className="card-title mb-6 text-center">Enviar PQRS</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="requestType" className="field-label">Tipo de Solicitud:</label>
          <select
            id="requestType"
            name="requestType"
            className="field mt-1"
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
          <label htmlFor="message" className="field-label">Mensaje:</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            className="field mt-1 min-h-[110px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PqrsForm; 