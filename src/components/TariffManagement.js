import React, { useState } from 'react';

const TariffManagement = ({ user }) => {
  const isAdmin = user?.role === 'admin';
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
  const [editedData, setEditedData] = useState({
    destination: '',
    value: ''
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRate, setNewRate] = useState({
    destination: '',
    value: ''
  });

  const handleEditRate = (rate) => {
    if (!isAdmin) return;
    setEditingRate(rate);
    setEditedData(rate);
  };

  const handleSaveRate = () => {
    if (!isAdmin) return;
    if (editingRate && editedData.value) {
      const newValue = parseInt(editedData.value);
      if (!isNaN(newValue) && newValue > 0) {
        setRates(rates.map(rate => 
          rate.destino === editingRate.destino 
            ? { ...rate, valor: newValue }
            : rate
        ));
        setEditingRate(null);
        alert('Tarifa actualizada exitosamente');
      } else {
        alert('Por favor ingrese un valor válido');
      }
    }
  };

  const handleAddNew = () => {
    if (!isAdmin) return;
    if (newRate.destination && newRate.value) {
      const valor = parseInt(newRate.value);
      if (!isNaN(valor) && valor > 0) {
        setRates([...rates, { destino: newRate.destination.toUpperCase(), valor }]);
        setNewRate({ destino: '', valor: '' });
        setIsAddingNew(false);
        alert('Tarifa agregada exitosamente');
      } else {
        alert('Por favor ingrese un valor válido');
      }
    } else {
      alert('Por favor complete todos los campos');
    }
  };

  const handleDeleteRate = (destino) => {
    if (!isAdmin) return;
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
      
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar destino..."
          className="w-1/3 px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                value={newRate.destination}
                onChange={(e) => setNewRate({...newRate, destination: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese el destino"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor</label>
              <input
                type="number"
                value={newRate.value}
                onChange={(e) => setNewRate({...newRate, value: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Ingrese el valor"
                min={minimumRate}
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleAddNew}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Guardar
            </button>
            <button
              onClick={() => setIsAddingNew(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

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
                  {editingRate?.destino === rate.destino ? (
                    <input
                      type="number"
                      value={editedData.value}
                      onChange={(e) => setEditedData({...editedData, value: e.target.value})}
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
  );
};

export default TariffManagement; 