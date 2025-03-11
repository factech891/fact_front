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
  Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation } from 'react-router-dom';

const Navbar = ({ companyName }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Datos del usuario - esto debería venir de tu contexto de autenticación
  const user = {
    name: 'Admin', // Nombre de ejemplo
    role: 'Administrador'
  };

  // Obtener el título correcto según la ruta actual
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/invoices')) return 'Facturas';
    if (path.startsWith('/clients')) return 'Clientes';
    if (path.startsWith('/products')) return 'Productos';
    if (path.startsWith('/settings')) return 'Configuración';
    return '';
  };

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{ 
        borderBottom: theme => `1px solid ${theme.palette.divider}`,
        backgroundColor: theme => theme.palette.background.paper,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
        >
          {getPageTitle()}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Notificaciones */}
          <Tooltip title="Notificaciones">
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Perfil de usuario */}
          <Tooltip title={user.name}>
            <IconButton
              onClick={handleClick}
              size="large"
              edge="end"
              aria-label="cuenta del usuario"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#4477CE' }}>
                {user.name.charAt(0)}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          {/* Menú de usuario simplificado */}
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose}>Perfil</MenuItem>
            {/* Quitamos Configuración de aquí para evitar duplicidad */}
            {/* <MenuItem onClick={handleClose}>Configuración</MenuItem> */}
            {/* Nota: Cerrar sesión se movió al sidebar */}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;