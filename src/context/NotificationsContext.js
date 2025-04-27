// src/context/NotificationsContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { alertsApi } from '../services/AlertsApi';

// URL del servidor Socket.io (debe coincidir con el backend)
const SOCKET_URL = 'http://localhost:5002';

// Crear el contexto
const NotificationsContext = createContext();

// Hook personalizado para usar el contexto
export const useNotifications = () => {
  return useContext(NotificationsContext);
};

export const NotificationsProvider = ({ children }) => {
  const { token, currentUser } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar notificaciones desde la API
  const loadNotifications = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const result = await alertsApi.getAll({ limit: 100 });
      if (result && result.data) {
        setNotifications(result.data);
        setUnreadCount(result.data.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Configurar Socket.io cuando el usuario está autenticado
  useEffect(() => {
    if (!token || !currentUser) return;

    // Crear instancia de Socket.io con autenticación
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token
      }
    });

    // Manejar eventos de conexión
    newSocket.on('connect', () => {
      console.log('Conexión establecida con Socket.io');
      // Solicitar notificaciones no leídas al conectarse
      newSocket.emit('getUnreadNotifications');
    });

    // Manejar errores de conexión
    newSocket.on('connect_error', (err) => {
      console.error('Error de conexión Socket.io:', err.message);
      setError(`Error de conexión: ${err.message}`);
    });

    // Recibir notificaciones no leídas al conectarse
    newSocket.on('unreadNotifications', (data) => {
      setNotifications(prev => {
        // Combinar con notificaciones existentes, evitando duplicados
        const existingIds = new Set(prev.map(n => n._id));
        const newNotifications = data.filter(n => !existingIds.has(n._id));
        const combined = [...prev, ...newNotifications];
        // Ordenar por fecha, más recientes primero
        return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
      setUnreadCount(prev => prev + data.length);
    });

    // Recibir nueva notificación
    newSocket.on('newNotification', (notification) => {
      setNotifications(prev => {
        // Añadir al inicio del array
        return [notification, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
      setUnreadCount(prev => prev + 1);
    });

    // Actualizar cuando una notificación se marca como leída
    newSocket.on('notificationMarkedAsRead', (notificationId) => {
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    });

    // Actualizar cuando todas las notificaciones se marcan como leídas
    newSocket.on('allNotificationsMarkedAsRead', () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    });

    // Guardar la referencia del socket y cargar notificaciones iniciales
    setSocket(newSocket);
    loadNotifications();

    // Limpiar al desmontar
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [token, currentUser, loadNotifications]);

  // Función para marcar una notificación como leída
  const markAsRead = async (notificationId) => {
    try {
      await alertsApi.markAsRead(notificationId);
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Notificar al servidor a través de Socket.io
      if (socket) {
        socket.emit('markAsRead', notificationId);
      }
    } catch (err) {
      console.error('Error al marcar notificación como leída:', err);
    }
  };

  // Función para marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    try {
      await alertsApi.markAllAsRead();
      
      // Actualizar estado local
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      // Notificar al servidor a través de Socket.io
      if (socket) {
        socket.emit('markAllAsRead');
      }
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  };

  // Función para eliminar una notificación
  const deleteNotification = async (notificationId) => {
    try {
      await alertsApi.delete(notificationId);
      
      // Actualizar estado local
      const wasUnread = notifications.find(n => n._id === notificationId && !n.read);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
    }
  };

  // Valor del contexto
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadNotifications
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;