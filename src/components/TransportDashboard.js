import React, { useState } from 'react';
import TransportRoutes from './TransportRoutes';
import PqrsForm from './PqrsForm';
import DriverInfo from './DriverInfo';
import BusInfo from './BusInfo';
import PqrsList from './PqrsList';

const TransportDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('routes');
  const [searchTerm, setSearchTerm] = useState('');
  const isAdmin = user.role === 'admin';
  const [rates, setRates] = useState([
    { destino: 'ALIZAL', valor: 8400 },
    { destino: 'APARTADERO', valor: 11000 },
    { destino: 'CAPELLANÍA', valor: 5300 },
    { destino: 'CARUPA', valor: 5000 },
    { destino: 'CHOCONTÁ', valor: 15500 },
    { destino: 'COPER', valor: 36000 },
    { destino: 'CUCUNUBÁ', valor: 4600 },
    { destino: 'FUQUENE', valor: 8700 },
    { destino: 'GUACHETÁ', valor: 10000 },
    { destino: 'HATO GRANDE', valor: 12200 },
    { destino: 'LA PLUMA', valor: 9600 },
    { destino: 'LA YE', valor: 14400 },
    { destino: 'LENGUAZAQUE', valor: 8700 },
    { destino: 'NEMOCÓN', valor: 15500 },
    { destino: 'LA RAMADA ALTA', valor: 10000 },
    { destino: 'LA RAMADA BAJA', valor: 9000 },
    { destino: 'ALTO DE CUCUNUBÁ', valor: 9000 },
    { destino: 'PATIO BONITO', valor: 10800 },
    { destino: 'PEÑAS DE CAJÓN', valor: 10100 },
    { destino: 'RAQUIRA', valor: 24500 },
    { destino: 'SALINAS', valor: 12400 },
    { destino: 'SAMACÁ', valor: 27000 },
    { destino: 'SAN MIGUEL DE SEMA', valor: 18000 },
    { destino: 'SIMIJACA', valor: 11800 },
    { destino: 'SUESCA', valor: 15500 },
    { destino: 'SUSA', valor: 10300 },
    { destino: 'TÁUSA', valor: 6500 },
    { destino: 'TIERRA NEGRA', valor: 7500 },
    { destino: 'TURTUR', valor: 31000 },
    { destino: 'VOLCÁN 1', valor: 6000 },
    { destino: 'VOLCÁN 2', valor: 6000 },
    { destino: 'VOLCÁN 3', valor: 8500 },
    { destino: 'VOLCÁN SOAGA', valor: 6000 },
    { destino: 'SUTATAUSA', valor: 5000 }
  ]);

  const [editingRate, setEditingRate] = useState(null);
  const [newRateValue, setNewRateValue] = useState('');
  const [pqrsList, setPqrsList] = useState([]);

  const handleAddPqrs = (pqrsData) => {
    setPqrsList([...pqrsList, pqrsData]);
    alert('PQRS enviada con éxito!');
  };

  const handleEditRate = (rate) => {
    setEditingRate(rate);
    setNewRateValue(rate.valor.toString());
  };

  const handleSaveRate = () => {
    if (editingRate && newRateValue) {
      const newValue = parseInt(newRateValue);
      if (!isNaN(newValue) && newValue > 0) {
        setRates(rates.map(rate => 
          rate.destino === editingRate.destino 
            ? { ...rate, valor: newValue }
            : rate
        ));
        setEditingRate(null);
        setNewRateValue('');
        alert('Tarifa actualizada exitosamente');
      } else {
        alert('Por favor ingrese un valor válido');
      }
    }
  };

  const handleDeleteRate = (destino) => {
    if (window.confirm(`¿Está seguro de eliminar la tarifa para ${destino}?`)) {
      setRates(rates.filter(rate => rate.destino !== destino));
      alert('Tarifa eliminada exitosamente');
    }
  };

  const filteredRates = rates.filter(rate =>
    rate.destino.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const minimumRate = 3700;

  // New data for drivers and buses with more bus info
  const driverBusData = [
    {
      driverName: 'Carlos Pérez',
      driverId: 'DRV-001',
      contact: '555-1234',
      busInfo: {
        number: 'BUS-001',
        model: 'Mercedes-Benz Citaro',
        plate: 'XYZ-123',
        capacity: 40,
        year: 2018,
        color: 'Blanco',
        status: 'Operativo',
        lastMaintenance: '2024-05-15',
      },
    },
    {
      driverName: 'Ana Rodríguez',
      driverId: 'DRV-002',
      contact: '555-5678',
      busInfo: {
        number: 'BUS-002',
        model: 'Volvo 7900',
        plate: 'ABC-456',
        capacity: 50,
        year: 2020,
        color: 'Azul',
        status: 'En Mantenimiento',
        lastMaintenance: '2024-05-20',
      },
    },
    {
      driverName: 'Jorge Gómez',
      driverId: 'DRV-003',
      contact: '555-9012',
      busInfo: {
        number: 'BUS-003',
        model: 'Scania Citywide',
        plate: 'DEF-789',
        capacity: 45,
        year: 2019,
        color: 'Rojo',
        status: 'Operativo',
        lastMaintenance: '2024-05-10',
      },
    },
  ];

  const [routesData, setRoutesData] = useState([
    // Rutas de Alta Demanda
    { name: 'Guachetá', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.', demand: 'high' },
    { name: 'Simijaca', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.', demand: 'high' },
    { name: 'Capellanía', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.', demand: 'high' },
    { name: 'Cucunubá', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.', demand: 'high' },
    { name: 'Tausa', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.', demand: 'high' },
    { name: 'Susa', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.', demand: 'high' },
    { name: 'Tierra Negra', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.', demand: 'high' },
    { name: 'Sutatausa', frequency: '15 minutos', schedule: '5:00 a.m. a 8:00 p.m.', demand: 'high' },

    // Rutas de Demanda Media
    { name: 'Nemocón', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'medium' },
    { name: 'Suesca', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'medium' },
    { name: 'La Ye', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'medium' },
    { name: 'La Pluma', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'medium' },
    { name: 'Lenguazaque', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'medium' },
    { name: 'San Miguel de Sema', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'medium' },
    { name: 'Samacá', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'medium' },
    { name: 'Chocontá', frequency: '20 minutos', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'medium' },

    // Rutas de Baja Demanda
    { name: 'Coper', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Ráquira', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Turtur', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Volcán 1', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Volcán 2', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Volcán 3', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Volcán Soaga', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Peñas de Cajón', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Carupa', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Alizal', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Apartadero', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Alto Cucunubá', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Hato Grande', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Patio Bonito', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
    { name: 'Salinas', frequency: '1 hora', schedule: '7:00 a.m. a 7:00 p.m.', demand: 'low' },
  ]);

  const handleUpdateRoute = (updatedRoute) => {
    setRoutesData(routesData.map(route =>
      route.name === updatedRoute.name ? updatedRoute : route
    ));
  };

  const handleDeleteRoute = (routeName) => {
    setRoutesData(routesData.filter(route => route.name !== routeName));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* <h1 className="text-xl font-bold">Rápido El Carmen S.A.</h1> */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Bienvenido, {user.email}</span>
            <span className="text-gray-600">({isAdmin ? 'Administrador' : 'Usuario'})</span>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {!isAdmin && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-yellow-700">
              <strong>Nota:</strong> Solo los administradores pueden realizar cambios en el sistema.
            </p>
          </div>
        )}

        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'routes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('routes')}
          >
            Rutas
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'rates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('rates')}
          >
            Tarifas
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'pqrs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('pqrs')}
          >
            PQRS
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'drivers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('drivers')}
          >
            Conductores
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'buses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('buses')}
          >
            Buses
          </button>
        </div>

        {activeTab === 'routes' && <TransportRoutes routesData={routesData} userRole={user.role} onUpdateRoute={handleUpdateRoute} onDeleteRoute={handleDeleteRoute} />}

        {activeTab === 'rates' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Tarifas Vigentes Año 2025</h2>
            <p className="text-center text-gray-600 mb-4">Desde Ubaté:</p>

            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar destino..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    {isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRates.map((rate, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rate.destino}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {editingRate?.destino === rate.destino ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={newRateValue}
                              onChange={(e) => setNewRateValue(e.target.value)}
                              className="w-32 px-2 py-1 border border-gray-300 rounded"
                            />
                            <button
                              onClick={handleSaveRate}
                              className="text-green-600 hover:text-green-800"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingRate(null)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          formatCurrency(rate.valor)
                        )}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {editingRate?.destino !== rate.destino && (
                            <>
                              <button
                                onClick={() => handleEditRate(rate)}
                                className="text-blue-600 hover:text-blue-800 mr-2"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteRate(rate.destino)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Eliminar
                              </button>
                            </>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-sm text-yellow-700">
                <span className="font-bold">TARIFA MÍNIMA:</span> {formatCurrency(minimumRate)}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'pqrs' && (
          isAdmin ? (
            <PqrsList pqrsList={pqrsList} />
          ) : (
            <PqrsForm onPqrsSubmit={handleAddPqrs} />
          )
        )}

        {activeTab === 'drivers' && <DriverInfo driverBusData={driverBusData} userRole={user.role} />}

        {activeTab === 'buses' && <BusInfo driverBusData={driverBusData} userRole={user.role} />}
      </main>
    </div>
  );
};

export default TransportDashboard;

// DONE