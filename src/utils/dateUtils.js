// src/utils/dateUtils.js - Corregir importaciones
import { format, parseISO, formatISO } from 'date-fns'; // Importar estas de date-fns
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz'; // De date-fns-tz
import { es } from 'date-fns/locale';

// Detectar zona horaria del navegador
export const detectBrowserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('No se pudo detectar la zona horaria del navegador:', error);
    return 'UTC';
  }
};

// Lista de zonas horarias comunes (con enfoque en América Latina)
export const commonTimezones = [
  { value: 'America/Argentina/Buenos_Aires', label: '(GMT-03:00) Argentina' },
  { value: 'America/Bogota', label: '(GMT-05:00) Colombia' },
  { value: 'America/Caracas', label: '(GMT-04:00) Venezuela' },
  { value: 'America/Santiago', label: '(GMT-03:00/GMT-04:00) Chile' },
  { value: 'America/Mexico_City', label: '(GMT-06:00) México' },
  { value: 'America/Lima', label: '(GMT-05:00) Perú' },
  { value: 'America/Montevideo', label: '(GMT-03:00) Uruguay' },
  { value: 'America/La_Paz', label: '(GMT-04:00) Bolivia' },
  { value: 'America/Guayaquil', label: '(GMT-05:00) Ecuador' },
  { value: 'America/Asuncion', label: '(GMT-03:00/GMT-04:00) Paraguay' },
  { value: 'America/Panama', label: '(GMT-05:00) Panamá' },
  { value: 'America/Costa_Rica', label: '(GMT-06:00) Costa Rica' },
  { value: 'America/Santo_Domingo', label: '(GMT-04:00) República Dominicana' },
  { value: 'America/Guatemala', label: '(GMT-06:00) Guatemala' },
  { value: 'Europe/Madrid', label: '(GMT+01:00/GMT+02:00) España' },
  { value: 'UTC', label: '(GMT+00:00) UTC' },
];

// Convertir fecha de UTC a zona horaria local
export const utcToLocalTime = (utcDateString, timezone) => {
  if (!utcDateString) return null;
  
  try {
    // Si la fecha es un string, convertirla a objeto Date
    const utcDate = typeof utcDateString === 'string' ? parseISO(utcDateString) : utcDateString;
    
    // Usar zona horaria del usuario, de la compañía o UTC como último recurso
    const userTimezone = timezone || detectBrowserTimezone() || 'UTC';
    
    // Convertir de UTC a la zona horaria especificada usando toZonedTime
    return toZonedTime(utcDate, userTimezone);
  } catch (error) {
    console.error('Error al convertir de UTC a hora local:', error);
    return new Date(utcDateString); // Fallback a conversión básica
  }
};

// Convertir fecha de zona horaria local a UTC
export const localTimeToUtc = (localDateString, timezone) => {
  if (!localDateString) return null;
  
  try {
    // Si la fecha es un string, convertirla a objeto Date
    const localDate = typeof localDateString === 'string' ? parseISO(localDateString) : localDateString;
    
    // Usar zona horaria del usuario, de la compañía o UTC como último recurso
    const userTimezone = timezone || detectBrowserTimezone() || 'UTC';
    
    // Convertir de la zona horaria especificada a UTC usando fromZonedTime
    return fromZonedTime(localDate, userTimezone);
  } catch (error) {
    console.error('Error al convertir de hora local a UTC:', error);
    return new Date(localDateString); // Fallback a conversión básica
  }
};

// Formatear fecha para mostrar (con diferentes opciones)
export const formatDate = (date, formatPattern = 'dd/MM/yyyy', timezone) => {
  if (!date) return '';
  
  try {
    // Convertir a la zona horaria correcta primero
    const localDate = utcToLocalTime(date, timezone);
    
    // Formatear según el patrón especificado usando formatInTimeZone
    return formatInTimeZone(localDate, timezone || detectBrowserTimezone() || 'UTC', formatPattern, { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    
    // Fallback básico en caso de error
    if (date instanceof Date) {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }
    return '';
  }
};

// Formatear fecha con hora
export const formatDateTime = (date, timezone) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm', timezone);
};

// Formatear fecha para inputs de tipo date (YYYY-MM-DD)
export const formatForDateInput = (date, timezone) => {
  return formatDate(date, 'yyyy-MM-dd', timezone);
};

// Formatear para uso en API (ISO 8601)
export const formatForApi = (date) => {
  if (!date) return null;
  try {
    return formatISO(date);
  } catch (error) {
    console.error('Error al formatear fecha para API:', error);
    return date.toISOString(); // Fallback
  }
};