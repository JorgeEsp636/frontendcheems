import axios from 'axios';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api', // URL base de tu API
    timeout: 10000, // Tiempo máximo de espera para las peticiones
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para agregar el token de autenticación a las peticiones
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

// Interceptor para manejar las respuestas
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 y no hemos intentado refrescar el token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Intentar refrescar el token
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken
                });

                // Guardar el nuevo token
                localStorage.setItem('token', response.data.access);

                // Actualizar el header de la petición original
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

                // Reintentar la petición original
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Si falla el refresh, redirigir al login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 