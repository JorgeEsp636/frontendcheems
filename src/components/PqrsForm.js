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
      <div className="glass-card-header">
        <div>
          <h2 className="card-title text-xl font-bold">
            <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sm">📝</span>
            Radicar Solicitud (PQRS)
          </h2>
          <p className="text-xs text-slate-400 mt-1">Envía tus Peticiones, Quejas, Reclamos o Sugerencias</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="requestType" className="field-label">Tipo de Solicitud</label>
          <select
            id="requestType"
            name="requestType"
            className="field"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
          >
            <option value="Petición">🙋 Petición</option>
            <option value="Queja">⚠️ Queja</option>
            <option value="Reclamo">❗ Reclamo</option>
            <option value="Sugerencia">💡 Sugerencia</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="field-label">Detalle del Mensaje</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            className="field min-h-[120px]"
            placeholder="Describe detalladamente tu situación, ruta, horario o inquietud..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-primary"
          >
            ✉️ Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  );
};

export default PqrsForm; 