const ADMIN_CREDENTIALS = {
    email: 'jorgemoreno062006@gmail.com',
    password: '12345678'
};

export const login = async (email, password) => {
    console.log('Login attempt:', { email, password });
    console.log('Admin credentials:', ADMIN_CREDENTIALS);

    // Verificar si es el administrador
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        console.log('Login exitoso como administrador');
        return {
            email: email,
            name: 'Administrador',
            username: 'Administrador',
            role: 'admin'
        };
    }
    
    // Para otros usuarios, permitir cualquier email/contraseña
    if (email && password) {
        console.log('Login exitoso como usuario normal');
        return {
            email: email,
            name: email.split('@')[0],
            username: email.split('@')[0],
            role: 'user'
        };
    }

    console.log('Login fallido');
    throw new Error('Credenciales inválidas');
};

export const register = async (userData) => {
    console.log('Register attempt:', userData);

    // No permitir registro con el email del administrador
    if (userData.email === ADMIN_CREDENTIALS.email) {
        throw new Error('Este correo electrónico no está disponible');
    }
    
    // Validar que los campos requeridos estén presentes
    if (!userData.email || !userData.username || !userData.password) {
        throw new Error('Todos los campos son requeridos');
    }

    console.log('Registro exitoso');
    return {
        email: userData.email,
        name: userData.username,
        username: userData.username,
        role: 'user'
    };
};

export const logout = () => {
    console.log('Logout');
};

export const isAuthenticated = () => {
    return true;
};

export const isAdmin = (user) => {
    return user && user.role === 'admin';
}; 