// src/layouts/DashboardLayout/Sidebar.js
import React, { useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom'; // Removed useNavigate
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// Iconos
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessIcon from '@mui/icons-material/Business';
import SupportIcon from '@mui/icons-material/Support';
// import LogoutIcon from '@mui/icons-material/Logout'; // Removed: defined but never used

import { useCompany } from '../../hooks/useCompany';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  // const navigate = useNavigate(); // Removed: assigned a value but never used
  const [isHovering, setIsHovering] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Obtenemos los datos de la empresa y el estado de carga
  const { company, loading: companyLoading } = useCompany();

  // Obtenemos el usuario actual y la función de logout del contexto de autenticación
  const { currentUser, logout } = useAuth();

  // --- IMPORTANTE: Usa el mismo rol que definiste en App.js ---
  const PLATFORM_ADMIN_ROLE = 'platform_admin';

  // Usamos el nombre real o un valor por defecto/carga
  const companyName = company?.nombre || "Mi Empresa";
  const companyLogoUrl = company?.logoUrl;

  const collapsedWidth = 72;
  const expandedWidth = 240;
  const open = isHovering;

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout();
  };

  // Función para manejar click en Soporte
  const handleSupportClick = (e) => {
    e.preventDefault();
    setShowSupportModal(true);
  };

  // Configuración de los items del menú
  const menuItems = [
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="home" style={{ fontSize: '20px' }}>🏠</span></Box> ),
      path: '/',
      hidden: currentUser?.role === 'facturador' || currentUser?.role === PLATFORM_ADMIN_ROLE
    },
    {
      id: 'platformAdmin',
      text: 'Panel Admin',
      icon: <AdminPanelSettingsIcon />,
      path: '/platform-admin',
      hidden: currentUser?.role !== PLATFORM_ADMIN_ROLE
    },
    {
      id: 'platformAdminCompanies',
      text: 'Compañías',
      icon: <BusinessIcon />,
      path: '/platform-admin/companies',
      hidden: currentUser?.role !== PLATFORM_ADMIN_ROLE
    },
    {
      id: 'invoices',
      text: 'Facturas',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="invoice" style={{ fontSize: '20px' }}>📄</span></Box> ),
      path: '/invoices',
      hidden: currentUser?.role === PLATFORM_ADMIN_ROLE
    },
    {
      id: 'documents',
      text: 'Cotizaciones',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="quotes" style={{ fontSize: '20px' }}>📋</span></Box> ),
      path: '/documents',
      hidden: currentUser?.role === PLATFORM_ADMIN_ROLE
    },
    {
      id: 'clients',
      text: 'Clientes',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="clients" style={{ fontSize: '20px' }}>👥</span></Box> ),
      path: '/clients',
      hidden: currentUser?.role === PLATFORM_ADMIN_ROLE
    },
    {
      id: 'products',
      text: 'Productos',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="products" style={{ fontSize: '20px' }}>📦</span></Box> ),
      path: '/products',
      hidden: currentUser?.role === PLATFORM_ADMIN_ROLE
    },
    {
      id: 'users',
      text: 'Usuarios',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="users" style={{ fontSize: '20px' }}>👤</span></Box> ),
      path: '/users',
      hidden: !['admin', 'gerente'].includes(currentUser?.role) || currentUser?.role === PLATFORM_ADMIN_ROLE
    },
    {
      id: 'settings',
      text: 'Configuración',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="settings" style={{ fontSize: '20px' }}>⚙️</span></Box> ),
      path: '/settings',
      hidden: !['admin', 'gerente'].includes(currentUser?.role) || currentUser?.role === PLATFORM_ADMIN_ROLE
    },
  ];

  // Iconos para el footer
  const supportIcon = ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="support" style={{ fontSize: '20px' }}>❓</span></Box> );
  const logoutIcon = ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="logout" style={{ fontSize: '20px' }}>🚪</span></Box> );

  // Función para obtener iniciales
  const getCompanyInitials = () => {
    if (currentUser?.role === PLATFORM_ADMIN_ROLE) {
        return 'PA';
    }
    if (!companyName || companyLoading) return "...";
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

  // Lógica para el nombre y RIF/Identificador en la cabecera
  const getHeaderText = () => {
     if (currentUser?.role === PLATFORM_ADMIN_ROLE) {
         return {
             name: "Admin Plataforma",
             identifier: "Superusuario"
         };
     }
     // El identificador se usará en el Tooltip
     return {
         name: companyLoading ? 'Cargando...' : companyName,
         identifier: companyLoading ? '' : (company?.rif ? `RIF: ${company.rif}` : 'Sistema de Facturación')
     };
  };
  const headerInfo = getHeaderText();

  // isActive
  const isActive = (path) => {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/platform-admin/')) return location.pathname === path || location.pathname.startsWith(path + '/');
    if (path === '/platform-admin') return location.pathname === '/platform-admin';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Colores y gradientes mejorados
  const mainColor = '#4facfe';
  const adminColor = '#9c27b0';

  // Gradiente mejorado para el fondo
  const sidebarGradient = 'linear-gradient(180deg, #f8f9ff 0%, #eef2f7 100%)';

  // Patrón de fondo sutil
  const sidebarPattern = {
    backgroundImage: `${sidebarGradient}, radial-gradient(circle at 25px 25px, rgba(200, 220, 240, 0.15) 2px, transparent 0)`,
    backgroundSize: 'cover, 15px 15px'
  };

  const headerGradient = currentUser?.role === PLATFORM_ADMIN_ROLE
    ? 'linear-gradient(135deg, #9c27b0 0%, #ab47bc 50%, #ba68c8 100%)'
    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #00c6fb 100%)';

  const activeItemGradient = (isAdmin) => isAdmin
    ? 'linear-gradient(45deg, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0.18) 100%)'
    : 'linear-gradient(45deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.18) 100%)';

  // const bounceEffect = { // Removed: assigned a value but never used
  //   '@keyframes bounce': {
  //     '0%': { transform: 'translateY(0)' },
  //     '50%': { transform: 'translateY(-5px)' },
  //     '100%': { transform: 'translateY(0)' }
  //   }
  // };

  const drawerStyles = {
    width: open ? expandedWidth : collapsedWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    ...sidebarPattern,
    color: '#333333',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRight: '1px solid rgba(224, 224, 224, 0.5)',
    boxShadow: '0 0 20px rgba(0,0,0,0.05)',
  };

  // Filtrar elementos del menú que no deben ocultarse
  const filteredMenuItems = menuItems.filter(item => !item.hidden);

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
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
        {/* Cabecera mejorada del Sidebar */}
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'flex-start' : 'center',
            padding: theme.spacing(0, open ? 2 : 1),
            height: '90px',
            overflow: 'hidden',
            background: headerGradient,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            mb: 1
          }}>
          {/* Avatar con logo mejorado - sin bordes blancos */}
          {currentUser?.role === PLATFORM_ADMIN_ROLE ? (
            <Avatar sx={{
              bgcolor: 'white',
              color: adminColor,
              width: 52,
              height: 52,
              mr: open ? 1.5 : 0,
              transition: theme.transitions.create(['margin', 'width', 'height']),
              boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
            }}>
              <AdminPanelSettingsIcon fontSize="medium" />
            </Avatar>
          ) : companyLogoUrl ? (
            <Avatar
              variant="rounded"
              src={companyLogoUrl}
              alt={`${companyName} logo`}
              sx={{
                width: 52,
                height: 52,
                mr: open ? 1.5 : 0,
                transition: theme.transitions.create(['margin', 'width', 'height']),
                bgcolor: 'transparent',
                p: 0, // Eliminar padding
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                borderRadius: '8px',
                '& img': {
                  objectFit: 'contain', // Ajustar el logo correctamente
                  width: '100%',
                  height: '100%'
                }
              }}
            />
          ) : (
            <Avatar sx={{
              bgcolor: 'white',
              color: mainColor,
              width: 52,
              height: 52,
              mr: open ? 1.5 : 0,
              transition: theme.transitions.create(['margin', 'width', 'height']),
              boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
              fontWeight: 'bold'
            }}>
              {companyLoading ? '...' : getCompanyInitials()}
            </Avatar>
          )}

          {/* Nombre con RIF en tooltip (visible si expandido) */}
          {open && (
            <Box sx={{ overflow: 'hidden', flexGrow: 1, ml: 1 }}>
              <Tooltip
                title={headerInfo.identifier || ''} // Muestra el identificador en el tooltip
                placement="bottom-start"
                arrow
                PopperProps={{
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 8], // Ajusta el offset si es necesario
                      },
                    },
                  ],
                }}
              >
                {/* El Tooltip envuelve la tipografía */}
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="white"
                  noWrap
                  sx={{
                    cursor: headerInfo.identifier ? 'help' : 'default', // Cambia cursor solo si hay identificador
                    display: 'inline-block', // Necesario para que el tooltip funcione bien con noWrap
                    width: '100%' // Asegura que ocupe el espacio disponible
                 }}
                >
                  {headerInfo.name}
                </Typography>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Menú principal */}
        <List sx={{ px: open ? 1 : 1.5, py: 2, flexGrow: 1 }}>
          {filteredMenuItems.map((item) => {
            const active = isActive(item.path);
            const isAdminItem = item.id.startsWith('platformAdmin');
            const itemColor = isAdminItem ? adminColor : mainColor;
            return (
              <ListItem key={item.id} disablePadding sx={{ display: 'block', position: 'relative', mb: 0.7 }} >
                {/* Indicador activo */}
                {active && (
                  <Box sx={{
                    position: 'absolute',
                    left: 0,
                    top: '15%',
                    width: 4,
                    height: '70%',
                    backgroundColor: itemColor,
                    borderRadius: '0 4px 4px 0',
                    opacity: open ? 1 : 0,
                    boxShadow: `0 0 8px ${itemColor}80`,
                    transition: theme.transitions.create('opacity')
                  }} />
                )}
                <ListItemButton
                  component={RouterLink}
                  to={item.path || '#'}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    px: 2,
                    py: 1,
                    borderRadius: 1.5,
                    background: active ? activeItemGradient(isAdminItem) : 'transparent',
                    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    '&:hover': {
                      background: isAdminItem
                        ? 'linear-gradient(45deg, rgba(156, 39, 176, 0.15) 0%, rgba(156, 39, 176, 0.23) 100%)'
                        : 'linear-gradient(45deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.23) 100%)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transform: 'translateY(-1px)',
                      transition: 'transform 0.2s',
                      '& .icon-bounce': {
                        animation: 'bounce 0.4s ease',
                      }
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {/* Icono con Tooltip si está cerrado y efecto de rebote */}
                  {!open ? (
                    <Tooltip title={item.text} placement="right">
                      <ListItemIcon sx={{
                        minWidth: 0,
                        justifyContent: 'center',
                        color: active ? itemColor : 'inherit',
                        fontSize: '1.1rem',
                        '&:hover': {
                          animation: 'bounce 0.4s ease',
                        }
                      }}
                      className="icon-bounce"
                      >
                        {item.icon}
                      </ListItemIcon>
                    </Tooltip>
                  ) : (
                    <ListItemIcon sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: 'center',
                      transition: theme.transitions.create('margin'),
                      color: active ? itemColor : 'inherit',
                      fontSize: '1.1rem',
                      '&:hover': {
                        animation: 'bounce 0.4s ease',
                      }
                    }}
                    className="icon-bounce"
                    >
                      {item.icon}
                    </ListItemIcon>
                  )}
                  {/* Texto del menú */}
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: theme.transitions.create('opacity', { duration: theme.transitions.duration.leavingScreen }),
                      '& .MuiTypography-root': {
                        fontWeight: active ? '600' : '500',
                        color: active ? itemColor : '#333333',
                        whiteSpace: 'nowrap',
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Footer del sidebar */}
        <Box sx={{
          px: open ? 2 : 1,
          pb: 2,
          pt: 1,
          borderTop: '1px solid rgba(224, 224, 224, 0.5)',
          background: 'linear-gradient(0deg, rgba(230,240,250,0.5) 0%, rgba(255,255,255,0) 100%)',
        }}>
          {/* Soporte (ahora con modal) */}
          {currentUser?.role !== PLATFORM_ADMIN_ROLE && (
            <ListItemButton
              sx={{
                borderRadius: 1.5,
                mb: 1,
                justifyContent: 'center',
                minHeight: 42,
                '&:hover': {
                  backgroundColor: 'rgba(79, 172, 254, 0.08)',
                  transform: 'translateY(-1px)',
                  transition: 'transform 0.2s',
                  '& .icon-bounce': {
                    animation: 'bounce 0.4s ease',
                  }
                }
              }}
              onClick={handleSupportClick}
            >
              {!open ? (
                <Tooltip title="Soporte" placement="right">
                  <ListItemIcon sx={{ minWidth: 0 }} className="icon-bounce"> {supportIcon} </ListItemIcon>
                </Tooltip>
              ) : (
                <ListItemIcon sx={{ minWidth: 0, mr: 2 }} className="icon-bounce"> {supportIcon} </ListItemIcon>
              )}
              <ListItemText
                primary="Soporte"
                sx={{
                  opacity: open ? 1 : 0,
                  transition: theme.transitions.create('opacity'),
                  '& .MuiTypography-root': {
                    color: '#666666',
                    whiteSpace: 'nowrap'
                  }
                }}
              />
            </ListItemButton>
          )}
          {/* Cerrar Sesión */}
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1.5,
              justifyContent: 'center',
              minHeight: 42,
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                transform: 'translateY(-1px)',
                transition: 'transform 0.2s',
                '& .icon-bounce': {
                  animation: 'bounce 0.4s ease',
                }
              }
            }}
          >
            {!open ? (
              <Tooltip title="Cerrar sesión" placement="right">
                <ListItemIcon sx={{ minWidth: 0, color: '#d32f2f' }} className="icon-bounce"> {logoutIcon} </ListItemIcon>
              </Tooltip>
            ) : (
              <ListItemIcon sx={{ minWidth: 0, mr: 2, color: '#d32f2f' }} className="icon-bounce"> {logoutIcon} </ListItemIcon>
            )}
            <ListItemText
              primary="Cerrar sesión"
              sx={{
                opacity: open ? 1 : 0,
                transition: theme.transitions.create('opacity'),
                '& .MuiTypography-root': {
                  color: '#d32f2f',
                  whiteSpace: 'nowrap',
                  fontWeight: '500'
                }
              }}
            />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Modal de Soporte */}
      <Dialog
        open={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        aria-labelledby="support-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="support-dialog-title" sx={{
          background: headerGradient,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <SupportIcon /> Soporte Técnico
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <DialogContentText>
            Para obtener asistencia técnica, contáctanos a través de los siguientes medios:
          </DialogContentText>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', bgcolor: 'rgba(79, 172, 254, 0.1)' }}>
                <span role="img" aria-label="email" style={{ fontSize: '18px' }}>✉️</span>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">Email de soporte:</Typography>
                <Typography variant="body2">soporte@facttech.io</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', bgcolor: 'rgba(79, 172, 254, 0.1)' }}>
                <span role="img" aria-label="time" style={{ fontSize: '18px' }}>🕓</span>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">Horario de atención:</Typography>
                <Typography variant="body2">Lunes a Viernes de 8:00 AM a 9:00 PM</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', bgcolor: 'rgba(79, 172, 254, 0.1)' }}>
                <span role="img" aria-label="chat" style={{ fontSize: '18px' }}>💬</span>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">Chat en vivo:</Typography>
                <Typography variant="body2">Disponible durante el horario de atención</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', bgcolor: 'rgba(79, 172, 254, 0.1)' }}>
                <span role="img" aria-label="help" style={{ fontSize: '18px' }}>📚</span>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">Centro de ayuda:</Typography>
                <Typography variant="body2">Visita nuestra documentación en línea para guías y tutoriales</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowSupportModal(false)}
            sx={{
              color: mainColor,
              '&:hover': {
                backgroundColor: 'rgba(79, 172, 254, 0.08)',
              }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;