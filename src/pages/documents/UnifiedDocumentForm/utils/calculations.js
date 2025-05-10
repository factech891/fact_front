/**
 * Calcula los totales del documento a partir de los items
 * @param {Array} items - Array de items del documento
 * @returns {Object} Subtotales desglosados, impuestos y total
 */
export const calculateTotals = (items) => {
  // Asegurar que items sea un array
  const safeItems = Array.isArray(items) ? items : [];

  // Inicializar montos por tipo fiscal
  let subtotalGravado = 0;
  let subtotalExento = 0;
  let subtotalNoGravado = 0; // Se mantiene inicializado, pero no se acumulará con la nueva lógica.

  // Calcular subtotales por tipo fiscal
  // --- INICIO CÓDIGO MODIFICADO DENTRO DE calculateTotals ---
  safeItems.forEach(item => {
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    const itemTotal = quantity * price;
    
    const taxType = item.taxType || (item.taxExempt ? 'exento' : 'gravado');
    
    if (taxType === 'exento') {
      subtotalExento += itemTotal;
    } else { // todo lo demás se trata como gravado
      subtotalGravado += itemTotal;
    }
  });
  // --- FIN CÓDIGO MODIFICADO DENTRO DE calculateTotals ---

  // Calcular IVA (solo para items gravados)
  const taxAmount = subtotalGravado * 0.16; // 16% IVA

  // Calcular subtotal general y total
  // subtotalNoGravado será 0 aquí con la lógica modificada.
  const subtotal = subtotalGravado + subtotalExento + subtotalNoGravado;
  const total = subtotal + taxAmount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    subtotalGravado: Number(subtotalGravado.toFixed(2)),
    subtotalExento: Number(subtotalExento.toFixed(2)),
    subtotalNoGravado: Number(subtotalNoGravado.toFixed(2)), // Siempre será 0 con la nueva lógica de forEach
    taxAmount: Number(taxAmount.toFixed(2)),
    total: Number(total.toFixed(2))
  };
};

/**
 * Calcula el subtotal de un item
 * @param {Object} item - Item con quantity y price
 * @returns {Number} Subtotal del item
 */
export const calculateItemSubtotal = (item) => {
  const quantity = parseFloat(item.quantity) || 0;
  const price = parseFloat(item.price) || 0;
  return Number((quantity * price).toFixed(2));
};

/**
 * Formatea un valor monetario según la moneda
 * @param {Number} amount - Cantidad a formatear
 * @param {String} currency - Código de moneda ('VES', 'USD', 'EUR')
 * @returns {String} Cantidad formateada
 */
export const formatCurrency = (amount, currency = 'VES') => {
  // Obtener símbolo de moneda
  let symbol = '';
  switch (currency) {
    case 'USD':
      symbol = '$';
      break;
    case 'EUR':
      symbol = '€';
      break;
    case 'VES':
    default:
      symbol = 'Bs.';
      break;
  }

  // Formatear con separador de miles y decimales según configuración local
  // Convertir a número antes de llamar a toLocaleString si amount podría no serlo
  const numericAmount = Number(amount) || 0;
  return `${symbol} ${numericAmount.toLocaleString('es-VE', { // es-VE como ejemplo, podría ser configurable
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};