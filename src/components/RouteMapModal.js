import React, { useState } from 'react';

const RouteMapModal = ({ route, onClose, vehiculos = [] }) => {
  const [travelMode, setTravelMode] = useState('driving'); // driving, transit, bicycling, walking
  const [mapType, setMapType] = useState('m'); // m = roadmap, k = satellite

  if (!route) return null;

  const origin = route.origen || 'Origen';
  const destination = route.destino || 'Destino';
  const routeName = route.nombre_ruta || 'Ruta de Transporte';

  const vehiculoAsignado = vehiculos.find(v => v.id_vehiculos === route.id_vehiculos);

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

  const embedUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&dirflg=${dirFlags[travelMode] || 'd'}&t=${mapType}&output=embed`;

  const externalGoogleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`;

  return (
    <>
      <div className="modal-overlay" aria-hidden="true" onClick={onClose}></div>
      <div className="modal-wrap">
        <div className="modal-sheet max-w-4xl w-full">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-300 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" y1="3" x2="9" y2="18" />
                    <line x1="15" y1="6" x2="15" y2="21" />
                  </svg>
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                  {routeName}
                </h3>
                {route.horario && (
                  <span className="chip-info text-xs font-semibold flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{route.horario}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{origin}</span>
                <span className="text-slate-400">➔</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold">{destination}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors shrink-0 font-bold"
              title="Cerrar modal"
            >
              ✕
            </button>
          </div>

          {/* Map Controls & Mode Selection */}
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
            {/* Travel Mode Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {travelModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setTravelMode(mode.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    travelMode === mode.id
                      ? 'bg-sky-500/20 text-sky-700 dark:text-sky-200 border border-sky-400/50 shadow-sm font-bold'
                      : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <span>{mode.icon}</span>
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>

            {/* Map Type & External Link Controls */}
            <div className="flex items-center gap-2">
              <div className="flex rounded-xl bg-slate-200/70 dark:bg-white/5 p-0.5 border border-slate-300 dark:border-white/10">
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

              <a
                href={externalGoogleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <span>Google Maps</span>
                <span className="text-xs">↗</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Map Iframe */}
          <div className="relative w-full h-[400px] sm:h-[480px] bg-slate-950 overflow-hidden">
            <iframe
              title={`Mapa de ruta ${routeName}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={embedUrl}
              className="w-full h-full"
            ></iframe>

            {/* Floating Indicator */}
            <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/15 text-xs text-slate-900 dark:text-slate-200 flex items-center gap-2 pointer-events-none shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold">Vista de trayecto en vivo</span>
            </div>
          </div>

          {/* Route Details Footer */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="item-box">
              <span className="item-label block mb-0.5 font-medium">Origen</span>
              <span className="font-bold text-slate-900 dark:text-white truncate block">{origin}</span>
            </div>
            <div className="item-box">
              <span className="item-label block mb-0.5 font-medium">Destino</span>
              <span className="font-bold text-slate-900 dark:text-white truncate block">{destination}</span>
            </div>
            <div className="item-box">
              <span className="item-label block mb-0.5 font-medium">Estimación</span>
              <span className="font-bold text-sky-600 dark:text-sky-300 truncate block">
                {route.duracion ? `${route.duracion}` : 'Calculado en mapa'} 
                {route.distancia ? ` • ${route.distancia}` : ''}
              </span>
            </div>
            <div className="item-box">
              <span className="item-label block mb-0.5 font-medium">Vehículo</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-300 truncate block">
                {vehiculoAsignado ? `${vehiculoAsignado.placa} (${vehiculoAsignado.empresa})` : 'No asignado'}
              </span>
            </div>
          </div>

          {/* Modal Bottom Action Bar with explicit Close button */}
          <div className="p-4 sm:px-6 bg-slate-100/70 dark:bg-slate-950/40 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs px-5 py-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RouteMapModal;
