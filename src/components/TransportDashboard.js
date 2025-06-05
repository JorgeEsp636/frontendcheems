import React, { useState } from 'react';
import TransportRoutes from './TransportRoutes';
import PqrsForm from './PqrsForm';
import DriverInfo from './DriverInfo';
import BusInfo from './BusInfo';
import PqrsList from './PqrsList';

const TransportDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('routes');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Restauramos la verificación de rol
  const userRole = user?.role || 'user';
  const isAdmin = userRole === 'admin';
  const username = user?.username || user?.name || 'Usuario';

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
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRate, setNewRate] = useState({ destino: '', valor: '' });
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

  const handleAddNewRate = () => {
    if (newRate.destino && newRate.valor) {
      const valor = parseInt(newRate.valor);
      if (!isNaN(valor) && valor >= minimumRate) {
        setRates([...rates, { destino: newRate.destino.toUpperCase(), valor }]);
        setNewRate({ destino: '', valor: '' });
        setIsAddingNew(false);
        alert('Tarifa agregada exitosamente');
      } else {
        alert(`El valor debe ser mayor o igual a ${formatCurrency(minimumRate)}`);
      }
    } else {
      alert('Por favor complete todos los campos');
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
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Sistema de Transporte</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('routes')}
                  className={`${
                    activeTab === 'routes'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Rutas
                </button>
                <button
                  onClick={() => setActiveTab('rates')}
                  className={`${
                    activeTab === 'rates'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Tarifas
                </button>
                <button
                  onClick={() => setActiveTab('drivers')}
                  className={`${
                    activeTab === 'drivers'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Conductores
                </button>
                <button
                  onClick={() => setActiveTab('buses')}
                  className={`${
                    activeTab === 'buses'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Buses
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setActiveTab('pqrsList')}
                    className={`${
                      activeTab === 'pqrsList'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Ver PQRS
                  </button>
                )}
                {!isAdmin && (
                  <button
                    onClick={() => setActiveTab('pqrsForm')}
                    className={`${
                      activeTab === 'pqrsForm'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Enviar PQRS
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                {username} ({isAdmin ? 'Administrador' : 'Usuario'})
              </span>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'routes' && (
          <TransportRoutes
            routesData={routesData}
            userRole={userRole}
            onUpdateRoute={isAdmin ? handleUpdateRoute : null}
            onDeleteRoute={isAdmin ? handleDeleteRoute : null}
          />
        )}
        {activeTab === 'rates' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Gestión de Tarifas</h2>
              {isAdmin && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Agregar Nueva Tarifa
                </button>
              )}
            </div>

            {isAddingNew && isAdmin && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-4">Nueva Tarifa</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Destino</label>
                    <input
                      type="text"
                      value={newRate.destino}
                      onChange={(e) => setNewRate({...newRate, destino: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                      placeholder="Ingrese el destino"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valor</label>
                    <input
                      type="number"
                      value={newRate.valor}
                      onChange={(e) => setNewRate({...newRate, valor: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                      placeholder="Ingrese el valor"
                      min={minimumRate}
                    />
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={handleAddNewRate}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setNewRate({ destino: '', valor: '' });
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar destino..."
                className="w-full px-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destino
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRates.map((rate) => (
                    <tr key={rate.destino}>
                      <td className="px-6 py-4 whitespace-nowrap">{rate.destino}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingRate?.destino === rate.destino && isAdmin ? (
                          <input
                            type="number"
                            value={newRateValue}
                            onChange={(e) => setNewRateValue(e.target.value)}
                            className="w-32 px-2 py-1 border rounded"
                            min={minimumRate}
                          />
                        ) : (
                          formatCurrency(rate.valor)
                        )}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingRate?.destino === rate.destino ? (
                            <button
                              onClick={handleSaveRate}
                              className="text-green-600 hover:text-green-900 mr-2"
                            >
                              Guardar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditRate(rate)}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                              Editar
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteRate(rate.destino)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'drivers' && (
          <DriverInfo drivers={driverBusData} isAdmin={isAdmin} />
        )}
        {activeTab === 'buses' && (
          <BusInfo buses={driverBusData.map(d => d.busInfo)} isAdmin={isAdmin} />
        )}
        {activeTab === 'pqrsList' && isAdmin && (
          <PqrsList pqrs={pqrsList} isAdmin={isAdmin} />
        )}
        {activeTab === 'pqrsForm' && !isAdmin && (
          <PqrsForm onSubmit={handleAddPqrs} />
        )}
      </main>
    </div>
  );
};

export default TransportDashboard;

// DONE