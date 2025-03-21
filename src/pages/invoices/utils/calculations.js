/**
 * Utilidades para realizar cálculos relacionados con facturas
 */

// Tasa de IVA (16%)
export const IVA_RATE = 0.16;

/**
 * Calcula el subtotal de una factura basado en sus items
 * @param {Array} items - Array de items con quantity y price
 * @returns {number} - Subtotal calculado
 */
export const calculateSubtotal = (items = []) => {
  return items.reduce((sum, item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    return sum + (quantity * price);
  }, 0);
};

/**
 * Calcula el IVA basado en subtotal e items exentos
 * @param {Array} items - Array de items con quantity, price y taxExempt
 * @returns {number} - Monto de IVA calculado
 */
export const calculateTax = (items = []) => {
  return items.reduce((sum, item) => {
    // Si el item está exento de impuestos, no agregar al cálculo
    if (item.taxExempt) {
      return sum;
    }
    
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    return sum + (quantity * price * IVA_RATE);
  }, 0);
};

/**
 * Calcula todos los totales de una factura
 * @param {Array} items - Array de items con quantity, price y taxExempt
 * @returns {Object} - Objeto con subtotal, tax y total
 */
export const calculateTotals = (items = []) => {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(items);
  const total = subtotal + tax;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

/**
 * Calcula el porcentaje de un valor
 * @param {number} value - Valor base
 * @param {number} percentage - Porcentaje a calcular
 * @returns {number} - Resultado del cálculo
 */
export const calculatePercentage = (value, percentage) => {
  return (parseFloat(value) * parseFloat(percentage)) / 100;
};

/**
 * Función para redondear valores monetarios a 2 decimales
 * @param {number} value - Valor a redondear
 * @returns {number} - Valor redondeado
 */
export const roundCurrency = (value) => {
  return parseFloat((Math.round(value * 100) / 100).toFixed(2));
};