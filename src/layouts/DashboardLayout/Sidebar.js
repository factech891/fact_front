// src/layouts/DashboardLayout/Sidebar.js
import React from 'react';
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
  Divider, // <-- No se usa, se puede quitar si quieres
  Avatar,
  Tooltip,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCompany } from '../../hooks/useCompany'; // Asegúrate que la ruta sea correcta

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  // Estado para controlar si el mouse está sobre el sidebar (simplificado)
  const [isHovering, setIsHovering] = React.useState(false);

  // Obtenemos los datos de la empresa y el estado de carga
  const { company, loading: companyLoading } = useCompany(); // Añadimos loading

  // Usamos el nombre real o un valor por defecto/carga
  const companyName = company?.nombre || "Mi Empresa"; // Default más genérico
  const companyLogoUrl = company?.logoUrl; // Guardamos la URL del logo

  const collapsedWidth = 72;
  const expandedWidth = 240;
  const open = isHovering; // El estado 'open' ahora depende de 'isHovering'

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Configuración de los items del menú (sin cambios)
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
      id: 'products',
      text: 'Productos',
      icon: (
        <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span role="img" aria-label="products" style={{ fontSize: '20px' }}>📦</span>
        </Box>
      ),
      path: '/products',
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

  // Función para obtener iniciales (ahora usa la empresa real)
  const getCompanyInitials = () => {
    if (!companyName || companyLoading) return "..."; // Muestra "..." si está cargando o no hay nombre
    // Lógica para iniciales (simplificada)
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

  // isActive (sin cambios)
  const isActive = (path) => {
    if (!path) return false;
    if (path === '/documents' && location.pathname.startsWith('/documents')) return true;
    if (path === '/products' && location.pathname.startsWith('/products')) return true;
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path) && path !== '/documents' && path !== '/products');
  };


  const mainColor = '#2196F3'; // Color principal (sin cambios)
  const drawerStyles = {
    width: open ? expandedWidth : collapsedWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    bgcolor: '#ffffff', // Fondo blanco
    color: '#333333', // Color de texto oscuro
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRight: '1px solid #e0e0e0', // Borde derecho sutil
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
      {/* ================================================= */}
      {/* Cabecera del Sidebar Modificada        */}
      {/* ================================================= */}
       <Box sx={{
           display: 'flex',
           alignItems: 'center',
           justifyContent: open ? 'flex-start' : 'center', // Centrado si colapsado
           padding: theme.spacing(0, open ? 2 : 1), // Ajusta padding
           borderBottom: '1px solid #e0e0e0',
           height: '72px', // Altura fija para la cabecera
           overflow: 'hidden' // Evitar desbordamiento
        }}>

         {/* Renderizado Condicional del Logo/Avatar */}
         {companyLogoUrl ? (
           // Si hay logoUrl, muestra el logo
           <Avatar
             variant="rounded" // Puedes cambiar a 'square' o 'circular'
             src={companyLogoUrl}
             alt={`${companyName} logo`}
             sx={{
               width: 40, // Tamaño del logo
               height: 40, // Tamaño del logo
               mr: open ? 1.5 : 0, // Margen derecho si está expandido
               transition: theme.transitions.create(['margin', 'width', 'height'], {
                 easing: theme.transitions.easing.sharp,
                 duration: theme.transitions.duration.leavingScreen,
               }),
               bgcolor: 'transparent', // Fondo transparente si la imagen lo tiene
               // Podrías añadir un borde si quieres: border: '1px solid #eee'
             }}
           />
         ) : (
           // Si NO hay logoUrl (o está cargando), muestra las iniciales
           <Avatar sx={{
               bgcolor: mainColor,
               color: 'white',
               width: 40,
               height: 40,
               mr: open ? 1.5 : 0,
               transition: theme.transitions.create(['margin', 'width', 'height'], {
                 easing: theme.transitions.easing.sharp,
                 duration: theme.transitions.duration.leavingScreen,
               })
             }}>
             {/* Muestra iniciales o "..." si está cargando */}
             {companyLoading ? '...' : getCompanyInitials()}
           </Avatar>
         )}

         {/* Nombre y RIF (solo visible si está expandido) */}
         {open && (
           <Box sx={{ overflow: 'hidden', flexGrow: 1, ml: 0 }}> {/* Ajuste ml */}
             <Typography variant="subtitle1" fontWeight="bold" color="#333333" noWrap>
               {companyLoading ? 'Cargando...' : companyName}
             </Typography>
             <Typography variant="caption" color="#666666" noWrap>
               {companyLoading ? '' : (company?.rif ? `RIF: ${company.rif}` : 'Sistema de Facturación')}
             </Typography>
           </Box>
         )}
       </Box>
      {/* ================================================= */}
      {/* Fin de la Cabecera Modificada           */}
      {/* ================================================= */}


      {/* Menú principal (sin cambios) */}
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

      <Box sx={{ flexGrow: 1 }} /> {/* Espacio flexible (sin cambios) */}

      {/* Asistente IA (sin cambios) */}
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

      {/* Footer del sidebar (sin cambios) */}
      <Box sx={{ px: open ? 2 : 1, pb: 2, pt: 1, borderTop: '1px solid #e0e0e0' }}>
        <ListItemButton sx={{ borderRadius: 1, mb: 1, justifyContent: 'center', minHeight: 42, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)', }, }} >
          <Tooltip title="Soporte" placement="right" disableHoverListener={open}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0 }}> {supportIcon} </ListItemIcon>
          </Tooltip>
          <ListItemText primary="Soporte" sx={{ opacity: open ? 1 : 0, transition: theme.transitions.create('opacity', { duration: theme.transitions.duration.leavingScreen }), '& .MuiTypography-root': { color: '#666666', whiteSpace: 'nowrap' } }} />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, justifyContent: 'center', minHeight: 42, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)', }, }} >
          <Tooltip title="Cerrar sesión" placement="right" disableHoverListener={open}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0 }}> {logoutIcon} </ListItemIcon>
          </Tooltip>
           <ListItemText primary="Cerrar sesión" sx={{ opacity: open ? 1 : 0, transition: theme.transitions.create('opacity', { duration: theme.transitions.duration.leavingScreen }), '& .MuiTypography-root': { color: '#666666', whiteSpace: 'nowrap' } }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;