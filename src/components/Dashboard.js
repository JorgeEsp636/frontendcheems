import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import TransportDashboard from './TransportDashboard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState({
        name: localStorage.getItem('userName') || 'Usuario',
        role: localStorage.getItem('userRole') || 'user'
    });

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <TransportDashboard 
            user={user}
            onLogout={handleLogout}
        />
    );
};

export default Dashboard; 