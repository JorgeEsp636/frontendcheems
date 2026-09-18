import React, { useState } from 'react';

const RouteMapView = ({ routes = [], vehiculos = [], onClose }) => {
  const [selectedRoute, setSelectedRoute] = useState(routes[0] || null);
  const [searchFilter, setSearchFilter] = useState('');
  const [travelMode, setTravelMode] = useState('driving'); // driving, transit, bicycling, walking
  const [mapType, setMapType] = useState('m'); // m = roadmap, k = satellite

  // Filtrar rutas según el término de búsqueda
  const filteredRoutes = routes.filter(r => {
    const term = searchFilter.toLowerCase();
    return (
      (r.nombre_ruta && r.nombre_ruta.toLowerCase().includes(term)) ||
      (r.origen && r.origen.toLowerCase().includes(term)) ||
      (r.destino && r.destino.toLowerCase().includes(term))
    );
  });

  const activeRoute = selectedRoute || (filteredRoutes.length > 0 ? filteredRoutes[0] : null);

  const origin = activeRoute?.origen || 'Origen';
  const destination = activeRoute?.destino || 'Destino';
  const routeName = activeRoute?.nombre_ruta || 'Selecciona una ruta';

  const vehiculoAsignado = activeRoute && vehiculos.find(v => v.id_vehiculos === activeRoute.id_vehiculos);

  const dirFlags = {
    driving: 'd',
    transit: 'r',
    bicycling: 'b',
    walking: 'w'
  };

  const travelModes = [
    {
      id: 'driving',
      label: 'Conducción / Bus',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="14" rx="2" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="16.5" cy="17.5" r="2.5" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      id: 'transit',
      label: 'Tránsito',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="16" rx="2" />
          <line x1="4" y1="11" x2="20" y2="11" />
          <line x1="8" y1="3" x2="8" y2="11" />
          <line x1="16" y1="3" x2="16" y2="11" />
          <circle cx="8" cy="15" r="1" />
          <circle cx="16" cy="15" r="1" />
        </svg>
      )
    },
    {
      id: 'bicycling',
      label: 'Bicicleta',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="5.5" cy="17.5" r="3.5" />
          <circle cx="18.5" cy="17.5" r="3.5" />
          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 9l4.5-3 2 4.5h3" />
        </svg>
      )
    },
    {
      id: 'walking',
      label: 'Caminata',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4" r="2" />
          <path d="M9 20l3-6 2 3 3 5" />
          <path d="M6 11l4-2 3 3 3-1" />
        </svg>
      )
    },
  ];

  // URL del mapa embebido de Google Maps
  const embedUrl = activeRoute
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&dirflg=${dirFlags[travelMode] || 'd'}&t=${mapType}&output=embed`
    : `https://maps.google.com/maps?q=Colombia&t=${mapType}&output=embed`;

  // URL de redirección directa a Google Maps
  const externalGoogleMapsUrl = activeRoute
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`
    : `https://www.google.com/maps`;

  return (
    <div className="card card-pad overflow-hidden">
      {/* View Header with Close Button */}
      <div className="glass-card-header mb-4 flex-wrap gap-3">
        <div>
          <h3 className="card-title text-xl font-bold flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-300 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
            </span>
            Explorador de Rutas en Google Maps
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualiza y navega en tiempo real por el trazado de cada ruta del sistema
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeRoute && (
            <a
              href={externalGoogleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <span>Navegar en Google Maps</span>
              <span className="text-xs font-bold">↗</span>
            </a>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs flex items-center gap-1.5"
              title="Cerrar vista de mapa y volver a tarjetas"
            >
              <span>Cerrar Mapa</span>
              <span className="font-bold">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout: Routes List on Left, Interactive Map on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Route selector */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar ruta, origen, destino..."
              className="field text-xs pl-9 py-2.5"
            />
            <span className="absolute left-3 top-2.5 text-slate-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Routes Scroll List */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredRoutes.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 rounded-2xl item-box text-xs">
                <div className="w-10 h-10 mx-auto mb-2 text-slate-400 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" y1="3" x2="9" y2="18" />
                    <line x1="15" y1="6" x2="15" y2="21" />
                  </svg>
                </div>
                No se encontraron rutas que coincidan con la búsqueda.
              </div>
            ) : (
              filteredRoutes.map((route) => {
                const isSelected = (activeRoute?.id_ruta && activeRoute?.id_ruta === route.id_ruta) ||
                                   (activeRoute?.id && activeRoute?.id === route.id) ||
                                   activeRoute?.nombre_ruta === route.nombre_ruta;
                return (
                  <button
                    key={route.id_ruta || route.id || route.nombre_ruta}
                    type="button"
                    onClick={() => setSelectedRoute(route)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 border ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500/60 shadow-[0_0_15px_rgba(56,189,248,0.25)] ring-1 ring-sky-500/30'
                        : 'item-card hover:border-sky-400/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-sm truncate text-slate-900 dark:text-white">{route.nombre_ruta || 'Ruta sin nombre'}</h4>
                      {route.horario && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 shrink-0 font-medium flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{route.horario}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="truncate font-medium">{route.origen || '-'}</span>
                      <span className="text-slate-400">➔</span>
                      <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></span>
                      <span className="truncate font-medium">{route.destino || '-'}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Google Maps Interactive Viewer */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {/* Map Top Bar */}
          <div className="p-3 rounded-2xl item-box flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Travel Mode Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {travelModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setTravelMode(mode.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    travelMode === mode.id
                      ? 'bg-sky-500/20 text-sky-700 dark:text-sky-200 border border-sky-400/50 shadow-sm font-semibold'
                      : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <span>{mode.icon}</span>
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>

            {/* Map Type Selector */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-0.5 border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setMapType('m')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                  mapType === 'm' ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Mapa
              </button>
              <button
                onClick={() => setMapType('k')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                  mapType === 'k' ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Satélite
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative w-full h-[420px] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/15 shadow-glass bg-slate-950">
            <iframe
              title={`Mapa de Google para ${routeName}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={embedUrl}
              className="w-full h-full"
            ></iframe>

            {/* Overlay badge with active route name */}
            <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-white/15 text-xs text-slate-900 dark:text-white flex items-center gap-2 shadow-lg pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold">{routeName}</span>
              <span className="text-slate-500 dark:text-slate-400 text-[10px]">({origin} ➔ {destination})</span>
            </div>
          </div>

          {/* Active Route Specs Footer */}
          {activeRoute && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="item-box">
                <span className="item-label block mb-0.5">Origen</span>
                <span className="item-value truncate block">{origin}</span>
              </div>
              <div className="item-box">
                <span className="item-label block mb-0.5">Destino</span>
                <span className="item-value truncate block">{destination}</span>
              </div>
              <div className="item-box">
                <span className="item-label block mb-0.5">Horario / Duración</span>
                <span className="font-bold text-sky-600 dark:text-sky-300 truncate block">
                  {activeRoute.horario ? `${activeRoute.horario}` : ''}
                  {activeRoute.duracion ? ` (${activeRoute.duracion})` : ''}
                </span>
              </div>
              <div className="item-box">
                <span className="item-label block mb-0.5">Vehículo Asignado</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-300 truncate block">
                  {vehiculoAsignado ? `${vehiculoAsignado.placa} - ${vehiculoAsignado.empresa}` : 'No asignado'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteMapView;
