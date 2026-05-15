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
    <div className="card card-pad">
      <div className="flex justify-between items-center mb-4">
        <h3 className="card-title">Rutas de Transporte</h3>
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
            className="btn-primary"
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
          <div key={route.id_ruta} className="card brand-gradient-fill p-4 flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg text-white">
                    {route.nombre_ruta ? route.nombre_ruta : '-'}
                  </span>
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Origen:</span> {route.origen ? route.origen : '-'}
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Destino:</span> {route.destino ? route.destino : '-'}
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Horario:</span> {route.horario ? route.horario : '-'}
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Duración:</span> {route.duracion ? route.duracion : '-'}
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Distancia:</span> {route.distancia ? route.distancia : '-'}
                </div>
              </div>
              {isAdmin && (
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEdit(route)}
                    className="btn-soft px-3 py-1.5 text-sm bg-white/15 text-white border-white/20 hover:bg-white/20 focus:ring-white/30"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(route.id_ruta)}
                    className="btn-soft px-3 py-1.5 text-sm bg-rose-500/20 text-white border-rose-200/30 hover:bg-rose-500/25 focus:ring-white/30"
                  >
                    Eliminar
                  </button>
                </div>
              )}
          </div>
        ))}
      </div>

      {showModal && (
        <>
          <div className="modal-overlay" aria-hidden="true"></div>
          <div className="modal-wrap">
            <div className="modal-sheet">
              <form onSubmit={handleSubmit}>
                <div className="p-5 sm:p-6">
                  <div className="mb-4">
                    <label htmlFor="nombre_ruta" className="field-label">
                      Nombre de la Ruta
                    </label>
                    <input
                      type="text"
                      name="nombre_ruta"
                      id="nombre_ruta"
                      value={formData.nombre_ruta}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="origen" className="field-label">
                      Origen
                    </label>
                    <input
                      type="text"
                      name="origen"
                      id="origen"
                      value={formData.origen}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="destino" className="field-label">
                      Destino
                    </label>
                    <input
                      type="text"
                      name="destino"
                      id="destino"
                      value={formData.destino}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="horario" className="field-label">
                      Horario
                    </label>
                    <input
                      type="time"
                      name="horario"
                      id="horario"
                      value={formData.horario}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="duracion" className="field-label">
                      Duración
                    </label>
                    <input
                      type="text"
                      name="duracion"
                      id="duracion"
                      value={formData.duracion}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="distancia" className="field-label">
                      Distancia
                    </label>
                    <input
                      type="text"
                      name="distancia"
                      id="distancia"
                      value={formData.distancia}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="id_vehiculos" className="field-label">
                      Vehículo
                    </label>
                    <select
                      name="id_vehiculos"
                      id="id_vehiculos"
                      value={formData.id_vehiculos}
                      onChange={handleInputChange}
                      className="field mt-1"
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
                <div className="bg-slate-50 px-5 py-4 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto"
                  >
                    {editingRoute ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingRoute(null);
                    }}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransportRoutes; 