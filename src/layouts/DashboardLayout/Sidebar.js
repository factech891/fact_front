// src/layouts/DashboardLayout/Sidebar.js (modificado)
import React from 'react';
import { useLocation, Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCompany } from '../../hooks/useCompany';
import { useAuth } from '../../context/AuthContext'; // Importamos el contexto de autenticación

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = React.useState(false);
  
  // Obtenemos los datos de la empresa y el estado de carga
  const { company, loading: companyLoading } = useCompany();
  
  // Obtenemos el usuario actual y la función de logout del contexto de autenticación
  const { currentUser, logout, hasRole } = useAuth();

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

  // Configuración de los items del menú (modificada para roles)
  const menuItems = [
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="home" style={{ fontSize: '20px' }}>🏠</span></Box> ),
      path: '/',
      requiredRoles: [] // Sin restricción de roles
    },
    {
      id: 'invoices',
      text: 'Facturas',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="invoice" style={{ fontSize: '20px' }}>📄</span></Box> ),
      path: '/invoices',
      requiredRoles: [] // Sin restricción de roles
    },
    {
      id: 'documents',
      text: 'Cotizaciones',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="quotes" style={{ fontSize: '20px' }}>📋</span></Box> ),
      path: '/documents',
      requiredRoles: [] // Sin restricción de roles
    },
    {
      id: 'clients',
      text: 'Clientes',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="clients" style={{ fontSize: '20px' }}>👥</span></Box> ),
      path: '/clients',
      requiredRoles: [] // Sin restricción de roles
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
      requiredRoles: [] // Sin restricción de roles
    },
    {
      id: 'users',
      text: 'Usuarios',
      icon: (
        <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span role="img" aria-label="users" style={{ fontSize: '20px' }}>👤</span>
        </Box>
      ),
      path: '/users',
      requiredRoles: ['admin'] // Solo para administradores
    },
    {
      id: 'settings',
      text: 'Configuración',
      icon: ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="settings" style={{ fontSize: '20px' }}>⚙️</span></Box> ),
      path: '/settings',
      requiredRoles: [] // Sin restricción de roles
    },
  ];

  // Iconos (sin cambios)
  const aiAssistantIcon = ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="ai-assistant" style={{ fontSize: '20px' }}>🤖</span></Box> );
  const supportIcon = ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="support" style={{ fontSize: '20px' }}>❓</span></Box> );
  const logoutIcon = ( <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span role="img" aria-label="logout" style={{ fontSize: '20px' }}>🚪</span></Box> );

  // Función para obtener iniciales (sin cambios)
  const getCompanyInitials = () => {
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

  // isActive (sin cambios)
  const isActive = (path) => {
    if (!path) return false;
    if (path === '/documents' && location.pathname.startsWith('/documents')) return true;
    if (path === '/products' && location.pathname.startsWith('/products')) return true;
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path) && path !== '/documents' && path !== '/products');
  };

  const mainColor = '#2196F3';
  const drawerStyles = {
    width: open ? expandedWidth : collapsedWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    bgcolor: '#ffffff',
    color: '#333333',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRight: '1px solid #e0e0e0',
  };

  // Filtrar elementos del menú según los roles del usuario
  const filteredMenuItems = menuItems.filter(item => {
    // Si no requiere roles específicos, mostrar a todos
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true;
    }
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    return item.requiredRoles.some(role => hasRole(role));
  });

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
      {/* Cabecera del Sidebar (sin cambios) */}
       <Box sx={{
           display: 'flex',
           alignItems: 'center',
           justifyContent: open ? 'flex-start' : 'center',
           padding: theme.spacing(0, open ? 2 : 1),
           borderBottom: '1px solid #e0e0e0',
           height: '72px',
           overflow: 'hidden'
        }}>

         {/* Renderizado Condicional del Logo/Avatar (sin cambios) */}
         {companyLogoUrl ? (
           <Avatar
             variant="rounded"
             src={companyLogoUrl}
             alt={`${companyName} logo`}
             sx={{
               width: 40,
               height: 40,
               mr: open ? 1.5 : 0,
               transition: theme.transitions.create(['margin', 'width', 'height'], {
                 easing: theme.transitions.easing.sharp,
                 duration: theme.transitions.duration.leavingScreen,
               }),
               bgcolor: 'transparent',
             }}
           />
         ) : (
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
             {companyLoading ? '...' : getCompanyInitials()}
           </Avatar>
         )}

         {/* Nombre y RIF (solo visible si está expandido) (sin cambios) */}
         {open && (
           <Box sx={{ overflow: 'hidden', flexGrow: 1, ml: 0 }}>
             <Typography variant="subtitle1" fontWeight="bold" color="#333333" noWrap>
               {companyLoading ? 'Cargando...' : companyName}
             </Typography>
             <Typography variant="caption" color="#666666" noWrap>
               {companyLoading ? '' : (company?.rif ? `RIF: ${company.rif}` : 'Sistema de Facturación')}
             </Typography>
           </Box>
         )}
       </Box>

      {/* Menú principal (modificado para filtrar por roles) */}
      <List sx={{ px: open ? 1 : 1.5, py: 2 }}>
        {filteredMenuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.id} disablePadding sx={{ display: 'block', position: 'relative', mb: 0.5 }} >
              {active && ( <Box sx={{ position: 'absolute', left: 0, top: '15%', width: 4, height: '70%', backgroundColor: mainColor, borderRadius: '0 4px 4px 0', opacity: open ? 1 : 0, transition: theme.transitions.create('opacity', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen, }) }} /> )}
              <ListItemButton component={RouterLink} to={item.path || '#'} sx={{ minHeight: 48, justifyContent: 'center', px: 2, py: 1, borderRadius: 1, backgroundColor: active ? 'rgba(33, 150, 243, 0.08)' : 'transparent', '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.12)' }, }} >
                {/* Solo mostramos el tooltip cuando está cerrado */}
                {!open ? (
                  <Tooltip title={item.text} placement="right">
                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                ) : (
                  <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center', transition: theme.transitions.create('margin', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen, }) }}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0, 
                    transition: theme.transitions.create('opacity', { 
                      easing: theme.transitions.easing.sharp, 
                      duration: theme.transitions.duration.leavingScreen, 
                    }), 
                    '& .MuiTypography-root': { 
                      fontWeight: active ? 'medium' : 'normal', 
                      color: active ? mainColor : '#333333', 
                      whiteSpace: 'nowrap',
                    } 
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

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
  
        {/* Footer del sidebar (modificado para incluir función de logout) */}
        <Box sx={{ px: open ? 2 : 1, pb: 2, pt: 1, borderTop: '1px solid #e0e0e0' }}>
          <ListItemButton 
            sx={{ 
              borderRadius: 1, 
              mb: 1, 
              justifyContent: 'center', 
              minHeight: 42, 
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.04)', 
              }, 
            }}
            component={RouterLink} 
            to="/support"
          >
            {!open ? (
              <Tooltip title="Soporte" placement="right">
                <ListItemIcon sx={{ minWidth: 0 }}> {supportIcon} </ListItemIcon>
              </Tooltip>
            ) : (
              <ListItemIcon sx={{ minWidth: 0, mr: 2 }}> {supportIcon} </ListItemIcon>
            )}
            <ListItemText 
              primary="Soporte" 
              sx={{ 
                opacity: open ? 1 : 0, 
                transition: theme.transitions.create('opacity', { 
                  duration: theme.transitions.duration.leavingScreen 
                }), 
                '& .MuiTypography-root': { 
                  color: '#666666', 
                  whiteSpace: 'nowrap' 
                } 
              }} 
            />
          </ListItemButton>
          <ListItemButton 
            onClick={handleLogout}
            sx={{ 
              borderRadius: 1, 
              justifyContent: 'center', 
              minHeight: 42, 
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.04)', 
              }, 
            }}
          >
            {!open ? (
              <Tooltip title="Cerrar sesión" placement="right">
                <ListItemIcon sx={{ minWidth: 0 }}> {logoutIcon} </ListItemIcon>
              </Tooltip>
            ) : (
              <ListItemIcon sx={{ minWidth: 0, mr: 2 }}> {logoutIcon} </ListItemIcon>
            )}
            <ListItemText 
              primary="Cerrar sesión" 
              sx={{ 
                opacity: open ? 1 : 0, 
                transition: theme.transitions.create('opacity', { 
                  duration: theme.transitions.duration.leavingScreen 
                }), 
                '& .MuiTypography-root': { 
                  color: '#666666', 
                  whiteSpace: 'nowrap' 
                } 
              }} 
            />
          </ListItemButton>
        </Box>
      </Drawer>
    );
  };
  
  export default Sidebar;