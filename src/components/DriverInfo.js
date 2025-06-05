import React, { useState } from 'react';

const DriverInfo = ({ drivers, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDriver, setEditingDriver] = useState(null);
  const [editedData, setEditedData] = useState({
    driverName: '',
    driverId: '',
    contact: '',
    busInfo: {
      number: '',
      model: '',
      plate: '',
      capacity: '',
      year: '',
      color: '',
      status: '',
      lastMaintenance: ''
    }
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDriver, setNewDriver] = useState({
    driverName: '',
    driverId: '',
    contact: '',
    busInfo: {
      number: '',
      model: '',
      plate: '',
      capacity: '',
      year: '',
      color: '',
      status: 'Operativo',
      lastMaintenance: ''
    }
  });

  const handleEdit = (driver) => {
    if (!isAdmin) return;
    setEditingDriver(driver);
    setEditedData(driver);
  };

  const handleSave = () => {
    if (!isAdmin) return;
    // Aquí iría la lógica para guardar los cambios
    setEditingDriver(null);
    alert('Conductor actualizado exitosamente');
  };

  const handleAddNew = () => {
    if (!isAdmin) return;
    if (newDriver.driverName && newDriver.driverId && newDriver.contact) {
      // Aquí iría la lógica para agregar el nuevo conductor
      setNewDriver({
        driverName: '',
        driverId: '',
        contact: '',
        busInfo: {
          number: '',
          model: '',
          plate: '',
          capacity: '',
          year: '',
          color: '',
          status: 'Operativo',
          lastMaintenance: ''
        }
      });
      setIsAddingNew(false);
      alert('Conductor agregado exitosamente');
    } else {
      alert('Por favor complete todos los campos requeridos');
    }
  };

  const handleDelete = (driverId) => {
    if (!isAdmin) return;
    if (window.confirm('¿Está seguro de eliminar este conductor?')) {
      // Aquí iría la lógica para eliminar el conductor
      alert('Conductor eliminado exitosamente');
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.driverId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Conductores</h2>
      
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar conductor por nombre o ID..."
          className="w-1/3 px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isAdmin && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Agregar Nuevo Conductor
          </button>
        )}
      </div>

      {isAddingNew && isAdmin && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-4">Nuevo Conductor</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Conductor</label>
              <input
                type="text"
                value={newDriver.driverName}
                onChange={(e) => setNewDriver({...newDriver, driverName: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese el nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID del Conductor</label>
              <input
                type="text"
                value={newDriver.driverId}
                onChange={(e) => setNewDriver({...newDriver, driverId: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese el ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contacto</label>
              <input
                type="text"
                value={newDriver.contact}
                onChange={(e) => setNewDriver({...newDriver, contact: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese el contacto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bus Asignado</label>
              <input
                type="text"
                value={newDriver.busInfo.number}
                onChange={(e) => setNewDriver({
                  ...newDriver,
                  busInfo: {...newDriver.busInfo, number: e.target.value}
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese el número del bus"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleAddNew}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Guardar
            </button>
            <button
              onClick={() => setIsAddingNew(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conductor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bus Asignado
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDrivers.map((driver) => (
              <tr key={driver.driverId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingDriver?.driverId === driver.driverId ? (
                    <input
                      type="text"
                      value={editedData.driverName}
                      onChange={(e) => setEditedData({...editedData, driverName: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    driver.driverName
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{driver.driverId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingDriver?.driverId === driver.driverId ? (
                    <input
                      type="text"
                      value={editedData.contact}
                      onChange={(e) => setEditedData({...editedData, contact: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    driver.contact
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {driver.busInfo.number} - {driver.busInfo.model}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingDriver?.driverId === driver.driverId ? (
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        Guardar
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(driver)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(driver.driverId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverInfo; 