// src/pages/documents/UnifiedDocumentForm/index.js
import React, { useState, useEffect, useCallback } from 'react';
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
  CircularProgress,
  Paper,
  Alert,
  Divider // Añadido para la nueva renderTotalsBar
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon,
  WarningAmberRounded as WarningIcon
} from '@mui/icons-material';

import DocumentTypeSection from './DocumentTypeSection';
import ClientSection from './ClientSection';
import ItemsSection from './ItemsSection';
import NotesSection from './NotesSection';

import { calculateTotals } from './utils/calculations';
import { validateForm } from './utils/validators';
import {
  DOCUMENT_TYPES,
  DOCUMENT_STATUS,
  DOCUMENT_TYPE_NAMES
} from '../constants/documentTypes';

// Importar las utilidades de zonas horarias y el contexto de autenticación
import { formatForDateInput, localTimeToUtc } from '../../../utils/dateUtils';
import { useAuth } from '../../../context/AuthContext';

// Función auxiliar para formatear fechas (modificada para usar zona horaria)
const formatLocalDate = (dateInput, timezone) => {
  if (!dateInput) {
    return formatForDateInput(new Date(), timezone);
  }
  
  if (typeof dateInput === 'string') {
    // Intentar parsear la fecha. Si es solo YYYY-MM-DD, agregar hora para evitar problemas de zona horaria en el parseo.
    const dateStr = dateInput.includes('T') ? dateInput : `${dateInput}T00:00:00`;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn('Fecha inválida en formatLocalDate (string):', dateInput);
      return formatForDateInput(new Date(), timezone); // Fallback a fecha actual
    }
    return formatForDateInput(date, timezone);
  }
  
  // Si ya es un objeto Date
  if (dateInput instanceof Date) {
      if (isNaN(dateInput.getTime())) {
          console.warn('Fecha inválida en formatLocalDate (Date object):', dateInput);
          return formatForDateInput(new Date(), timezone); // Fallback
      }
      return formatForDateInput(dateInput, timezone);
  }

  console.error('Tipo de fecha no manejado en formatLocalDate:', dateInput);
  return formatForDateInput(new Date(), timezone); // Fallback a fecha actual
};

