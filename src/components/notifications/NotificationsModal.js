// src/components/notifications/NotificationsModal.js
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
  Chip,
  useTheme,
  CircularProgress,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MarkChatReadOutlinedIcon from '@mui/icons-material/MarkChatReadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNotifications } from '../../context/NotificationsContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificationsModal = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error,
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'unread', 'read'
  
  // Filtrar notificaciones según la pestaña seleccionada
  const filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 'unread') return !notification.read;
    if (selectedTab === 'read') return notification.read;
    return true; // 'all'
  });

  // Función para obtener el icono según el tipo de notificación
  const getNotificationIcon = (notification) => {
    const iconProps = { fontSize: "small" };
    
    switch (notification.type) {
      case 'inventario_bajo':
        return <InventoryIcon {...iconProps} sx={{ color: theme.palette.warning?.main || '#ff9800' }} />;
      case 'factura_vencida':
        return <WarningAmberOutlinedIcon {...iconProps} sx={{ color: theme.palette.error?.main || '#f44336' }} />;
      case 'pago_recibido':
        return <PaidOutlinedIcon {...iconProps} sx={{ color: theme.palette.success?.main || '#4caf50' }} />;
      case 'cotizacion_pendiente':
        return <ArticleOutlinedIcon {...iconProps} sx={{ color: theme.palette.info?.main || '#2196f3' }} />;
      case 'sistema':
      default:
        return <InfoOutlinedIcon {...iconProps} sx={{ color: theme.palette.action?.active || 'rgba(0, 0, 0, 0.54)' }} />;
    }
  };

  // Función para formatear la fecha de creación
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.abs(now - date) / 36e5; // Diferencia en horas
      
      if (diffInHours < 24) {
        // Si es menos de 24 horas, mostrar "Hace X horas/minutos"
        if (diffInHours < 1) {
          const minutes = Math.round(diffInHours * 60);
          return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
        }
        const hours = Math.round(diffInHours);
        return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
      } else if (diffInHours < 48) {
        // Si es menos de 48 horas, mostrar "Ayer"
        return "Ayer";
      } else {
        // Si es más de 48 horas, mostrar la fecha formateada
        return format(date, "d 'de' MMMM", { locale: es });
      }
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return dateString;
    }
  };

  // Manejar clic en una notificación
  const handleNotificationClick = async (notification) => {
    // Si no está leída, marcarla como leída
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    
    // Si tiene un link, navegar a él
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  // Manejar eliminación de una notificación
  const handleDelete = async (e, notificationId) => {
    e.stopPropagation(); // Evitar que se propague al ListItem
    await deleteNotification(notificationId);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="div" fontWeight={600}>
          Notificaciones
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {unreadCount > 0 && (
            <Tooltip title="Marcar todas como leídas">
              <IconButton size="small" color="primary" onClick={markAllAsRead}>
                <MarkChatReadOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
          <IconButton size="small" onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      {/* Pestañas de filtrado */}
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
        <Button 
          variant={selectedTab === 'all' ? 'contained' : 'text'} 
          size="small"
          onClick={() => setSelectedTab('all')}
        >
          Todas
        </Button>
        <Button 
          variant={selectedTab === 'unread' ? 'contained' : 'text'} 
          size="small"
          onClick={() => setSelectedTab('unread')}
          endIcon={unreadCount > 0 ? <Chip size="small" label={unreadCount} color="error" /> : null}
        >
          No leídas
        </Button>
        <Button 
          variant={selectedTab === 'read' ? 'contained' : 'text'} 
          size="small"
          onClick={() => setSelectedTab('read')}
        >
          Leídas
        </Button>
      </Box>
      
      <Divider />
      
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
            <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {selectedTab === 'all' 
                ? 'No tienes notificaciones.' 
                : selectedTab === 'unread' 
                  ? 'No tienes notificaciones sin leer.' 
                  : 'No tienes notificaciones leídas.'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notification) => (
              <React.Fragment key={notification._id}>
                <ListItem 
                  button 
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    py: 2,
                    px: 2,
                    bgcolor: notification.read ? 'transparent' : theme.palette.action?.selected || 'rgba(0, 0, 0, 0.04)',
                    '&:hover': {
                      bgcolor: theme.palette.action?.hover || 'rgba(0, 0, 0, 0.08)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    {getNotificationIcon(notification)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography 
                        variant="body2" 
                        fontWeight={notification.read ? 'normal' : 600}
                        color="text.primary"
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                          {formatDate(notification.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                  <Tooltip title="Eliminar">
                    <IconButton 
                      edge="end" 
                      size="small"
                      onClick={(e) => handleDelete(e, notification._id)}
                      sx={{ ml: 1, opacity: 0.6, '&:hover': { opacity: 1 } }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;