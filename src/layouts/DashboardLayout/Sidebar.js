import React, { useState, useEffect } from 'react';
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
  Tooltip,
  Chip
} from '@mui/material';

// Iconos para control del sidebar
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Sidebar = ({ companyName = "Transportes Express" }) => {
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };
  
  // Configuración de los items del menú con emojis coloridos
  const menuItems = [
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span role="img" aria-label="home" style={{ fontSize: '20px' }}>🏠</span>
        </Box>
      ),
      path: '/',
    },
    {
      id: 'invoices',
      text: 'Facturas',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span role="img" aria-label="invoice" style={{ fontSize: '20px' }}>📄</span>
        </Box>
      ),
      path: '/invoices',
    },
    {
      id: 'documents',
      text: 'Cotizaciones',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span role="img" aria-label="quotes" style={{ fontSize: '20px' }}>📋</span>
        </Box>
      ),
      path: '/documents',
    },
    {
      id: 'clients',
      text: 'Clientes',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span role="img" aria-label="clients" style={{ fontSize: '20px' }}>👥</span>
        </Box>
      ),
      path: '/clients',
    },
    {
      id: 'products',
      text: 'Productos',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span role="img" aria-label="products" style={{ fontSize: '20px' }}>📦</span>
        </Box>
      ),
      path: '/products',
    },
    {
      id: 'settings',
      text: 'Configuración',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span role="img" aria-label="settings" style={{ fontSize: '20px' }}>⚙️</span>
        </Box>
      ),
      path: '/settings',
    },
  ];

  // Asistente IA icon
  const aiAssistantIcon = (
    <Box sx={{ 
      width: 24, 
      height: 24, 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <span role="img" aria-label="ai-assistant" style={{ fontSize: '20px' }}>🤖</span>
    </Box>
  );

  // Soporte icon
  const supportIcon = (
    <Box sx={{ 
      width: 24, 
      height: 24, 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <span role="img" aria-label="support" style={{ fontSize: '20px' }}>❓</span>
    </Box>
  );

  // Logout icon
  const logoutIcon = (
    <Box sx={{ 
      width: 24, 
      height: 24, 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <span role="img" aria-label="logout" style={{ fontSize: '20px' }}>🚪</span>
    </Box>
  );

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
    if (!path) return false;
    
    // Para la ruta de documentos, consideramos activo incluso con parámetros
    if (path === '/documents' && location.pathname.startsWith('/documents')) {
      return true;
    }
    
    return location.pathname === path ||
           (path !== '/' && location.pathname.startsWith(path));
  };

  // Ancho del drawer
  const drawerWidth = open ? 240 : 72;

  // Color principal
  const mainColor = '#2196F3';

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#ffffff',
          color: '#333333',
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRight: '1px solid #e0e0e0',
          overflowX: 'hidden'
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
          borderBottom: '1px solid #e0e0e0',
          height: '72px', // Altura fija para evitar cambios de tamaño
          position: 'relative'
        }}
      >
        {open ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ 
                bgcolor: mainColor, 
                color: 'white',
              }}>
                {getCompanyInitials()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" color="#333333" noWrap>
                  {companyName}
                </Typography>
                <Typography variant="caption" color="#666666">
                  Sistema de Facturación
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={handleToggle} 
              sx={{ 
                color: 'white',
                bgcolor: mainColor,
                width: 30,
                height: 30,
                '&:hover': {
                  bgcolor: '#1976D2',
                }
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ 
                bgcolor: mainColor, 
                color: 'white',
                mb: 0.5
              }}>
                {getCompanyInitials()}
              </Avatar>
            </Box>
            {/* Botón de expandir colocado fuera del sidebar pero visible */}
            <IconButton 
              onClick={handleToggle} 
              sx={{ 
                position: 'absolute', 
                right: '-15px', 
                top: '20px', 
                bgcolor: mainColor, 
                color: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)', 
                width: 30, 
                height: 30,
                '&:hover': {
                  bgcolor: '#1976D2',
                }
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>

      {/* Menú principal */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <ListItem 
              key={item.id} 
              disablePadding 
              sx={{ 
                display: 'block',
                position: 'relative',
                mb: 0.5
              }}
            >
              {active && (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    left: 0,
                    top: '15%',
                    width: 4,
                    height: '70%',
                    backgroundColor: mainColor,
                    borderRadius: '0 4px 4px 0'
                  }} 
                />
              )}
              <ListItemButton
                component={RouterLink}
                to={item.path || '#'}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  backgroundColor: active ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.12)',
                  },
                }}
              >
                <Tooltip title={open ? "" : item.text} placement="right">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </Tooltip>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    '& .MuiTypography-root': {
                      fontWeight: active ? 'medium' : 'normal',
                      color: active ? mainColor : '#333333',
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Plan Premium */}
      {open ? (
        <Box 
          sx={{ 
            mx: 2, 
            my: 2, 
            py: 1.5,
            px: 2, 
            borderRadius: 2, 
            bgcolor: 'rgba(255, 196, 0, 0.1)',
            border: '1px solid rgba(255, 196, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <Box sx={{ fontSize: 20, display: 'flex', alignItems: 'center' }}>
            <span role="img" aria-label="star">⭐</span>
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" color="#333333">
              Plan Premium
            </Typography>
            <Typography variant="caption" color="#666666">
              Versión 1
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 2,
            mb: 2
          }}
        >
          <Tooltip title="Plan Premium" placement="right">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'rgba(255, 196, 0, 0.2)',
                color: '#FFB800',
                fontSize: 18
              }}
            >
              ⭐
            </Avatar>
          </Tooltip>
        </Box>
      )}

      <Box sx={{ flexGrow: 1 }} /> {/* Espacio flexible */}

      {/* Asistente IA - Rediseñado y mejorado */}
      {open ? (
        <Box 
          sx={{ 
            mx: 2, 
            mb: 2, 
            overflow: 'hidden',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: '1px solid rgba(33, 150, 243, 0.1)'
          }}
        >
          <Box 
            sx={{ 
              bgcolor: mainColor, 
              p: 1.5, 
              display: 'flex', 
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span role="img" aria-label="robot" style={{ fontSize: '18px' }}>🤖</span>
            </Box>
            <Typography variant="subtitle2" fontWeight="medium" color="white">
              Asistente IA
            </Typography>
          </Box>
          <Box 
            sx={{ 
              bgcolor: 'white', 
              p: 1.5, 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Chip
              label="Próximamente"
              size="small"
              sx={{
                bgcolor: 'rgba(33, 150, 243, 0.08)',
                color: mainColor,
                fontWeight: 'medium',
                border: '1px solid rgba(33, 150, 243, 0.2)'
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Tooltip title="Asistente IA - Próximamente" placement="right">
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: mainColor,
                color: 'white',
                fontSize: 18,
                boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
              }}
            >
              🤖
            </Avatar>
          </Tooltip>
        </Box>
      )}

      {/* Footer del sidebar */}
      <Box sx={{ px: 2, pb: 2, pt: 1, borderTop: '1px solid #e0e0e0' }}>
        {/* Botón de soporte */}
        <ListItemButton
          sx={{
            borderRadius: 1,
            mb: 1,
            justifyContent: open ? 'initial' : 'center',
            minHeight: 42,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Tooltip title={open ? "" : "Soporte"} placement="right">
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto' }}>
              {supportIcon}
            </ListItemIcon>
          </Tooltip>
          {open && <ListItemText primary="Soporte" sx={{ 
            '& .MuiTypography-root': { color: '#666666' },
          }} />}
        </ListItemButton>
        
        {/* Botón de cerrar sesión */}
        <ListItemButton
          sx={{
            borderRadius: 1,
            justifyContent: open ? 'initial' : 'center',
            minHeight: 42,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Tooltip title={open ? "" : "Cerrar sesión"} placement="right">
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto' }}>
              {logoutIcon}
            </ListItemIcon>
          </Tooltip>
          {open && <ListItemText primary="Cerrar sesión" sx={{ 
            '& .MuiTypography-root': { color: '#666666' },
          }} />}
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;