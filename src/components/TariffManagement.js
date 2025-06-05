import React, { useState } from 'react';

const TariffManagement = ({ user }) => {
  // Los datos de tarifas y la lógica de manejo
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

  const [searchTerm, setSearchTerm] = useState('');
  const [editingRate, setEditingRate] = useState(null);
  const [newRateValue, setNewRateValue] = useState('');

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

  const minimumRate = 3700; // Definir la tarifa mínima si es necesaria

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Tarifas</h2>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRates.map((rate) => (
              <tr key={rate.destino}>
                <td className="px-6 py-4 whitespace-nowrap">{rate.destino}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingRate?.destino === rate.destino ? (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TariffManagement; 