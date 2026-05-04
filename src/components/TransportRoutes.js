import React, { useState, useEffect } from 'react';
import transportService from '../services/transportService';

const TransportRoutes = ({ isAdmin, onCreateRoute, onUpdateRoute, onDeleteRoute }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    nombre_ruta: '',
    origen: '',
    destino: '',
    horario: '',
    duracion: '',
    distancia: '',
    id_vehiculos: ''
  });
  const [vehiculos, setVehiculos] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    // Cargar vehículos al abrir el modal
    if (showModal) {
      transportService.getBuses && transportService.getBuses().then(setVehiculos);
    }
  }, [showModal]);

  const loadRoutes = async () => {
    try {
      const routesData = await transportService.getRoutes();
      setRoutes(routesData || []);
    } catch (error) {
      console.error('Error al cargar las rutas:', error);
    }
  };

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
      let horarioValue = formData.horario;
      // Si el campo está vacío, lo envío como null
      if (!horarioValue || horarioValue.trim() === '') {
        horarioValue = null;
      } else {
        // Si tiene segundos, los quito
        const match = horarioValue.match(/^\d{2}:\d{2}/);
        horarioValue = match ? match[0] : horarioValue;
      }
      const dataToSend = {
        ...formData,
        horario: horarioValue,
        id_vehiculos: parseInt(formData.id_vehiculos)
      };
      if (editingRoute) {
        await onUpdateRoute(editingRoute.id_ruta, dataToSend);
      } else {
        await onCreateRoute(dataToSend);
      }
      await loadRoutes();
      setShowModal(false);
      setEditingRoute(null);
      setFormData({
        nombre_ruta: '',
        origen: '',
        destino: '',
        horario: '',
        duracion: '',
        distancia: '',
        id_vehiculos: ''
      });
    } catch (error) {
      console.error('Error al guardar la ruta:', error);
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      nombre_ruta: route.nombre_ruta,
      origen: route.origen,
      destino: route.destino,
      horario: route.horario,
      duracion: route.duracion,
      distancia: route.distancia,
      id_vehiculos: route.id_vehiculos
    });
    setShowModal(true);
  };

  const handleDelete = async (routeId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta ruta?')) {
      try {
        await onDeleteRoute(routeId);
        await loadRoutes();
      } catch (error) {
        console.error('Error al eliminar la ruta:', error);
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Rutas de Transporte</h3>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingRoute(null);
              setFormData({
                nombre_ruta: '',
                origen: '',
                destino: '',
                horario: '',
                duracion: '',
                distancia: '',
                id_vehiculos: ''
              });
              setShowModal(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Agregar Ruta
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No hay rutas registradas.</div>
        )}
        {routes.map((route) => (
          <div key={route.id_ruta} className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg text-blue-700">
                  {route.nombre_ruta ? route.nombre_ruta : '-'}
                </span>
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Origen:</span> {route.origen ? route.origen : '-'}
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Destino:</span> {route.destino ? route.destino : '-'}
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Horario:</span> {route.horario ? route.horario : '-'}
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Duración:</span> {route.duracion ? route.duracion : '-'}
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Distancia:</span> {route.distancia ? route.distancia : '-'}
              </div>
            </div>
            {isAdmin && (
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(route)}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 transition-colors text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(route.id_ruta)}
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
                    <label htmlFor="nombre_ruta" className="block text-sm font-medium text-gray-700">
                      Nombre de la Ruta
                    </label>
                    <input
                      type="text"
                      name="nombre_ruta"
                      id="nombre_ruta"
                      value={formData.nombre_ruta}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="origen" className="block text-sm font-medium text-gray-700">
                      Origen
                    </label>
                    <input
                      type="text"
                      name="origen"
                      id="origen"
                      value={formData.origen}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="destino" className="block text-sm font-medium text-gray-700">
                      Destino
                    </label>
                    <input
                      type="text"
                      name="destino"
                      id="destino"
                      value={formData.destino}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="horario" className="block text-sm font-medium text-gray-700">
                      Horario
                    </label>
                    <input
                      type="time"
                      name="horario"
                      id="horario"
                      value={formData.horario}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="duracion" className="block text-sm font-medium text-gray-700">
                      Duración
                    </label>
                    <input
                      type="text"
                      name="duracion"
                      id="duracion"
                      value={formData.duracion}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="distancia" className="block text-sm font-medium text-gray-700">
                      Distancia
                    </label>
                    <input
                      type="text"
                      name="distancia"
                      id="distancia"
                      value={formData.distancia}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="id_vehiculos" className="block text-sm font-medium text-gray-700">
                      Vehículo
                    </label>
                    <select
                      name="id_vehiculos"
                      id="id_vehiculos"
                      value={formData.id_vehiculos}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Selecciona un vehículo</option>
                      {vehiculos.map((vehiculo) => (
                        <option key={vehiculo.id_vehiculos} value={vehiculo.id_vehiculos}>
                          {vehiculo.placa} - {vehiculo.empresa}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingRoute ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingRoute(null);
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

export default TransportRoutes; 