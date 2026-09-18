import React, { useState, useEffect } from 'react';
import transportService from '../services/transportService';
import RouteMapModal from './RouteMapModal';
import RouteMapView from './RouteMapView';

const TransportRoutes = ({ routes: propRoutes = [], isAdmin, onCreateRoute, onUpdateRoute, onDeleteRoute }) => {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'map'
  const [selectedMapRoute, setSelectedMapRoute] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    nombre_ruta: '',
    origen: '',
    destino: '',
    horario: '',
    duracion: '',
    distancia: '',
    id_vehiculos: ''
  });
  const [vehiculos, setVehiculos] = useState([]);
  const [routes, setRoutes] = useState(propRoutes || []);

  const loadRoutes = async () => {
    try {
      const routesData = await transportService.getRoutes();
      setRoutes(routesData || []);
    } catch (error) {
      console.error('Error al cargar las rutas:', error);
    }
  };

  useEffect(() => {
    if (propRoutes && propRoutes.length > 0) {
      setRoutes(propRoutes);
    } else {
      loadRoutes();
    }
  }, [propRoutes]);

  useEffect(() => {
    loadRoutes();
    // Pre-cargar vehículos para la información del mapa
    if (transportService.getBuses) {
      transportService.getBuses().then(data => setVehiculos(data || [])).catch(() => {});
    }
  }, []);

  useEffect(() => {
    // Cargar vehículos al abrir el modal de creación/edición
    if (showModal) {
      transportService.getBuses && transportService.getBuses().then(setVehiculos);
    }
  }, [showModal]);

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
      let horarioValue = formData.horario;
      // Si el campo está vacío, lo envío como null
      if (!horarioValue || horarioValue.trim() === '') {
        horarioValue = null;
      } else {
        // Si tiene segundos, los quito
        const match = horarioValue.match(/^\d{2}:\d{2}/);
        horarioValue = match ? match[0] : horarioValue;
      }
      const dataToSend = {
        ...formData,
        horario: horarioValue,
        id_vehiculos: formData.id_vehiculos ? parseInt(formData.id_vehiculos) : null
      };
      if (editingRoute) {
        const routeId = editingRoute.id_ruta || editingRoute.id;
        if (onUpdateRoute) {
          await onUpdateRoute(routeId, dataToSend);
        }
      } else {
        if (onCreateRoute) {
          await onCreateRoute(dataToSend);
        }
      }
      await loadRoutes();
      setShowModal(false);
      setEditingRoute(null);
      setFormData({
        nombre_ruta: '',
        origen: '',
        destino: '',
        horario: '',
        duracion: '',
        distancia: '',
        id_vehiculos: ''
      });
    } catch (error) {
      console.error('Error al guardar la ruta:', error);
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      nombre_ruta: route.nombre_ruta || '',
      origen: route.origen || '',
      destino: route.destino || '',
      horario: route.horario || '',
      duracion: route.duracion || '',
      distancia: route.distancia || '',
      id_vehiculos: route.id_vehiculos || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (routeId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta ruta?')) {
      try {
        if (onDeleteRoute) {
          await onDeleteRoute(routeId);
        }
        await loadRoutes();
      } catch (error) {
        console.error('Error al eliminar la ruta:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header with Switcher and Actions */}
      <div className="card card-pad">
        <div className="glass-card-header flex-wrap gap-3">
          <div>
            <h3 className="card-title text-xl font-bold">
              <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-300 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                </svg>
              </span>
              Rutas de Transporte
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Consulta, navega en Google Maps y administra las rutas disponibles</p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Mode Toggle: Cards vs Map */}
            <div className="nav-pill-group p-1">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'cards'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Tarjetas</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'map'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Google Maps</span>
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  setEditingRoute(null);
                  setFormData({
                    nombre_ruta: '',
                    origen: '',
                    destino: '',
                    horario: '',
                    duracion: '',
                    distancia: '',
                    id_vehiculos: ''
                  });
                  setShowModal(true);
                }}
                className="btn-primary"
              >
                + Agregar Ruta
              </button>
            )}
          </div>
        </div>

        {/* View Mode: Interactive Google Maps Explorer */}
        {viewMode === 'map' && (
          <div className="mt-4">
            <RouteMapView
              routes={routes}
              vehiculos={vehiculos}
              onClose={() => setViewMode('cards')}
            />
          </div>
        )}

        {/* View Mode: Cards Grid */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {routes.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                <div className="w-12 h-12 mx-auto mb-2 text-slate-400 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" y1="3" x2="9" y2="18" />
                    <line x1="15" y1="6" x2="15" y2="21" />
                  </svg>
                </div>
                No hay rutas registradas actualmente.
              </div>
            )}
            {routes.map((route, idx) => {
              const routeId = route.id_ruta || route.id || idx;
              return (
                <div
                  key={routeId}
                  className="item-card group"
                >
                  <div>
                    {/* Card Title & Path */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h4 className="item-title">
                        {route.nombre_ruta || 'Ruta sin nombre'}
                      </h4>
                      {route.horario && (
                        <span className="chip-info shrink-0 flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{route.horario}</span>
                        </span>
                      )}
                    </div>

                    {/* Origin -> Destination Box */}
                    <div className="item-box mb-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                        <span className="item-label">Origen:</span>
                        <span className="item-value truncate">{route.origen || '-'}</span>
                      </div>
                      <div className="h-4 border-l border-dashed border-slate-400 dark:border-slate-600 ml-1"></div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>
                        <span className="item-label">Destino:</span>
                        <span className="item-value truncate">{route.destino || '-'}</span>
                      </div>
                    </div>

                    {/* Distance & Duration Badges */}
                    <div className="flex items-center gap-2 flex-wrap text-xs mb-3">
                      {route.duracion && (
                        <span className="item-box px-2.5 py-1 flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span className="font-semibold">{route.duracion}</span>
                        </span>
                      )}
                      {route.distancia && (
                        <span className="item-box px-2.5 py-1 flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span className="font-semibold">{route.distancia}</span>
                        </span>
                      )}
                    </div>

                    {/* Google Maps Quick Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedMapRoute(route)}
                      className="btn-map-action mb-3 group/btn"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                        <line x1="9" y1="3" x2="9" y2="18" />
                        <line x1="15" y1="6" x2="15" y2="21" />
                      </svg>
                      <span>Ver Trayecto en Google Maps</span>
                      <span className="group-hover/btn:translate-x-0.5 transition-transform">➔</span>
                    </button>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-2 pt-3 mt-1 border-t border-slate-200 dark:border-white/10">
                      <button
                        onClick={() => handleEdit(route)}
                        className="btn-soft text-xs flex-1 py-1.5"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(route.id_ruta || route.id)}
                        className="btn-soft-rose text-xs flex-1 py-1.5"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Google Maps Floating Modal */}
      {selectedMapRoute && (
        <RouteMapModal
          route={selectedMapRoute}
          vehiculos={vehiculos}
          onClose={() => setSelectedMapRoute(null)}
        />
      )}

      {showModal && (
        <>
          <div className="modal-overlay" aria-hidden="true" onClick={() => setShowModal(false)}></div>
          <div className="modal-wrap">
            <div className="modal-sheet">
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingRoute ? 'Editar Ruta de Transporte' : 'Nueva Ruta de Transporte'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingRoute(null);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <label htmlFor="nombre_ruta" className="field-label">
                      Nombre de la Ruta
                    </label>
                    <input
                      type="text"
                      name="nombre_ruta"
                      id="nombre_ruta"
                      value={formData.nombre_ruta}
                      onChange={handleInputChange}
                      className="field"
                      placeholder="Ej. Ruta Express Norte"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="origen" className="field-label">
                        Origen
                      </label>
                      <input
                        type="text"
                        name="origen"
                        id="origen"
                        value={formData.origen}
                        onChange={handleInputChange}
                        className="field"
                        placeholder="Terminal Central"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="destino" className="field-label">
                        Destino
                      </label>
                      <input
                        type="text"
                        name="destino"
                        id="destino"
                        value={formData.destino}
                        onChange={handleInputChange}
                        className="field"
                        placeholder="Zona Industrial"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="horario" className="field-label">
                        Horario
                      </label>
                      <input
                        type="time"
                        name="horario"
                        id="horario"
                        value={formData.horario}
                        onChange={handleInputChange}
                        className="field"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="duracion" className="field-label">
                        Duración
                      </label>
                      <input
                        type="text"
                        name="duracion"
                        id="duracion"
                        value={formData.duracion}
                        onChange={handleInputChange}
                        className="field"
                        placeholder="Ej. 45 min"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="distancia" className="field-label">
                        Distancia
                      </label>
                      <input
                        type="text"
                        name="distancia"
                        id="distancia"
                        value={formData.distancia}
                        onChange={handleInputChange}
                        className="field"
                        placeholder="Ej. 18 km"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="id_vehiculos" className="field-label">
                      Vehículo Asignado
                    </label>
                    <select
                      name="id_vehiculos"
                      id="id_vehiculos"
                      value={formData.id_vehiculos}
                      onChange={handleInputChange}
                      className="field"
                      required
                    >
                      <option value="">Selecciona un vehículo</option>
                      {vehiculos.map((vehiculo) => (
                        <option key={vehiculo.id_vehiculos} value={vehiculo.id_vehiculos}>
                          {vehiculo.placa} - {vehiculo.empresa} ({vehiculo.modelo})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-5 sm:px-6 bg-slate-100/70 dark:bg-slate-950/40 border-t border-slate-200 dark:border-white/10 flex flex-row-reverse gap-3">
                  <button
                    type="submit"
                    className="btn-primary flex-1 sm:flex-initial"
                  >
                    {editingRoute ? 'Guardar Cambios' : 'Crear Ruta'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingRoute(null);
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

export default TransportRoutes; 