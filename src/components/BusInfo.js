import React, { useState } from 'react';

const BusInfo = ({ buses, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
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
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newBus, setNewBus] = useState({
    number: '',
    model: '',
    plate: '',
    capacity: '',
    year: '',
    color: '',
    status: 'Operativo',
    lastMaintenance: ''
  });

  const handleEdit = (bus) => {
    if (!isAdmin) return;
    setEditingBus(bus);
    setEditedData(bus);
  };

  const handleSave = () => {
    if (!isAdmin) return;
    // Aquí iría la lógica para guardar los cambios
    setEditingBus(null);
    alert('Bus actualizado exitosamente');
  };

  const handleAddNew = () => {
    if (!isAdmin) return;
    if (newBus.number && newBus.model && newBus.plate && newBus.capacity) {
      // Aquí iría la lógica para agregar el nuevo bus
      setNewBus({
        number: '',
        model: '',
        plate: '',
        capacity: '',
        year: '',
        color: '',
        status: 'Operativo',
        lastMaintenance: ''
      });
      setIsAddingNew(false);
      alert('Bus agregado exitosamente');
    } else {
      alert('Por favor complete todos los campos requeridos');
    }
  };

  const handleDelete = (busNumber) => {
    if (!isAdmin) return;
    if (window.confirm('¿Está seguro de eliminar este bus?')) {
      // Aquí iría la lógica para eliminar el bus
      alert('Bus eliminado exitosamente');
    }
  };

  const filteredBuses = buses.filter(bus =>
    bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Buses</h2>
      
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar bus por número o placa..."
          className="w-1/3 px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isAdmin && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Agregar Nuevo Bus
          </button>
        )}
      </div>

      {isAddingNew && isAdmin && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-4">Nuevo Bus</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Número de Bus</label>
              <input
                type="text"
                value={newBus.number}
                onChange={(e) => setNewBus({...newBus, number: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese el número"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Modelo</label>
              <input
                type="text"
                value={newBus.model}
                onChange={(e) => setNewBus({...newBus, model: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese el modelo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Placa</label>
              <input
                type="text"
                value={newBus.plate}
                onChange={(e) => setNewBus({...newBus, plate: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese la placa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacidad</label>
              <input
                type="number"
                value={newBus.capacity}
                onChange={(e) => setNewBus({...newBus, capacity: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese la capacidad"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Año</label>
              <input
                type="number"
                value={newBus.year}
                onChange={(e) => setNewBus({...newBus, year: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese el año"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input
                type="text"
                value={newBus.color}
                onChange={(e) => setNewBus({...newBus, color: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese el color"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                value={newBus.status}
                onChange={(e) => setNewBus({...newBus, status: e.target.value})}
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
                value={newBus.lastMaintenance}
                onChange={(e) => setNewBus({...newBus, lastMaintenance: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
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
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modelo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Placa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Mantenimiento
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBuses.map((bus) => (
              <tr key={bus.number}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingBus?.number === bus.number ? (
                    <input
                      type="text"
                      value={editedData.number}
                      onChange={(e) => setEditedData({...editedData, number: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    bus.number
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingBus?.number === bus.number ? (
                    <input
                      type="text"
                      value={editedData.model}
                      onChange={(e) => setEditedData({...editedData, model: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    bus.model
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingBus?.number === bus.number ? (
                    <input
                      type="text"
                      value={editedData.plate}
                      onChange={(e) => setEditedData({...editedData, plate: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    bus.plate
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingBus?.number === bus.number ? (
                    <input
                      type="number"
                      value={editedData.capacity}
                      onChange={(e) => setEditedData({...editedData, capacity: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    bus.capacity
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingBus?.number === bus.number ? (
                    <select
                      value={editedData.status}
                      onChange={(e) => setEditedData({...editedData, status: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="Operativo">Operativo</option>
                      <option value="En Mantenimiento">En Mantenimiento</option>
                      <option value="Fuera de Servicio">Fuera de Servicio</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded text-sm ${
                      bus.status === 'Operativo' ? 'bg-green-100 text-green-800' :
                      bus.status === 'En Mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {bus.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingBus?.number === bus.number ? (
                    <input
                      type="date"
                      value={editedData.lastMaintenance}
                      onChange={(e) => setEditedData({...editedData, lastMaintenance: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    new Date(bus.lastMaintenance).toLocaleDateString()
                  )}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingBus?.number === bus.number ? (
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        Guardar
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(bus)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(bus.number)}
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

export default BusInfo; 