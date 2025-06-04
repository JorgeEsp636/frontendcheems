import React from 'react';

const TransportRoutes = () => {
  const origin = 'Ubaté';

  const highDemandRoutes = [
    { name: 'Guachetá', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.' },
    { name: 'Simijaca', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.' },
    { name: 'Capellanía', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.' },
    { name: 'Cucunubá', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.' },
    { name: 'Tausa', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.' },
    { name: 'Susa', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.' },
    { name: 'Tierra Negra', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.' },
    { name: 'Sutatausa', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.' },
  ];

  const mediumDemandRoutes = [
    { name: 'Nemocón', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Suesca', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'La Ye', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'La Pluma', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Lenguazaque', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'San Miguel de Sema', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Samacá', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Chocontá', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.' },
  ];

  const lowDemandRoutes = [
    { name: 'Coper', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Ráquira', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Turtur', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Volcán 1', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Volcán 2', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Volcán 3', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Volcán Soaga', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Peñas de Cajón', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Carupa', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Alizal', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Apartadero', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Alto Cucunubá', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Hato Grande', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Patio Bonito', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
    { name: 'Salinas', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.' },
  ];

  const RouteSection = ({ title, routes, color }) => (
    <div className="mb-8">
      <h2 className={`text-2xl font-bold mb-4 ${color}`}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">Desde {origin} a: {route.name}</h3>
            <p className="text-gray-600">Frecuencia: {route.frequency}</p>
            <p className="text-gray-600">Horario: {route.schedule}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <RouteSection 
        title="🟢 Rutas de Alta Demanda" 
        routes={highDemandRoutes} 
        color="text-green-600"
      />
      
      <RouteSection 
        title="🟡 Rutas de Demanda Media" 
        routes={mediumDemandRoutes} 
        color="text-yellow-600"
      />
      
      <RouteSection 
        title="🔵 Rutas de Baja Demanda" 
        routes={lowDemandRoutes} 
        color="text-blue-600"
      />
    </div>
  );
};

export default TransportRoutes; 