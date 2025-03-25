/**
 * Constantes para tasas de impuestos y configuraciones relacionadas
 */

// Tasa de IVA (16%)
export const IVA_RATE = 0.16;
export const IVA_PERCENTAGE = 16;

// Tipos de condiciones de pago
export const PAYMENT_CONDITIONS = {
  CASH: 'Contado',
  CREDIT: 'Crédito'
};

// Tipos de moneda aceptados
export const CURRENCY_TYPES = {
  VES: 'VES',   // Bolívares (ahora primero)
  USD: 'USD'    // Dólares (ahora segundo)
};

// Lista de monedas para menús y selects
export const CURRENCY_LIST = [
  {
    value: CURRENCY_TYPES.VES,
    label: 'Bolívares (VES)'
  },
  {
    value: CURRENCY_TYPES.USD,
    label: 'Dólares (USD)'
  }
];

// Días por defecto para crédito
export const DEFAULT_CREDIT_DAYS = 30;