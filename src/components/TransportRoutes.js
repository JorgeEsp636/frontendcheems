import React, { useState } from 'react';

const TransportRoutes = ({ routesData: initialRoutesData, userRole, onUpdateRoute, onDeleteRoute }) => {
  const [routesData, setRoutesData] = useState(initialRoutesData);
  const [editingRoute, setEditingRoute] = useState(null);
  const [editedData, setEditedData] = useState({ name: '', frequency: '', schedule: '', demand: 'high' });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRoute, setNewRoute] = useState({ name: '', frequency: '', schedule: '', demand: 'high' });

  const isAdmin = userRole === 'admin';

  const handleEdit = (route) => {
    if (!isAdmin) return;
    setEditingRoute(route);
    setEditedData({ name: route.name, frequency: route.frequency, schedule: route.schedule, demand: route.demand });
  };

  const handleSave = () => {
    if (!isAdmin) return;
    if (editingRoute && editedData.name && editedData.frequency && editedData.schedule && editedData.demand) {
      const updatedRoute = { ...editingRoute, ...editedData };
      // Update local state
      setRoutesData(routesData.map(route =>
        route.name === editingRoute.name ? updatedRoute : route
      ));
      // Call the update function passed from parent
      onUpdateRoute(updatedRoute);
      setEditingRoute(null);
      alert('Ruta actualizada exitosamente');
    } else {
      alert('Por favor complete todos los campos para la ruta');
    }
  };

  const handleAddNew = () => {
    if (!isAdmin) return;
    if (newRoute.name && newRoute.frequency && newRoute.schedule && newRoute.demand) {
      setRoutesData([...routesData, newRoute]);
      setNewRoute({ name: '', frequency: '', schedule: '', demand: 'high' });
      setIsAddingNew(false);
      alert('Ruta agregada exitosamente');
    } else {
      alert('Por favor complete todos los campos para la nueva ruta');
    }
  };

  const handleDelete = (routeName) => {
    if (!isAdmin) return;
    if (window.confirm(`¿Está seguro de eliminar la ruta ${routeName}?`)) {
      // Update local state
      setRoutesData(routesData.filter(route => route.name !== routeName));
      // Call the delete function passed from parent
      onDeleteRoute(routeName);
      alert('Ruta eliminada exitosamente');
    }
  };

  const origin = 'Ubaté';

  // Group routes by demand
  const routesByDemand = routesData.reduce((acc, route) => {
    acc[route.demand] = [...(acc[route.demand] || []), route];
    return acc;
  }, {});

  const demandOrder = ['high', 'medium', 'low'];

  const getDemandTitle = (demand) => {
    switch (demand) {
      case 'high': return '🟢 Rutas de Alta Demanda';
      case 'medium': return '🟡 Rutas de Demanda Media';
      case 'low': return '🔵 Rutas de Baja Demanda';
      default: return '';
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isAdmin && (
        <div className="mb-6">
          {!isAddingNew ? (
            <button
              onClick={() => setIsAddingNew(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Agregar Nueva Ruta
            </button>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-semibold mb-4">Nueva Ruta</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre de la Ruta</label>
                  <input
                    type="text"
                    value={newRoute.name}
                    onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frecuencia</label>
                  <input
                    type="text"
                    value={newRoute.frequency}
                    onChange={(e) => setNewRoute({...newRoute, frequency: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Horario</label>
                  <input
                    type="text"
                    value={newRoute.schedule}
                    onChange={(e) => setNewRoute({...newRoute, schedule: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Demanda</label>
                  <select
                    value={newRoute.demand}
                    onChange={(e) => setNewRoute({...newRoute, demand: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    required
                  >
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                </div>
                <div className="flex space-x-2">
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
            </div>
          )}
        </div>
      )}

      {demandOrder.map(demand => routesByDemand[demand] && (
        <div key={demand} className="mb-8">
          <h2 className={`text-2xl font-bold mb-4 ${getDemandColor(demand)}`}>{getDemandTitle(demand)}</h2>
          <div className="grid gap-4">
            {routesByDemand[demand].map((route, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                {editingRoute?.name === route.name ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre de la Ruta</label>
                      <input
                        type="text"
                        value={editedData.name}
                        onChange={(e) => setEditedData({...editedData, name: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Frecuencia</label>
                      <input
                        type="text"
                        value={editedData.frequency}
                        onChange={(e) => setEditedData({...editedData, frequency: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Horario</label>
                      <input
                        type="text"
                        value={editedData.schedule}
                        onChange={(e) => setEditedData({...editedData, schedule: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Demanda</label>
                      <select
                        value={editedData.demand}
                        onChange={(e) => setEditedData({...editedData, demand: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                        required
                      >
                        <option value="high">Alta</option>
                        <option value="medium">Media</option>
                        <option value="low">Baja</option>
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingRoute(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg mb-2">Desde {origin} a: {route.name}</h3>
                    <p className="text-gray-600">Frecuencia: {route.frequency}</p>
                    <p className="text-gray-600">Horario: {route.schedule}</p>
                    {isAdmin && (
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => handleEdit(route)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(route.name)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
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
      ))}
    </div>
  );
};

export default TransportRoutes; 