const UnifiedDocumentForm = ({
  open,
  onClose,
  initialData = null,
  onSave,
  clients = [],
  products = [],
  isInvoice = false
}) => {
  const { currentUser } = useAuth();
  const userTimezone = currentUser?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const actionButtonStyle = {
    borderRadius: '50px',
    color: 'white',
    fontWeight: 600,
    padding: '8px 22px',
    textTransform: 'none',
    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
    transition: 'all 0.2s ease-in-out',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)',
      backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
      backgroundColor: 'transparent',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 10px rgba(79, 172, 254, 0.4)',
    },
    '&.Mui-disabled': {
      backgroundImage: 'linear-gradient(to right, #919191 0%, #b7b7b7 100%)',
      color: 'rgba(255, 255, 255, 0.6)',
    }
  };

  const [saving, setSaving] = useState(false);
  const [productWarnings, setProductWarnings] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitStockErrors, setSubmitStockErrors] = useState([]);

  const calculateExpiryDate = useCallback((docType) => {
    if (isInvoice || docType !== DOCUMENT_TYPES.QUOTE) return null;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    return formatLocalDate(expiryDate, userTimezone);
  }, [isInvoice, userTimezone]);

  const getInitialFormState = useCallback(() => ({
    type: isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE,
    documentType: isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE,
    documentNumber: '',
    date: formatLocalDate(new Date(), userTimezone),
    expiryDate: calculateExpiryDate(isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE),
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
    subtotalGravado: 0,
    subtotalExento: 0,
    subtotalNoGravado: 0,
    tax: 0,
    taxAmount: 0,
    total: 0,
    notes: '',
    terms: ''
  }), [isInvoice, userTimezone, calculateExpiryDate]);

  const [formData, setFormData] = useState(getInitialFormState());
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  const resetForm = useCallback(() => {
    setFormData(getInitialFormState());
    setSelectedProducts([]);
    setErrors({});
    setProductWarnings([]);
    setSubmitStockErrors([]);
  }, [getInitialFormState]);


  useEffect(() => {
    setProductWarnings([]);
    setSubmitStockErrors([]);

    if (open) {
      if (initialData) {
        const warnings = [];
        const documentProductsForAutocomplete = (initialData.items || [])
          .map(item => {
            const productId = item.product?._id || item.product;
            const fullProduct = products.find(p => p._id === productId);
            if (fullProduct) {
              return fullProduct;
            } else {
              warnings.push(`El producto "${item.descripcion || productId}" no se encontró en la lista actual y podría no mostrarse correctamente.`);
              return null; // O un objeto placeholder si es necesario para Autocomplete
            }
          })
          .filter(p => p !== null);

        if (warnings.length > 0) {
            setProductWarnings(warnings);
        }

        setSelectedProducts(documentProductsForAutocomplete);

        const loadedItems = (initialData.items || []).map(item => {
             const productId = item.product?._id || item.product;
             const fullProduct = products.find(p => p._id === productId);
             
             let taxType = item.taxType;
             let taxExempt = item.taxExempt || false;

             if (!taxType) { // Si taxType no está definido
               taxType = taxExempt ? 'exento' : 'gravado';
             } else { // Si taxType está definido, asegurar que taxExempt sea consistente
               taxExempt = taxType === 'exento';
             }
             
             return {
                product: productId,
                codigo: fullProduct?.codigo || item.codigo || 'N/A',
                descripcion: fullProduct?.nombre || item.descripcion || 'Producto Desconocido',
                quantity: item.quantity || 1,
                price: item.price ?? fullProduct?.precio ?? 0,
                taxExempt: taxExempt,
                taxType: taxType,
                // El subtotal del ítem se recalcula con calculateTotals, no es necesario aquí
             };
        });
        
        const totals = calculateTotals(loadedItems, initialData.taxRate); // Asumir que calculateTotals puede usar taxRate

        let dateValue = initialData.date;
        if (dateValue) { // Asegurar que la fecha se formatee correctamente para el input
          dateValue = formatLocalDate(dateValue, userTimezone);
        }
        
        let expiryDateValue = initialData.expiryDate;
        if (expiryDateValue) {
          expiryDateValue = formatLocalDate(expiryDateValue, userTimezone);
        }

        const loadedData = {
          ...getInitialFormState(), // Base para campos no presentes en initialData
          ...initialData, // Sobrescribir con datos iniciales
          type: initialData.type || (isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE),
          documentType: initialData.documentType || initialData.type || (isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE),
          documentNumber: initialData.documentNumber || initialData.number || '',
          date: dateValue || formatLocalDate(new Date(), userTimezone),
          expiryDate: expiryDateValue || calculateExpiryDate(initialData.type || (isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE)),
          status: (isInvoice ? (initialData.status || 'DRAFT') : initialData.status || DOCUMENT_STATUS.DRAFT).toUpperCase(),
          client: clients.find(c => c._id === (initialData.client?._id || initialData.client)) || initialData.client || null,
          currency: initialData.currency || initialData.moneda || 'VES',
          moneda: initialData.moneda || initialData.currency || 'VES',
          paymentTerms: initialData.paymentTerms || initialData.condicionesPago || 'Contado',
          condicionesPago: initialData.condicionesPago || initialData.paymentTerms || 'Contado',
          creditDays: initialData.creditDays || initialData.diasCredito || 0,
          diasCredito: initialData.diasCredito || initialData.creditDays || 0,
          items: loadedItems, // Usar los items procesados
          // Los totales se establecen desde 'totals'
          subtotal: totals.subtotal,
          subtotalGravado: totals.subtotalGravado,
          subtotalExento: totals.subtotalExento,
          subtotalNoGravado: totals.subtotalNoGravado,
          tax: totals.taxAmount, // o initialData.tax si se prefiere el valor guardado y no el calculado
          taxAmount: totals.taxAmount,
          total: totals.total,
          notes: initialData.notes || '',
          terms: initialData.terms || ''
        };
        setFormData(loadedData);
      } else {
        resetForm();
      }
    }
  }, [open, initialData, products, clients, isInvoice, userTimezone, calculateExpiryDate, getInitialFormState, resetForm]);


  const handleFieldChange = (field, value) => {
    if (errors.submit) {
        setErrors(prev => ({...prev, submit: undefined}));
    }
    if (field === 'client' || field === 'currency' || field === 'moneda'){
         setSubmitStockErrors([]);
    }

    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'currency') updated.moneda = value;
      if (field === 'moneda') updated.currency = value;
      if (field === 'paymentTerms') updated.condicionesPago = value;
      if (field === 'condicionesPago') updated.paymentTerms = value;
      if (field === 'creditDays') updated.diasCredito = value;
      if (field === 'diasCredito') updated.creditDays = value;
      
      if ((field === 'paymentTerms' || field === 'condicionesPago') && value !== 'Crédito') {
        updated.creditDays = 0;
        updated.diasCredito = 0;
      }
      if (field === 'documentType' && !isInvoice) {
        updated.expiryDate = calculateExpiryDate(value);
      }
      return updated;
    });
  };

  const handleProductSelect = (event, values) => {
    const safeValues = Array.isArray(values) ? values : []; 

    const newItems = safeValues.map(product => {
      const existingItem = formData.items.find(item => item.product === product._id);
      
      let taxType = product.taxType;
      let taxExempt = product.isExempt || false;

      if (taxType) {
        taxExempt = taxType === 'exento';
      } else {
        taxType = taxExempt ? 'exento' : 'gravado';
      }

      return {
        product: product._id, 
        codigo: product.codigo || '',
        descripcion: product.nombre || '',
        quantity: existingItem?.quantity || 1, 
        price: product.precio ?? 0, 
        taxExempt: taxExempt,
        taxType: taxType,
      };
    });

    setSelectedProducts(safeValues); 
    
    const totals = calculateTotals(newItems, formData.taxRate); 
    setFormData(prev => ({
      ...prev,
      items: newItems,
      subtotal: totals.subtotal,
      subtotalGravado: totals.subtotalGravado,
      subtotalExento: totals.subtotalExento,
      subtotalNoGravado: totals.subtotalNoGravado,
      tax: totals.taxAmount, 
      taxAmount: totals.taxAmount,
      total: totals.total
    }));
    setSubmitStockErrors([]); 
  };

  const handleItemChange = (index, field, value) => {
    console.log(`UnifiedDocumentForm - handleItemChange: index=${index}, field=${field}, value=`, value);
  
    const currentItems = formData.items || [];
    const updatedItems = JSON.parse(JSON.stringify(currentItems));
  
    if (index < 0 || index >= updatedItems.length) {
      console.error("Índice de item inválido en handleItemChange:", index);
      return;
    }
  
    updatedItems[index][field] = value;

    if (field === 'taxType') {
        updatedItems[index].taxExempt = value === 'exento';
    }
    if (field === 'taxExempt') {
        if (updatedItems[index].taxType !== 'no_gravado') { 
            updatedItems[index].taxType = value ? 'exento' : 'gravado';
        }
    }
  
    const totals = calculateTotals(updatedItems, formData.taxRate); 
  
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal: totals.subtotal,
      subtotalGravado: totals.subtotalGravado,
      subtotalExento: totals.subtotalExento,
      subtotalNoGravado: totals.subtotalNoGravado,
      tax: totals.taxAmount, 
      taxAmount: totals.taxAmount,
      total: totals.total
    }));
  
    setSubmitStockErrors([]); 
  };
  

  const handleSubmit = () => {
    setErrors({});
    setSubmitStockErrors([]);

    const formErrors = validateForm(formData, isInvoice);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const stockValidationErrors = [];
    let hasStockError = false;
    (formData.items || []).forEach((item) => { 
        const productId = item.product;
        const fullProduct = products.find(p => p._id === productId);

        if (fullProduct && fullProduct.tipo === 'producto' && typeof fullProduct.stock === 'number') {
            const requestedQuantity = item.quantity;
            const availableStock = fullProduct.stock;

            if (requestedQuantity > availableStock) {
                hasStockError = true;
                stockValidationErrors.push(`Stock insuficiente para "${fullProduct.nombre}" (Código: ${fullProduct.codigo || 'N/A'}). Solicitado: ${requestedQuantity}, Disponible: ${availableStock}.`);
            }
        }
    });

    if (hasStockError) {
        setSubmitStockErrors(stockValidationErrors);
        setErrors(prev => ({...prev, submit: 'No se puede guardar: hay productos con stock insuficiente.'}));
        return;
    }

    setSaving(true);
    const statusToSend = isInvoice ? (formData.status || 'DRAFT').toLowerCase() : (formData.status || DOCUMENT_STATUS.DRAFT);
    
    let utcDate;
    try {
      const dateStr = typeof formData.date === 'string' ? formData.date : formatForDateInput(formData.date, userTimezone);
      const localDate = new Date(dateStr.replace(/-/g, '/')); 
      if (isNaN(localDate.getTime())) throw new Error('Invalid date object from formData.date');
      utcDate = localTimeToUtc(localDate, userTimezone);
    } catch (error) {
      console.error("Error al convertir fecha a UTC:", error, "formData.date:", formData.date);
      setErrors({ submit: `Error al procesar la fecha del documento: ${error.message}. Verifique la fecha.` });
      setSaving(false);
      return;
    }
    
    let utcExpiryDate = null;
    if (formData.expiryDate) {
      try {
        const expiryDateStr = typeof formData.expiryDate === 'string' ? formData.expiryDate : formatForDateInput(formData.expiryDate, userTimezone);
        const localExpiryDate = new Date(expiryDateStr.replace(/-/g, '/'));
        if (isNaN(localExpiryDate.getTime())) throw new Error('Invalid date object from formData.expiryDate');
        utcExpiryDate = localTimeToUtc(localExpiryDate, userTimezone);
      } catch (error) {
        console.error("Error al convertir fecha de vencimiento a UTC:", error, "formData.expiryDate:", formData.expiryDate);
      }
    }
    
    const documentToSave = {
      _id: initialData?._id,
      type: formData.type,
      documentType: formData.documentType,
      number: formData.documentNumber || undefined, 
      documentNumber: formData.documentNumber || undefined,
      date: utcDate.toISOString().split('T')[0], 
      expiryDate: utcExpiryDate ? utcExpiryDate.toISOString().split('T')[0] : null,
      status: statusToSend,
      client: formData.client?._id || formData.client, 
      currency: formData.currency,
      moneda: formData.moneda, 
      paymentTerms: formData.paymentTerms,
      condicionesPago: formData.condicionesPago,
      creditDays: parseInt(formData.creditDays, 10) || 0,
      diasCredito: parseInt(formData.diasCredito, 10) || 0,
      items: (formData.items || []).map(item => ({ 
        product: item.product, 
        quantity: item.quantity,
        price: item.price,
        taxExempt: item.taxExempt || false,
        taxType: item.taxType 
      })),
      subtotal: formData.subtotal,
      subtotalGravado: formData.subtotalGravado,
      subtotalExento: formData.subtotalExento,
      subtotalNoGravado: formData.subtotalNoGravado,
      tax: formData.taxAmount, 
      taxAmount: formData.taxAmount,
      total: formData.total,
      notes: formData.notes || '',
      terms: formData.terms || '',
      usePrefix: isInvoice ? 'INV' : undefined 
    };

    onSave(documentToSave)
      .then(() => {
        onClose(); 
      })
      .catch(error => {
        console.error('Error al guardar el documento:', error);
        setErrors({ submit: 'Error al guardar: ' + (error?.response?.data?.message || error.message) });
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const getDocumentTitle = () => {
    const action = initialData ? 'Editar' : 'Nuevo';
    return isInvoice
      ? `${action} Factura`
      : `${action} ${DOCUMENT_TYPE_NAMES[formData.type] || 'Documento'}`;
  };
  
  const getCurrencySymbol = () => {
    switch (formData.currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'VES': default: return 'Bs.';
    }
  };

  // --- INICIO FUNCIÓN renderTotalsBar MODIFICADA ---
  const renderTotalsBar = () => {
    if (!formData.items || formData.items.length === 0) return null;
    const currencySymbol = getCurrencySymbol(); // Asegurarse que getCurrencySymbol está accesible
    return (
      <Box sx={{ width: '100%', mb: 2, bgcolor: '#2a2a2a', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Grid container alignItems="center" sx={{ p: 2 }}>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'center' }, mb: { xs: 1, sm: 0 } }}>
            <Typography variant="subtitle2" color="text.secondary">Base Imponible:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{currencySymbol} {(formData.subtotalGravado || 0).toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'center' }, mb: { xs: 1, sm: 0 } }}>
            <Typography variant="subtitle2" color="text.secondary">Exento:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{currencySymbol} {(formData.subtotalExento || 0).toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
            <Typography variant="subtitle2" color="text.secondary">IVA (16%):</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{currencySymbol} {(formData.tax || formData.taxAmount || 0).toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle2" color="text.secondary" display="inline" sx={{ mr: 2 }}>Total:</Typography>
            <Typography variant="h6" color="primary.main" display="inline" sx={{ fontWeight: 'bold' }}>{currencySymbol} {(formData.total || 0).toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </Box>
    );
  };
  // --- FIN FUNCIÓN renderTotalsBar MODIFICADA ---

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      disableEscapeKeyDown={saving}
      PaperProps={{ sx: { bgcolor: '#1e1e1e', backgroundImage: 'none', colorScheme: 'dark' } }} 
    >
      <DialogTitle sx={{
        backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5, 
        px: 2
      }}>
        {getDocumentTitle()}
        <IconButton onClick={onClose} sx={{ color: 'white' }} disabled={saving}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {productWarnings.length > 0 && (
          <Box sx={{ px: 2, pt: 1, pb: 0 }}> 
              {productWarnings.map((warning, index) => (
                  <Alert severity="warning" key={index} icon={<WarningIcon fontSize="inherit" />} sx={{ mb: 1 }}>
                      {warning}
                  </Alert>
              ))}
          </Box>
      )}

      {renderTotalsBar()}

      <DialogContent sx={{ p: 2, bgcolor: '#1e1e1e', color: 'white' }}>
        {submitStockErrors.length > 0 && (
             <Alert severity="error" sx={{ mb: 2 }}>
                <Typography fontWeight="bold">Error de Stock:</Typography>
                <ul>
                    {submitStockErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
             </Alert>
        )}
        {errors.submit && !submitStockErrors.length > 0 && ( 
          <Alert severity="error" sx={{ mb: 2 }}>{errors.submit}</Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <DocumentTypeSection
                formData={formData}
                errors={errors}
                onFieldChange={handleFieldChange}
                isInvoice={isInvoice}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <ClientSection
                formData={formData}
                clients={clients}
                errors={errors}
                onFieldChange={handleFieldChange}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, mb:0, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <NotesSection
                notes={formData.notes}
                terms={formData.terms}
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
          onClick={resetForm}
          startIcon={<ResetIcon />}
          disabled={saving}
          sx={{ 
            color: '#ff4d4d', 
            borderColor: 'rgba(255, 77, 77, 0.5)', 
            '&:hover': { 
              borderColor: '#ff4d4d', 
              bgcolor: 'rgba(255, 77, 77, 0.1)' 
            } 
          }}
        >
          Limpiar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={saving || !!submitStockErrors.length} 
          sx={{ ...actionButtonStyle }}
        >
          {saving ? 'GUARDANDO...' : (initialData ? 'ACTUALIZAR' : 'GUARDAR')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnifiedDocumentForm;