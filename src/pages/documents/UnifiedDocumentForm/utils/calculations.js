// src/pages/documents/UnifiedDocumentForm/utils/calculations.js

/**
 * Calcula los totales del documento a partir de los items
 * @param {Array} items - Array de items del documento
 * @returns {Object} Subtotal, impuestos y total
 */
export const calculateTotals = (items) => {
    // Asegurar que items sea un array
    const safeItems = Array.isArray(items) ? items : [];
    
    // Calcular subtotal
    const subtotal = safeItems.reduce((sum, item) => {
      // Asegurar que quantity y price son números
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + (quantity * price);
    }, 0);
    
    // Calcular impuestos (16% IVA, excluyendo items exentos)
    const taxAmount = safeItems.reduce((sum, item) => {
      if (item.taxExempt) {
        return sum; // No agregar impuesto si está exento
      } else {
        // Asegurar que quantity y price son números
        const quantity = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        return sum + (quantity * price * 0.16); // 16% IVA
      }
    }, 0);
    
    // Calcular total
    const total = subtotal + taxAmount;
    
    return {
      subtotal: Number(subtotal.toFixed(2)),
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
    return `${symbol} ${amount.toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };