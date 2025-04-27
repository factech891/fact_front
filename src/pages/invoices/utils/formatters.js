import React from 'react';
/**
 * Utilidades para formatear valores en facturas
 */

/**
 * Formatea un valor monetario
 * @param {number} value - Valor numérico a formatear
 * @param {string} locale - Configuración regional (por defecto es-VE)
 * @returns {string} - Valor formateado
 */
export const formatCurrency = (value, locale = 'es-VE') => {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value) || 0);
  };
  
  /**
   * Formatea un valor monetario con símbolo de moneda
   * @param {number} value - Valor numérico a formatear
   * @param {string} currency - Código de moneda (USD, VES, etc.)
   * @param {string} locale - Configuración regional
   * @returns {string} - Valor formateado con símbolo de moneda
   */
  export const formatMoney = (value, currency = 'USD', locale = 'es-VE') => {
    return `${currency} ${formatCurrency(value, locale)}`;
  };
  
  /**
   * Formatea una fecha en formato largo
   * @param {Date|string} date - Fecha a formatear
   * @param {string} locale - Configuración regional
   * @returns {string} - Fecha formateada
   */
  export const formatLongDate = (date, locale = 'es-ES') => {
    if (!date) return '';
    
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  /**
   * Formatea una fecha en formato corto
   * @param {Date|string} date - Fecha a formatear
   * @param {string} locale - Configuración regional
   * @returns {string} - Fecha formateada
   */
  export const formatShortDate = (date, locale = 'es-ES') => {
    if (!date) return '';
    
    return new Date(date).toLocaleDateString(locale);
  };
  
  /**
   * Obtiene el texto del estado de una factura
   * @param {string} status - Código del estado
   * @returns {string} - Texto del estado
   */
  export const getStatusText = (status) => {
    switch (status) {
      case 'draft':
        return 'Borrador';
      case 'pending':
        return 'Pendiente';
      case 'paid':
        return 'Pagada';
      case 'cancelled':
        return 'Anulada';
      case 'overdue':
        return 'Vencida';
      case 'partial':
        return 'Pago Parcial';
      default:
        return 'Borrador';
    }
  };
  
  /**
   * Obtiene el color Material-UI del estado de una factura
   * @param {string} status - Código del estado
   * @returns {string} - Color Material-UI
   */
  export const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'overdue':
        return 'error';
      case 'partial':
        return 'info';
      default:
        return 'default';
    }
  };