// src/pages/documents/UnifiedDocumentForm/index.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon
} from '@mui/icons-material';

// Importando las secciones del formulario
import DocumentTypeSection from './DocumentTypeSection'; // Incluye el estado
import ClientSection from './ClientSection';
import ItemsSection from './ItemsSection';
import NotesSection from './NotesSection';

// Importando utilidades
import { calculateTotals } from './utils/calculations';
import { validateForm } from './utils/validators';

// Importando constantes
import {
  DOCUMENT_TYPES,
  DOCUMENT_STATUS,
  DOCUMENT_TYPE_NAMES // <--- ¡ASEGÚRATE QUE ESTÉ ESTA LÍNEA!
} from '../constants/documentTypes';

/**
 * Formulario unificado para ambos módulos: facturas y cotizaciones
 * Versión con todas las secciones en una sola pantalla
 */
const UnifiedDocumentForm = ({
  open,
  onClose,
  initialData = null,
  onSave,
  clients = [],
  products = [],
  isInvoice = false // Determina si estamos en modo factura o cotización
}) => {
  const [saving, setSaving] = useState(false);

  // Función para calcular fecha de expiración
  const calculateExpiryDate = (docType) => {
    if (isInvoice || docType !== DOCUMENT_TYPES.QUOTE) return null;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 días para cotizaciones
    return expiryDate.toISOString().split('T')[0];
  };

  // Estado inicial del formulario (asegurando Status en MAYÚSCULAS para facturas)
  const getInitialFormState = () => ({
    type: isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE,
    documentType: isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE,
    documentNumber: '',
    date: new Date().toISOString().split('T')[0],
    expiryDate: calculateExpiryDate(isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE),
    // Asegurar estado inicial DRAFT en MAYÚSCULAS para facturas
    status: isInvoice ? 'DRAFT' : DOCUMENT_STATUS.DRAFT,
    client: null,
    currency: 'VES',
    moneda: 'VES',
    paymentTerms: 'Contado',
    condicionesPago: 'Contado',
    creditDays: 0,
    diasCredito: 0,
    items: [],
    subtotal: 0,
    tax: 0,
    taxAmount: 0,
    total: 0,
    notes: '',
    terms: ''
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && initialData) {
      console.log('Cargando documento para edición:', initialData);
      console.log('Notas cargadas:', initialData.notes);
      console.log('Términos cargados:', initialData.terms);
      console.log('Estado cargado:', initialData.status); // Verificar estado recibido

      const documentProducts = initialData.items?.map(item => {
        const fullProduct = products.find(p => p._id === (item.product?._id || item.product));
        return {
          _id: fullProduct?._id,
          codigo: fullProduct?.codigo,
          nombre: fullProduct?.nombre,
          precio: item.price || fullProduct?.precio
        };
      }) || [];
      setSelectedProducts(documentProducts);

      // Mapear datos iniciales, asegurando consistencia
      setFormData({
        type: initialData.type || (isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE),
        documentType: initialData.documentType || initialData.type || (isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE),
        documentNumber: initialData.number || initialData.documentNumber || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : calculateExpiryDate(initialData.type || (isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE)),
        // *** IMPORTANTE: Estandarizar estado recibido a MAYÚSCULAS si es factura ***
        status: isInvoice
          ? (initialData.status || 'DRAFT').toUpperCase() // Convertir a Mayúsculas
          : initialData.status || DOCUMENT_STATUS.DRAFT,

        client: initialData.client, // Asume que client ya es el objeto completo
        currency: initialData.moneda || initialData.currency || 'VES',
        moneda: initialData.moneda || initialData.currency || 'VES',
        paymentTerms: initialData.condicionesPago || initialData.paymentTerms || 'Contado',
        condicionesPago: initialData.condicionesPago || initialData.paymentTerms || 'Contado',
        creditDays: initialData.diasCredito || initialData.creditDays || 0,
        diasCredito: initialData.diasCredito || initialData.creditDays || 0,

        items: initialData.items?.map(item => ({
          product: item.product?._id || item.product,
          codigo: item.codigo || item.product?.codigo || '',
          descripcion: item.descripcion || item.product?.nombre || '',
          quantity: item.quantity,
          price: item.price,
          taxExempt: item.taxExempt || false,
          subtotal: (item.quantity || 0) * (item.price || 0) // Asegurar cálculo
        })) || [],
        subtotal: initialData.subtotal || 0,
        tax: initialData.tax || initialData.taxAmount || 0, // Usar ambos por compatibilidad
        taxAmount: initialData.tax || initialData.taxAmount || 0,
        total: initialData.total || 0,

        notes: initialData.notes || '',
        terms: initialData.terms || ''
      });
    } else if (open) {
      resetForm();
    }
  }, [open, initialData, products, isInvoice]); // No incluir formData aquí para evitar bucles

  const resetForm = () => {
    setFormData(getInitialFormState());
    setSelectedProducts([]);
    setErrors({});
  };

  const handleFieldChange = (field, value) => {
    console.log(`Cambiando ${field} a:`, value); // Log para depuración

    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Lógica de compatibilidad y casos especiales
      if (field === 'currency') updated.moneda = value;
      if (field === 'moneda') updated.currency = value;
      if (field === 'paymentTerms') updated.condicionesPago = value;
      if (field === 'condicionesPago') updated.paymentTerms = value;
      if (field === 'creditDays') updated.diasCredito = value;
      if (field === 'diasCredito') updated.creditDays = value;
      if (field === 'tax') updated.taxAmount = value; // Mantener sincronizados
      if (field === 'taxAmount') updated.tax = value; // Mantener sincronizados

      // Actualizar notas/términos directamente
      if (field === 'notes') console.log('Notas actualizadas en estado:', value);
      if (field === 'terms') console.log('Términos actualizados en estado:', value);

      // Si cambia a "Contado", resetear días de crédito
      if ((field === 'paymentTerms' || field === 'condicionesPago') && value !== 'Crédito') {
        updated.creditDays = 0;
        updated.diasCredito = 0;
      }

      // Si cambia el tipo de documento (en modo no-factura), recalcular fecha exp.
      if (field === 'documentType' && !isInvoice) {
         updated.expiryDate = calculateExpiryDate(value);
      }

      // Si cambia el estado, registrarlo
      if (field === 'status') {
          console.log('Estado actualizado en formData:', value);
      }

      return updated;
    });
  };

  const handleProductSelect = (event, values) => {
    const safeValues = values || [];
    const newItems = safeValues.map(product => ({
      product: product._id,
      codigo: product.codigo || '',
      descripcion: product.nombre || '',
      quantity: 1,
      price: product.precio || 0,
      taxExempt: product.isExempt || false, // Considerar si el producto tiene exención por defecto
      subtotal: product.precio || 0
    }));

    setSelectedProducts(safeValues);

    // Actualizar items y recalcular totales
    const totals = calculateTotals(newItems); // Asegúrate que calculateTotals maneje taxExempt
    setFormData(prev => ({
      ...prev,
      items: newItems,
      subtotal: totals.subtotal,
      tax: totals.taxAmount, // Sincronizar
      taxAmount: totals.taxAmount,
      total: totals.total
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    const item = { ...updatedItems[index] }; // Copia del item a modificar

    item[field] = value;

    // Recalcular subtotal del item si cambia cantidad o precio
    if (field === 'quantity' || field === 'price') {
        item.subtotal = (item.quantity || 0) * (item.price || 0);
    }

    updatedItems[index] = item;

    // Recalcular totales generales
    const totals = calculateTotals(updatedItems); // Asegúrate que calculateTotals maneje taxExempt
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal: totals.subtotal,
      tax: totals.taxAmount, // Sincronizar
      taxAmount: totals.taxAmount,
      total: totals.total
    }));
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(formData, isInvoice);
    setErrors(validationErrors); // Actualizar errores siempre

    if (Object.keys(validationErrors).length === 0) {
      setSaving(true);

      // Obtener el estado actual del formulario (estará en MAYÚSCULAS para facturas)
      const currentStatusFromForm = formData.status || (isInvoice ? 'DRAFT' : DOCUMENT_STATUS.DRAFT);
      
      // *** CORRECCIÓN CRÍTICA: Convertir a minúsculas ANTES de enviar si es factura ***
      const statusToSend = isInvoice ? currentStatusFromForm.toLowerCase() : currentStatusFromForm;

      const documentToSave = {
        _id: initialData?._id, // Incluir ID para actualizaciones

        // Tipos
        type: formData.type,
        documentType: formData.documentType,

        // Generales
        number: formData.documentNumber, // Permitir que backend genere si está vacío
        documentNumber: formData.documentNumber,
        date: formData.date,
        expiryDate: formData.expiryDate,
        
        // *** Usar el estado convertido a minúsculas para el backend ***
        status: statusToSend,

        // Cliente (asegurar enviar solo ID)
        client: formData.client?._id || formData.client, // Manejar ambos casos

        // Moneda y Pago
        currency: formData.currency,
        moneda: formData.moneda,
        paymentTerms: formData.paymentTerms,
        condicionesPago: formData.condicionesPago,
        creditDays: parseInt(formData.creditDays, 10) || 0, // Asegurar número
        diasCredito: parseInt(formData.diasCredito, 10) || 0,

        // Items (limpiar para enviar solo lo necesario)
        items: formData.items.map(item => ({
          product: item.product, // Enviar ID
          quantity: item.quantity,
          price: item.price,
          taxExempt: item.taxExempt || false, // Enviar siempre
          // No es necesario enviar subtotal de item, backend puede calcular
        })),

        // Totales (Enviar para posible referencia, backend debe recalcular)
        subtotal: formData.subtotal,
        tax: formData.tax,
        taxAmount: formData.taxAmount,
        total: formData.total,

        // Notas y Términos (Enviar siempre, backend decide qué hacer)
        notes: formData.notes || '',
        terms: formData.terms || '',

        // Indicador para prefijo (solo si es factura)
        usePrefix: isInvoice ? 'INV' : undefined
      };

      console.log('Guardando documento:', documentToSave);
      // Verificar el estado que se envía:
      console.log('Guardando estado (formato para backend):', documentToSave.status); 
      console.log('Guardando notas:', documentToSave.notes);
      console.log('Guardando términos:', documentToSave.terms);

      if (onSave) {
        onSave(documentToSave)
          .then(() => {
            console.log('Documento guardado exitosamente.');
            onClose(); // Cerrar modal al guardar
          })
          .catch(error => {
            console.error('Error al guardar documento desde UnifiedForm:', error);
            // Mostrar mensaje de error específico del backend si es posible
            const backendErrorMessage = error?.response?.data?.message || error.message || 'Intente de nuevo';
            setErrors({ submit: 'Error al guardar: ' + backendErrorMessage });
          })
          .finally(() => {
            setSaving(false);
          });
      } else {
        console.warn('No se proporcionó función onSave a UnifiedDocumentForm.');
        setSaving(false);
        // onClose(); // Considera si quieres cerrar aunque no haya onSave
      }
    } else {
      console.log('Errores de validación:', validationErrors);
      // Opcional: Scroll al primer error o mostrar un resumen
    }
  };

  const getDocumentTitle = () => {
    const action = initialData ? 'Editar' : 'Nuevo';
    if (isInvoice) {
      return `${action} Factura`;
    }
    // Para otros documentos, usar el nombre según el tipo
    return `${action} ${DOCUMENT_TYPE_NAMES[formData.type] || 'Documento'}`;
  };

  // Renderizar barra de totales (sin cambios necesarios aquí)
  const renderTotalsBar = () => {
      if (formData.items.length === 0) return null;
      return (
          <Box sx={{ width: '100%', mb: 2, bgcolor: '#2a2a2a', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Grid container alignItems="center" sx={{ p: 2 }}>
                  <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'center' }, mb: { xs: 1, sm: 0 } }}>
                      <Typography variant="subtitle2" color="text.secondary">Subtotal:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bs. {formData.subtotal.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'center' }, mb: { xs: 1, sm: 0 } }}>
                      <Typography variant="subtitle2" color="text.secondary">IVA (16%):</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bs. {formData.tax.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
                      <Typography variant="subtitle2" color="text.secondary">Total:</Typography>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>Bs. {formData.total.toFixed(2)}</Typography>
                  </Grid>
              </Grid>
          </Box>
      );
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      // Evitar cierre al hacer clic fuera si se está guardando
      disableEscapeKeyDown={saving}
      // PaperProps para estilo del diálogo si es necesario
      PaperProps={{ sx: { bgcolor: '#1e1e1e', backgroundImage: 'none' } }} // Ajusta el color de fondo base
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {getDocumentTitle()}
        <IconButton onClick={onClose} sx={{ color: 'white' }} disabled={saving}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Barra de totales */}
      {renderTotalsBar()}

      <DialogContent sx={{ p: 2, bgcolor: '#1e1e1e', color: 'white' }}>
        {/* Mostrar error general si existe */}
         {errors.submit && (
            <Typography color="error" sx={{ mb: 2 }}>{errors.submit}</Typography>
         )}
        <Grid container spacing={2}>
          {/* Información del Documento (incluye Tipo, Fecha, Estado) */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <DocumentTypeSection
                formData={formData}
                errors={errors}
                onFieldChange={handleFieldChange}
                isInvoice={isInvoice}
              />
            </Paper>
          </Grid>

          {/* Datos del Cliente */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <ClientSection
                formData={formData}
                clients={clients}
                errors={errors}
                onFieldChange={handleFieldChange}
              />
            </Paper>
          </Grid>

          {/* Productos/Servicios */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <ItemsSection
                formData={formData}
                selectedProducts={selectedProducts}
                products={products}
                errors={errors}
                onProductSelect={handleProductSelect}
                onItemChange={handleItemChange}
              />
            </Paper>
          </Grid>

          {/* Notas y Términos */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <NotesSection
                notes={formData.notes}
                terms={formData.terms}
                // Pasar directamente la llamada a handleFieldChange
                onNotesChange={(value) => handleFieldChange('notes', value)}
                onTermsChange={(value) => handleFieldChange('terms', value)}
              />
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#2a2a2a', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          variant="outlined"
          color="error"
          onClick={resetForm}
          startIcon={<ResetIcon />}
          disabled={saving} // Deshabilitar si está guardando
          sx={{ borderColor: 'rgba(255, 77, 77, 0.5)', '&:hover': { borderColor: 'error.main', bgcolor: 'rgba(255, 77, 77, 0.1)' } }}
        >
          Limpiar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={saving} // Deshabilitar si está guardando
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnifiedDocumentForm;