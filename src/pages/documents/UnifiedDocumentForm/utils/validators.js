// src/pages/documents/UnifiedDocumentForm/utils/validators.js

/**
 * Valida el formulario completo del documento
 * @param {Object} formData - Datos del formulario a validar
 * @param {Boolean} isInvoice - Si es factura o documento
 * @returns {Object} Errores encontrados
 */
export const validateForm = (formData, isInvoice = false) => {
    const errors = {};
    
    // Validar tipo de documento
    if (!formData.documentType) {
      errors.documentType = 'Seleccione un tipo de documento';
    }
    
    // Validar fecha
    if (!formData.date) {
      errors.date = 'Ingrese una fecha válida';
    }
    
    // Validar cliente
    if (!formData.client || !formData.client._id) {
      errors.client = 'Seleccione un cliente';
    }
    
    // Validar ítems
    if (!formData.items || formData.items.length === 0) {
      errors.items = 'Agregue al menos un producto o servicio';
    } else {
      // Validar que cada ítem tenga cantidad y precio válidos
      const invalidItems = formData.items.filter(
        item => !item.quantity || item.quantity <= 0 || !item.price || item.price < 0
      );
      
      if (invalidItems.length > 0) {
        errors.items = 'Todos los productos deben tener cantidad y precio válidos';
      }
    }
    
    // Validar condiciones de pago a crédito
    if (formData.paymentTerms === 'Crédito') {
      if (!formData.creditDays || formData.creditDays <= 0) {
        errors.creditDays = 'Ingrese días de crédito válidos';
      }
    }
    
    // Validar fecha de expiración para cotizaciones
    if (!isInvoice && formData.documentType === 'QUOTE' && !formData.expiryDate) {
      errors.expiryDate = 'Ingrese una fecha de vencimiento para la cotización';
    }
    
    return errors;
  };
  
  /**
   * Valida un item individual
   * @param {Object} item - Item a validar
   * @returns {Object} Errores encontrados
   */
  export const validateItem = (item) => {
    const errors = {};
    
    if (!item.product) {
      errors.product = 'Seleccione un producto';
    }
    
    if (!item.quantity || item.quantity <= 0) {
      errors.quantity = 'Ingrese una cantidad válida';
    }
    
    if (item.price === undefined || item.price === null || item.price < 0) {
      errors.price = 'Ingrese un precio válido';
    }
    
    return errors;
  };