// src/pages/documents/constants/documentTypes.js
// Tipos de documentos
export const DOCUMENT_TYPES = {
  QUOTE: 'QUOTE',               // Presupuesto
  PROFORMA: 'PROFORMA',         // Factura Proforma
  DELIVERY_NOTE: 'DELIVERY_NOTE' // Nota de Entrega
};

// Nombres para mostrar
export const DOCUMENT_TYPE_NAMES = {
  [DOCUMENT_TYPES.QUOTE]: 'Presupuesto',
  [DOCUMENT_TYPES.PROFORMA]: 'Factura Proforma',
  [DOCUMENT_TYPES.DELIVERY_NOTE]: 'Nota de Entrega'
};

// Estados de documentos
export const DOCUMENT_STATUS = {
  DRAFT: 'DRAFT',           // Borrador
  SENT: 'SENT',             // Enviado
  APPROVED: 'APPROVED',     // Aprobado
  REJECTED: 'REJECTED',     // Rechazado
  EXPIRED: 'EXPIRED',       // Expirado
  CONVERTED: 'CONVERTED'    // Convertido a factura
};

// Nombres para mostrar (estados)
export const DOCUMENT_STATUS_NAMES = {
  [DOCUMENT_STATUS.DRAFT]: 'Borrador',
  [DOCUMENT_STATUS.SENT]: 'Enviado',
  [DOCUMENT_STATUS.APPROVED]: 'Aprobado',
  [DOCUMENT_STATUS.REJECTED]: 'Rechazado',
  [DOCUMENT_STATUS.EXPIRED]: 'Expirado',
  [DOCUMENT_STATUS.CONVERTED]: 'Convertido a Factura'
};

// Colores para estados
export const DOCUMENT_STATUS_COLORS = {
  [DOCUMENT_STATUS.DRAFT]: 'default',
  [DOCUMENT_STATUS.SENT]: 'primary',
  [DOCUMENT_STATUS.APPROVED]: 'success',
  [DOCUMENT_STATUS.REJECTED]: 'error',
  [DOCUMENT_STATUS.EXPIRED]: 'warning',
  [DOCUMENT_STATUS.CONVERTED]: 'info'
};

// Días de validez para documentos
export const DOCUMENT_VALIDITY_DAYS = {
  [DOCUMENT_TYPES.QUOTE]: 30,           // 30 días para presupuestos
  [DOCUMENT_TYPES.PROFORMA]: 15,        // 15 días para proformas
  [DOCUMENT_TYPES.DELIVERY_NOTE]: null  // Sin fecha de expiración para notas de entrega
};