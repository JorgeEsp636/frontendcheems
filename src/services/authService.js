import axiosInstance from './axiosConfig';

const ADMIN_CREDENTIALS = {
    email: 'jorgemoreno062006@gmail.com',
    password: '12345678'
};

const authService = {
    // Iniciar sesión
    login: async (email, password) => {
        try {
            const response = await axiosInstance.post('/token/', {
                correo_electronico: email,
                contrasena: password
            });
            
            if (response.data.access) {
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);
                
                // Obtener información del usuario
                const userResponse = await axiosInstance.get('/usuarios/me/');
                const userData = userResponse.data;
                
                // Guardar información del usuario
                localStorage.setItem('userName', userData.nombre);
                localStorage.setItem('userRole', userData.rol_nombre);
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al iniciar sesión' };
        }
    },

    // Registrar usuario
    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/registro/', {
                correo_electronico: userData.correo_electronico,
                nombre: userData.nombre,
                contrasena: userData.contrasena
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al registrar usuario' };
        }
    },

    // Cerrar sesión
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
    },

    // Verificar si el usuario está autenticado
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Obtener el token actual
    getToken: () => {
        return localStorage.getItem('token');
    }
};

export default authService;

export const isAdmin = (user) => {
    return user && user.role === 'admin';
}; 