/**
 * Constantes para estados de facturas
 */

// Valores para el estado de la factura
export const INVOICE_STATUS = {
    DRAFT: 'draft',       // Borrador
    PENDING: 'pending',   // Pendiente de pago
    PAID: 'paid',         // Pagada
    CANCELLED: 'cancelled', // Anulada
    OVERDUE: 'overdue',   // Vencida
    PARTIAL: 'partial'    // Pago parcial
  };
  
  // Nombres legibles para cada estado
  export const INVOICE_STATUS_LABELS = {
    [INVOICE_STATUS.DRAFT]: 'Borrador',
    [INVOICE_STATUS.PENDING]: 'Pendiente',
    [INVOICE_STATUS.PAID]: 'Pagada',
    [INVOICE_STATUS.CANCELLED]: 'Anulada',
    [INVOICE_STATUS.OVERDUE]: 'Vencida',
    [INVOICE_STATUS.PARTIAL]: 'Pago Parcial'
  };
  
  // Colores Material-UI para cada estado
  export const INVOICE_STATUS_COLORS = {
    [INVOICE_STATUS.DRAFT]: 'default',
    [INVOICE_STATUS.PENDING]: 'warning',
    [INVOICE_STATUS.PAID]: 'success',
    [INVOICE_STATUS.CANCELLED]: 'error',
    [INVOICE_STATUS.OVERDUE]: 'error',
    [INVOICE_STATUS.PARTIAL]: 'info'
  };
  
  // Lista de estados para menús y selects
  export const INVOICE_STATUS_LIST = [
    {
      value: INVOICE_STATUS.DRAFT,
      label: INVOICE_STATUS_LABELS[INVOICE_STATUS.DRAFT],
      color: INVOICE_STATUS_COLORS[INVOICE_STATUS.DRAFT]
    },
    {
      value: INVOICE_STATUS.PENDING,
      label: INVOICE_STATUS_LABELS[INVOICE_STATUS.PENDING],
      color: INVOICE_STATUS_COLORS[INVOICE_STATUS.PENDING]
    },
    {
      value: INVOICE_STATUS.PAID,
      label: INVOICE_STATUS_LABELS[INVOICE_STATUS.PAID],
      color: INVOICE_STATUS_COLORS[INVOICE_STATUS.PAID]
    },
    {
      value: INVOICE_STATUS.PARTIAL,
      label: INVOICE_STATUS_LABELS[INVOICE_STATUS.PARTIAL],
      color: INVOICE_STATUS_COLORS[INVOICE_STATUS.PARTIAL]
    },
    {
      value: INVOICE_STATUS.OVERDUE,
      label: INVOICE_STATUS_LABELS[INVOICE_STATUS.OVERDUE],
      color: INVOICE_STATUS_COLORS[INVOICE_STATUS.OVERDUE]
    },
    {
      value: INVOICE_STATUS.CANCELLED,
      label: INVOICE_STATUS_LABELS[INVOICE_STATUS.CANCELLED],
      color: INVOICE_STATUS_COLORS[INVOICE_STATUS.CANCELLED]
    }
  ];