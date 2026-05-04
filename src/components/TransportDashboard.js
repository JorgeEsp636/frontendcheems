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
      setRoutes([...routes, newRoute]);
      return true;
    } catch (err) {
      setError(err.message || 'Error al crear la ruta');
      return false;
    }
  };

  const handleUpdateRoute = async (routeId, routeData) => {
    try {
      const updatedRoute = await transportService.updateRoute(routeId, routeData);
      setRoutes(routes.map(route => 
        route.id === routeId ? updatedRoute : route
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
      setRoutes(routes.filter(route => route.id !== routeId));
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
      setRates([...rates, newRate]);
      return true;
    } catch (err) {
      setError(err.message || 'Error al crear la tarifa');
      return false;
    }
  };

  const handleUpdateRate = async (rateId, rateData) => {
    try {
      const updatedRate = await transportService.updateRate(rateId, rateData);
        setRates(rates.map(rate => 
        rate.id === rateId ? updatedRate : rate
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
      setRates(rates.filter(rate => rate.id !== rateId));
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
      setDrivers([...drivers, newDriver]);
      return true;
    } catch (err) {
      setError(err.message || 'Error al crear el conductor');
      return false;
    }
  };

  const handleUpdateDriver = async (driverId, driverData) => {
    try {
      const updatedDriver = await transportService.updateDriver(driverId, driverData);
      setDrivers(drivers.map(driver => 
        driver.id === driverId ? updatedDriver : driver
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
      setDrivers(drivers.filter(driver => driver.id !== driverId));
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
      setBuses([...buses, newBus]);
      return true;
    } catch (err) {
      setError(err.message || 'Error al crear el bus');
      return false;
    }
  };

  const handleUpdateBus = async (busId, busData) => {
    try {
      const updatedBus = await transportService.updateBus(busId, busData);
      setBuses(buses.map(bus => 
        bus.id === busId ? updatedBus : bus
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
      setBuses(buses.filter(bus => bus.id !== busId));
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">CHEEMS Transport</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <div className="flex space-x-4 mb-6 justify-center">
                  <button
                    className={`px-4 py-2 rounded ${activeTab === 'routes' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('routes')}
                  >
                    Rutas
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${activeTab === 'rates' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('rates')}
                  >
                    Tarifas
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${activeTab === 'drivers' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('drivers')}
                  >
                    Conductores
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${activeTab === 'buses' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('buses')}
                  >
                    Buses
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${activeTab === 'pqrs' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('pqrs')}
                  >
                    PQRS
                  </button>
                  {isAdmin && (
                    <button
                      className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => setActiveTab('dashboard')}
                    >
                      Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-4">
                <div className="text-gray-700">
                  {(() => {
                    const nombre = user?.nombre || user?.name || 'Usuario';
                    const rol = getRoleName(user);
                    return rol ? (
                      <span className="font-medium">{nombre} <span className="text-sm text-gray-500">({rol})</span></span>
                    ) : (
                      <span className="font-medium">{nombre}</span>
                    );
                  })()}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'routes' && (
                <TransportRoutes
                  routes={routes}
                  isAdmin={user?.rol === 3 || user?.rol_id === 3}
                  onCreateRoute={handleCreateRoute}
                  onUpdateRoute={handleUpdateRoute}
                  onDeleteRoute={handleDeleteRoute}
                />
              )}
              {activeTab === 'rates' && (
                <TariffManagement user={user} />
              )}
              {activeTab === 'pqrs' && (
                <div>
                  {pqrsLoading ? (
                    <div className="text-center text-gray-500">Cargando PQRS...</div>
                  ) : isAdmin ? (
                    <PqrsList pqrs={pqrs} />
                  ) : (
                    <>
                      {pqrsSuccess && <div className="text-green-600 text-center mb-2">{pqrsSuccess}</div>}
                      {pqrsError && <div className="text-red-600 text-center mb-2">{pqrsError}</div>}
                      <PqrsForm onSubmit={handlePqrsSubmit} />
                      <div className="mt-8">
                        <PqrsList pqrs={pqrs} />
                      </div>
                    </>
                  )}
                </div>
              )}
              {activeTab === 'drivers' && (
                <DriverInfo
                  drivers={drivers}
                  isAdmin={user?.rol === 3 || user?.rol_id === 3}
                  onCreateDriver={handleCreateDriver}
                  onUpdateDriver={handleUpdateDriver}
                  onDeleteDriver={handleDeleteDriver}
                />
              )}
              {activeTab === 'buses' && (
                <BusInfo
                  buses={buses}
                  isAdmin={user?.rol === 3 || user?.rol_id === 3}
                  onCreateBus={handleCreateBus}
                  onUpdateBus={handleUpdateBus}
                  onDeleteBus={handleDeleteBus}
                />
              )}
              {activeTab === 'dashboard' && isAdmin && (
                <AdminDashboardCharts />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransportDashboard;

// DONE