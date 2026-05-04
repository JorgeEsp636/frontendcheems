import React from 'react';

const PqrsList = ({ pqrs }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Listado de PQRS</h2>
      {pqrs.length === 0 ? (
        <p className="text-center text-gray-500">No hay PQRS registradas aún.</p>
      ) : (
        <div className="space-y-4">
          {pqrs.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-lg font-semibold capitalize">{item.tipo}</p>
                <span className={`px-2 py-1 rounded text-sm ${
                  item.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  item.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.estado.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <p className="text-gray-800 font-semibold mb-1">Asunto: {item.asunto}</p>
              <p className="text-gray-600 mb-2">{item.descripcion}</p>
              <p className="text-sm text-gray-500 mb-1">Usuario: {item.usuario_nombre || '-'}</p>
              <p className="text-sm text-gray-500 mb-1">
                Fecha: {item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleString() : '-'}
              </p>
              {item.respuesta && (
                <div className="mt-2 p-2 bg-green-50 rounded">
                  <p className="text-sm text-green-800 font-semibold">Respuesta:</p>
                  <p className="text-sm text-green-700">{item.respuesta}</p>
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