import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export const DashboardLayout = ({ children }) => {
  // Estado para controlar si el sidebar está colapsado
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Empresa que ha iniciado sesión - esto podría venir de un contexto de autenticación
  const companyInfo = {
    name: "Transportes Express",
    // Otros datos que podrían ser útiles
    plan: "Premium",
    logo: null // URL del logo si existe
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Sidebar con el nombre de la empresa */}
      <Sidebar 
        companyName={companyInfo.name} 
        open={sidebarOpen} 
        onToggle={toggleSidebar} 
      />
      
      {/* Contenedor principal */}
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Navbar superior */}
        <Navbar companyName={companyInfo.name} />
        
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