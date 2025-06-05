import React from 'react';

const PqrsList = ({ pqrs }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Listado de PQRS</h2>
      {pqrs.length === 0 ? (
        <p className="text-center text-gray-500">No hay PQRS registradas aún.</p>
      ) : (
        <div className="space-y-4">
          {pqrs.map((pqrs, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-lg font-semibold">{pqrs.type}</p>
                <span className={`px-2 py-1 rounded text-sm ${
                  pqrs.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  pqrs.status === 'En Proceso' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {pqrs.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{pqrs.message}</p>
              <p className="text-sm text-gray-500">
                Fecha: {new Date(pqrs.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PqrsList; 