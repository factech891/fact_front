// src/layouts/DashboardLayout/Navbar.js - CORREGIDO getPageTitle
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  ListItemIcon,
  Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const notificationsOpen = Boolean(notificationsAnchorEl);
  const location = useLocation();

  const mainColor = '#4CAF50'; // Color verde

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  // Datos del usuario (ejemplo)
  const user = {
    name: 'Admin',
    role: 'Administrador',
    email: 'admin@transportesexpress.com'
  };

  // Notificaciones (ejemplo)
  const notifications = [
    { id: 1, title: 'Nueva factura creada', time: 'Hace 5 minutos' },
    { id: 2, title: 'Cliente actualizado', time: 'Hace 30 minutos' },
    { id: 3, title: 'Recordatorio de pago', time: 'Hace 2 horas' },
    { id: 4, title: 'Producto añadido al inventario', time: 'Ayer' }
  ];

  // --- FUNCIÓN MODIFICADA ---
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/invoices')) return 'Facturas';
    if (path.startsWith('/documents')) return 'Cotizaciones'; // <--- LÍNEA AÑADIDA
    if (path.startsWith('/clients')) return 'Clientes';
    if (path.startsWith('/products')) return 'Productos';
    if (path.startsWith('/settings')) return 'Configuración';
    return ''; // Retorna vacío si no es ninguna de las anteriores
  };
  // --- FIN FUNCIÓN MODIFICADA ---

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: '#2a2a2a',
        color: '#ffffff'
      }}
    >
      <Toolbar sx={{ minHeight: '64px' }}>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, fontWeight: 500 }}
        >
          {/* El título ahora se actualizará correctamente */}
          {getPageTitle()}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Notificaciones */}
          <Tooltip title="Notificaciones">
            <IconButton
              size="medium"
              onClick={handleNotificationsClick}
              sx={{
                mr: 1,
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                }
              }}
            >
              <Badge
                badgeContent={notifications.length}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#F44336',
                    fontWeight: 'bold',
                    minWidth: 18,
                    height: 18
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Menú de notificaciones */}
          <Menu
            id="notifications-menu"
            anchorEl={notificationsAnchorEl}
            open={notificationsOpen}
            onClose={handleNotificationsClose}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                minWidth: 280,
                maxWidth: 320,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
             <Box sx={{ p: 2, pb: 1 }}>
               <Typography variant="subtitle1" fontWeight="medium">
                 Notificaciones
               </Typography>
             </Box>
             <Divider />

             {notifications.map((notification) => (
               <MenuItem
                 key={notification.id}
                 onClick={handleNotificationsClose}
                 sx={{
                   py: 1.5,
                   px: 2,
                   borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
                 }}
               >
                 <Box>
                   <Typography variant="body2" noWrap>
                     {notification.title}
                   </Typography>
                   <Typography variant="caption" color="text.secondary">
                     {notification.time}
                   </Typography>
                 </Box>
               </MenuItem>
             ))}

             <Divider />
             <Box sx={{ display: 'flex', justifyContent: 'center', p: 1.5 }}>
               <Typography
                 variant="body2"
                 color={mainColor} // Usa el color principal definido
                 sx={{
                   cursor: 'pointer',
                   fontWeight: 'medium',
                   '&:hover': {
                     textDecoration: 'underline'
                   }
                 }}
                 onClick={handleNotificationsClose}
               >
                 Ver todas las notificaciones
               </Typography>
             </Box>
          </Menu>

          {/* Perfil de usuario */}
          <Tooltip title={user.name}>
            <IconButton
              onClick={handleClick}
              size="small"
              edge="end"
              aria-label="cuenta del usuario"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{
                ml: 1,
                border: `2px solid ${mainColor}`, // Usa el color principal definido
                padding: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: mainColor, // Usa el color principal definido
                  fontWeight: 'bold',
                  color: 'white'
                }}
              >
                {user.name.charAt(0)}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Menú de usuario */}
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                width: 220,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <PersonOutlineIcon fontSize="small" sx={{ color: mainColor }} /> {/* Usa el color principal definido */}
              </ListItemIcon>
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <SettingsOutlinedIcon fontSize="small" sx={{ color: mainColor }} /> {/* Usa el color principal definido */}
              </ListItemIcon>
              Preferencias
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: mainColor }} /> {/* Usa el color principal definido */}
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;