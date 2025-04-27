import React from 'react';
// src/services/exchangeRateApi.js - COMPLETO

// Claves de localStorage
const STORAGE_KEY_RATE = 'factTech_exchangeRate';
const STORAGE_KEY_MODE = 'factTech_exchangeRateMode'; // 'auto' o 'manual'
const STORAGE_KEY_RATES = 'factTech_exchangeRates'; // Para guardar todas las tasas como JSON

// Valor por defecto si no hay nada guardado
const DEFAULT_RATE = 66;

// Evento personalizado para notificar cambios en la tasa
const RATE_CHANGE_EVENT = 'factTech_rateChange';

// Función para disparar evento de cambio de tasa
const notifyRateChange = (rate, mode) => {
  // Crear y disparar evento personalizado
  const event = new CustomEvent(RATE_CHANGE_EVENT, { 
    detail: { rate, mode } 
  });
  window.dispatchEvent(event);
  console.log('Evento de cambio de tasa disparado:', rate, mode);
};

// Función para obtener tasas desde API externa
const fetchRatesFromAPI = async () => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    // Extraer tasa para Venezuela (VES)
    const bcvRate = data.rates.VES || 40; // Valor de respaldo si no existe
    
    // Calculamos otras tasas basadas en esta
    const rates = {
      bcv: bcvRate,
      usdt: bcvRate * 1.02, // USDT suele ser un poco más alto
      average: bcvRate * 1.01 // Promedio ligeramente por encima
    };
    
    // Guardar todas las tasas en localStorage
    localStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(rates));
    return rates;
  } catch (error) {
    console.error('Error al obtener tasas desde API:', error);
    
    // Si falla, intentar usar valores guardados anteriormente
    const savedRates = localStorage.getItem(STORAGE_KEY_RATES);
    if (savedRates) {
      return JSON.parse(savedRates);
    }
    
    // Si no hay valores guardados, usar valores por defecto
    return {
      bcv: 40,
      usdt: 41,
      average: 40.5
    };
  }
};

const exchangeRateApi = {
  // Obtener todas las tasas de cambio
  getExchangeRates: async () => {
    try {
      // Verificar el modo actual
      const mode = localStorage.getItem(STORAGE_KEY_MODE) || 'auto';
      console.log('Modo de tasa de cambio:', mode);
      
      // Si el modo es manual, obtener las tasas manuales
      if (mode === 'manual') {
        const savedRates = localStorage.getItem(STORAGE_KEY_RATES);
        if (savedRates) {
          const rates = JSON.parse(savedRates);
          console.log('Usando tasas manuales:', rates);
          return rates;
        }
      }
      
      // Si estamos en modo automático o no hay tasas manuales, obtener de la API
      if (mode === 'auto' || !localStorage.getItem(STORAGE_KEY_RATES)) {
        console.log('Obteniendo tasas desde API...');
        const rates = await fetchRatesFromAPI();
        return rates;
      }
      
      // Si llegamos aquí, algo falló con el modo
      // Intentar usar tasas guardadas como respaldo
      const savedRates = localStorage.getItem(STORAGE_KEY_RATES);
      if (savedRates) {
        const rates = JSON.parse(savedRates);
        console.log('Usando tasas guardadas anteriormente:', rates);
        return rates;
      }
      
      // Si todo falla, usar valores por defecto
      console.log('Usando tasas por defecto');
      return {
        bcv: 40,
        usdt: 41,
        average: 40.5
      };
    } catch (error) {
      console.error('Error al obtener tasas de cambio:', error);
      
      // Si hay error general, devolver valores por defecto
      return {
        bcv: 40,
        usdt: 41,
        average: 40.5
      };
    }
  },
  
  // Guardar una tasa manual y cambiar al modo manual
  setManualRate: (rate) => {
    try {
      // Verificar si el valor es realmente diferente
      const currentRate = localStorage.getItem(STORAGE_KEY_RATE);
      if (currentRate && Math.abs(parseFloat(currentRate) - rate) < 0.01) {
        console.log('Ignorando cambio redundante de tasa, ya es similar');
        return {
          rate: rate,
          mode: 'manual',
          success: true
        };
      }
      
      console.log('Guardando tasa manual:', rate);
      localStorage.setItem(STORAGE_KEY_RATE, rate.toString());
      localStorage.setItem(STORAGE_KEY_MODE, 'manual');
      console.log('Modo cambiado a manual');
      
      // Notificar cambio a todos los componentes
      notifyRateChange(rate, 'manual');
      
      return { 
        rate: rate,
        mode: 'manual',
        success: true
      };
    } catch (error) {
      console.error('Error al guardar tasa manual:', error);
      throw error;
    }
  },
  
  // Cambiar al modo automático
  switchToAutoMode: async () => {
    try {
      console.log('Cambiando a modo automático...');
      localStorage.setItem(STORAGE_KEY_MODE, 'auto');
      
      // Obtener nuevas tasas automáticas
      const rates = await fetchRatesFromAPI();
      const rate = rates.average || rates.bcv;
      
      // Guardar también la tasa actual para rápido acceso
      localStorage.setItem(STORAGE_KEY_RATE, rate.toString());
      
      // Notificar cambio a todos los componentes
      notifyRateChange(rate, 'auto');
      
      return {
        rates,
        rate,
        mode: 'auto',
        success: true
      };
    } catch (error) {
      console.error('Error al cambiar a modo automático:', error);
      throw error;
    }
  },
  
  // Obtener el modo actual
  getCurrentMode: () => {
    return localStorage.getItem(STORAGE_KEY_MODE) || 'auto';
  },
  
  // Obtener tasa seleccionada actual (para compatibilidad)
  getCurrentRate: async () => {
    try {
      const mode = localStorage.getItem(STORAGE_KEY_MODE) || 'auto';
      const savedType = localStorage.getItem('factTech_selectedRateType') || 'average';
      
      if (mode === 'manual') {
        // Si estamos en modo manual, obtener la tasa guardada
        const rate = localStorage.getItem(STORAGE_KEY_RATE);
        if (rate) {
          return {
            rate: parseFloat(rate),
            mode: 'manual',
            source: 'localStorage'
          };
        }
      }
      
      // Si estamos en modo automático o no hay tasa manual guardada
      // Obtener todas las tasas
      const rates = await exchangeRateApi.getExchangeRates();
      
      // Devolver la tasa según el tipo seleccionado o la tasa promedio
      const rate = rates[savedType] || rates.average || DEFAULT_RATE;
      
      // Guardar para rápido acceso
      localStorage.setItem(STORAGE_KEY_RATE, rate.toString());
      
      return {
        rate,
        mode: mode,
        source: mode === 'auto' ? 'api' : 'manual'
      };
    } catch (error) {
      console.error('Error al obtener tasa actual:', error);
      return {
        rate: DEFAULT_RATE,
        mode: 'fallback',
        source: 'default'
      };
    }
  },
  
  // Escuchar cambios en la tasa (para componentes)
  subscribeToRateChanges: (callback) => {
    window.addEventListener(RATE_CHANGE_EVENT, (event) => {
      callback(event.detail.rate, event.detail.mode);
    });
  },
  
  // Dejar de escuchar (importante para evitar memory leaks)
  unsubscribeFromRateChanges: (callback) => {
    window.removeEventListener(RATE_CHANGE_EVENT, callback);
  }
};

export default exchangeRateApi;