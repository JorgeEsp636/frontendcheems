import React, { useState, useEffect } from 'react';
import transportService from '../services/transportService';

const TariffManagement = ({ user }) => {
  // Detectar admin con cualquier campo posible
  const isAdmin = user?.role === 'admin' || user?.rol === 3 || user?.rol_id === 3 || user?.roleId === 3;
  const [rates, setRates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRate, setEditingRate] = useState(null);
  const [editedData, setEditedData] = useState({
    zona_origen: '',
    zona_destino: '',
    precio_base: '',
    precio_km: ''
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRate, setNewRate] = useState({
    zona_origen: '',
    zona_destino: '',
    precio_base: '',
    precio_km: ''
  });

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      const ratesData = await transportService.getRates();
      setRates(ratesData);
    } catch (error) {
      console.error('Error al cargar las tarifas:', error);
    }
  };

  const handleEditRate = (rate) => {
    if (!isAdmin) return;
    setEditingRate(rate);
    setEditedData({
      zona_origen: rate.zona_origen,
      zona_destino: rate.zona_destino,
      precio_base: rate.precio_base,
      precio_km: rate.precio_km
    });
  };

  const handleSaveRate = async () => {
    if (!isAdmin) return;
    try {
      await transportService.updateRate(editingRate.id_tarifa, editedData);
      await loadRates();
      setEditingRate(null);
      alert('Tarifa actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar la tarifa:', error);
      alert('Error al actualizar la tarifa');
    }
  };

  const handleAddNew = async () => {
    if (!isAdmin) return;
    try {
      await transportService.createRate(newRate);
      await loadRates();
      setNewRate({
        zona_origen: '',
        zona_destino: '',
        precio_base: '',
        precio_km: ''
      });
      setIsAddingNew(false);
      alert('Tarifa agregada exitosamente');
    } catch (error) {
      console.error('Error al crear la tarifa:', error);
      alert('Error al crear la tarifa');
    }
  };

  const handleDeleteRate = async (id_tarifa) => {
    if (!isAdmin) return;
    if (window.confirm('¿Está seguro de eliminar esta tarifa?')) {
      try {
        await transportService.deleteRate(id_tarifa);
        await loadRates();
        alert('Tarifa eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar la tarifa:', error);
        alert('Error al eliminar la tarifa');
      }
    }
  };

  const filteredRates = rates.filter(rate =>
    rate.zona_destino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.zona_origen?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Tarifas</h2>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar por origen o destino..."
          className="w-1/3 px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isAdmin && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Agregar Tarifa
          </button>
        )}
      </div>

      {isAddingNew && isAdmin && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-4">Nueva Tarifa</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Zona Origen</label>
              <input
                type="text"
                value={newRate.zona_origen}
                onChange={(e) => setNewRate({...newRate, zona_origen: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese la zona de origen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zona Destino</label>
              <input
                type="text"
                value={newRate.zona_destino}
                onChange={(e) => setNewRate({...newRate, zona_destino: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese la zona de destino"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio Base</label>
              <input
                type="number"
                value={newRate.precio_base}
                onChange={(e) => setNewRate({...newRate, precio_base: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese el precio base"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio por KM</label>
              <input
                type="number"
                value={newRate.precio_km}
                onChange={(e) => setNewRate({...newRate, precio_km: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese el precio por kilómetro"
                min="0"
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

      {/* Tarjetas de tarifas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRates.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No hay tarifas registradas.</div>
        )}
        {filteredRates.map((rate) => (
          <div key={rate.id_tarifa} className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg text-blue-700">
                  {rate.zona_origen} → {rate.zona_destino}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${rate.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {rate.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Precio base:</span> {formatCurrency(rate.precio_base)}
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Precio por KM:</span> {formatCurrency(rate.precio_km)}
              </div>
              <div className="text-gray-500 text-xs mb-2">
                Última actualización: {rate.fecha_actualizacion ? new Date(rate.fecha_actualizacion).toLocaleString('es-CO') : '-'}
              </div>
            </div>
            {isAdmin && (
              <div className="flex space-x-2 mt-2">
                {editingRate?.id_tarifa === rate.id_tarifa ? (
                  <>
                    <button
                      onClick={handleSaveRate}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200 transition-colors text-sm"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingRate(null)}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditRate(rate)}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteRate(rate.id_tarifa)}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TariffManagement; 