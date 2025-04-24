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
  List,
  useTheme // Importar useTheme para acceder a los colores
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'; // Ya no se usa aquí
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importamos el contexto de autenticación

// Importación de iconos para notificaciones
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
  const theme = useTheme(); // Obtener el tema

  // Obtenemos la función logout y el usuario actual del contexto de autenticación
  const { logout, user: currentUser } = useAuth(); // Renombrado a currentUser para claridad

  // Usar el color primario del tema o un fallback
  const mainColor = theme.palette.primary?.main || '#2196F3'; // Ajustado para usar el tema

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

  // Datos del usuario (usando el contexto)
  // Proporcionar valores por defecto más robustos si currentUser es null
  const user = currentUser || {
    name: 'Invitado',
    email: '',
    roles: ['Invitado'] // Asignar un rol por defecto si no hay usuario
  };

  // Notificaciones (sin cambios)
  const notifications = [
    { id: 1, type: 'payment', icon: <PaidOutlinedIcon fontSize="small" sx={{ color: theme.palette.success?.main || '#4caf50' }}/>, title: 'Pago recibido F-008', detail: 'Cliente: Ana Gómez', time: 'Hace 5 min', read: false, link: '/invoices/F-008' },
    { id: 2, type: 'quote_pending', icon: <ArticleOutlinedIcon fontSize="small" sx={{ color: theme.palette.info?.main || '#2196f3' }}/>, title: 'Cotización C-012 pendiente', detail: 'Revisar y enviar', time: 'Hace 30 min', read: false, link: '/documents/C-012' },
    { id: 3, type: 'invoice_due', icon: <WarningAmberOutlinedIcon fontSize="small" sx={{ color: theme.palette.warning?.main || '#ff9800' }}/>, title: 'Factura F-005 vence mañana', detail: 'Cliente: Pedro Martínez', time: 'Hace 2 horas', read: false, link: '/invoices/F-005' },
    { id: 4, type: 'system', icon: <InfoOutlinedIcon fontSize="small" sx={{ color: theme.palette.action?.active || 'rgba(0, 0, 0, 0.54)' }}/>, title: 'Mantenimiento programado', detail: 'Esta noche a las 11 PM', time: 'Ayer', read: true, link: '/announcements/1' }
  ];

  // Calcula no leídas (sin cambios)
  const unreadCount = notifications.filter(n => !n.read).length;

  // Placeholder para acciones futuras de notificaciones (sin cambios)
  const handleNotificationClick = (notification) => {
      console.log("Navegar a:", notification.link);
      if (notification.link) {
        navigate(notification.link);
      }
      handleNotificationsClose();
  };

  const handleMarkAllRead = () => {
      console.log("Marcar todas como leídas");
      // Aquí iría la lógica para actualizar el estado/API de notificaciones
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
    if (path.startsWith('/settings/profile')) return 'Mi Perfil'; // Título específico para perfil
    if (path.startsWith('/settings/company')) return 'Configuración Empresa'; // Título específico
    if (path.startsWith('/settings/subscription')) return 'Suscripción'; // Título específico
    if (path.startsWith('/settings')) return 'Configuración'; // Genérico si es /settings
    if (path.startsWith('/users')) return 'Gestión de Usuarios';
    if (path.startsWith('/support')) return 'Soporte';
    // Añadir más títulos según sea necesario
    return 'FactTech'; // Título por defecto
  };

  // Función para obtener la inicial del usuario
  const getUserInitial = () => {
    if (currentUser?.firstName) return currentUser.firstName.charAt(0).toUpperCase();
    if (currentUser?.name) return currentUser.name.charAt(0).toUpperCase();
    return 'U'; // Default 'U' for User/Usuario
  }

  return (
    <AppBar
      position="static" // O 'fixed' si quieres que quede fija arriba
      color="inherit" // Usar color heredado para aplicar estilos propios
      elevation={1} // Sombra sutil
      sx={{
        // Usar colores del tema si están definidos, si no, los oscuros
        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#ffffff',
        color: theme.palette.text?.primary || '#ffffff', // Color de texto primario del tema
        borderBottom: `1px solid ${theme.palette.divider || 'rgba(255, 255, 255, 0.1)'}`, // Usar divisor del tema
      }}
    >
      <Toolbar sx={{ minHeight: '64px' }}>
        {/* Título de la Página */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600 /* Un poco más de peso */ }}
        >
          {getPageTitle()}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* SECCIÓN DE NOTIFICACIONES */}
          <Tooltip title="Notificaciones">
            <IconButton
              size="medium"
              onClick={handleNotificationsClick}
              sx={{
                mr: 1,
                color: theme.palette.action?.active || 'rgba(255, 255, 255, 0.8)', // Color de icono activo del tema
                '&:hover': { backgroundColor: theme.palette.action?.hover || 'rgba(255, 255, 255, 0.08)' } // Color hover del tema
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error" // Mantenemos error para destacar
                sx={{
                  '& .MuiBadge-badge': {
                    fontWeight: 'bold',
                    minWidth: 18,
                    height: 18,
                    fontSize: '0.7rem' // Tamaño de fuente más pequeño
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
                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.1))', // Sombra más pronunciada
                mt: 1.5,
                minWidth: 300, // Ancho mínimo
                maxWidth: 360, // Ancho máximo
                bgcolor: theme.palette.background?.paper || '#ffffff', // Fondo del papel del tema
                color: theme.palette.text?.primary || '#000000', // Texto primario del tema
                borderRadius: '8px',
                border: `1px solid ${theme.palette.divider || 'rgba(0, 0, 0, 0.1)'}` // Borde sutil
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
             <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Typography variant="subtitle1" fontWeight="600"> {/* Más peso */}
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
             <Divider sx={{ borderColor: theme.palette.divider || 'rgba(0, 0, 0, 0.08)' }} />

             {/* Lista de Notificaciones */}
             <List sx={{ padding: 0, maxHeight: 400, overflowY: 'auto' }}>
                 {notifications.length > 0 ? (
                    notifications.slice(0, 7).map((notification) => (
                    <MenuItem
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        sx={{
                          py: 1.5,
                          px: 2,
                          borderBottom: `1px solid ${theme.palette.divider || 'rgba(0, 0, 0, 0.04)'}`,
                          // Fondo más sutil para no leídas
                          bgcolor: notification.read ? 'transparent' : theme.palette.action?.selected || 'rgba(33, 150, 243, 0.05)',
                          '&:hover': {
                             bgcolor: theme.palette.action?.hover || 'rgba(0, 0, 0, 0.03)'
                          },
                          '&:last-child': { borderBottom: 'none' }
                        }}
                    >
                        {/* Icono */}
                        <ListItemIcon sx={{ minWidth: 36, color: notification.read ? theme.palette.text?.disabled : 'inherit' }}>
                          {notification.icon || <InfoOutlinedIcon fontSize="small"/>}
                        </ListItemIcon>
                        {/* Contenido */}
                        <Box>
                          <Typography variant="body2" noWrap sx={{ fontWeight: notification.read ? 'normal' : '500' }}>
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

             {/* Footer del Menú */}
             {notifications.length > 0 && (
                <>
                <Divider sx={{ borderColor: theme.palette.divider || 'rgba(0, 0, 0, 0.08)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1.5 }}>
                    <Typography
                      variant="body2"
                      color="primary" // Usar color primario del tema
                      sx={{ cursor: 'pointer', fontWeight: '500', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => { navigate("/notifications"); handleNotificationsClose(); }} // Navegar a una página de notificaciones
                    >
                      Ver todas
                    </Typography>
                </Box>
                </>
             )}
          </Menu>

          {/* SECCIÓN DE USUARIO */}
          <Tooltip title={user.name || "Cuenta"}>
            <IconButton
              onClick={handleClick}
              size="small"
              edge="end" // Mover al borde derecho
              aria-label="cuenta del usuario"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{
                ml: 1.5, // Un poco más de margen
                // Quitar borde, usar hover background
                '&:hover': { backgroundColor: theme.palette.action?.hover || 'rgba(255, 255, 255, 0.08)' }
              }}
            >
              <Avatar
                sx={{
                  width: 36, // Ligeramente más grande
                  height: 36,
                  bgcolor: mainColor, // Usar color primario del tema
                  fontWeight: 'bold',
                  color: theme.palette.getContrastText(mainColor), // Color de contraste automático
                  fontSize: '1rem' // Tamaño de fuente para la inicial
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
                minWidth: 240, // Un poco más ancho
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
                {/* Mostrar nombre completo si existe, si no, el 'name' */}
                {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
              {/* Mostrar el rol principal del usuario */}
              {currentUser?.roles && currentUser.roles.length > 0 && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'primary.main', textTransform: 'capitalize' }}>
                  {currentUser.roles[0]} {/* Asumiendo que el rol principal está en la primera posición */}
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
            {/* *** MenuItem de Configuración ELIMINADO *** */}
            {/*
            <MenuItem onClick={() => { navigate('/settings'); handleClose(); }} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <SettingsOutlinedIcon fontSize="small" sx={{ color: mainColor }} />
              </ListItemIcon>
              Configuración
            </MenuItem>
            */}
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