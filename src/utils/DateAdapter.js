// src/utils/DateAdapter.js
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

// Crear una clase adaptador personalizada para evitar problemas de compatibilidad
class CustomDateAdapter extends AdapterDateFns {
  constructor({ locale } = {}) {
    super({ locale });
  }

  // Sobrescribir métodos problemáticos si es necesario
  // Esta es una solución alternativa en caso de que haya problemas específicos
  formatByString(date, formatString) {
    try {
      return super.formatByString(date, formatString);
    } catch (error) {
      console.warn('Error en formatByString:', error);
      // Implementar una solución alternativa
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      // Formato básico dd/MM/yyyy
      return `${day}/${month}/${year}`;
    }
  }
}

// Exportar instancia con locale español
export const dateAdapter = new CustomDateAdapter({ locale: es });