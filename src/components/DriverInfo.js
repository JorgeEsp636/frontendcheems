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
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Conductores</h3>
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
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
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
          <div key={driver.id_conductor} className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg text-blue-700">
                  {driver.nombre ? driver.nombre : '-'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${driver.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {driver.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Documento:</span> {driver.documento ? driver.documento : '-'}
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Licencia:</span> {driver.licencia_conduccion ? driver.licencia_conduccion : '-'}
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Teléfono:</span> {driver.telefono ? driver.telefono : '-'}
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Email:</span> {driver.email ? driver.email : '-'}
              </div>
            </div>
            {isAdmin && (
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(driver)}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 transition-colors text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(driver.id_conductor)}
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
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="documento" className="block text-sm font-medium text-gray-700">
                      Documento de Identidad
                    </label>
                    <input
                      type="text"
                      name="documento"
                      id="documento"
                      value={formData.documento}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="licencia_conduccion" className="block text-sm font-medium text-gray-700">
                      Número de Licencia
                    </label>
                    <input
                      type="text"
                      name="licencia_conduccion"
                      id="licencia_conduccion"
                      value={formData.licencia_conduccion}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      id="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
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
                    </select>
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
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                    {editingDriver ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingDriver(null);
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

export default DriverInfo; 