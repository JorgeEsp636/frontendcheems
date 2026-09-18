import React, { useState } from 'react';

const RateInfo = ({ rates, onCreateRate, onUpdateRate, onDeleteRate, isAdmin }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({
    zona_origen: '',
    zona_destino: '',
    precio_base: '',
    precio_km: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRate) {
        await onUpdateRate(editingRate.id, formData);
      } else {
        await onCreateRate(formData);
      }
      setShowModal(false);
      setEditingRate(null);
      setFormData({
        zona_origen: '',
        zona_destino: '',
        precio_base: '',
        precio_km: ''
      });
    } catch (error) {
      console.error('Error al guardar la tarifa:', error);
    }
  };

  const handleEdit = (rate) => {
    setEditingRate(rate);
    setFormData({
      zona_origen: rate.zona_origen,
      zona_destino: rate.zona_destino,
      precio_base: rate.precio_base,
      precio_km: rate.precio_km
    });
    setShowModal(true);
  };

  const handleDelete = async (rateId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta tarifa?')) {
      try {
        await onDeleteRate(rateId);
      } catch (error) {
        console.error('Error al eliminar la tarifa:', error);
      }
    }
  };

  return (
    <div className="card card-pad">
      <div className="glass-card-header">
        <div>
          <h3 className="card-title text-xl font-bold">
            <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sm">💳</span>
            Tarifas
          </h3>
          <p className="text-xs text-slate-400 mt-1">Configuración tarifaria por trayecto</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingRate(null);
              setFormData({
                zona_origen: '',
                zona_destino: '',
                precio_base: '',
                precio_km: ''
              });
              setShowModal(true);
            }}
            className="btn-primary"
          >
            + Agregar Tarifa
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rates.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
            <div className="text-4xl mb-2">💳</div>
            No hay tarifas registradas actualmente.
          </div>
        )}
        {rates.map((rate, idx) => (
          <div
            key={rate.id_tarifa || rate.id || idx}
            className="item-card group"
          >
            <div className="flex justify-between items-start gap-2 mb-3">
              <h4 className="item-title">
                {rate.zona_origen || '-'} → {rate.zona_destino || '-'}
              </h4>
              {rate.activa ? (
                <span className="chip-success shrink-0">Activa</span>
              ) : (
                <span className="chip-danger shrink-0">Inactiva</span>
              )}
            </div>

            <div className="item-box grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <span className="item-label block">Precio Base:</span>
                <span className="font-bold text-sky-600 dark:text-sky-300 text-sm">${rate.precio_base || 0}</span>
              </div>
              <div>
                <span className="item-label block">Precio/KM:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-300 text-sm">${rate.precio_km || 0}</span>
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  onClick={() => handleEdit(rate)}
                  className="btn-soft text-xs flex-1 py-1.5"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(rate.id_tarifa || rate.id)}
                  className="btn-soft-rose text-xs flex-1 py-1.5"
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && isAdmin && (
        <>
          <div className="modal-overlay" aria-hidden="true" onClick={() => setShowModal(false)}></div>
          <div className="modal-wrap">
            <div className="modal-sheet">
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingRate ? 'Editar Tarifa' : 'Nueva Tarifa'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingRate(null);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label htmlFor="zona_origen" className="field-label">
                      Zona de Origen
                    </label>
                    <input
                      type="text"
                      name="zona_origen"
                      id="zona_origen"
                      value={formData.zona_origen}
                      onChange={handleInputChange}
                      className="field"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="zona_destino" className="field-label">
                      Zona de Destino
                    </label>
                    <input
                      type="text"
                      name="zona_destino"
                      id="zona_destino"
                      value={formData.zona_destino}
                      onChange={handleInputChange}
                      className="field"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="precio_base" className="field-label">
                        Precio Base
                      </label>
                      <input
                        type="number"
                        name="precio_base"
                        id="precio_base"
                        value={formData.precio_base}
                        onChange={handleInputChange}
                        className="field"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="precio_km" className="field-label">
                        Precio por KM
                      </label>
                      <input
                        type="number"
                        name="precio_km"
                        id="precio_km"
                        value={formData.precio_km}
                        onChange={handleInputChange}
                        className="field"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:px-6 bg-slate-100/70 dark:bg-slate-950/40 border-t border-slate-200 dark:border-white/10 flex flex-row-reverse gap-3">
                  <button
                    type="submit"
                    className="btn-primary flex-1 sm:flex-initial"
                  >
                    {editingRate ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingRate(null);
                    }}
                    className="btn-secondary flex-1 sm:flex-initial"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RateInfo; 