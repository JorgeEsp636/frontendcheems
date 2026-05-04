import React, { useState } from 'react';

const RateInfo = ({ rates, onCreateRate, onUpdateRate, onDeleteRate, isAdmin }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({
    zona_origen: '',
    zona_destino: '',
    precio_base: '',
    precio_km: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRate) {
        await onUpdateRate(editingRate.id, formData);
      } else {
        await onCreateRate(formData);
      }
      setShowModal(false);
      setEditingRate(null);
      setFormData({
        zona_origen: '',
        zona_destino: '',
        precio_base: '',
        precio_km: ''
      });
    } catch (error) {
      console.error('Error al guardar la tarifa:', error);
    }
  };

  const handleEdit = (rate) => {
    setEditingRate(rate);
    setFormData({
      zona_origen: rate.zona_origen,
      zona_destino: rate.zona_destino,
      precio_base: rate.precio_base,
      precio_km: rate.precio_km
    });
    setShowModal(true);
  };

  const handleDelete = async (rateId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta tarifa?')) {
      try {
        await onDeleteRate(rateId);
      } catch (error) {
        console.error('Error al eliminar la tarifa:', error);
      }
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Tarifas</h3>
        {isAdmin && (
        <button
          onClick={() => {
            setEditingRate(null);
            setFormData({
              zona_origen: '',
              zona_destino: '',
              precio_base: '',
              precio_km: ''
            });
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Agregar Tarifa
        </button>
        )}
      </div>

      <div className="border-t border-gray-200">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {rates.map((rate) => (
              <li key={rate.id_tarifa}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    Origen: {rate.zona_origen ? rate.zona_origen : '-'} | Destino: {rate.zona_destino ? rate.zona_destino : '-'}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="truncate">
                      Precio base: {rate.precio_base ? rate.precio_base : '-'} | Precio/km: {rate.precio_km ? rate.precio_km : '-'}
                    </span>
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="truncate">
                      Activa: {rate.activa ? 'Sí' : 'No'}
                    </span>
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="truncate">
                      Última actualización: {rate.fecha_actualizacion ? rate.fecha_actualizacion : '-'}
                    </span>
                  </p>
                </div>
                {isAdmin && (
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => handleEdit(rate)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(rate.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showModal && isAdmin && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="zona_origen" className="block text-sm font-medium text-gray-700">
                      Zona de Origen
                    </label>
                    <input
                      type="text"
                      name="zona_origen"
                      id="zona_origen"
                      value={formData.zona_origen}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="zona_destino" className="block text-sm font-medium text-gray-700">
                      Zona de Destino
                    </label>
                    <input
                      type="text"
                      name="zona_destino"
                      id="zona_destino"
                      value={formData.zona_destino}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="precio_base" className="block text-sm font-medium text-gray-700">
                      Precio Base
                    </label>
                    <input
                      type="number"
                      name="precio_base"
                      id="precio_base"
                      value={formData.precio_base}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="precio_km" className="block text-sm font-medium text-gray-700">
                      Precio por Kilómetro
                    </label>
                    <input
                      type="number"
                      name="precio_km"
                      id="precio_km"
                      value={formData.precio_km}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingRate ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingRate(null);
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateInfo; 