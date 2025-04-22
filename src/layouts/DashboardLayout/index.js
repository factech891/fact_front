// src/layouts/DashboardLayout/index.js (Simplificado)
import React from 'react';
import { Outlet } from 'react-router-dom'; // Importar Outlet para renderizar rutas anidadas
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
// Ya no necesitamos useAuth aquí si ProtectedRoute maneja la redirección
// import { useAuth } from '../../context/AuthContext'; 
// Ya no necesitamos useNavigate aquí si ProtectedRoute maneja la redirección
// import { useNavigate } from 'react-router-dom'; 

// Importamos el tema para usarlo en sx prop si es necesario
// Asegúrate de que la ruta de importación sea correcta
import theme from '../../theme'; 

export const DashboardLayout = () => {
  // Ya no necesitamos verificar loading o currentUser aquí.
  // ProtectedRoute se asegura de que este componente solo se renderice
  // cuando el usuario esté autenticado y la carga inicial haya terminado.

  // NOTA: Usamos <Outlet /> de react-router-dom v6 para renderizar
  // el componente de la ruta hija coincidente (Dashboard, Invoices, etc.)
  // Reemplaza a {children} cuando se usa con rutas anidadas definidas en App.js.

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
