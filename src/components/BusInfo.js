import React, { useState } from 'react';

const BusInfo = ({ driverBusData: initialDriverBusData, userRole }) => {
  const [driverBusData, setDriverBusData] = useState(initialDriverBusData);
  const [editingBus, setEditingBus] = useState(null);
  const [editedData, setEditedData] = useState({
    number: '',
    model: '',
    plate: '',
    capacity: '',
    year: '',
    color: '',
    status: '',
    lastMaintenance: ''
  });

  const isAdmin = userRole === 'admin';
  // Extract bus info from driverBusData
  const busData = driverBusData.map(item => item.busInfo);

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setEditedData({
      number: bus.number,
      model: bus.model,
      plate: bus.plate,
      capacity: bus.capacity.toString(),
      year: bus.year.toString(),
      color: bus.color,
      status: bus.status,
      lastMaintenance: bus.lastMaintenance
    });
  };

  const handleSave = () => {
    if (editingBus && editedData.number && editedData.model && editedData.plate) {
      const updatedBusData = {
        ...editedData,
        capacity: parseInt(editedData.capacity),
        year: parseInt(editedData.year)
      };

      setDriverBusData(driverBusData.map(item => 
        item.busInfo.number === editingBus.number
          ? { ...item, busInfo: updatedBusData }
          : item
      ));
      setEditingBus(null);
      alert('Bus actualizado exitosamente');
    } else {
      alert('Por favor complete todos los campos requeridos');
    }
  };

  const handleDelete = (busNumber) => {
    if (window.confirm('¿Está seguro de eliminar este bus?')) {
      setDriverBusData(driverBusData.filter(item => item.busInfo.number !== busNumber));
      alert('Bus eliminado exitosamente');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Información de Buses</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {busData.map((bus, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm">
            {editingBus?.number === bus.number ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de Bus</label>
                  <input
                    type="text"
                    value={editedData.number}
                    onChange={(e) => setEditedData({...editedData, number: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Modelo</label>
                  <input
                    type="text"
                    value={editedData.model}
                    onChange={(e) => setEditedData({...editedData, model: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Placa</label>
                  <input
                    type="text"
                    value={editedData.plate}
                    onChange={(e) => setEditedData({...editedData, plate: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacidad</label>
                  <input
                    type="number"
                    value={editedData.capacity}
                    onChange={(e) => setEditedData({...editedData, capacity: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Año</label>
                  <input
                    type="number"
                    value={editedData.year}
                    onChange={(e) => setEditedData({...editedData, year: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <input
                    type="text"
                    value={editedData.color}
                    onChange={(e) => setEditedData({...editedData, color: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    value={editedData.status}
                    onChange={(e) => setEditedData({...editedData, status: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  >
                    <option value="Operativo">Operativo</option>
                    <option value="En Mantenimiento">En Mantenimiento</option>
                    <option value="Fuera de Servicio">Fuera de Servicio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Último Mantenimiento</label>
                  <input
                    type="date"
                    value={editedData.lastMaintenance}
                    onChange={(e) => setEditedData({...editedData, lastMaintenance: e.target.value})}
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
                    onClick={() => setEditingBus(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">Bus: {bus.number}</h3>
                <div className="space-y-1 text-gray-600">
                  <p><span className="font-medium">Modelo:</span> {bus.model}</p>
                  <p><span className="font-medium">Placa:</span> {bus.plate}</p>
                  <p><span className="font-medium">Capacidad:</span> {bus.capacity} pasajeros</p>
                  <p><span className="font-medium">Año:</span> {bus.year}</p>
                  <p><span className="font-medium">Color:</span> {bus.color}</p>
                  <p><span className="font-medium">Estado:</span> {bus.status}</p>
                  <p><span className="font-medium">Último Mantenimiento:</span> {bus.lastMaintenance}</p>
                </div>
                {isAdmin && (
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(bus)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(bus.number)}
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

export default BusInfo; 