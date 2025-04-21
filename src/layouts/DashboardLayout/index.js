// src/layouts/DashboardLayout/index.js
import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';

export const DashboardLayout = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  // Redirigir al usuario al login si no está autenticado
  React.useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/auth/login');
    }
  }, [currentUser, loading, navigate]);

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p>Cargando...</p>
      </Box>
    );
  }

  // Si no hay usuario y no está cargando, no mostrar nada (la redirección ya está en marcha)
  if (!currentUser && !loading) {
    return null;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenedor principal */}
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Navbar superior */}
        <Navbar />
        
        {/* Área de contenido */}
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: 3,
          overflow: 'auto',
          backgroundColor: theme => theme.palette.background.default
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;