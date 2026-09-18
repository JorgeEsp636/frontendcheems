import React from 'react';

const DriverBusInfo = () => {
  const driverBusData = [
    {
      driverName: 'Carlos Pérez',
      busInfo: {
        number: 'BUS-001',
        model: 'Mercedes-Benz Citaro',
        plate: 'XYZ-123',
        capacity: 40,
      },
    },
    {
      driverName: 'Ana Rodríguez',
      busInfo: {
        number: 'BUS-002',
        model: 'Volvo 7900',
        plate: 'ABC-456',
        capacity: 50,
      },
    },
    {
      driverName: 'Jorge Gómez',
      busInfo: {
        number: 'BUS-003',
        model: 'Scania Citywide',
        plate: 'DEF-789',
        capacity: 45,
      },
    },
  ];

  return (
    <div className="card card-pad">
      <div className="glass-card-header">
        <div>
          <h2 className="card-title text-xl font-bold">
            <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sm">🚌</span>
            Asignación de Conductores y Buses
          </h2>
          <p className="text-xs text-slate-400 mt-1">Relación operativa de unidades y operadores asignados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {driverBusData.map((item, index) => (
          <div
            key={index}
            className="item-card group"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-300/30 dark:border-white/20 flex items-center justify-center font-bold text-sky-600 dark:text-sky-300 shadow-sm">
                  {item.driverName.charAt(0)}
                </div>
                <div>
                  <h3 className="item-title">{item.driverName}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{item.busInfo.number}</span>
                </div>
              </div>

              <div className="space-y-2 item-box text-xs">
                <div className="flex justify-between">
                  <span className="item-label">Modelo:</span>
                  <span className="item-value">{item.busInfo.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="item-label">Placa:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-300 font-mono">{item.busInfo.plate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="item-label">Capacidad:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.busInfo.capacity} pasajeros</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverBusInfo; 