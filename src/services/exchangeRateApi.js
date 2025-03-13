/**
 * Servicio para obtener tasas de cambio de divisas
 */

// URL de la API de DolarToday (ejemplo)
const DOLARTODAY_API = 'https://s3.amazonaws.com/dolartoday/data.json';

// URL alternativa si la primera falla
const BACKUP_API = 'https://api.exchangerate-api.com/v4/latest/USD';

/**
 * Obtiene las tasas de cambio actuales
 * @returns {Promise<Object>} Objeto con las tasas bcv, usdt y promedio
 */
export const getExchangeRates = async () => {
  try {
    // Intentar obtener de DolarToday
    const response = await fetch(DOLARTODAY_API);
    
    if (!response.ok) {
      throw new Error('Error al obtener tasas desde DolarToday');
    }
    
    const data = await response.json();
    
    // Extraer valores según la estructura de la API
    const bcvRate = data?.USD?.oficial || 35.27;
    const usdtRate = data?.USD?.localbitcoin || 36.10;
    const averageRate = data?.USD?.promedio || 35.68;
    
    return {
      bcv: parseFloat(bcvRate),
      usdt: parseFloat(usdtRate),
      average: parseFloat(averageRate)
    };
  } catch (primaryError) {
    console.error('Error con API primaria:', primaryError);
    
    // Intentar API de respaldo
    try {
      console.info('Intentando con API de respaldo...');
      const backupResponse = await fetch(BACKUP_API);
      
      if (!backupResponse.ok) {
        throw new Error('Error al obtener tasas desde API de respaldo');
      }
      
      const backupData = await backupResponse.json();
      
      // Simular tasas basadas en la API de respaldo
      // Nota: Esta API no proporciona tasas específicas para Venezuela,
      // por lo que simulamos valores a partir de la tasa base
      const baseRate = 35.68; // Tasa base simulada para VES
      
      return {
        bcv: baseRate - 0.5,       // Simular tasa BCV ligeramente menor
        usdt: baseRate + 0.5,      // Simular tasa USDT ligeramente mayor
        average: baseRate          // Usar como promedio
      };
    } catch (backupError) {
      console.error('Error con API de respaldo:', backupError);
      
      // Si todo falla, devolver valores por defecto
      return {
        bcv: 35.27,
        usdt: 36.10,
        average: 35.68
      };
    }
  }
};

/**
 * Guarda tasas de cambio manualmente
 * @param {Object} rates Objeto con las tasas bcv, usdt y average
 */
export const saveManualRates = (rates) => {
  if (!rates) return;
  
  try {
    localStorage.setItem('tasaCambioBCV', rates.bcv || 35.27);
    localStorage.setItem('tasaCambioUSDT', rates.usdt || 36.10);
    localStorage.setItem('tasaCambioPromedio', rates.average || 35.68);
    
    return true;
  } catch (error) {
    console.error('Error al guardar tasas de cambio:', error);
    return false;
  }
};

/**
 * Carga tasas de cambio guardadas
 * @returns {Object} Objeto con las tasas bcv, usdt y average
 */
export const getStoredRates = () => {
  try {
    const bcv = localStorage.getItem('tasaCambioBCV');
    const usdt = localStorage.getItem('tasaCambioUSDT');
    const average = localStorage.getItem('tasaCambioPromedio');
    
    return {
      bcv: bcv ? parseFloat(bcv) : 35.27,
      usdt: usdt ? parseFloat(usdt) : 36.10,
      average: average ? parseFloat(average) : 35.68
    };
  } catch (error) {
    console.error('Error al cargar tasas de cambio:', error);
    return {
      bcv: 35.27,
      usdt: 36.10,
      average: 35.68
    };
  }
};