import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Definir los roles
const ROLES = {
    PASAJERO: 1,
    CONDUCTOR: 2,
    ADMIN: 3
};

// Mapeo de IDs de roles a nombres
const ROLE_NAMES = {
    [ROLES.PASAJERO]: 'Pasajero',
    [ROLES.CONDUCTOR]: 'Conductor',
    [ROLES.ADMIN]: 'Administrador'
};

// Configurar axios para incluir el token en todas las peticiones
axios.interceptors.request.use(
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

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
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
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                // Solo cerrar sesión si es un error 401
                if (error.response?.status === 401) {
                    authService.logout();
                }
            }
        }
        return Promise.reject(error);
    }
);

// Guardar usuario y tokens correctamente tras login
const saveUserAndTokens = (data, userInfo) => {
    if (data.access && data.refresh) {
        localStorage.setItem('token', data.access);
        localStorage.setItem('refreshToken', data.refresh);
    }
    if (userInfo) {
        localStorage.setItem('user', JSON.stringify(userInfo));
    }
};

const authService = {
    // Iniciar sesión
    async login(credentials) {
        try {
            const response = await axios.post(`${API_URL}/token/`, credentials);
            const data = response.data;
            // Guardar el token antes de hacer la petición para obtener el usuario
            if (data.access && data.refresh) {
                localStorage.setItem('token', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                // Configurar el token en Axios para futuras peticiones
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
            }
            // Si la respuesta incluye el usuario, lo guardamos
            if (data.user) {
                saveUserAndTokens(data, data.user);
                return data.user;
            } else {
                // Si no, hacemos una petición adicional para obtenerlo
                const userInfoResp = await axios.get(`${API_URL}/usuarios/me/`);
                const userInfo = userInfoResp.data;
                saveUserAndTokens(data, userInfo);
                return userInfo;
            }
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Credenciales incorrectas');
            }
            throw new Error('Error al iniciar sesión');
        }
    },

    // Registrar usuario
    async register(userData) {
        try {
            const response = await axios.post(`${API_URL}/registro/`, userData);
            // Solo devolver el mensaje de éxito, no intentes obtener el usuario actual ni guardar token
            return response.data;
        } catch (error) {
            if (error.response?.data?.correo_electronico) {
                throw new Error('El correo electrónico ya está registrado');
            }
            if (error.response?.data?.username) {
                throw new Error('El nombre de usuario ya está registrado');
            }
            throw new Error('Error al registrar usuario');
        }
    },

    // Obtener información del usuario
    async getUserInfo() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            const response = await axios.get(`${API_URL}/usuarios/me/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data) {
                const userInfo = {
                    ...response.data,
                    role: ROLE_NAMES[response.data.rol_id] || 'Usuario',
                    roleId: response.data.rol_id
                };
                return userInfo;
            }
            return null;
        } catch (error) {
            console.error('Error al obtener información del usuario:', error);
            if (error.response?.status === 401) {
                this.logout();
            }
            return null;
        }
    },

    // Cerrar sesión
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },

    // Obtener el token actual
    getToken() {
        return localStorage.getItem('token');
    },

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    },

    isAdmin() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.roleId === ROLES.ADMIN;
    },

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token available');

            const response = await axios.post(`${API_URL}/token/refresh/`, {
                refresh: refreshToken
            });

            if (response.data.access) {
                localStorage.setItem('token', response.data.access);
                return response.data.access;
            }
            return null;
        } catch (error) {
            console.error('Error refreshing token:', error);
            this.logout();
            return null;
        }
    }
};

export default authService;

export const isAdmin = (user) => {
    const userRoleId = user?.rol || localStorage.getItem('userRoleId');
    return userRoleId === ROLES.ADMIN;
}; 