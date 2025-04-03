import React, { useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Tooltip,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Sidebar = ({ companyName = "Transportes Express" }) => {
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(false); // Estado inicial: colapsado

  const collapsedWidth = 72;
  const expandedWidth = 240;

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  // Configuración de los items del menú (Revertido a Productos)
  const menuItems = [
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="home" style={{ fontSize: '20px' }}>🏠</span></Box> ),
      path: '/',
    },
    {
      id: 'invoices',
      text: 'Facturas',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="invoice" style={{ fontSize: '20px' }}>📄</span></Box> ),
      path: '/invoices',
    },
    {
      id: 'documents',
      text: 'Cotizaciones',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="quotes" style={{ fontSize: '20px' }}>📋</span></Box> ),
      path: '/documents',
    },
    {
      id: 'clients',
      text: 'Clientes',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="clients" style={{ fontSize: '20px' }}>👥</span></Box> ),
      path: '/clients',
    },
    {
      // ***** REVERTIDO AQUÍ *****
      id: 'products', // antes 'items'
      text: 'Productos', // antes 'Items'
      icon: (
        <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span role="img" aria-label="products" style={{ fontSize: '20px' }}>📦</span>
        </Box>
      ),
      path: '/products', // antes '/items'
      // ***** FIN REVERSIÓN *****
    },
    {
      id: 'settings',
      text: 'Configuración',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="settings" style={{ fontSize: '20px' }}>⚙️</span></Box> ),
      path: '/settings',
    },
  ];

  // Iconos (sin cambios)
  const aiAssistantIcon = ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="ai-assistant" style={{ fontSize: '20px' }}>🤖</span></Box> );
  const supportIcon = ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="support" style={{ fontSize: '20px' }}>❓</span></Box> );
  const logoutIcon = ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="logout" style={{ fontSize: '20px' }}>🚪</span></Box> );

  // Funciones auxiliares (getCompanyInitials sin cambios)
  const getCompanyInitials = () => companyName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();

  // isActive actualizado para volver a buscar /products
  const isActive = (path) => {
    if (!path) return false;
    if (path === '/documents' && location.pathname.startsWith('/documents')) return true;
    // ***** REVERTIDO AQUÍ *****
    if (path === '/products' && location.pathname.startsWith('/products')) return true;
    // Asegurarse que la comparación exacta y startsWith funcionen bien juntos
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path) && path !== '/documents' && path !== '/products');
  };


  const mainColor = '#2196F3';
  const drawerStyles = {
    width: open ? expandedWidth : collapsedWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    bgcolor: '#ffffff',
    color: '#333333',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRight: '1px solid #e0e0e0',
  };


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
      {/* Cabecera del sidebar (sin cambios respecto a la versión anterior) */}
       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: theme.spacing(2), borderBottom: '1px solid #e0e0e0', height: '72px', ...(open && { justifyContent: 'flex-start', }) }} >
         <Avatar sx={{ bgcolor: mainColor, color: 'white', mr: open ? 1.5 : 0, transition: theme.transitions.create('margin', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen, }) }}>
           {getCompanyInitials()}
         </Avatar>
         {open && (
           <Box sx={{ overflow: 'hidden' }}>
             <Typography variant="subtitle1" fontWeight="bold" color="#333333" noWrap>{companyName}</Typography>
             <Typography variant="caption" color="#666666" noWrap>Sistema de Facturación</Typography>
           </Box>
         )}
       </Box>

      {/* Menú principal (la lógica interna ya usa menuItems actualizado) */}
      <List sx={{ px: open ? 1 : 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.id} disablePadding sx={{ display: 'block', position: 'relative', mb: 0.5 }} >
              {active && ( <Box sx={{ position: 'absolute', left: 0, top: '15%', width: 4, height: '70%', backgroundColor: mainColor, borderRadius: '0 4px 4px 0', opacity: open ? 1 : 0, transition: theme.transitions.create('opacity', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen, }) }} /> )}
              <ListItemButton component={RouterLink} to={item.path || '#'} sx={{ minHeight: 48, justifyContent: 'center', px: 2, py: 1, borderRadius: 1, backgroundColor: active ? 'rgba(33, 150, 243, 0.08)' : 'transparent', '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.12)' }, }} >
                <Tooltip title={item.text} placement="right" disableHoverListener={open}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0, justifyContent: 'center', transition: theme.transitions.create('margin', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen, }) }} >
                    {item.icon}
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, transition: theme.transitions.create('opacity', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen, }), '& .MuiTypography-root': { fontWeight: active ? 'medium' : 'normal', color: active ? mainColor : '#333333', whiteSpace: 'nowrap', } }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* SECCIÓN PLAN PREMIUM ELIMINADA */}

      <Box sx={{ flexGrow: 1 }} /> {/* Espacio flexible */}

      {/* Asistente IA (sin cambios) */}
       <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
         {open ? ( /* ... JSX para asistente abierto ... */
            <Box sx={{ mx: 2, overflow: 'hidden', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid rgba(33, 150, 243, 0.1)', width: '100%' }} >
              <Box sx={{ bgcolor: mainColor, p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }} >
                <Box sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} > <span role="img" aria-label="robot" style={{ fontSize: '18px' }}>🤖</span> </Box>
                <Typography variant="subtitle2" fontWeight="medium" color="white" noWrap> Asistente IA </Typography>
              </Box>
              <Box sx={{ bgcolor: 'white', p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                <Chip label="Próximamente" size="small" sx={{ bgcolor: 'rgba(33, 150, 243, 0.08)', color: mainColor, fontWeight: 'medium', border: '1px solid rgba(33, 150, 243, 0.2)' }} />
              </Box>
            </Box>
         ) : ( /* ... JSX para asistente cerrado ... */
           <Tooltip title="Asistente IA - Próximamente" placement="right">
             <Avatar sx={{ width: 42, height: 42, bgcolor: mainColor, color: 'white', fontSize: 18, boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)' }} > 🤖 </Avatar>
           </Tooltip>
         )}
       </Box>

      {/* Footer del sidebar (sin cambios) */}
      <Box sx={{ px: open ? 2 : 1, pb: 2, pt: 1, borderTop: '1px solid #e0e0e0' }}>
        <ListItemButton sx={{ borderRadius: 1, mb: 1, justifyContent: 'center', minHeight: 42, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)', }, }} >
          <Tooltip title="Soporte" placement="right" disableHoverListener={open}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0 }}> {supportIcon} </ListItemIcon>
          </Tooltip>
          <ListItemText primary="Soporte" sx={{ opacity: open ? 1 : 0, transition: theme.transitions.create('opacity', { /* ... */ }), '& .MuiTypography-root': { color: '#666666', whiteSpace: 'nowrap' } }} />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, justifyContent: 'center', minHeight: 42, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)', }, }} >
          <Tooltip title="Cerrar sesión" placement="right" disableHoverListener={open}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0 }}> {logoutIcon} </ListItemIcon>
          </Tooltip>
           <ListItemText primary="Cerrar sesión" sx={{ opacity: open ? 1 : 0, transition: theme.transitions.create('opacity', { /* ... */ }), '& .MuiTypography-root': { color: '#666666', whiteSpace: 'nowrap' } }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;