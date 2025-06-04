import React, { useState } from 'react';
import TransportRoutes from './TransportRoutes';

const TransportDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('routes');
  const [searchTerm, setSearchTerm] = useState('');

  const rates = [
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
  ];

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

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* <h1 className="text-xl font-bold">Rápido El Carmen S.A.</h1> */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Bienvenido, {user.email}</span>
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
        </div>

        {activeTab === 'routes' && <TransportRoutes />}

        {activeTab === 'rates' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Tarifas Vigentes Año 2025</h2>
            <p className="text-center text-gray-600 mb-4">Desde Ubaté:</p>

            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar destino..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRates.map((rate, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rate.destino}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(rate.valor)}</td>
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
      </main>
    </div>
  );
};

export default TransportDashboard;

// DONE