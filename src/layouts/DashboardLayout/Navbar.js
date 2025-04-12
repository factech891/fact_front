// src/layouts/DashboardLayout/Navbar.js
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
  List // <-- Añadido List para el menú de notificaciones
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation } from 'react-router-dom';

// --- Importa Iconos que podrías usar para notificaciones ---
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Descomenta si usas
// import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined'; // Descomenta si usas
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import MarkChatReadOutlinedIcon from '@mui/icons-material/MarkChatReadOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const notificationsOpen = Boolean(notificationsAnchorEl);
  const location = useLocation();

  // Color principal (definido aquí, considera moverlo al tema si es global)
  const mainColor = '#4CAF50'; // Color verde (o el que uses globalmente)

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

  // Datos del usuario (EJEMPLO - Reemplazar con datos reales)
  const user = {
    name: 'Admin',
    role: 'Administrador',
    email: 'admin@facttech.com'
  };

  // Notificaciones (EJEMPLO MÁS DETALLADO - Reemplazar con datos reales)
  const notifications = [
    { id: 1, type: 'payment', icon: <PaidOutlinedIcon fontSize="small" color="success"/>, title: 'Pago recibido F-008', detail: 'Cliente: Ana Gómez', time: 'Hace 5 min', read: false, link: '/invoices/F-008' },
    { id: 2, type: 'quote_pending', icon: <ArticleOutlinedIcon fontSize="small" color="info"/>, title: 'Cotización C-012 pendiente', detail: 'Revisar y enviar', time: 'Hace 30 min', read: false, link: '/documents/C-012' },
    { id: 3, type: 'invoice_due', icon: <WarningAmberOutlinedIcon fontSize="small" color="warning"/>, title: 'Factura F-005 vence mañana', detail: 'Cliente: Pedro Martínez', time: 'Hace 2 horas', read: false, link: '/invoices/F-005' },
    { id: 4, type: 'system', icon: <InfoOutlinedIcon fontSize="small" color="action"/>, title: 'Mantenimiento programado', detail: 'Esta noche a las 11 PM', time: 'Ayer', read: true, link: '/announcements/1' }
  ];

  // Calcula no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Placeholder para acciones futuras de notificaciones
  const handleNotificationClick = (notification) => {
      console.log("Navegar a:", notification.link);
      // Aquí iría la lógica para:
      // 1. Marcar la notificación como leída (en el estado/backend)
      // 2. Navegar a notification.link usando react-router-dom
      handleNotificationsClose(); // Cerrar el menú
  };

  const handleMarkAllRead = () => {
      console.log("Marcar todas como leídas");
      // Aquí iría la lógica para marcar todas como leídas en el estado/backend
      handleNotificationsClose(); // Cerrar el menú
  };


  // Función para obtener el título (sin cambios respecto a tu versión)
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/invoices')) return 'Facturas';
    if (path.startsWith('/documents')) return 'Cotizaciones';
    if (path.startsWith('/clients')) return 'Clientes';
    if (path.startsWith('/products')) return 'Productos';
    if (path.startsWith('/settings')) return 'Configuración';
    return ''; // Retorna vacío si no es ninguna de las anteriores
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: '#2a2a2a', // Fondo oscuro
        color: '#ffffff' // Texto blanco
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
          {/* --- SECCIÓN DE NOTIFICACIONES --- */}
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
                badgeContent={unreadCount} // Mostrar solo no leídas
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#F44336', // Rojo para el badge
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

          {/* Menú de notificaciones con estructura mejorada */}
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
                maxWidth: 350, // Un poco más de ancho si es necesario
                bgcolor: 'background.paper', // Fondo del menú
                color: 'text.primary', // Color de texto del menú
                borderRadius: '8px' // Bordes redondeados
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
             <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Typography variant="subtitle1" fontWeight="medium">
                 Notificaciones
               </Typography>
               {/* Botón opcional para marcar todas como leídas */}
               {unreadCount > 0 && (
                  <Tooltip title="Marcar todas como leídas">
                    <IconButton size="small" onClick={handleMarkAllRead}>
                       <MarkChatReadOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
               )}
             </Box>
             <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />

             {/* Lista de Notificaciones */}
             <List sx={{ padding: 0, maxHeight: 400, overflowY: 'auto' }}> {/* Scroll si hay muchas */}
                 {notifications.length > 0 ? (
                    notifications.slice(0, 7).map((notification) => ( // Mostrar hasta 7, por ejemplo
                    <MenuItem
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        sx={{
                          py: 1.5,
                          px: 2,
                          borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                          bgcolor: notification.read ? 'transparent' : 'rgba(33, 150, 243, 0.05)', // Fondo sutil si no está leída (Azul)
                          '&:hover': {
                             bgcolor: notification.read ? 'rgba(0, 0, 0, 0.03)' : 'rgba(33, 150, 243, 0.08)' // Hover un poco más oscuro
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
                    // Mensaje si no hay notificaciones
                    <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                        No tienes notificaciones nuevas.
                    </Typography>
                 )}
             </List>

             {/* Footer del Menú */}
             {notifications.length > 0 && (
                <>
                <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1.5 }}>
                    <Typography
                      variant="body2"
                      color={mainColor} // Color principal
                      sx={{ cursor: 'pointer', fontWeight: 'medium', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => { console.log("Navegar a /notifications"); handleNotificationsClose(); }} // Placeholder
                    >
                      Ver todas las notificaciones
                    </Typography>
                </Box>
                </>
             )}
          </Menu>
     


          {/* --- SECCIÓN DE USUARIO --- */}
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
                border: `2px solid ${mainColor}`, // Usa color principal
                padding: 0.5,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: mainColor, // Usa color principal
                  fontWeight: 'bold',
                  color: 'white'
                }}
              >
                {/* Usar inicial del usuario real cuando se conecte */}
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
                bgcolor: 'background.paper', // Fondo del menú
                color: 'text.primary', // Color de texto
                borderRadius: '8px'
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {/* Usar nombre real cuando se conecte */}
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {/* Usar email real cuando se conecte */}
                {user.email}
              </Typography>
              {/* Aquí podrías mostrar el ROL del usuario también */}
              {/* <Typography variant="caption" display="block" sx={{ mt: 0.5, color: mainColor }}>{user.role}</Typography> */}
            </Box>
            <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <PersonOutlineIcon fontSize="small" sx={{ color: mainColor }} /> {/* Usa color principal */}
              </ListItemIcon>
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <SettingsOutlinedIcon fontSize="small" sx={{ color: mainColor }} /> {/* Usa color principal */}
              </ListItemIcon>
              Preferencias
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />
            <MenuItem onClick={() => { console.log("Cerrar Sesión!"); handleClose(); }} sx={{ py: 1.5 }}> {/* Placeholder para cerrar sesión */}
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: mainColor }} /> {/* Usa color principal */}
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
          {/* --- FIN SECCIÓN DE USUARIO --- */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;