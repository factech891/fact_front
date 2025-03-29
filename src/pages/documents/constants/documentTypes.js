// Constants for document types
export const DOCUMENT_TYPES = {
    QUOTE: 'QUOTE',           // Presupuesto
    PROFORMA: 'PROFORMA',     // Factura proforma
    ORDER: 'ORDER',           // Orden de compra
    DELIVERY_NOTE: 'DELIVERY_NOTE', // Nota de entrega
    CREDIT_NOTE: 'CREDIT_NOTE', // Nota de crédito
    RECEIPT: 'RECEIPT',       // Recibo
    OTHER: 'OTHER'            // Otros documentos
  };
  
  // Display names for document types
  export const DOCUMENT_TYPE_NAMES = {
    [DOCUMENT_TYPES.QUOTE]: 'Presupuesto',
    [DOCUMENT_TYPES.PROFORMA]: 'Factura Proforma',
    [DOCUMENT_TYPES.ORDER]: 'Orden de Compra',
    [DOCUMENT_TYPES.DELIVERY_NOTE]: 'Nota de Entrega',
    [DOCUMENT_TYPES.CREDIT_NOTE]: 'Nota de Crédito',
    [DOCUMENT_TYPES.RECEIPT]: 'Recibo',
    [DOCUMENT_TYPES.OTHER]: 'Otro'
  };
  
  // Document status types
  export const DOCUMENT_STATUS = {
    DRAFT: 'DRAFT',           // Borrador
    SENT: 'SENT',             // Enviado
    APPROVED: 'APPROVED',     // Aprobado
    REJECTED: 'REJECTED',     // Rechazado
    EXPIRED: 'EXPIRED',       // Expirado
    CONVERTED: 'CONVERTED'    // Convertido a factura
  };
  
  // Display names for document status
  export const DOCUMENT_STATUS_NAMES = {
    [DOCUMENT_STATUS.DRAFT]: 'Borrador',
    [DOCUMENT_STATUS.SENT]: 'Enviado',
    [DOCUMENT_STATUS.APPROVED]: 'Aprobado',
    [DOCUMENT_STATUS.REJECTED]: 'Rechazado',
    [DOCUMENT_STATUS.EXPIRED]: 'Expirado',
    [DOCUMENT_STATUS.CONVERTED]: 'Convertido a Factura'
  };
  
  // Status colors for UI
  export const DOCUMENT_STATUS_COLORS = {
    [DOCUMENT_STATUS.DRAFT]: 'default',
    [DOCUMENT_STATUS.SENT]: 'primary',
    [DOCUMENT_STATUS.APPROVED]: 'success',
    [DOCUMENT_STATUS.REJECTED]: 'error',
    [DOCUMENT_STATUS.EXPIRED]: 'warning',
    [DOCUMENT_STATUS.CONVERTED]: 'info'
  };
  
  // Validity periods in days for different document types
  export const DOCUMENT_VALIDITY_DAYS = {
    [DOCUMENT_TYPES.QUOTE]: 30,
    [DOCUMENT_TYPES.PROFORMA]: 15,
    [DOCUMENT_TYPES.ORDER]: 60,
    [DOCUMENT_TYPES.DELIVERY_NOTE]: null, // No expiration
    [DOCUMENT_TYPES.CREDIT_NOTE]: null,   // No expiration
    [DOCUMENT_TYPES.RECEIPT]: null,       // No expiration
    [DOCUMENT_TYPES.OTHER]: 30            // Default 30 days
  };