// src/layouts/DashboardLayout/Navbar.js (modificado)
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
  Divider,
  List
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importamos el contexto de autenticación

// Importación de iconos para notificaciones (sin cambios)
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import MarkChatReadOutlinedIcon from '@mui/icons-material/MarkChatReadOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const notificationsOpen = Boolean(notificationsAnchorEl);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtenemos la función logout y el usuario actual del contexto de autenticación
  const { logout, currentUser } = useAuth();

  // Color principal (sin cambios)
  const mainColor = '#4CAF50';

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

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    handleClose(); // Cerrar el menú
    logout(); // Llamar a la función de logout del contexto
  };

  // Datos del usuario (ahora usando el contexto de autenticación)
  const user = currentUser || {
    name: 'Usuario',
    role: 'Usuario',
    email: 'usuario@facttech.com'
  };

  // Notificaciones (sin cambios)
  const notifications = [
    { id: 1, type: 'payment', icon: <PaidOutlinedIcon fontSize="small" color="success"/>, title: 'Pago recibido F-008', detail: 'Cliente: Ana Gómez', time: 'Hace 5 min', read: false, link: '/invoices/F-008' },
    { id: 2, type: 'quote_pending', icon: <ArticleOutlinedIcon fontSize="small" color="info"/>, title: 'Cotización C-012 pendiente', detail: 'Revisar y enviar', time: 'Hace 30 min', read: false, link: '/documents/C-012' },
    { id: 3, type: 'invoice_due', icon: <WarningAmberOutlinedIcon fontSize="small" color="warning"/>, title: 'Factura F-005 vence mañana', detail: 'Cliente: Pedro Martínez', time: 'Hace 2 horas', read: false, link: '/invoices/F-005' },
    { id: 4, type: 'system', icon: <InfoOutlinedIcon fontSize="small" color="action"/>, title: 'Mantenimiento programado', detail: 'Esta noche a las 11 PM', time: 'Ayer', read: true, link: '/announcements/1' }
  ];

  // Calcula no leídas (sin cambios)
  const unreadCount = notifications.filter(n => !n.read).length;

  // Placeholder para acciones futuras de notificaciones (sin cambios)
  const handleNotificationClick = (notification) => {
      console.log("Navegar a:", notification.link);
      handleNotificationsClose();
  };

  const handleMarkAllRead = () => {
      console.log("Marcar todas como leídas");
      handleNotificationsClose();
  };

  // Función para obtener el título (sin cambios)
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/invoices')) return 'Facturas';
    if (path.startsWith('/documents')) return 'Cotizaciones';
    if (path.startsWith('/clients')) return 'Clientes';
    if (path.startsWith('/products')) return 'Productos';
    if (path.startsWith('/settings')) return 'Configuración';
    if (path.startsWith('/users')) return 'Gestión de Usuarios';
    return '';
  };

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
        {/* Título de la Página */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, fontWeight: 500 }}
        >
          {getPageTitle()}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* SECCIÓN DE NOTIFICACIONES (sin cambios) */}
          <Tooltip title="Notificaciones">
            <IconButton
              size="medium"
              onClick={handleNotificationsClick}
              sx={{
                mr: 1,
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
              }}
            >
              <Badge
                badgeContent={unreadCount}
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

          {/* Menú de notificaciones (sin cambios) */}
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
                maxWidth: 350,
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderRadius: '8px'
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
             <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Typography variant="subtitle1" fontWeight="medium">
                 Notificaciones
               </Typography>
               {unreadCount > 0 && (
                  <Tooltip title="Marcar todas como leídas">
                    <IconButton size="small" onClick={handleMarkAllRead}>
                       <MarkChatReadOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
               )}
             </Box>
             <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />

             {/* Lista de Notificaciones (sin cambios) */}
             <List sx={{ padding: 0, maxHeight: 400, overflowY: 'auto' }}>
                 {notifications.length > 0 ? (
                    notifications.slice(0, 7).map((notification) => (
                    <MenuItem
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        sx={{
                          py: 1.5,
                          px: 2,
                          borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                          bgcolor: notification.read ? 'transparent' : 'rgba(33, 150, 243, 0.05)',
                          '&:hover': {
                             bgcolor: notification.read ? 'rgba(0, 0, 0, 0.03)' : 'rgba(33, 150, 243, 0.08)'
                          },
                          '&:last-child': { borderBottom: 'none' }
                        }}
                    >
                        {/* Icono */}
                        <ListItemIcon sx={{ minWidth: 36, color: notification.read ? 'text.secondary' : 'inherit' }}>
                          {notification.icon || <InfoOutlinedIcon fontSize="small"/>}
                        </ListItemIcon>
                        {/* Contenido */}
                        <Box>
                          <Typography variant="body2" noWrap sx={{ fontWeight: notification.read ? 'normal' : 'medium' }}>
                              {notification.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {notification.detail} - {notification.time}
                          </Typography>
                        </Box>
                    </MenuItem>
                    ))
                 ) : (
                    <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                        No tienes notificaciones nuevas.
                    </Typography>
                 )}
             </List>

             {/* Footer del Menú (sin cambios) */}
             {notifications.length > 0 && (
                <>
                <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1.5 }}>
                    <Typography
                      variant="body2"
                      color={mainColor}
                      sx={{ cursor: 'pointer', fontWeight: 'medium', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => { console.log("Navegar a /notifications"); handleNotificationsClose(); }}
                    >
                      Ver todas las notificaciones
                    </Typography>
                </Box>
                </>
             )}
          </Menu>
     
          {/* SECCIÓN DE USUARIO (modificada para usar datos reales) */}
          <Tooltip title={user.firstName || user.name || "Usuario"}>
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
                border: `2px solid ${mainColor}`,
                padding: 0.5,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: mainColor,
                  fontWeight: 'bold',
                  color: 'white'
                }}
              >
                {/* Usar inicial del nombre real del usuario */}
                {(user.firstName || user.name || "U").charAt(0)}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Menú de usuario (modificado para usar datos reales y función de logout) */}
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
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderRadius: '8px'
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
              {user.roles && user.roles.length > 0 && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5, color: mainColor }}>
                  {user.roles[0]} {/* Mostrar el primer rol */}
                </Typography>
              )}
            </Box>
            <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />
            <MenuItem onClick={() => { navigate('/settings/profile'); handleClose(); }} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <PersonOutlineIcon fontSize="small" sx={{ color: mainColor }} />
              </ListItemIcon>
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={() => { navigate('/settings'); handleClose(); }} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <SettingsOutlinedIcon fontSize="small" sx={{ color: mainColor }} />
              </ListItemIcon>
              Configuración
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: mainColor }} />
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