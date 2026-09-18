import React from 'react';

const PqrsList = ({ pqrs }) => {
  return (
    <div className="card card-pad">
      <div className="glass-card-header">
        <div>
          <h2 className="card-title text-xl font-bold">
            <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sm">📋</span>
            Historial de Solicitudes (PQRS)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Seguimiento de peticiones, quejas, reclamos y sugerencias radicadas</p>
        </div>
      </div>

      {pqrs.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <div className="text-4xl mb-2">📭</div>
          No hay solicitudes registradas aún.
        </div>
      ) : (
        <div className="space-y-4">
          {pqrs.map((item, index) => (
            <div
              key={index}
              className="item-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>
                  <h4 className="text-base font-bold item-title capitalize">{item.tipo}</h4>
                </div>
                {item.estado === 'pendiente' ? (
                  <span className="chip-amber self-start sm:self-auto">
                    ⏳ Pendiente
                  </span>
                ) : item.estado === 'en_proceso' ? (
                  <span className="chip-info self-start sm:self-auto">
                    🔄 En Proceso
                  </span>
                ) : (
                  <span className="chip-success self-start sm:self-auto">
                    ✓ Resuelta
                  </span>
                )}
              </div>

              <h5 className="text-sm font-semibold text-sky-700 dark:text-sky-200 mb-1.5">
                {item.asunto}
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                {item.descripcion}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400">
                <span>👤 Solicitante: {item.usuario_nombre || 'Usuario'}</span>
                <span>📅 {item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleString('es-CO') : '-'}</span>
              </div>

              {item.respuesta && (
                <div className="mt-3.5 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md shadow-inner">
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5 mb-1">
                    <span>💬</span> Respuesta Oficial:
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed">{item.respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PqrsList;