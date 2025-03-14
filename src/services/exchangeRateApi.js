// src/services/exchangeRateApi.js
const STORAGE_KEY_RATE = 'factTech_exchangeRate';
const STORAGE_KEY_MODE = 'factTech_exchangeRateMode'; // 'auto' o 'manual'

// Valor por defecto si no hay nada guardado
const DEFAULT_RATE = 66;

// Función para obtener tasa desde API externa
const fetchRateFromAPI = async () => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    // Extraer tasa para Venezuela (VES)
    const rate = data.rates.VES || DEFAULT_RATE;
    
    // Guardar en localStorage para tenerlo como respaldo
    localStorage.setItem(STORAGE_KEY_RATE, rate.toString());
    
    return rate;
  } catch (error) {
    console.error('Error al obtener tasa desde API:', error);
    
    // Si falla, intentar usar valor guardado anteriormente
    const savedRate = localStorage.getItem(STORAGE_KEY_RATE);
    if (savedRate) {
      return parseFloat(savedRate);
    }
    
    // Si no hay valor guardado, usar valor por defecto
    return DEFAULT_RATE;
  }
};

const exchangeRateApi = {
  // Obtener la tasa de cambio actual
  getCurrentRate: async () => {
    try {
      // Verificar el modo actual
      const mode = localStorage.getItem(STORAGE_KEY_MODE) || 'auto';
      console.log('Modo de tasa de cambio:', mode);
      
      // Si el modo es manual, obtener la tasa manual
      if (mode === 'manual') {
        const manualRate = localStorage.getItem(STORAGE_KEY_RATE);
        if (manualRate) {
          const rate = parseFloat(manualRate);
          console.log('Usando tasa manual:', rate);
          return { 
            rate: rate,
            mode: 'manual',
            source: 'localStorage'
          };
        }
      }
      
      // Si estamos en modo automático, obtener de la API
      if (mode === 'auto') {
        console.log('Obteniendo tasa desde API...');
        const rate = await fetchRateFromAPI();
        console.log('Tasa obtenida de API:', rate);
        return {
          rate: rate,
          mode: 'auto',
          source: 'api'
        };
      }
      
      // Si llegamos aquí, algo raro pasó con el modo
      // Intentar usar valor guardado en localStorage como respaldo
      const savedRate = localStorage.getItem(STORAGE_KEY_RATE);
      if (savedRate) {
        console.log('Usando tasa guardada anteriormente:', savedRate);
        return { 
          rate: parseFloat(savedRate),
          mode: mode,
          source: 'localStorage'
        };
      }
      
      // Si todo falla, usar valor por defecto
      console.log('Usando tasa por defecto:', DEFAULT_RATE);
      return { 
        rate: DEFAULT_RATE,
        mode: mode,
        source: 'default'
      };
    } catch (error) {
      console.error('Error al obtener tasa de cambio:', error);
      
      // Si hay error general, devolver valor por defecto
      return { 
        rate: DEFAULT_RATE,
        mode: 'fallback',
        source: 'default'
      };
    }
  },
  
  // Guardar una tasa manual y cambiar al modo manual
  setManualRate: (rate) => {
    try {
      console.log('Guardando tasa manual:', rate);
      localStorage.setItem(STORAGE_KEY_RATE, rate.toString());
      localStorage.setItem(STORAGE_KEY_MODE, 'manual');
      console.log('Modo cambiado a manual');
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
      
      // Obtener tasa actualizada de la API
      const rate = await fetchRateFromAPI();
      
      return {
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
  }
};

export default exchangeRateApi;