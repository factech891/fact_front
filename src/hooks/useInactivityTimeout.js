// src/hooks/useInactivityTimeout.js - versión mejorada
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const useInactivityTimeout = (timeoutMinutes = 60) => {
  const { logout } = useAuth();
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    // Convertir minutos a milisegundos
    const timeoutMs = timeoutMinutes * 60 * 1000;
    
    // Función para reiniciar el temporizador
    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Actualizar timestamp de última actividad
      lastActivityRef.current = Date.now();
      
      // Establecer nuevo temporizador con verificación adicional
      timeoutRef.current = setTimeout(() => {
        // Verificar el tiempo real transcurrido
        const inactiveTime = Date.now() - lastActivityRef.current;
        
        // Solo cerrar sesión si realmente ha pasado el tiempo de inactividad
        if (inactiveTime >= timeoutMs) {
          console.log(`Cerrando sesión automáticamente después de ${inactiveTime/60000} minutos de inactividad`);
          logout();
        } else {
          // Si por alguna razón no ha pasado suficiente tiempo, reintentar
          console.log('Verificación de tiempo: inactividad insuficiente, reintentando');
          resetTimer();
        }
      }, timeoutMs);
    };

    // Eventos a escuchar para detectar actividad
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 
      'scroll', 'touchstart', 'click', 'focus'
    ];

    // Iniciar el temporizador
    resetTimer();

    // Añadir listeners para cada evento
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Verificación periódica para mayor seguridad
    const intervalCheck = setInterval(() => {
      const inactiveTime = Date.now() - lastActivityRef.current;
      if (inactiveTime >= timeoutMs) {
        console.log(`Verificación periódica: inactividad detectada (${inactiveTime/60000} minutos)`);
        logout();
        clearInterval(intervalCheck);
      }
    }, timeoutMs / 2); // Verificar a la mitad del tiempo de timeout

    // Limpiar listeners y temporizador al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearInterval(intervalCheck);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [logout, timeoutMinutes]);
};

export default useInactivityTimeout;