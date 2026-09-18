import React, { useState, useEffect } from 'react';
import transportService from '../services/transportService';

const BusInfo = ({ buses: propBuses = [], onCreateBus, onUpdateBus, onDeleteBus, isAdmin }) => {
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
  const [buses, setBuses] = useState(propBuses || []);

  const loadBuses = async () => {
    try {
      const busesData = await transportService.getBuses();
      setBuses(busesData || []);
    } catch (error) {
      console.error('Error al cargar los buses:', error);
    }
  };

  useEffect(() => {
    if (propBuses && propBuses.length > 0) {
      setBuses(propBuses);
    } else {
      loadBuses();
    }
  }, [propBuses]);

  useEffect(() => {
    loadBuses();
  }, []);

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
      if (editingBus) {
        const busId = editingBus.id_vehiculos || editingBus.id;
        if (onUpdateBus) {
          await onUpdateBus(busId, formData);
        }
      } else {
        if (onCreateBus) {
          await onCreateBus(formData);
        }
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
      placa: bus.placa || '',
      modelo: bus.modelo || '',
      capacidad: bus.capacidad || '',
      estado: bus.estado || 'activo',
      ultima_mantenimiento: bus.ultima_mantenimiento || '',
      conductor_id: bus.conductor_id || '',
      empresa: bus.empresa || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (busId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este bus?')) {
      try {
        if (onDeleteBus) {
          await onDeleteBus(busId);
        }
        await loadBuses();
      } catch (error) {
        console.error('Error al eliminar el bus:', error);
      }
    }
  };

  return (
    <div className="card card-pad">
      <div className="glass-card-header">
        <div>
          <h3 className="card-title text-xl font-bold">
            <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sm">🚌</span>
            Flota de Buses
          </h3>
          <p className="text-xs text-slate-400 mt-1">Control de vehículos, capacidad y estado de mantenimiento</p>
        </div>
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
            + Agregar Bus
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {buses.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
            <div className="text-4xl mb-2">🚍</div>
            No hay buses registrados actualmente.
          </div>
        )}
        {buses.map((bus, idx) => {
          const busId = bus.id_vehiculos || bus.id || idx;
          return (
            <div
              key={busId}
              className="item-card group"
            >
              <div>
                {/* Bus Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="item-title">
                      {bus.modelo || 'Bus'}
                    </h4>
                    <div className="inline-block px-2.5 py-0.5 mt-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs font-mono font-bold tracking-wider text-sky-700 dark:text-sky-200">
                      {bus.placa || 'SIN PLACA'}
                    </div>
                  </div>
                  {bus.estado === 'activo' ? (
                    <span className="chip-success shrink-0">Activo</span>
                  ) : bus.estado === 'mantenimiento' ? (
                    <span className="chip-amber shrink-0">Mantenimiento</span>
                  ) : (
                    <span className="chip-danger shrink-0">Inactivo</span>
                  )}
                </div>

                {/* Details Box */}
                <div className="item-box space-y-2 mb-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="item-label">Empresa:</span>
                    <span className="item-value truncate max-w-[150px]">{bus.empresa || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="item-label">Capacidad:</span>
                    <span className="font-semibold text-sky-600 dark:text-sky-300">{bus.capacidad ? `${bus.capacidad} pasajeros` : '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="item-label">Último Mantenimiento:</span>
                    <span className="item-value">{bus.ultima_mantenimiento || '-'}</span>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => handleEdit(bus)}
                    className="btn-soft text-xs flex-1 py-1.5"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(bus.id_vehiculos || bus.id)}
                    className="btn-soft-rose text-xs flex-1 py-1.5"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <>
          <div className="modal-overlay" aria-hidden="true" onClick={() => setShowModal(false)}></div>
          <div className="modal-wrap">
            <div className="modal-sheet">
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingBus ? 'Editar Bus' : 'Registrar Nuevo Bus'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingBus(null);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="placa" className="field-label">
                        Placa
                      </label>
                      <input
                        type="text"
                        name="placa"
                        id="placa"
                        value={formData.placa}
                        onChange={handleInputChange}
                        className="field font-mono"
                        placeholder="ABC-123"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="modelo" className="field-label">
                        Modelo
                      </label>
                      <input
                        type="text"
                        name="modelo"
                        id="modelo"
                        value={formData.modelo}
                        onChange={handleInputChange}
                        className="field"
                        placeholder="Ej. Mercedes-Benz 2023"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="capacidad" className="field-label">
                        Capacidad (Pasajeros)
                      </label>
                      <input
                        type="number"
                        name="capacidad"
                        id="capacidad"
                        value={formData.capacidad}
                        onChange={handleInputChange}
                        className="field"
                        placeholder="Ej. 42"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="ultima_mantenimiento" className="field-label">
                        Último Mantenimiento
                      </label>
                      <input
                        type="date"
                        name="ultima_mantenimiento"
                        id="ultima_mantenimiento"
                        value={formData.ultima_mantenimiento}
                        onChange={handleInputChange}
                        className="field"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="estado" className="field-label">
                        Estado Operativo
                      </label>
                      <select
                        name="estado"
                        id="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        className="field"
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="mantenimiento">En Mantenimiento</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="empresa" className="field-label">
                        Empresa Operadora
                      </label>
                      <input
                        type="text"
                        name="empresa"
                        id="empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        className="field"
                        placeholder="Ej. Expreso CHEEMS"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="conductor_id" className="field-label">
                      ID del Conductor Asignado
                    </label>
                    <input
                      type="text"
                      name="conductor_id"
                      id="conductor_id"
                      value={formData.conductor_id}
                      onChange={handleInputChange}
                      className="field"
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                <div className="p-5 sm:px-6 bg-slate-100/70 dark:bg-slate-950/40 border-t border-slate-200 dark:border-white/10 flex flex-row-reverse gap-3">
                  <button
                    type="submit"
                    className="btn-primary flex-1 sm:flex-initial"
                  >
                    {editingBus ? 'Guardar Cambios' : 'Registrar Bus'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingBus(null);
                    }}
                    className="btn-secondary flex-1 sm:flex-initial"
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