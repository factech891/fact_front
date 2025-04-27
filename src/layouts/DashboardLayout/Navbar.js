// src/layouts/DashboardLayout/Navbar.js (actualizado con NotificationsContext)
import React, { useState } from 'react';
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
  Divider,
  useTheme
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext'; // Importar contexto de notificaciones
import NotificationsModal from '../../components/notifications/NotificationsModal'; // Importar el componente modal

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false); // Estado para el modal
  const open = Boolean(anchorEl);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  // Contexto de autenticación
  const { logout, currentUser } = useAuth();
  
  // Contexto de notificaciones
  const { unreadCount } = useNotifications();

  // Color primario del tema
  const mainColor = theme.palette.primary?.main || '#2196F3';

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Manejadores para el modal de notificaciones
  const handleNotificationsClick = () => {
    setNotificationsModalOpen(true);
  };

  const handleNotificationsClose = () => {
    setNotificationsModalOpen(false);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    handleClose();
    logout();
  };

  // Datos del usuario
  const user = currentUser || {
    name: 'Invitado',
    email: '',
    roles: ['Invitado']
  };

  // Función para obtener el título de la página
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/invoices')) return 'Facturas';
    if (path.startsWith('/documents')) return 'Cotizaciones';
    if (path.startsWith('/clients')) return 'Clientes';
    if (path.startsWith('/products')) return 'Productos';
    if (path.startsWith('/settings/profile')) return 'Mi Perfil';
    if (path.startsWith('/settings/company')) return 'Configuración Empresa';
    if (path.startsWith('/settings/subscription')) return 'Suscripción';
    if (path.startsWith('/settings')) return 'Configuración';
    if (path.startsWith('/users')) return 'Gestión de Usuarios';
    if (path.startsWith('/support')) return 'Soporte';
    return 'FactTech';
  };

  // Función para obtener la inicial del usuario
  const getUserInitial = () => {
    if (currentUser?.firstName) return currentUser.firstName.charAt(0).toUpperCase();
    if (currentUser?.name) return currentUser.name.charAt(0).toUpperCase();
    return 'U';
  }

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={1}
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#ffffff',
        color: theme.palette.text?.primary || '#ffffff',
        borderBottom: `1px solid ${theme.palette.divider || 'rgba(255, 255, 255, 0.1)'}`,
      }}
    >
      <Toolbar sx={{ minHeight: '64px' }}>
        {/* Título de la Página */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          {getPageTitle()}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* SECCIÓN DE NOTIFICACIONES - Actualizada para usar el modal */}
          <Tooltip title="Notificaciones">
            <IconButton
              size="medium"
              onClick={handleNotificationsClick}
              sx={{
                mr: 1,
                color: theme.palette.action?.active || 'rgba(255, 255, 255, 0.8)',
                '&:hover': { backgroundColor: theme.palette.action?.hover || 'rgba(255, 255, 255, 0.08)' }
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontWeight: 'bold',
                    minWidth: 18,
                    height: 18,
                    fontSize: '0.7rem'
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Modal de notificaciones */}
          <NotificationsModal 
            open={notificationsModalOpen} 
            onClose={handleNotificationsClose} 
          />

          {/* SECCIÓN DE USUARIO */}
          <Tooltip title={user.name || "Cuenta"}>
            <IconButton
              onClick={handleClick}
              size="small"
              edge="end"
              aria-label="cuenta del usuario"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{
                ml: 1.5,
                '&:hover': { backgroundColor: theme.palette.action?.hover || 'rgba(255, 255, 255, 0.08)' }
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: mainColor,
                  fontWeight: 'bold',
                  color: theme.palette.getContrastText(mainColor),
                  fontSize: '1rem'
                }}
              >
                {getUserInitial()}
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
                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.1))',
                mt: 1.5,
                minWidth: 240,
                bgcolor: theme.palette.background?.paper || '#ffffff',
                color: theme.palette.text?.primary || '#000000',
                borderRadius: '8px',
                border: `1px solid ${theme.palette.divider || 'rgba(0, 0, 0, 0.1)'}`
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* Información del usuario */}
            <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="600" noWrap>
                {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
              {currentUser?.roles && currentUser.roles.length > 0 && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'primary.main', textTransform: 'capitalize' }}>
                  {currentUser.roles[0]}
                </Typography>
              )}
            </Box>
            <Divider sx={{ borderColor: theme.palette.divider || 'rgba(0, 0, 0, 0.08)' }} />
            {/* Opción Mi Perfil */}
            <MenuItem onClick={() => { navigate('/settings/profile'); handleClose(); }} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 36, color: theme.palette.text?.secondary }}>
                <PersonOutlineIcon fontSize="small" />
              </ListItemIcon>
              Mi Perfil
            </MenuItem>
            <Divider sx={{ borderColor: theme.palette.divider || 'rgba(0, 0, 0, 0.08)' }} />
            {/* Opción Cerrar Sesión */}
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 36, color: theme.palette.error?.main || '#d32f2f' }}>
                <LogoutIcon fontSize="small" />
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