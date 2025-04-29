// src/layouts/DashboardLayout/index.js (Simplificado)
import React from 'react';
import { Outlet } from 'react-router-dom'; // Importar Outlet para renderizar rutas anidadas
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import theme from '../../theme'; 

export const DashboardLayout = () => {
  
  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      overflow: 'hidden', // Evita el desbordamiento general
      backgroundColor: theme.palette.background.default // Fondo general
    }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenedor principal */}
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden' // Evita que el contenedor principal desborde
      }}>
        {/* Navbar superior */}
        <Navbar />
        
        {/* Área de contenido principal con scroll */}
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: 3, // Padding alrededor del contenido
          overflowY: 'auto', // Habilita el scroll vertical solo para esta área
          // No es necesario backgroundColor aquí si ya está en el contenedor padre
        }}>
          {/* Renderiza el componente de la ruta anidada actual */}
          <Outlet /> 
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;