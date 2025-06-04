import React from 'react';

const PqrsList = ({ pqrsList }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Listado de PQRS</h2>
      {pqrsList.length === 0 ? (
        <p className="text-center text-gray-500">No hay PQRS registradas aún.</p>
      ) : (
        <div className="space-y-4">
          {pqrsList.map((pqrs, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm">
              <p><strong className="font-medium">Tipo:</strong> {pqrs.type}</p>
              <p><strong className="font-medium">Nombre:</strong> {pqrs.name}</p>
              <p><strong className="font-medium">Email:</strong> {pqrs.email}</p>
              <p><strong className="font-medium">Asunto:</strong> {pqrs.subject}</p>
              <p><strong className="font-medium">Mensaje:</strong> {pqrs.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PqrsList; 