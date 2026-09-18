import React, { useState, useEffect } from 'react';
import transportService from '../services/transportService';

const DriverInfo = ({ drivers: propDrivers = [], onCreateDriver, onUpdateDriver, onDeleteDriver, isAdmin }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    licencia_conduccion: '',
    telefono: '',
    email: '',
    estado: 'activo',
    id_vehiculos: ''
  });
  const [vehiculos, setVehiculos] = useState([]);
  const [drivers, setDrivers] = useState(propDrivers || []);

  const loadDrivers = async () => {
    try {
      const driversData = await transportService.getDrivers();
      setDrivers(driversData || []);
    } catch (error) {
      console.error('Error al cargar los conductores:', error);
    }
  };

  useEffect(() => {
    if (propDrivers && propDrivers.length > 0) {
      setDrivers(propDrivers);
    } else {
      loadDrivers();
    }
  }, [propDrivers]);

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    if (showModal) {
      transportService.getBuses && transportService.getBuses().then(setVehiculos);
    }
  }, [showModal]);

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
      const dataToSend = {
        ...formData,
        id_vehiculos: formData.id_vehiculos ? parseInt(formData.id_vehiculos) : null
      };
      if (editingDriver) {
        const driverId = editingDriver.id_conductor || editingDriver.id;
        if (onUpdateDriver) {
          await onUpdateDriver(driverId, dataToSend);
        }
      } else {
        if (onCreateDriver) {
          await onCreateDriver(dataToSend);
        }
      }
      await loadDrivers();
      setShowModal(false);
      setEditingDriver(null);
      setFormData({
        nombre: '',
        documento: '',
        licencia_conduccion: '',
        telefono: '',
        email: '',
        estado: 'activo',
        id_vehiculos: ''
      });
    } catch (error) {
      console.error('Error al guardar el conductor:', error);
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      nombre: driver.nombre || '',
      documento: driver.documento || '',
      licencia_conduccion: driver.licencia_conduccion || '',
      telefono: driver.telefono || '',
      email: driver.email || '',
      estado: driver.estado || 'activo',
      id_vehiculos: driver.id_vehiculos || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (driverId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este conductor?')) {
      try {
        if (onDeleteDriver) {
          await onDeleteDriver(driverId);
        }
        await loadDrivers();
      } catch (error) {
        console.error('Error al eliminar el conductor:', error);
      }
    }
  };

  return (
    <div className="card card-pad">
      <div className="glass-card-header">
        <div>
          <h3 className="card-title text-xl font-bold">
            <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sm">👤</span>
            Conductores
          </h3>
          <p className="text-xs text-slate-400 mt-1">Directorio y estado del personal de conducción</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingDriver(null);
              setFormData({
                nombre: '',
                documento: '',
                licencia_conduccion: '',
                telefono: '',
                email: '',
                estado: 'activo',
                id_vehiculos: ''
              });
              setShowModal(true);
            }}
            className="btn-primary"
          >
            + Agregar Conductor
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {drivers.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
            <div className="text-4xl mb-2">🧑‍✈️</div>
            No hay conductores registrados actualmente.
          </div>
        )}
        {drivers.map((driver, idx) => {
          const driverId = driver.id_conductor || driver.id || idx;
          return (
            <div
              key={driverId}
              className="item-card group"
            >
              <div>
                {/* Driver Header & Avatar */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-400/30 flex items-center justify-center font-bold text-sky-600 dark:text-sky-300 text-lg shadow-inner">
                      {(driver.nombre || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="item-title">
                        {driver.nombre || 'Conductor'}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Doc: {driver.documento || '-'}
                      </div>
                    </div>
                  </div>
                  {driver.estado === 'activo' ? (
                    <span className="chip-success shrink-0">Activo</span>
                  ) : (
                    <span className="chip-danger shrink-0">Inactivo</span>
                  )}
                </div>

                {/* Information Rows */}
                <div className="item-box space-y-2 mb-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="item-label">Licencia:</span>
                    <span className="item-value">{driver.licencia_conduccion || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="item-label">Teléfono:</span>
                    <span className="item-value">{driver.telefono || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="item-label">Email:</span>
                    <span className="item-value truncate max-w-[150px]">{driver.email || '-'}</span>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => handleEdit(driver)}
                    className="btn-soft text-xs flex-1 py-1.5"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(driver.id_conductor || driver.id)}
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
                  {editingDriver ? 'Editar Conductor' : 'Registrar Conductor'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingDriver(null);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <label htmlFor="nombre" className="field-label">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="field"
                      placeholder="Ej. Juan Carlos Pérez"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="documento" className="field-label">
                        Documento de Identidad
                      </label>
                      <input
                        type="text"
                        name="documento"
                        id="documento"
                        value={formData.documento}
                        onChange={handleInputChange}
                        className="field"
                        placeholder="Ej. 1020304050"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="licencia_conduccion" className="field-label">
                        Número de Licencia
                      </label>
                      <input
                        type="text"
                        name="licencia_conduccion"
                        id="licencia_conduccion"
                        value={formData.licencia_conduccion}
                        onChange={handleInputChange}
                        className="field"
                        placeholder="Ej. C2-987654321"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="telefono" className="field-label">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        id="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="field"
                        placeholder="310 123 4567"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="field-label">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="field"
                        placeholder="conductor@transporte.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="estado" className="field-label">
                        Estado
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
                      </select>
                    </div>
                    <div>
                      <label htmlFor="id_vehiculos" className="field-label">
                        Vehículo Asignado
                      </label>
                      <select
                        name="id_vehiculos"
                        id="id_vehiculos"
                        value={formData.id_vehiculos}
                        onChange={handleInputChange}
                        className="field"
                      >
                        <option value="">Sin vehículo asignado</option>
                        {vehiculos.map((vehiculo) => (
                          <option key={vehiculo.id_vehiculos} value={vehiculo.id_vehiculos}>
                            {vehiculo.placa} - {vehiculo.empresa}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:px-6 bg-slate-100/70 dark:bg-slate-950/40 border-t border-slate-200 dark:border-white/10 flex flex-row-reverse gap-3">
                  <button
                    type="submit"
                    className="btn-primary flex-1 sm:flex-initial"
                  >
                    {editingDriver ? 'Guardar Cambios' : 'Registrar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingDriver(null);
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

export default DriverInfo; 