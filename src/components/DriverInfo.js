import React, { useState, useEffect } from 'react';
import transportService from '../services/transportService';

const DriverInfo = ({ drivers, onCreateDriver, onUpdateDriver, onDeleteDriver, isAdmin }) => {
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

  const loadDrivers = async () => {
    try {
      const driversData = await transportService.getDrivers();
      setDrivers(driversData || []);
    } catch (error) {
      console.error('Error al cargar los conductores:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        id_vehiculos: parseInt(formData.id_vehiculos)
      };
      if (editingDriver) {
        await onUpdateDriver(editingDriver.id_conductor, dataToSend);
      } else {
        await onCreateDriver(dataToSend);
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
      nombre: driver.nombre,
      documento: driver.documento,
      licencia_conduccion: driver.licencia_conduccion,
      telefono: driver.telefono,
      email: driver.email,
      estado: driver.estado,
      id_vehiculos: driver.id_vehiculos
    });
    setShowModal(true);
  };

  const handleDelete = async (driverId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este conductor?')) {
      try {
        await onDeleteDriver(driverId);
        await loadDrivers();
      } catch (error) {
        console.error('Error al eliminar el conductor:', error);
      }
    }
  };

  return (
    <div className="card card-pad">
      <div className="flex justify-between items-center mb-4">
        <h3 className="card-title">Conductores</h3>
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
            Agregar Conductor
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No hay conductores registrados.</div>
        )}
        {drivers.map((driver) => (
          <div key={driver.id_conductor} className="card brand-gradient-fill p-4 flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg text-white">
                    {driver.nombre ? driver.nombre : '-'}
                  </span>
                  {driver.estado === 'activo' ? (
                    <span className="chip-on-dark-success">Activo</span>
                  ) : (
                    <span className="chip-on-dark-danger">Inactivo</span>
                  )}
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Documento:</span> {driver.documento ? driver.documento : '-'}
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Licencia:</span> {driver.licencia_conduccion ? driver.licencia_conduccion : '-'}
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Teléfono:</span> {driver.telefono ? driver.telefono : '-'}
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Email:</span> {driver.email ? driver.email : '-'}
                </div>
              </div>
              {isAdmin && (
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEdit(driver)}
                    className="btn-soft px-3 py-1.5 text-sm bg-white/15 text-white border-white/20 hover:bg-white/20 focus:ring-white/30"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(driver.id_conductor)}
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
                    <label htmlFor="nombre" className="field-label">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="documento" className="field-label">
                      Documento de Identidad
                    </label>
                    <input
                      type="text"
                      name="documento"
                      id="documento"
                      value={formData.documento}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="licencia_conduccion" className="field-label">
                      Número de Licencia
                    </label>
                    <input
                      type="text"
                      name="licencia_conduccion"
                      id="licencia_conduccion"
                      value={formData.licencia_conduccion}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="telefono" className="field-label">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      id="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="field-label">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
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
                    </select>
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
                    {editingDriver ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingDriver(null);
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

export default DriverInfo; 