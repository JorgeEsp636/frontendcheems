import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransportRoutes from './TransportRoutes';
import PqrsForm from './PqrsForm';
import DriverInfo from './DriverInfo';
import BusInfo from './BusInfo';
import RateInfo from './RateInfo';
import PqrsList from './PqrsList';
import transportService from '../services/transportService';
import authService from '../services/authService';
import TariffManagement from './TariffManagement';
import AdminDashboardCharts from './AdminDashboardCharts';
import AssistantChat from './AssistantChat';
import ThemeToggle from './ThemeToggle';

const TransportDashboard = ({ user: propUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('routes');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : propUser;
  });

  const navigate = useNavigate();

  // Estados para los datos
  const [routes, setRoutes] = useState([]);
  const [rates, setRates] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pqrs, setPqrs] = useState([]);
  const [pqrsLoading, setPqrsLoading] = useState(false);
  const [pqrsSuccess, setPqrsSuccess] = useState('');
  const [pqrsError, setPqrsError] = useState('');

  const isAdmin = user?.role === 'admin' || user?.rol === 3 || user?.rol_id === 3 || user?.roleId === 3;

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/login', { replace: true });
        return;
      }

      // Actualizar el usuario desde localStorage si no está en props
      if (!propUser) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } else {
        setUser(propUser);
      }
    };

    checkAuth();
  }, [propUser, navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        // Cargar rutas
        const routesData = await transportService.getRoutes();
        setRoutes(routesData || []);

        // Cargar tarifas
        try {
          const ratesData = await transportService.getRates();
          setRates(ratesData || []);
        } catch (error) {
          console.error('Error al cargar tarifas:', error);
          setRates([]);
        }

        // Cargar conductores y buses para cualquier rol
        try {
          const driversData = await transportService.getDrivers();
          setDrivers(driversData || []);
        } catch (error) {
          console.error('Error al cargar conductores:', error);
          setDrivers([]);
        }

        try {
          const busesData = await transportService.getBuses();
          setBuses(busesData || []);
        } catch (error) {
          console.error('Error al cargar buses:', error);
          setBuses([]);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Cargar PQRS al cambiar de usuario o pestaña
  useEffect(() => {
    const fetchPqrs = async () => {
      if (activeTab !== 'pqrs') return;
      setPqrsLoading(true);
      setPqrsError('');
      try {
        let pqrsData = [];
        if (isAdmin) {
          // Endpoint de admin
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:8000/api/pqrs/admin/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          pqrsData = await response.json();
        } else {
          // Endpoint de usuario normal
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:8000/api/pqrs/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          pqrsData = await response.json();
        }
        setPqrs(Array.isArray(pqrsData) ? pqrsData : []);
      } catch (err) {
        setPqrsError('Error al cargar PQRS');
        setPqrs([]);
      } finally {
        setPqrsLoading(false);
      }
    };
    fetchPqrs();
  }, [user, activeTab, isAdmin]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login', { replace: true });
  };

  // Manejadores para rutas
  const handleCreateRoute = async (routeData) => {
    try {
      const newRoute = await transportService.createRoute(routeData);
      setRoutes(prev => [...prev, newRoute]);
      return true;
    } catch (err) {
      setError(err.message || 'Error al crear la ruta');
      return false;
    }
  };

  const handleUpdateRoute = async (routeId, routeData) => {
    try {
      const updatedRoute = await transportService.updateRoute(routeId, routeData);
      setRoutes(prev => prev.map(route => 
        (route.id_ruta === routeId || route.id === routeId) ? updatedRoute : route
      ));
      return true;
    } catch (err) {
      setError(err.message || 'Error al actualizar la ruta');
      return false;
    }
  };

  const handleDeleteRoute = async (routeId) => {
    try {
      await transportService.deleteRoute(routeId);
      setRoutes(prev => prev.filter(route => route.id_ruta !== routeId && route.id !== routeId));
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar la ruta');
      return false;
    }
  };

  // Manejadores para tarifas
  const handleCreateRate = async (rateData) => {
    try {
      const newRate = await transportService.createRate(rateData);
      setRates(prev => [...prev, newRate]);
      return true;
    } catch (err) {
      setError(err.message || 'Error al crear la tarifa');
      return false;
    }
  };

  const handleUpdateRate = async (rateId, rateData) => {
    try {
      const updatedRate = await transportService.updateRate(rateId, rateData);
      setRates(prev => prev.map(rate => 
        (rate.id_tarifa === rateId || rate.id === rateId) ? updatedRate : rate
      ));
      return true;
    } catch (err) {
      setError(err.message || 'Error al actualizar la tarifa');
      return false;
    }
  };

  const handleDeleteRate = async (rateId) => {
    try {
      await transportService.deleteRate(rateId);
      setRates(prev => prev.filter(rate => rate.id_tarifa !== rateId && rate.id !== rateId));
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar la tarifa');
      return false;
    }
  };

  // Manejadores para conductores
  const handleCreateDriver = async (driverData) => {
    try {
      const newDriver = await transportService.createDriver(driverData);
      setDrivers(prev => [...prev, newDriver]);
      return true;
    } catch (err) {
      setError(err.message || 'Error al crear el conductor');
      return false;
    }
  };

  const handleUpdateDriver = async (driverId, driverData) => {
    try {
      const updatedDriver = await transportService.updateDriver(driverId, driverData);
      setDrivers(prev => prev.map(driver => 
        (driver.id_conductor === driverId || driver.id === driverId) ? updatedDriver : driver
      ));
      return true;
    } catch (err) {
      setError(err.message || 'Error al actualizar el conductor');
      return false;
    }
  };

  const handleDeleteDriver = async (driverId) => {
    try {
      await transportService.deleteDriver(driverId);
      setDrivers(prev => prev.filter(driver => driver.id_conductor !== driverId && driver.id !== driverId));
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar el conductor');
      return false;
    }
  };

  // Manejadores para buses
  const handleCreateBus = async (busData) => {
    try {
      const newBus = await transportService.createBus(busData);
      setBuses(prev => [...prev, newBus]);
      return true;
    } catch (err) {
      setError(err.message || 'Error al crear el bus');
      return false;
    }
  };

  const handleUpdateBus = async (busId, busData) => {
    try {
      const updatedBus = await transportService.updateBus(busId, busData);
      setBuses(prev => prev.map(bus => 
        (bus.id_vehiculos === busId || bus.id === busId) ? updatedBus : bus
      ));
      return true;
    } catch (err) {
      setError(err.message || 'Error al actualizar el bus');
      return false;
    }
  };

  const handleDeleteBus = async (busId) => {
    try {
      await transportService.deleteBus(busId);
      setBuses(prev => prev.filter(bus => bus.id_vehiculos !== busId && bus.id !== busId));
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar el bus');
      return false;
    }
  };

  // Función robusta para obtener el nombre del rol
  const getRoleName = (user) => {
    if (!user) return '';
    if (typeof user.role === 'string' && user.role.trim() !== '') return user.role;
    if (typeof user.rol === 'string' && user.rol.trim() !== '') return user.rol;
    if (user?.perfil?.role && typeof user.perfil.role === 'string') return user.perfil.role;
    if (user?.perfil?.rol && typeof user.perfil.rol === 'string') return user.perfil.rol;
    if (user.roleId === 1 || user.rol_id === 1) return 'Administrador';
    if (user.roleId === 2 || user.rol_id === 2) return 'Conductor';
    if (user.roleId === 3 || user.rol_id === 3) return 'Usuario';
    if (Array.isArray(user.roles) && user.roles.length > 0) return user.roles[0];
    return '';
  };

  // Envío de PQRS
  const handlePqrsSubmit = async (pqrsData) => {
    setPqrsSuccess('');
    setPqrsError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/pqrs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo: pqrsData.type.toLowerCase(),
          asunto: pqrsData.type,
          descripcion: pqrsData.message,
          estado: 'pendiente' // El backend lo maneja automáticamente, pero lo enviamos por claridad
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al enviar PQRS');
      }
      setPqrsSuccess('PQRS enviada correctamente');
      // Recargar la lista de PQRS del usuario
      const updated = await response.json();
      setPqrs((prev) => [...prev, updated]);
    } catch (err) {
      setPqrsError(err.message || 'Error al enviar PQRS');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-[#040911] text-white">
        <div className="ambient-glow-wrapper">
          <div className="ambient-orb ambient-orb-1"></div>
          <div className="ambient-orb ambient-orb-2"></div>
        </div>
        <div className="surface rounded-3xl p-8 max-w-xs w-full text-center relative z-10 border border-white/15 shadow-glass-lg">
          <div className="relative mx-auto w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-sky-400/20 animate-ping"></div>
            <div className="w-14 h-14 rounded-full border-4 border-t-sky-400 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="mt-5 text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const displayName = user?.nombre || user?.name || 'Usuario';
  const displayRole = getRoleName(user);

  const tabs = [
    {
      id: 'routes',
      label: 'Rutas',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
      )
    },
    {
      id: 'rates',
      label: 'Tarifas',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      )
    },
    {
      id: 'drivers',
      label: 'Conductores',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      id: 'buses',
      label: 'Buses',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="14" rx="2" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="16.5" cy="17.5" r="2.5" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      id: 'pqrs',
      label: 'PQRS',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      id: 'assistant',
      label: 'Asistente IA',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
        </svg>
      )
    },
  ];
  if (isAdmin) {
    tabs.push({
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    });
  }

  return (
    <div className="app-shell min-h-screen">
      <header className="app-topbar">
        <div className="app-topbar-inner">
          {/* Logo & User Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500/30 to-indigo-500/30 backdrop-blur-xl flex items-center justify-center border border-white/25 shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                aria-hidden="true"
              >
                <path
                  d="M12 2.25 20.25 6.9V17.1L12 21.75 3.75 17.1V6.9L12 2.25Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 2.25V12m0 0 8.25-5.1M12 12 3.75 6.9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="app-title brand-gradient-text text-base sm:text-lg font-extrabold tracking-wider">CHEEMS</div>
              <div className="app-subtle truncate flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-900 dark:text-slate-200">{displayName}</span>
                {displayRole && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/10 dark:bg-sky-500/15 border border-sky-300 dark:border-sky-400/25 text-sky-700 dark:text-sky-300 font-medium text-[10px]">
                    {displayRole}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Pill Group */}
          <div className="hidden md:flex items-center gap-3">
            <div className="nav-pill-group">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={`nav-pill flex items-center gap-1.5 ${
                    activeTab === t.id ? 'nav-pill-active' : ''
                  }`}
                  onClick={() => setActiveTab(t.id)}
                >
                  <span className="shrink-0">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Theme Mode Switcher (Retains the ☀️ / 🌙 emoji toggle as requested) */}
            <ThemeToggle size="sm" showLabel={false} />

            <button onClick={handleLogout} className="btn-danger text-xs px-3.5 py-2">
              Salir
            </button>
          </div>

          {/* Mobile Actions: Theme Toggle & Logout */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle size="sm" showLabel={false} />
            <button onClick={handleLogout} className="btn-danger text-xs px-3 py-1.5">
              Salir
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="app-content pt-4 pb-0">
          <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-700 dark:text-rose-200 text-sm shadow-[0_0_15px_rgba(251,113,133,0.15)] flex items-center gap-2" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <main className="app-content content-safe-bottom">
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400"></div>
            </div>
          ) : (
            <>
              {activeTab === 'routes' && (
                <TransportRoutes
                  routes={routes}
                  isAdmin={isAdmin}
                  onCreateRoute={handleCreateRoute}
                  onUpdateRoute={handleUpdateRoute}
                  onDeleteRoute={handleDeleteRoute}
                />
              )}
              {activeTab === 'rates' && (
                <TariffManagement user={user} />
              )}
              {activeTab === 'pqrs' && (
                <div className="space-y-6">
                  {pqrsLoading ? (
                    <div className="text-center text-slate-400 py-8">Cargando PQRS...</div>
                  ) : isAdmin ? (
                    <PqrsList pqrs={pqrs} />
                  ) : (
                    <>
                      {pqrsSuccess && (
                        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-700 dark:text-emerald-300 text-sm text-center">
                          {pqrsSuccess}
                        </div>
                      )}
                      {pqrsError && (
                        <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-700 dark:text-rose-300 text-sm text-center">
                          {pqrsError}
                        </div>
                      )}
                      <PqrsForm onSubmit={handlePqrsSubmit} />
                      <PqrsList pqrs={pqrs} />
                    </>
                  )}
                </div>
              )}
              {activeTab === 'drivers' && (
                <DriverInfo
                  drivers={drivers}
                  isAdmin={isAdmin}
                  onCreateDriver={handleCreateDriver}
                  onUpdateDriver={handleUpdateDriver}
                  onDeleteDriver={handleDeleteDriver}
                />
              )}
              {activeTab === 'buses' && (
                <BusInfo
                  buses={buses}
                  isAdmin={isAdmin}
                  onCreateBus={handleCreateBus}
                  onUpdateBus={handleUpdateBus}
                  onDeleteBus={handleDeleteBus}
                />
              )}
              {activeTab === 'dashboard' && isAdmin && (
                <AdminDashboardCharts />
              )}
              {activeTab === 'assistant' && <AssistantChat />}
            </>
          )}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar with Frosted Glass */}
      <nav className="bottom-tabbar" aria-label="Navegación inferior">
        <div className={`bottom-tabbar-inner ${isAdmin ? 'grid-cols-7' : 'grid-cols-6'}`}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab-item ${activeTab === t.id ? 'tab-item-active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="shrink-0">{t.icon}</span>
              <span className="truncate max-w-[50px]">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default TransportDashboard;

// DONE