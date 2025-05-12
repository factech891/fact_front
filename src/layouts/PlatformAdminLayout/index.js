// src/layouts/PlatformAdminLayout/index.js
import React from 'react';
import { Outlet } from 'react-router-dom'; // Para renderizar las páginas anidadas del admin
import { Box } from '@mui/material';
// Asumimos que podrías querer un Sidebar o Navbar específico para Admin en el futuro.
// Por ahora, podemos reutilizar los existentes o crear unos nuevos si ya los tienes.
// Si quieres usar los mismos que DashboardLayout:
import Sidebar from '../DashboardLayout/Sidebar'; // Ajusta la ruta si es necesario
import Navbar from '../DashboardLayout/Navbar';  // Ajusta la ruta si es necesario
// Si planeas crear Sidebar/Navbar específicos para admin, impórtalos desde aquí:
// import AdminSidebar from './AdminSidebar';
// import AdminNavbar from './AdminNavbar';

// Importa tu tema si lo necesitas directamente aquí
import theme from '../../theme';

/**
 * Layout principal para las páginas del panel de administración de la plataforma.
 * Define la estructura con Sidebar, Navbar y área de contenido principal.
 */
const PlatformAdminLayout = () => {
  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden', // Previene scroll en el nivel más alto
      backgroundColor: theme.palette.background.default // Usar el fondo del tema
    }}>
      {/* Sidebar: Usa el Sidebar general o uno específico para admin */}
      <Sidebar />
      {/* <AdminSidebar /> */}

      {/* Contenedor Principal */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden' // Previene scroll en este contenedor
      }}>
        {/* Navbar: Usa el Navbar general o uno específico para admin */}
        <Navbar />
        {/* <AdminNavbar /> */}

        {/* Área de Contenido Principal (Scrollable) */}
        <Box component="main" sx={{
          flexGrow: 1,
          p: 3, // Padding estándar
          overflowY: 'auto', // Habilita scroll vertical solo aquí
          // backgroundColor opcional si quieres diferenciar visualmente el área
        }}>
          {/* Aquí se renderizará el componente de la ruta admin actual (Dashboard, Companies, etc.) */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default PlatformAdminLayout;