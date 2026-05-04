import React, { useState } from 'react';
import transportService from '../services/transportService';

const BusInfo = ({ buses, onCreateBus, onUpdateBus, onDeleteBus, isAdmin }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    capacidad: '',
    estado: 'activo',
    ultima_mantenimiento: '',
    conductor_id: '',
    empresa: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadBuses = async () => {
    try {
      const busesData = await transportService.getBuses();
      setBuses(busesData || []);
    } catch (error) {
      console.error('Error al cargar los buses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBus) {
        await onUpdateBus(editingBus.id_vehiculos, formData);
      } else {
        await onCreateBus(formData);
      }
      await loadBuses();
      setShowModal(false);
      setEditingBus(null);
      setFormData({
        placa: '',
        modelo: '',
        capacidad: '',
        estado: 'activo',
        ultima_mantenimiento: '',
        conductor_id: '',
        empresa: ''
      });
    } catch (error) {
      console.error('Error al guardar el bus:', error);
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      placa: bus.placa,
      modelo: bus.modelo,
      capacidad: bus.capacidad,
      estado: bus.estado,
      ultima_mantenimiento: bus.ultima_mantenimiento,
      conductor_id: bus.conductor_id,
      empresa: bus.empresa
    });
    setShowModal(true);
  };

  const handleDelete = async (busId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este bus?')) {
      try {
        await onDeleteBus(busId);
        await loadBuses();
      } catch (error) {
        console.error('Error al eliminar el bus:', error);
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Buses</h3>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingBus(null);
              setFormData({
                placa: '',
                modelo: '',
                capacidad: '',
                estado: 'activo',
                ultima_mantenimiento: '',
                conductor_id: '',
                empresa: ''
              });
              setShowModal(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Agregar Bus
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buses.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No hay buses registrados.</div>
        )}
        {buses.map((bus) => (
          <div key={bus.id_vehiculos} className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg text-blue-700">
                  {bus.modelo ? bus.modelo : '-'} - {bus.placa ? bus.placa : '-'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${bus.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {bus.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Capacidad:</span> {bus.capacidad ? bus.capacidad : '-'} pasajeros
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Último mantenimiento:</span> {bus.ultima_mantenimiento ? bus.ultima_mantenimiento : '-'}
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Empresa:</span> {bus.empresa ? bus.empresa : '-'}
              </div>
            </div>
            {isAdmin && (
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(bus)}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 transition-colors text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(bus.id_vehiculos)}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors text-sm"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="placa" className="block text-sm font-medium text-gray-700">
                      Placa
                    </label>
                    <input
                      type="text"
                      name="placa"
                      id="placa"
                      value={formData.placa}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
                      Modelo
                    </label>
                    <input
                      type="text"
                      name="modelo"
                      id="modelo"
                      value={formData.modelo}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700">
                      Capacidad
                    </label>
                    <input
                      type="number"
                      name="capacidad"
                      id="capacidad"
                      value={formData.capacidad}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="ultima_mantenimiento" className="block text-sm font-medium text-gray-700">
                      Último Mantenimiento
                    </label>
                    <input
                      type="date"
                      name="ultima_mantenimiento"
                      id="ultima_mantenimiento"
                      value={formData.ultima_mantenimiento}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                      Estado
                    </label>
                    <select
                      name="estado"
                      id="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="mantenimiento">En Mantenimiento</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="conductor_id" className="block text-sm font-medium text-gray-700">
                      ID del Conductor
                    </label>
                    <input
                      type="text"
                      name="conductor_id"
                      id="conductor_id"
                      value={formData.conductor_id}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="empresa" className="block text-sm font-medium text-gray-700">
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      id="empresa"
                      value={formData.empresa}
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
                    {editingBus ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingBus(null);
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

export default BusInfo; 