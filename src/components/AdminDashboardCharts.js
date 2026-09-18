import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import transportService from '../services/transportService';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-3 shadow-glass text-xs">
        <p className="font-bold text-slate-900 dark:text-white mb-1">{label || payload[0].name}</p>
        <p className="text-sky-600 dark:text-sky-300 font-semibold">
          Cantidad: <span className="text-slate-900 dark:text-white font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

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
        setTarifas(tarifasData || []);
        setRutas(rutasData || []);
        setConductores(conductoresData || []);
        setBuses(busesData || []);
      } catch (e) {
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

  const rutasData = rutas.map(r => ({ name: r.nombre_ruta || `${r.origen}-${r.destino}`, value: 1 }));

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

  if (loading) {
    return (
      <div className="card card-pad text-center py-16">
        <div className="w-10 h-10 rounded-full border-4 border-sky-400/20 border-t-sky-400 animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Cargando métricas y estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl p-5 bg-sky-500/10 dark:bg-gradient-to-b dark:from-sky-500/15 dark:to-slate-900/60 backdrop-blur-xl border border-sky-300/40 dark:border-sky-400/30 shadow-glass">
          <div className="text-xs text-sky-700 dark:text-sky-300 font-semibold">Total Rutas</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{rutas.length}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">En operación activa</div>
        </div>

        <div className="rounded-3xl p-5 bg-indigo-500/10 dark:bg-gradient-to-b dark:from-indigo-500/15 dark:to-slate-900/60 backdrop-blur-xl border border-indigo-300/40 dark:border-indigo-400/30 shadow-glass">
          <div className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">Conductores</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{conductores.length}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">{conductoresActivos} activos</div>
        </div>

        <div className="rounded-3xl p-5 bg-purple-500/10 dark:bg-gradient-to-b dark:from-purple-500/15 dark:to-slate-900/60 backdrop-blur-xl border border-purple-300/40 dark:border-purple-400/30 shadow-glass">
          <div className="text-xs text-purple-700 dark:text-purple-300 font-semibold">Buses en Flota</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{buses.length}</div>
          <div className="text-[11px] text-sky-600 dark:text-sky-300 font-medium mt-1">{busesActivos} operativos</div>
        </div>

        <div className="rounded-3xl p-5 bg-emerald-500/10 dark:bg-gradient-to-b dark:from-emerald-500/15 dark:to-slate-900/60 backdrop-blur-xl border border-emerald-300/40 dark:border-emerald-400/30 shadow-glass">
          <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Tarifas</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{tarifas.length}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-300 font-medium mt-1">{tarifasActivas} activas</div>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tarifas */}
        <div className="card card-pad">
          <h3 className="text-base font-bold mb-4 text-center text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <span>💳</span> Estado de Tarifas
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={tarifasData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} stroke="rgba(255,255,255,0.15)">
                {tarifasData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Rutas */}
        <div className="card card-pad">
          <h3 className="text-base font-bold mb-4 text-center text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <span>🛣️</span> Distribución de Rutas
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rutasData.slice(0, 10)}>
              <XAxis dataKey="name" hide />
              <YAxis allowDecimals={false} stroke="#64748b" />
              <Bar dataKey="value" fill="#0284c7" radius={[8, 8, 0, 0]} />
              <Tooltip content={<CustomTooltip />} />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
            Mostrando {Math.min(rutas.length, 10)} de {rutas.length} rutas registradas
          </div>
        </div>

        {/* Conductores */}
        <div className="card card-pad">
          <h3 className="text-base font-bold mb-4 text-center text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <span>👤</span> Conductores: Activos vs Inactivos
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={conductoresData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} stroke="rgba(255,255,255,0.15)">
                {conductoresData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[(idx + 1) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Buses */}
        <div className="card card-pad">
          <h3 className="text-base font-bold mb-4 text-center text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <span>🚌</span> Flota de Buses por Estado
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={busesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} stroke="rgba(255,255,255,0.15)">
                {busesData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[(idx + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardCharts; 