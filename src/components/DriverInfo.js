import React, { useState } from 'react';

const DriverInfo = ({ drivers }) => {
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

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setEditedData(driver);
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    setEditingDriver(null);
    alert('Conductor actualizado exitosamente');
  };

  const handleDelete = (driverId) => {
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
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar conductor por nombre o ID..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverInfo; 