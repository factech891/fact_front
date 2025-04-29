// src/layouts/DashboardLayout/Sidebar.js (modificado para admin link y Companies link)
import React from 'react';
import { useLocation, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Tooltip,
  Chip,
  Divider // Importar Divider si se usa
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// Importar iconos específicos si se usan
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // Icono para Panel Admin
import BusinessIcon from '@mui/icons-material/Business'; // Importar icono para Compañías

import { useCompany } from '../../hooks/useCompany';
import { useAuth } from '../../context/AuthContext'; // Importamos el contexto de autenticación

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = React.useState(false);

  // Obtenemos los datos de la empresa y el estado de carga
  const { company, loading: companyLoading } = useCompany();

  // Obtenemos el usuario actual y la función de logout del contexto de autenticación
  const { currentUser, logout } = useAuth();

  // --- IMPORTANTE: Usa el mismo rol que definiste en App.js ---
  const PLATFORM_ADMIN_ROLE = 'platform_admin';

  // Usamos el nombre real o un valor por defecto/carga
  const companyName = company?.nombre || "Mi Empresa";
  const companyLogoUrl = company?.logoUrl;

  const collapsedWidth = 72;
  const expandedWidth = 240;
  const open = isHovering;

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    // navigate('/auth/login'); // Redirigir al login
  };

  // Configuración de los items del menú
  const menuItems = [
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="home" style={{ fontSize: '20px' }}>🏠</span></Box> ),
      path: '/',
      hidden: currentUser?.role === 'facturador' || currentUser?.role === PLATFORM_ADMIN_ROLE // Oculto para facturador y platform_admin
    },
    // --- Items del Panel de Administración ---
    {
      id: 'platformAdmin',
      text: 'Panel Admin',
      icon: <AdminPanelSettingsIcon />, // Usar un icono adecuado
      path: '/platform-admin', // Ruta base del panel de admin (dashboard)
      hidden: currentUser?.role !== PLATFORM_ADMIN_ROLE // Oculto si NO es platform_admin
    },
    // --- Inicio Modificación: Añadir item de Compañías ---
    {
        id: 'platformAdminCompanies',
        text: 'Compañías',
        icon: <BusinessIcon />, // O cualquier otro icono adecuado
        path: '/platform-admin/companies',
        hidden: currentUser?.role !== PLATFORM_ADMIN_ROLE
    },
    // --- Fin Modificación: Añadir item de Compañías ---
    // --- Fin de items del Panel de Administración ---
    {
      id: 'invoices',
      text: 'Facturas',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="invoice" style={{ fontSize: '20px' }}>📄</span></Box> ),
      path: '/invoices',
      hidden: currentUser?.role === PLATFORM_ADMIN_ROLE // Oculto para platform_admin
    },
    {
      id: 'documents',
      text: 'Cotizaciones',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="quotes" style={{ fontSize: '20px' }}>📋</span></Box> ),
      path: '/documents',
       hidden: currentUser?.role === PLATFORM_ADMIN_ROLE // Oculto para platform_admin
    },
    {
      id: 'clients',
      text: 'Clientes',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="clients" style={{ fontSize: '20px' }}>👥</span></Box> ),
      path: '/clients',
       hidden: currentUser?.role === PLATFORM_ADMIN_ROLE // Oculto para platform_admin
    },
    {
      id: 'products',
      text: 'Productos',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="products" style={{ fontSize: '20px' }}>📦</span></Box> ),
      path: '/products',
       hidden: currentUser?.role === PLATFORM_ADMIN_ROLE // Oculto para platform_admin
    },
    {
      id: 'users',
      text: 'Usuarios',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="users" style={{ fontSize: '20px' }}>👤</span></Box> ),
      path: '/users',
      // Oculto si no es admin o gerente Y TAMBIÉN si es platform_admin
      hidden: !['admin', 'gerente'].includes(currentUser?.role) || currentUser?.role === PLATFORM_ADMIN_ROLE
    },
    {
      id: 'settings',
      text: 'Configuración',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="settings" style={{ fontSize: '20px' }}>⚙️</span></Box> ),
      path: '/settings',
       // Oculto si no es admin o gerente Y TAMBIÉN si es platform_admin
      hidden: !['admin', 'gerente'].includes(currentUser?.role) || currentUser?.role === PLATFORM_ADMIN_ROLE
    },
  ];

  // Iconos
  const aiAssistantIcon = ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="ai-assistant" style={{ fontSize: '20px' }}>🤖</span></Box> );
  const supportIcon = ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="support" style={{ fontSize: '20px' }}>❓</span></Box> );
  const logoutIcon = ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="logout" style={{ fontSize: '20px' }}>🚪</span></Box> );

  // Función para obtener iniciales
  const getCompanyInitials = () => {
    // Si es platform_admin, mostrar iniciales fijas o un icono
    if (currentUser?.role === PLATFORM_ADMIN_ROLE) {
        return 'PA'; // O cualquier otra cosa que identifique al admin de plataforma
    }
    // Lógica existente para empresas normales
    if (!companyName || companyLoading) return "...";
    const words = companyName.split(' ');
    if (words.length > 1) {
        return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length > 1) {
        return (words[0][0] + words[0][1]).toUpperCase();
    } else if (words.length === 1 && words[0].length === 1) {
         return words[0][0].toUpperCase();
    }
    return '??';
  };

   // Lógica para el nombre y RIF/Identificador en la cabecera
   const getHeaderText = () => {
       if (currentUser?.role === PLATFORM_ADMIN_ROLE) {
           return {
               name: "Admin Plataforma", // O currentUser?.nombre si prefieres
               identifier: "Superusuario"
           };
       }
       // Lógica existente para empresas
       return {
           name: companyLoading ? 'Cargando...' : companyName,
           identifier: companyLoading ? '' : (company?.rif ? `RIF: ${company.rif}` : 'Sistema de Facturación')
       };
   };
   const headerInfo = getHeaderText();


  // isActive (modificado para incluir la ruta del admin y companies)
  const isActive = (path) => {
    if (!path) return false;
    // Coincidencia exacta para la ruta raíz '/'
    if (path === '/') return location.pathname === '/';
    // Coincidencia para platform-admin y sus subrutas (excepto la raíz)
    // Esto asegura que '/platform-admin/companies' marque 'companies' como activo y no el dashboard '/platform-admin'
    if (path.startsWith('/platform-admin/')) return location.pathname === path || location.pathname.startsWith(path + '/');
    // Coincidencia exacta para el dashboard de platform-admin
    if (path === '/platform-admin') return location.pathname === '/platform-admin';
    // Coincidencia para otras rutas y sus subrutas
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };


  const mainColor = '#2196F3'; // Color principal
  const adminColor = '#9c27b0'; // Color distintivo para el admin (morado)

  const drawerStyles = {
    width: open ? expandedWidth : collapsedWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    bgcolor: '#ffffff', // Fondo blanco
    color: '#333333', // Color de texto principal
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRight: '1px solid #e0e0e0', // Borde derecho sutil
  };

  // Filtrar elementos del menú que no deben ocultarse
  const filteredMenuItems = menuItems.filter(item => !item.hidden);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? expandedWidth : collapsedWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('width', {
             easing: theme.transitions.easing.sharp,
             duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
        }),
        '& .MuiDrawer-paper': drawerStyles,
      }}
      PaperProps={{
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      }}
    >
      {/* Cabecera del Sidebar (modificada para admin) */}
       <Box sx={{
           display: 'flex',
           alignItems: 'center',
           justifyContent: open ? 'flex-start' : 'center',
           padding: theme.spacing(0, open ? 2 : 1),
           borderBottom: '1px solid #e0e0e0',
           height: '72px', // Altura fija
           overflow: 'hidden'
        }}>
         {/* Avatar: Mostrar logo de empresa o icono/iniciales de admin */}
         {currentUser?.role === PLATFORM_ADMIN_ROLE ? (
             <Avatar sx={{ bgcolor: adminColor, color: 'white', width: 40, height: 40, mr: open ? 1.5 : 0, transition: theme.transitions.create(['margin', 'width', 'height']) }}>
                 <AdminPanelSettingsIcon />
             </Avatar>
         ) : companyLogoUrl ? (
           <Avatar variant="rounded" src={companyLogoUrl} alt={`${companyName} logo`} sx={{ width: 40, height: 40, mr: open ? 1.5 : 0, transition: theme.transitions.create(['margin', 'width', 'height']), bgcolor: 'transparent' }} />
         ) : (
           <Avatar sx={{ bgcolor: mainColor, color: 'white', width: 40, height: 40, mr: open ? 1.5 : 0, transition: theme.transitions.create(['margin', 'width', 'height']) }}>
             {companyLoading ? '...' : getCompanyInitials()}
           </Avatar>
         )}
         {/* Nombre y RIF/Identificador (visible si expandido) */}
         {open && (
           <Box sx={{ overflow: 'hidden', flexGrow: 1, ml: currentUser?.role === PLATFORM_ADMIN_ROLE ? 0 : 0 }}>
             <Typography variant="subtitle1" fontWeight="bold" color="#333333" noWrap>
               {headerInfo.name}
             </Typography>
             <Typography variant="caption" color="#666666" noWrap>
               {headerInfo.identifier}
             </Typography>
           </Box>
         )}
       </Box>

      {/* Menú principal */}
      <List sx={{ px: open ? 1 : 1.5, py: 2, flexGrow: 1 }}>
        {filteredMenuItems.map((item) => {
          const active = isActive(item.path);
          // Determinar color activo basado en si es admin o no
          const itemColor = item.id.startsWith('platformAdmin') ? adminColor : mainColor;
          return (
            <ListItem key={item.id} disablePadding sx={{ display: 'block', position: 'relative', mb: 0.5 }} >
              {/* Indicador activo */}
              {active && ( <Box sx={{ position: 'absolute', left: 0, top: '15%', width: 4, height: '70%', backgroundColor: itemColor, borderRadius: '0 4px 4px 0', opacity: open ? 1 : 0, transition: theme.transitions.create('opacity') }} /> )}
              <ListItemButton
                  component={RouterLink}
                  to={item.path || '#'}
                  sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      backgroundColor: active ? (item.id.startsWith('platformAdmin') ? 'rgba(156, 39, 176, 0.08)' : 'rgba(33, 150, 243, 0.08)') : 'transparent',
                      '&:hover': {
                          backgroundColor: item.id.startsWith('platformAdmin') ? 'rgba(156, 39, 176, 0.12)' : 'rgba(33, 150, 243, 0.12)',
                      },
                  }}
              >
                  {/* Icono con Tooltip si está cerrado */}
                  {!open ? (
                      <Tooltip title={item.text} placement="right">
                          <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: active ? itemColor : 'inherit' }}>
                              {item.icon}
                          </ListItemIcon>
                      </Tooltip>
                  ) : (
                      <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center', transition: theme.transitions.create('margin'), color: active ? itemColor : 'inherit' }}>
                          {item.icon}
                      </ListItemIcon>
                  )}
                  {/* Texto del menú */}
                  <ListItemText
                      primary={item.text}
                      sx={{
                          opacity: open ? 1 : 0,
                          transition: theme.transitions.create('opacity', { duration: theme.transitions.duration.leavingScreen }),
                          '& .MuiTypography-root': {
                              fontWeight: active ? '600' : '500',
                              color: active ? itemColor : '#333333',
                              whiteSpace: 'nowrap',
                          }
                      }}
                  />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Asistente IA (oculto para platform_admin) */}
      {currentUser?.role !== PLATFORM_ADMIN_ROLE && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
               {open ? (
                  <Box sx={{ mx: 2, overflow: 'hidden', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid rgba(33, 150, 243, 0.1)', width: '100%' }} >
                    <Box sx={{ bgcolor: mainColor, p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }} >
                      <Box sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} > <span role="img" aria-label="robot" style={{ fontSize: '18px' }}>🤖</span> </Box>
                      <Typography variant="subtitle2" fontWeight="medium" color="white" noWrap> Asistente IA </Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'white', p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                      <Chip label="Próximamente" size="small" sx={{ bgcolor: 'rgba(33, 150, 243, 0.08)', color: mainColor, fontWeight: 'medium', border: '1px solid rgba(33, 150, 243, 0.2)' }} />
                    </Box>
                  </Box>
               ) : (
                 <Tooltip title="Asistente IA - Próximamente" placement="right">
                   <Avatar sx={{ width: 42, height: 42, bgcolor: mainColor, color: 'white', fontSize: 18, boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)' }} > 🤖 </Avatar>
                 </Tooltip>
               )}
          </Box>
      )}


        {/* Footer del sidebar */}
        <Box sx={{ px: open ? 2 : 1, pb: 2, pt: 1, borderTop: '1px solid #e0e0e0' }}>
          {/* Soporte (oculto para platform_admin) */}
          {currentUser?.role !== PLATFORM_ADMIN_ROLE && (
              <ListItemButton
                sx={{ borderRadius: 1, mb: 1, justifyContent: 'center', minHeight: 42, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                component={RouterLink}
                to="/support" // Ajusta la ruta si es necesario
              >
                {!open ? (
                  <Tooltip title="Soporte" placement="right">
                    <ListItemIcon sx={{ minWidth: 0 }}> {supportIcon} </ListItemIcon>
                  </Tooltip>
                ) : (
                  <ListItemIcon sx={{ minWidth: 0, mr: 2 }}> {supportIcon} </ListItemIcon>
                )}
                <ListItemText primary="Soporte" sx={{ opacity: open ? 1 : 0, transition: theme.transitions.create('opacity', { duration: theme.transitions.duration.leavingScreen }), '& .MuiTypography-root': { color: '#666666', whiteSpace: 'nowrap' } }} />
              </ListItemButton>
          )}
          {/* Cerrar Sesión */}
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 1, justifyContent: 'center', minHeight: 42, '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' } }}
          >
            {!open ? (
              <Tooltip title="Cerrar sesión" placement="right">
                <ListItemIcon sx={{ minWidth: 0, color: '#d32f2f' }}> {logoutIcon} </ListItemIcon>
              </Tooltip>
            ) : (
              <ListItemIcon sx={{ minWidth: 0, mr: 2, color: '#d32f2f' }}> {logoutIcon} </ListItemIcon>
            )}
            <ListItemText primary="Cerrar sesión" sx={{ opacity: open ? 1 : 0, transition: theme.transitions.create('opacity', { duration: theme.transitions.duration.leavingScreen }), '& .MuiTypography-root': { color: '#d32f2f', whiteSpace: 'nowrap', fontWeight: '500' } }} />
          </ListItemButton>
        </Box>
      </Drawer>
    );
  };

  export default Sidebar;