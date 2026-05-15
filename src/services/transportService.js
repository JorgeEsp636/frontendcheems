import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar el token a todas las peticiones
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Si es un error 403 o 401, intentar refrescar el token
        if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${API_URL}/token/refresh/`, {
                    refresh: refreshToken
                });

                if (response.data.access) {
                    localStorage.setItem('token', response.data.access);
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                // Solo cerrar sesión si es un error 401
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                }
            }
        }
        return Promise.reject(error);
    }
);

const transportService = {
    // Rutas
    getRoutes: async () => {
        try {
            const response = await axiosInstance.get('/rutas/');
            return response.data;
        } catch (error) {
            console.error('Error fetching routes:', error);
            throw new Error(error.response?.data?.message || 'Error al obtener las rutas');
        }
    },

    createRoute: async (routeData) => {
        try {
            const response = await axiosInstance.post('/rutas/', routeData);
            return response.data;
        } catch (error) {
            console.error('Error creating route:', error);
            throw new Error(error.response?.data?.message || 'Error al crear la ruta');
        }
    },

    updateRoute: async (routeId, routeData) => {
        try {
            const response = await axiosInstance.put(`/rutas/${routeId}/`, routeData);
            return response.data;
        } catch (error) {
            console.error('Error updating route:', error);
            throw new Error(error.response?.data?.message || 'Error al actualizar la ruta');
        }
    },

    deleteRoute: async (routeId) => {
        try {
            const response = await axiosInstance.delete(`/rutas/${routeId}/`);
            return response.data;
        } catch (error) {
            console.error('Error deleting route:', error);
            throw new Error(error.response?.data?.message || 'Error al eliminar la ruta');
        }
    },

    // Tarifas
    getRates: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token available');
            }

            // Elimino el filtro de admin para que todos puedan ver las tarifas
            const response = await axiosInstance.get('/tarifas/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching rates:', error);
            // Si hay cualquier error, devolver un array vacío
            return [];
        }
    },

    createRate: async (rateData) => {
        try {
            const response = await axiosInstance.post('/tarifas/', rateData);
            return response.data;
        } catch (error) {
            console.error('Error creating rate:', error);
            throw new Error(error.response?.data?.message || 'Error al crear la tarifa');
        }
    },

    updateRate: async (rateId, rateData) => {
        try {
            const response = await axiosInstance.put(`/tarifas/${rateId}/`, rateData);
            return response.data;
        } catch (error) {
            console.error('Error updating rate:', error);
            throw new Error(error.response?.data?.message || 'Error al actualizar la tarifa');
        }
    },

    deleteRate: async (rateId) => {
        try {
            const response = await axiosInstance.delete(`/tarifas/${rateId}/`);
            return response.data;
        } catch (error) {
            console.error('Error deleting rate:', error);
            throw new Error(error.response?.data?.message || 'Error al eliminar la tarifa');
        }
    },

    // Conductores
    getDrivers: async () => {
        try {
            const response = await axiosInstance.get('/conductores/');
            return response.data;
        } catch (error) {
            console.error('Error fetching drivers:', error);
            if (error.response?.status === 403) {
                console.log('Acceso denegado a conductores');
                return [];
            }
            throw new Error(error.response?.data?.message || 'Error al obtener los conductores');
        }
    },

    createDriver: async (driverData) => {
        try {
            const response = await axiosInstance.post('/conductores/', driverData);
            return response.data;
        } catch (error) {
            console.error('Error creating driver:', error);
            throw new Error(error.response?.data?.message || 'Error al crear el conductor');
        }
    },

    updateDriver: async (driverId, driverData) => {
        try {
            const response = await axiosInstance.put(`/conductores/${driverId}/`, driverData);
            return response.data;
        } catch (error) {
            console.error('Error updating driver:', error);
            throw new Error(error.response?.data?.message || 'Error al actualizar el conductor');
        }
    },

    deleteDriver: async (driverId) => {
        try {
            const response = await axiosInstance.delete(`/conductores/${driverId}/`);
            return response.data;
        } catch (error) {
            console.error('Error deleting driver:', error);
            throw new Error(error.response?.data?.message || 'Error al eliminar el conductor');
        }
    },

    // Buses
    getBuses: async () => {
        try {
            const response = await axiosInstance.get('/vehiculos/');
            return response.data;
        } catch (error) {
            console.error('Error fetching buses:', error);
            if (error.response?.status === 403) {
                console.log('Acceso denegado a buses');
                return [];
            }
            throw new Error(error.response?.data?.message || 'Error al obtener los buses');
        }
    },

    createBus: async (busData) => {
        try {
            const response = await axiosInstance.post('/vehiculos/', busData);
            return response.data;
        } catch (error) {
            console.error('Error creating bus:', error);
            throw new Error(error.response?.data?.message || 'Error al crear el bus');
        }
    },

    updateBus: async (busId, busData) => {
        try {
            const response = await axiosInstance.put(`/vehiculos/${busId}/`, busData);
            return response.data;
        } catch (error) {
            console.error('Error updating bus:', error);
            throw new Error(error.response?.data?.message || 'Error al actualizar el bus');
        }
    },

    deleteBus: async (busId) => {
        try {
            const response = await axiosInstance.delete(`/vehiculos/${busId}/`);
            return response.data;
        } catch (error) {
            console.error('Error deleting bus:', error);
            throw new Error(error.response?.data?.message || 'Error al eliminar el bus');
        }
    }
};

export { axiosInstance };
export default transportService; 