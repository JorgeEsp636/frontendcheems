import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import transportService from '../services/transportService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6699'];

const AdminDashboardCharts = () => {
  const [tarifas, setTarifas] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tarifasData, rutasData, conductoresData, busesData] = await Promise.all([
          transportService.getRates(),
          transportService.getRoutes(),
          transportService.getDrivers(),
          transportService.getBuses()
        ]);
        setTarifas(tarifasData);
        setRutas(rutasData);
        setConductores(conductoresData);
        setBuses(busesData);
      } catch (e) {
        // Si algún endpoint falla, deja el array vacío
        setTarifas([]); setRutas([]); setConductores([]); setBuses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Datos para gráficas
  const tarifasActivas = tarifas.filter(t => t.activa).length;
  const tarifasInactivas = tarifas.length - tarifasActivas;
  const tarifasData = [
    { name: 'Activas', value: tarifasActivas },
    { name: 'Inactivas', value: tarifasInactivas }
  ];

  const rutasData = rutas.map(r => ({ name: r.nombre_ruta || r.origen + '-' + r.destino, value: 1 }));

  const conductoresActivos = conductores.filter(c => c.estado === 'activo').length;
  const conductoresInactivos = conductores.length - conductoresActivos;
  const conductoresData = [
    { name: 'Activos', value: conductoresActivos },
    { name: 'Inactivos', value: conductoresInactivos }
  ];

  const busesActivos = buses.filter(b => b.estado === 'activo').length;
  const busesMantenimiento = buses.filter(b => b.estado === 'mantenimiento').length;
  const busesInactivos = buses.length - busesActivos - busesMantenimiento;
  const busesData = [
    { name: 'Activos', value: busesActivos },
    { name: 'Mantenimiento', value: busesMantenimiento },
    { name: 'Inactivos', value: busesInactivos }
  ];

  if (loading) return <div className="text-center text-gray-500">Cargando gráficas...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* Tarifas */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-bold mb-4 text-center">Tarifas activas vs inactivas</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={tarifasData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {tarifasData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Rutas */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-bold mb-4 text-center">Cantidad de rutas</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={rutasData}>
            <XAxis dataKey="name" hide />
            <YAxis allowDecimals={false} />
            <Bar dataKey="value" fill="#0088FE" />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
        <div className="text-center text-gray-600 mt-2">Total: {rutas.length}</div>
      </div>
      {/* Conductores */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-bold mb-4 text-center">Conductores activos vs inactivos</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={conductoresData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {conductoresData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Buses */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-bold mb-4 text-center">Buses por estado</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={busesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {busesData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboardCharts; 