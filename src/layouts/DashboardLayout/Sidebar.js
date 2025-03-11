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
  Divider,
  IconButton,
  Avatar,
  Tooltip
} from '@mui/material';

// Importa los iconos que necesitas
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import StarIcon from '@mui/icons-material/Star';

const Sidebar = ({ companyName = "Transportes Express", open = true, onToggle }) => {
  const location = useLocation();
  
  // Configuración de los items del menú
  const menuItems = [
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      id: 'invoices',
      text: 'Facturas',
      icon: <ReceiptIcon />,
      path: '/invoices',
    },
    {
      id: 'clients',
      text: 'Clientes',
      icon: <PeopleIcon />,
      path: '/clients',
    },
    {
      id: 'products',
      text: 'Productos',
      icon: <Inventory2Icon />,
      path: '/products',
    },
    {
      id: 'settings',
      text: 'Configuración',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  // Genera las iniciales de la empresa para el avatar
  const getCompanyInitials = () => {
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Determina si un item está activo
  const isActive = (path) => {
    return location.pathname === path ||
           (path !== '/' && location.pathname.startsWith(path));
  };

  // Ancho del drawer
  const drawerWidth = open ? 240 : 72;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#4477CE', // Azul similar al de la captura
          color: 'white',
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        },
      }}
    >
      {/* Cabecera del sidebar con logo/nombre de empresa */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          padding: theme => theme.spacing(2),
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {open ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {getCompanyInitials()}
              </Avatar>
              <Typography variant="subtitle1" noWrap>
                {companyName}
              </Typography>
            </Box>
            <IconButton onClick={onToggle} sx={{ color: 'white' }}>
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={onToggle} sx={{ color: 'white' }}>
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>

      {/* Menú principal */}
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.id} 
            disablePadding 
            sx={{ display: 'block' }}
          >
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                py: 1.5,
                my: 0.5,
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  '& .MuiTypography-root': {
                    fontWeight: isActive(item.path) ? 'bold' : 'normal',
                  }
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} /> {/* Espacio flexible */}

      {/* Footer del sidebar */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {open && (
          <>
            {/* Plan actual */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <StarIcon sx={{ color: '#FFD700', mr: 1 }} />
              <Typography variant="body2">Plan Premium</Typography>
            </Box>
            
            {/* Versión */}
            <Typography variant="caption" color="rgba(255, 255, 255, 0.7)" sx={{ mb: 2, display: 'block' }}>
              Versión 1.0.2
            </Typography>
          </>
        )}
        
        {/* Botón de soporte */}
        <ListItemButton
          sx={{
            borderRadius: 1,
            mb: 1,
            justifyContent: open ? 'initial' : 'center',
            minHeight: 42,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', color: 'white' }}>
            <HelpOutlineIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Soporte" />}
        </ListItemButton>
        
        {/* Botón de cerrar sesión */}
        <ListItemButton
          sx={{
            borderRadius: 1,
            justifyContent: open ? 'initial' : 'center',
            minHeight: 42,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', color: 'white' }}>
            <LogoutIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Cerrar sesión" />}
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;