import React, { useState } from 'react';

const DriverInfo = ({ driverBusData: initialDriverBusData, userRole }) => {
  const [driverBusData, setDriverBusData] = useState(initialDriverBusData);
  const [editingDriver, setEditingDriver] = useState(null);
  const [editedData, setEditedData] = useState({
    driverName: '',
    driverId: '',
    contact: ''
  });

  const isAdmin = userRole === 'admin';

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setEditedData({
      driverName: driver.driverName,
      driverId: driver.driverId,
      contact: driver.contact
    });
  };

  const handleSave = () => {
    if (editingDriver && editedData.driverName && editedData.driverId && editedData.contact) {
      setDriverBusData(driverBusData.map(driver => 
        driver.driverId === editingDriver.driverId
          ? { ...driver, ...editedData }
          : driver
      ));
      setEditingDriver(null);
      alert('Conductor actualizado exitosamente');
    } else {
      alert('Por favor complete todos los campos');
    }
  };

  const handleDelete = (driverId) => {
    if (window.confirm('¿Está seguro de eliminar este conductor?')) {
      setDriverBusData(driverBusData.filter(driver => driver.driverId !== driverId));
      alert('Conductor eliminado exitosamente');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Información de Conductores</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {driverBusData.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm">
            {editingDriver?.driverId === item.driverId ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre del Conductor</label>
                  <input
                    type="text"
                    value={editedData.driverName}
                    onChange={(e) => setEditedData({...editedData, driverName: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Conductor</label>
                  <input
                    type="text"
                    value={editedData.driverId}
                    onChange={(e) => setEditedData({...editedData, driverId: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contacto</label>
                  <input
                    type="text"
                    value={editedData.contact}
                    onChange={(e) => setEditedData({...editedData, contact: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingDriver(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">Conductor: {item.driverName}</h3>
                <div className="space-y-1 text-gray-600">
                  <p><span className="font-medium">ID Conductor:</span> {item.driverId}</p>
                  <p><span className="font-medium">Contacto:</span> {item.contact}</p>
                  <p><span className="font-medium">Bus Asignado:</span> {item.busInfo.number}</p>
                </div>
                {isAdmin && (
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.driverId)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverInfo; 