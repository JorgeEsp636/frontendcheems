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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Conductores y Buses</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {driverBusData.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Conductor: {item.driverName}</h3>
            <div className="space-y-1 text-gray-600">
              <p><span className="font-medium">Número de Bus:</span> {item.busInfo.number}</p>
              <p><span className="font-medium">Modelo:</span> {item.busInfo.model}</p>
              <p><span className="font-medium">Placa:</span> {item.busInfo.plate}</p>
              <p><span className="font-medium">Capacidad:</span> {item.busInfo.capacity} pasajeros</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverBusInfo; 