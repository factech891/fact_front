// src/context/NotificationsContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
// Asumiendo que tienes un servicio API para notificaciones
import { alertsApi } from '../services/AlertsApi'; // Asegúrate que la ruta sea correcta

// URL del servidor Socket.io (debe coincidir con el backend)
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5002'; // Usar variable de entorno

// Crear el contexto
const NotificationsContext = createContext();

// Hook personalizado para usar el contexto
export const useNotifications = () => {
  return useContext(NotificationsContext);
};

// Proveedor del contexto
export const NotificationsProvider = ({ children }) => {
  const { token, currentUser } = useAuth(); // Obtener token y usuario del contexto de autenticación
  const [socket, setSocket] = useState(null); // Estado para la instancia del socket
  const [notifications, setNotifications] = useState([]); // Estado para la lista de notificaciones
  const [unreadCount, setUnreadCount] = useState(0); // Estado para el contador de no leídas
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [error, setError] = useState(null); // Estado para manejar errores

  // --- Carga Inicial de Notificaciones (vía API REST) ---
  const loadNotifications = useCallback(async () => {
    // Solo cargar si hay token
    if (!token) {
        setLoading(false); // Detener carga si no hay token
        return;
    }

    console.log('[NotificationsContext] Cargando notificaciones iniciales desde API...');
    setLoading(true);
    setError(null); // Limpiar errores previos
    try {
      // Llamar a la API para obtener notificaciones (ej: últimas 100)
      const result = await alertsApi.getAll({ limit: 100 }); // Usar tu servicio API real
      if (result && Array.isArray(result.data)) {
        // Ordenar por fecha descendente (más recientes primero)
        const sortedNotifications = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(sortedNotifications);
        // Calcular no leídas iniciales (se recalculará en el useEffect)
        // setUnreadCount(sortedNotifications.filter(n => !n.read).length);
        console.log(`[NotificationsContext] ${result.data.length} notificaciones cargadas desde API.`);
      } else {
         console.warn('[NotificationsContext] La respuesta de la API de notificaciones no tiene el formato esperado.');
         setNotifications([]); // Establecer array vacío si la respuesta no es válida
      }
    } catch (err) {
      console.error('[NotificationsContext] Error cargando notificaciones desde API:', err);
      setError('No se pudieron cargar las notificaciones.'); // Mensaje de error para el usuario
    } finally {
      setLoading(false); // Finalizar estado de carga
    }
  }, [token]); // Dependencia: token

  // --- Efecto para recalcular no leídas cuando cambian las notificaciones ---
  useEffect(() => {
    // Actualizar el conteo de no leídas cada vez que cambian las notificaciones
    const actualUnread = notifications.filter(n => !n.read).length;
    setUnreadCount(actualUnread);

    // Log para debugging (opcional)
    // console.log('[NotificationsContext] Estado de notificaciones actualizado. Totales:', notifications.length, 'No leídas:', actualUnread);
  }, [notifications]); // Dependencia: notifications

  // --- Efecto para configurar y manejar Socket.IO ---
  useEffect(() => {
    // Solo conectar si hay token y usuario
    if (!token || !currentUser) {
        // Si no hay token/usuario y el socket existe, desconectarlo
        if (socket) {
            console.log('[NotificationsContext] Desconectando socket por falta de token/usuario.');
            socket.disconnect();
            setSocket(null);
        }
        return;
    }

    // Evitar reconexiones múltiples si el socket ya existe y está conectado
    if (socket && socket.connected) {
        // console.log('[NotificationsContext] Socket ya conectado.');
        return;
    }

    console.log('[NotificationsContext] Intentando conectar a Socket.IO en', SOCKET_URL);
    setError(null); // Limpiar errores previos al intentar conectar

    // --- Crear instancia de Socket.io con autenticación y opciones de reconexión (UNIFICADO) ---
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token // Enviar token JWT para autenticación en el backend
      },
      reconnectionAttempts: 5, // Número máximo de intentos de reconexión
      reconnectionDelay: 1000, // Retraso inicial antes del primer intento (1 segundo)
      timeout: 10000, // Tiempo máximo de espera para la conexión (10 segundos)
      transports: ['websocket', 'polling'] // Intentar WebSocket primero, luego fallback a polling
    });

    // --- Manejadores de eventos del Socket ---

    // Conexión exitosa
    newSocket.on('connect', () => {
      console.log('[NotificationsContext] Conexión establecida con Socket.io (ID:', newSocket.id, ')');
      setError(null); // Limpiar cualquier error de conexión previo
      // Solicitar notificaciones no leídas al servidor tras conectar/reconectar
      console.log('[NotificationsContext] Emitiendo getUnreadNotifications al servidor...');
      newSocket.emit('getUnreadNotifications', (response) => {
          // Manejar respuesta del servidor si usa callback
          if (response && response.success && Array.isArray(response.notifications)) {
              console.log(`[NotificationsContext] Recibidas ${response.notifications.length} notificaciones no leídas vía callback.`);
              // Actualizar estado local (evitando duplicados)
              setNotifications(prev => {
                  const existingIds = new Set(prev.map(n => n._id));
                  const newUnread = response.notifications.filter(n => !existingIds.has(n._id));
                  if (newUnread.length > 0) {
                      console.log(`[NotificationsContext] Añadiendo ${newUnread.length} nuevas notificaciones no leídas al estado.`);
                      return [...prev, ...newUnread].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                  }
                  return prev; // No cambiar si no hay nuevas
              });
          } else if (response && !response.success) {
              console.error('[NotificationsContext] Error en respuesta de getUnreadNotifications:', response.error);
          }
      });
    });

    // Error de conexión (UNIFICADO con mensaje amigable)
    newSocket.on('connect_error', (err) => {
      console.error('[NotificationsContext] Error de conexión Socket.io:', err.message);
      let friendlyError = `Error de conexión: ${err.message}`;
      // Mostrar un mensaje más específico para errores comunes
      if (err.message.includes('xhr poll error') || err.message.includes('timeout') || err.message.includes('transport error')) {
        friendlyError = 'Problemas de conexión con el servidor. Intentando reconectar...';
      } else if (err.message.includes('Authentication error')) {
         friendlyError = 'Error de autenticación con el servidor de notificaciones.';
         // Podrías querer desloguear al usuario o mostrar un mensaje más fuerte aquí
      }
      setError(friendlyError);
    });

    // Intento de reconexión (UNIFICADO)
    newSocket.on('reconnect_attempt', (attempt) => {
      console.log(`[NotificationsContext] Intento de reconexión ${attempt}/5...`);
      setError('Intentando reconectar con el servidor de notificaciones...'); // Informar al usuario
    });

    // Falla en la reconexión después de todos los intentos
     newSocket.on('reconnect_failed', () => {
       console.error('[NotificationsContext] Fallaron todos los intentos de reconexión.');
       setError('No se pudo reconectar con el servidor de notificaciones. Por favor, recarga la página.');
     });

    // Desconexión
     newSocket.on('disconnect', (reason) => {
         console.warn(`[NotificationsContext] Socket desconectado. Razón: ${reason}`);
         // Si la desconexión fue iniciada por el servidor, puede requerir reconexión manual o login
         if (reason === 'io server disconnect') {
             setError('Desconectado por el servidor. Puede que necesites volver a iniciar sesión.');
             // Considera limpiar el socket aquí si la reconexión automática no aplica
             // setSocket(null);
         } else {
            // Para otras razones (ej: 'transport close'), la reconexión automática debería intentarlo
            setError('Conexión perdida. Intentando reconectar...');
         }
     });


    // Recibir notificaciones no leídas (manejador alternativo si no se usa callback en 'connect')
    // newSocket.on('unreadNotifications', (data) => {
    //   console.log(`[NotificationsContext] Recibidas ${data.length} notificaciones no leídas vía evento.`);
    //   setNotifications(prev => {
    //     const existingIds = new Set(prev.map(n => n._id));
    //     const newNotifications = data.filter(n => !existingIds.has(n._id));
    //     const combined = [...prev, ...newNotifications];
    //     return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    //   });
    //   // El useEffect [notifications] recalculará el unreadCount
    // });

    // Recibir nueva notificación (UNIFICADO con prevención de duplicados)
    newSocket.on('newNotification', (notification) => {
      console.log('[NotificationsContext] Nueva notificación recibida:', notification.title);
      setNotifications(prev => {
        // Verificar si la notificación ya existe por ID
        const exists = prev.some(n => n._id === notification._id);
        if (exists) {
          console.warn(`[NotificationsContext] Notificación duplicada recibida (ID: ${notification._id}), actualizando si es necesario.`);
          // Si ya existe, reemplazarla por si tiene datos actualizados (raro pero posible)
          return prev.map(n => n._id === notification._id ? notification : n)
                     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Reordenar por si acaso
        }
        // Si no existe, añadir al inicio y ordenar
        return [notification, ...prev]
               .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
      // El useEffect [notifications] recalculará el unreadCount
    });

    // Actualizar cuando una notificación se marca como leída (recibido del servidor)
    newSocket.on('notificationMarkedAsRead', (notificationId) => {
      console.log(`[NotificationsContext] Evento recibido: Notificación ${notificationId} marcada como leída.`);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      // El useEffect [notifications] recalculará el unreadCount
    });

    // Actualizar cuando todas las notificaciones se marcan como leídas (recibido del servidor)
    newSocket.on('allNotificationsMarkedAsRead', () => {
      console.log('[NotificationsContext] Evento recibido: Todas las notificaciones marcadas como leídas.');
      setNotifications(prev => prev.map(n => n.read ? n : { ...n, read: true })); // Marcar solo las no leídas
      // El useEffect [notifications] recalculará el unreadCount (irá a 0)
    });

    // Guardar la referencia del socket en el estado
    setSocket(newSocket);
    // Cargar notificaciones iniciales desde la API
    loadNotifications();

    // Función de limpieza al desmontar el componente o cambiar dependencias
    return () => {
      console.log('[NotificationsContext] Limpiando: Desconectando socket...');
      if (newSocket) {
        newSocket.off('connect'); // Quitar todos los listeners para evitar fugas
        newSocket.off('connect_error');
        newSocket.off('reconnect_attempt');
        newSocket.off('reconnect_failed');
        newSocket.off('disconnect');
        newSocket.off('unreadNotifications');
        newSocket.off('newNotification');
        newSocket.off('notificationMarkedAsRead');
        newSocket.off('allNotificationsMarkedAsRead');
        newSocket.disconnect(); // Desconectar el socket
      }
      setSocket(null); // Limpiar referencia del socket
    };
  // La siguiente línea causaba el error de ESLint si el plugin no está configurado. La he eliminado.
  // Si tienes el plugin configurado, ESLint te advertirá si faltan dependencias aquí.
  }, [token, currentUser, loadNotifications]); // Dependencias: token y currentUser (loadNotifications se memoiza con useCallback)

  // --- Funciones de Acción (para interactuar con API y Socket) ---

  // Función para marcar una notificación como leída (local y servidor)
  const markAsRead = useCallback(async (notificationId) => {
    // Actualizar estado local inmediatamente para UI responsiva
    const notificationExists = notifications.some(n => n._id === notificationId);
    if (!notificationExists) {
        console.warn(`[NotificationsContext] Intento de marcar como leída notificación inexistente: ${notificationId}`);
        return;
    }
    // Marcar como leída solo si no lo está ya
    setNotifications(prev =>
      prev.map(n => (n._id === notificationId && !n.read) ? { ...n, read: true } : n)
    );
    // El useEffect [notifications] recalculará el unreadCount

    // Notificar al servidor (API y Socket)
    try {
      console.log(`[NotificationsContext] Marcando notificación ${notificationId} como leída (API)...`);
      await alertsApi.markAsRead(notificationId); // Llamada API REST

      // Notificar al servidor a través de Socket.io para sincronizar otros clientes (si está conectado)
      if (socket && socket.connected) {
        console.log(`[NotificationsContext] Emitiendo evento markAsRead para ${notificationId} vía Socket...`);
        socket.emit('markAsRead', notificationId);
      }
    } catch (err) {
      console.error(`[NotificationsContext] Error al marcar notificación ${notificationId} como leída (API):`, err);
      // Opcional: Revertir el cambio local si falla la API
      // setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: false } : n));
      // Mostrar error al usuario
      setError('Error al actualizar el estado de la notificación.');
    }
  }, [notifications, socket]); // Dependencias: notifications, socket

  // Función para marcar todas las notificaciones como leídas
  const markAllAsRead = useCallback(async () => {
    // Actualizar estado local inmediatamente
    const wereUnread = notifications.some(n => !n.read);
    if (!wereUnread) return; // No hacer nada si ya están todas leídas

    setNotifications(prev => prev.map(n => n.read ? n : { ...n, read: true }));
    // El useEffect [notifications] recalculará el unreadCount (a 0)

    // Notificar al servidor (API y Socket)
    try {
      console.log('[NotificationsContext] Marcando todas las notificaciones como leídas (API)...');
      await alertsApi.markAllAsRead(); // Llamada API REST

      if (socket && socket.connected) {
        console.log('[NotificationsContext] Emitiendo evento markAllAsRead vía Socket...');
        socket.emit('markAllAsRead');
      }
    } catch (err) {
      console.error('[NotificationsContext] Error al marcar todas como leídas (API):', err);
      // Opcional: Revertir cambio local
      // loadNotifications(); // Podría ser una opción para resincronizar
      setError('Error al marcar todas las notificaciones como leídas.');
    }
  }, [notifications, socket]); // Dependencias: notifications, socket

  // Función para eliminar una notificación
  const deleteNotification = useCallback(async (notificationId) => {
    // Guardar estado previo por si hay que revertir
    const originalNotifications = [...notifications];
    // Actualizar estado local inmediatamente
    setNotifications(prev => prev.filter(n => n._id !== notificationId));
    // El useEffect [notifications] recalculará el unreadCount

    // Llamar a la API para eliminar
    try {
      console.log(`[NotificationsContext] Eliminando notificación ${notificationId} (API)...`);
      await alertsApi.delete(notificationId); // Llamada API REST
      // No se necesita emitir evento de socket para eliminar, ya que afecta solo al estado local
      // (a menos que quieras notificar a otros usuarios que una notificación fue eliminada)
    } catch (err) {
      console.error(`[NotificationsContext] Error al eliminar notificación ${notificationId} (API):`, err);
      // Revertir el estado local si falla la API
      setNotifications(originalNotifications);
      setError('Error al eliminar la notificación.');
    }
  }, [notifications]); // Dependencia: notifications

  // Función para refrescar/recargar notificaciones manualmente (si es necesario)
  const refreshNotifications = useCallback(() => {
      console.log("[NotificationsContext] Refrescando notificaciones manualmente...");
      setError(null); // Limpiar errores
      loadNotifications(); // Volver a cargar desde la API
      // Si el socket está conectado, también podría solicitar no leídas
      if (socket && socket.connected) {
          // Podrías añadir un callback aquí también si el servidor lo soporta
          socket.emit('getUnreadNotifications');
      }
  }, [loadNotifications, socket]);


  // Valor proporcionado por el contexto
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications // Añadir función de refresco al contexto
    // loadNotifications // Exponer si otros componentes la necesitan
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
