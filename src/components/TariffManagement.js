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
      <div className="glass-card-header flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="card-title text-xl font-bold">
            <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sm">💳</span>
            Gestión de Tarifas
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configuración de precios base y tarifas por kilómetro</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Buscar origen o destino..."
              className="field pl-9 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsAddingNew(true)}
              className="btn-primary text-xs shrink-0"
            >
              + Nueva Tarifa
            </button>
          )}
        </div>
      </div>

      {isAddingNew && isAdmin && (
        <div className="p-6 rounded-3xl bg-slate-800/80 backdrop-blur-2xl border border-sky-400/40 shadow-glass-glow mb-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>✨</span> Registrar Nueva Tarifa
            </h3>
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕ Cerrar
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="field-label text-xs">Zona Origen</label>
              <input
                type="text"
                value={newRate.zona_origen}
                onChange={(e) => setNewRate({...newRate, zona_origen: e.target.value})}
                className="field"
                placeholder="Ej. Centro"
              />
            </div>
            <div>
              <label className="field-label text-xs">Zona Destino</label>
              <input
                type="text"
                value={newRate.zona_destino}
                onChange={(e) => setNewRate({...newRate, zona_destino: e.target.value})}
                className="field"
                placeholder="Ej. Norte"
              />
            </div>
            <div>
              <label className="field-label text-xs">Precio Base (COP)</label>
              <input
                type="number"
                value={newRate.precio_base}
                onChange={(e) => setNewRate({...newRate, precio_base: e.target.value})}
                className="field"
                placeholder="Ej. 2800"
                min="0"
              />
            </div>
            <div>
              <label className="field-label text-xs">Precio por KM (COP)</label>
              <input
                type="number"
                value={newRate.precio_km}
                onChange={(e) => setNewRate({...newRate, precio_km: e.target.value})}
                className="field"
                placeholder="Ej. 150"
                min="0"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsAddingNew(false)}
              className="btn-secondary text-xs"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddNew}
              className="btn-primary text-xs"
            >
              Guardar Tarifa
            </button>
          </div>
        </div>
      )}

      {/* Tarjetas de tarifas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRates.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
            <div className="text-4xl mb-2">🏷️</div>
            No se encontraron tarifas que coincidan con la búsqueda.
          </div>
        )}
        {filteredRates.map((rate) => (
          <div
            key={rate.id_tarifa}
            className="item-card group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h4 className="item-title">
                  {rate.zona_origen} → {rate.zona_destino}
                </h4>
                {rate.activa ? (
                  <span className="chip-success shrink-0">Activa</span>
                ) : (
                  <span className="chip-danger shrink-0">Inactiva</span>
                )}
              </div>

              {/* Price Breakdown Cards */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="item-box">
                  <div className="item-label">Precio Base</div>
                  <div className="text-base font-extrabold text-sky-600 dark:text-sky-300 mt-0.5">
                    {formatCurrency(rate.precio_base)}
                  </div>
                </div>
                <div className="item-box">
                  <div className="item-label">Precio / KM</div>
                  <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-300 mt-0.5">
                    {formatCurrency(rate.precio_km)}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                Actualizado: {rate.fecha_actualizacion ? new Date(rate.fecha_actualizacion).toLocaleDateString('es-CO') : 'Reciente'}
              </div>
            </div>

            {isAdmin && (
              <div className="pt-3 mt-2 border-t border-slate-200 dark:border-white/10">
                {editingRate?.id_tarifa === rate.id_tarifa ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={editedData.precio_base}
                        onChange={(e) => setEditedData({...editedData, precio_base: e.target.value})}
                        className="field text-xs"
                        placeholder="Precio Base"
                      />
                      <input
                        type="number"
                        value={editedData.precio_km}
                        onChange={(e) => setEditedData({...editedData, precio_km: e.target.value})}
                        className="field text-xs"
                        placeholder="Precio / KM"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveRate}
                        className="btn-primary text-xs flex-1 py-1.5"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingRate(null)}
                        className="btn-secondary text-xs flex-1 py-1.5"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditRate(rate)}
                      className="btn-soft text-xs flex-1 py-1.5"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteRate(rate.id_tarifa)}
                      className="btn-soft-rose text-xs flex-1 py-1.5"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
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