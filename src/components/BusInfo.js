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
    <div className="card card-pad">
      <div className="flex justify-between items-center mb-4">
        <h3 className="card-title">Buses</h3>
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
            className="btn-primary"
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
          <div key={bus.id_vehiculos} className="card brand-gradient-fill p-4 flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg text-white">
                    {bus.modelo ? bus.modelo : '-'} - {bus.placa ? bus.placa : '-'}
                  </span>
                  {bus.estado === 'activo' ? (
                    <span className="chip-on-dark-success">Activo</span>
                  ) : (
                    <span className="chip-on-dark-danger">Inactivo</span>
                  )}
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Capacidad:</span> {bus.capacidad ? bus.capacidad : '-'} pasajeros
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Último mantenimiento:</span> {bus.ultima_mantenimiento ? bus.ultima_mantenimiento : '-'}
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Empresa:</span> {bus.empresa ? bus.empresa : '-'}
                </div>
              </div>
              {isAdmin && (
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEdit(bus)}
                    className="btn-soft px-3 py-1.5 text-sm bg-white/15 text-white border-white/20 hover:bg-white/20 focus:ring-white/30"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(bus.id_vehiculos)}
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
                    <label htmlFor="placa" className="field-label">
                      Placa
                    </label>
                    <input
                      type="text"
                      name="placa"
                      id="placa"
                      value={formData.placa}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="modelo" className="field-label">
                      Modelo
                    </label>
                    <input
                      type="text"
                      name="modelo"
                      id="modelo"
                      value={formData.modelo}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="capacidad" className="field-label">
                      Capacidad
                    </label>
                    <input
                      type="number"
                      name="capacidad"
                      id="capacidad"
                      value={formData.capacidad}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="ultima_mantenimiento" className="field-label">
                      Último Mantenimiento
                    </label>
                    <input
                      type="date"
                      name="ultima_mantenimiento"
                      id="ultima_mantenimiento"
                      value={formData.ultima_mantenimiento}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="estado" className="field-label">
                      Estado
                    </label>
                    <select
                      name="estado"
                      id="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="field mt-1"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="mantenimiento">En Mantenimiento</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="conductor_id" className="field-label">
                      ID del Conductor
                    </label>
                    <input
                      type="text"
                      name="conductor_id"
                      id="conductor_id"
                      value={formData.conductor_id}
                      onChange={handleInputChange}
                      className="field mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="empresa" className="field-label">
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      id="empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                </div>
                <div className="bg-slate-50 px-5 py-4 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto"
                  >
                    {editingBus ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingBus(null);
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

export default BusInfo; 