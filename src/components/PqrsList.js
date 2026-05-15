import React from 'react';

const PqrsList = ({ pqrs }) => {
  return (
    <div className="card card-pad">
      <h2 className="card-title mb-6 text-center">Listado de PQRS</h2>
      {pqrs.length === 0 ? (
        <p className="text-center text-gray-500">No hay PQRS registradas aún.</p>
      ) : (
        <div className="space-y-4">
          {pqrs.map((item, index) => (
            <div key={index} className="card p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-lg font-semibold capitalize">{item.tipo}</p>
                {item.estado === 'pendiente' ? (
                  <span className="chip bg-amber-50 text-amber-800 border border-amber-200">
                    {item.estado.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ) : item.estado === 'en_proceso' ? (
                  <span className="chip-info">
                    {item.estado.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ) : (
                  <span className="chip-success">
                    {item.estado.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                )}
              </div>
              <p className="text-slate-900 font-semibold mb-1">Asunto: {item.asunto}</p>
              <p className="text-slate-600 mb-2">{item.descripcion}</p>
              <p className="text-sm text-slate-500 mb-1">Usuario: {item.usuario_nombre || '-'}</p>
              <p className="text-sm text-slate-500 mb-1">
                Fecha: {item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleString() : '-'}
              </p>
              {item.respuesta && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-sm text-emerald-900 font-semibold">Respuesta:</p>
                  <p className="text-sm text-emerald-800">{item.respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PqrsList; 