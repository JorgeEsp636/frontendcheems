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
    <div className="card card-pad">
      <h2 className="card-title mb-4">Gestión de Tarifas</h2>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar por origen o destino..."
          className="field w-1/2 sm:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isAdmin && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="btn-primary"
          >
            Agregar Tarifa
          </button>
        )}
      </div>

      {isAddingNew && isAdmin && (
        <div className="surface rounded-2xl p-4 sm:p-5 mb-4 bg-slate-50">
          <h3 className="text-base sm:text-lg font-bold mb-4">Nueva Tarifa</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Zona Origen</label>
              <input
                type="text"
                value={newRate.zona_origen}
                onChange={(e) => setNewRate({...newRate, zona_origen: e.target.value})}
                className="field mt-1"
                placeholder="Ingrese la zona de origen"
              />
            </div>
            <div>
              <label className="field-label">Zona Destino</label>
              <input
                type="text"
                value={newRate.zona_destino}
                onChange={(e) => setNewRate({...newRate, zona_destino: e.target.value})}
                className="field mt-1"
                placeholder="Ingrese la zona de destino"
              />
            </div>
            <div>
              <label className="field-label">Precio Base</label>
              <input
                type="number"
                value={newRate.precio_base}
                onChange={(e) => setNewRate({...newRate, precio_base: e.target.value})}
                className="field mt-1"
                placeholder="Ingrese el precio base"
                min="0"
              />
            </div>
            <div>
              <label className="field-label">Precio por KM</label>
              <input
                type="number"
                value={newRate.precio_km}
                onChange={(e) => setNewRate({...newRate, precio_km: e.target.value})}
                className="field mt-1"
                placeholder="Ingrese el precio por kilómetro"
                min="0"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleAddNew}
              className="btn-primary"
            >
              Guardar
            </button>
            <button
              onClick={() => setIsAddingNew(false)}
              className="btn-secondary"
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
          <div key={rate.id_tarifa} className="card brand-gradient-fill p-4 flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg text-white">
                    {rate.zona_origen} → {rate.zona_destino}
                  </span>
                  {rate.activa ? (
                    <span className="chip-on-dark-success">Activa</span>
                  ) : (
                    <span className="chip-on-dark-danger">Inactiva</span>
                  )}
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Precio base:</span> {formatCurrency(rate.precio_base)}
                </div>
                <div className="text-white/90 mb-1">
                  <span className="font-semibold text-white">Precio por KM:</span> {formatCurrency(rate.precio_km)}
                </div>
                <div className="text-white/70 text-xs mb-2">
                  Última actualización: {rate.fecha_actualizacion ? new Date(rate.fecha_actualizacion).toLocaleString('es-CO') : '-'}
                </div>
              </div>
              {isAdmin && (
                <div className="flex space-x-2 mt-2">
                  {editingRate?.id_tarifa === rate.id_tarifa ? (
                    <>
                      <button
                        onClick={handleSaveRate}
                        className="btn-soft px-3 py-1.5 text-sm bg-white/15 text-white border-white/20 hover:bg-white/20 focus:ring-white/30"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingRate(null)}
                        className="btn-soft px-3 py-1.5 text-sm bg-white/10 text-white border-white/20 hover:bg-white/15 focus:ring-white/30"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditRate(rate)}
                        className="btn-soft px-3 py-1.5 text-sm bg-white/15 text-white border-white/20 hover:bg-white/20 focus:ring-white/30"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteRate(rate.id_tarifa)}
                        className="btn-soft px-3 py-1.5 text-sm bg-rose-500/20 text-white border-rose-200/30 hover:bg-rose-500/25 focus:ring-white/30"
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