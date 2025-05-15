// src/hooks/useInactivityTimeout.js
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook personalizado para detectar inactividad y cerrar sesión automáticamente
 * @param {number} timeoutMinutes - Tiempo en minutos para cerrar sesión por inactividad (default: 60)
 */
const useInactivityTimeout = (timeoutMinutes = 60) => {
  const { logout } = useAuth();
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Convertir minutos a milisegundos
    const timeoutMs = timeoutMinutes * 60 * 1000;

    // Función para reiniciar el temporizador
    const resetTimer = () => {
      // Limpiar temporizador previo si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Establecer nuevo temporizador
      timeoutRef.current = setTimeout(() => {
        logout();
      }, timeoutMs);
    };

    // Eventos a escuchar para detectar actividad
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 
      'scroll', 'touchstart', 'click'
    ];

    // Iniciar el temporizador
    resetTimer();

    // Añadir listeners para cada evento
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Limpiar listeners y temporizador al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [logout, timeoutMinutes]);

  // Este hook no devuelve nada, solo tiene efectos secundarios
};

export default useInactivityTimeout;