import React from 'react';
/**
 * Utilidades para validar datos de facturas
 */

/**
 * Valida si un valor está presente (no es null, undefined o string vacío)
 * @param {any} value - Valor a validar
 * @returns {boolean} - true si el valor está presente
 */
export const isPresent = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
  };
  
  /**
   * Valida si un valor es numérico y positivo
   * @param {any} value - Valor a validar
   * @returns {boolean} - true si el valor es numérico y positivo
   */
  export const isPositiveNumber = (value) => {
    const number = parseFloat(value);
    return !isNaN(number) && number > 0;
  };
  
  /**
   * Valida si un valor es un número válido (puede ser cero)
   * @param {any} value - Valor a validar
   * @returns {boolean} - true si el valor es numérico
   */
  export const isValidNumber = (value) => {
    const number = parseFloat(value);
    return !isNaN(number) && number >= 0;
  };
  
  /**
   * Valida un cliente en la factura
   * @param {Object} client - Objeto cliente
   * @returns {string|null} - Mensaje de error o null si es válido
   */
  export const validateClient = (client) => {
    if (!client) return 'Seleccione un cliente';
    if (typeof client === 'object' && !client._id) return 'Cliente no válido';
    return null;
  };
  
  /**
   * Valida los items de una factura
   * @param {Array} items - Array de items
   * @returns {string|null} - Mensaje de error o null si es válido
   */
  export const validateItems = (items) => {
    if (!items || !items.length) return 'Agregue al menos un servicio';
    
    // Verificar que todos los items tengan cantidad y precio válidos
    const invalidItems = items.some(item => 
      !isPositiveNumber(item.quantity) || !isValidNumber(item.price)
    );
    
    if (invalidItems) return 'Todos los servicios deben tener cantidad y precio válidos';
    return null;
  };
  
  /**
   * Valida las condiciones de pago
   * @param {string} condicionesPago - Condición de pago
   * @param {number} diasCredito - Días de crédito
   * @returns {Object} - Objeto con errores por campo
   */
  export const validatePaymentConditions = (condicionesPago, diasCredito) => {
    const errors = {};
    
    if (condicionesPago === 'Crédito' && !isPositiveNumber(diasCredito)) {
      errors.diasCredito = 'Ingrese días de crédito válidos (mayor a 0)';
    }
    
    return errors;
  };
  
  /**
   * Valida el formulario completo de factura
   * @param {Object} formData - Datos del formulario
   * @returns {Object} - Objeto con errores por campo
   */
  export const validateInvoiceForm = (formData) => {
    const errors = {};
    
    // Validar cliente
    const clientError = validateClient(formData.client);
    if (clientError) errors.client = clientError;
    
    // Validar items
    const itemsError = validateItems(formData.items);
    if (itemsError) errors.items = itemsError;
    
    // Validar condiciones de pago
    const paymentErrors = validatePaymentConditions(
      formData.condicionesPago, 
      formData.diasCredito
    );
    
    return { ...errors, ...paymentErrors };
  };