/**
 * Constantes para tipos de documentos de facturación
 */

// Valores para el tipo de documento
export const DOCUMENT_TYPES = {
    INVOICE: 'invoice',    // Factura
    QUOTE: 'quote',        // Presupuesto
    PROFORMA: 'proforma',  // Factura Proforma
    DRAFT: 'draft'         // Borrador
  };
  
  // Nombres legibles para cada tipo de documento
  export const DOCUMENT_TYPE_LABELS = {
    [DOCUMENT_TYPES.INVOICE]: 'Factura',
    [DOCUMENT_TYPES.QUOTE]: 'Presupuesto',
    [DOCUMENT_TYPES.PROFORMA]: 'Factura Proforma',
    [DOCUMENT_TYPES.DRAFT]: 'Borrador'
  };
  
  // Lista de tipos de documento para menús y selects
  export const DOCUMENT_TYPE_LIST = [
    {
      value: DOCUMENT_TYPES.INVOICE,
      label: DOCUMENT_TYPE_LABELS[DOCUMENT_TYPES.INVOICE]
    },
    {
      value: DOCUMENT_TYPES.QUOTE,
      label: DOCUMENT_TYPE_LABELS[DOCUMENT_TYPES.QUOTE]
    },
    {
      value: DOCUMENT_TYPES.PROFORMA,
      label: DOCUMENT_TYPE_LABELS[DOCUMENT_TYPES.PROFORMA]
    },
    {
      value: DOCUMENT_TYPES.DRAFT,
      label: DOCUMENT_TYPE_LABELS[DOCUMENT_TYPES.DRAFT]
    }
  ];
  
  // Función para obtener el título del documento según el tipo y si es edición
  export const getDocumentTitle = (type, isEdit = false) => {
    const action = isEdit ? 'Editar' : 'Nuevo';
    const documentType = DOCUMENT_TYPE_LABELS[type] || 'Documento';
    
    return `${action} ${documentType}`;
  };