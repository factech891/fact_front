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
  Paper,
  Alert
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
import { formatForDateInput, utcToLocalTime, localTimeToUtc } from '../../../utils/dateUtils';
import { useAuth } from '../../../context/AuthContext';

// Función auxiliar para formatear fechas (modificada para usar zona horaria)
const formatLocalDate = (dateInput, timezone) => {
  if (!dateInput) {
    return formatForDateInput(new Date(), timezone);
  }
  
  if (typeof dateInput === 'string') {
    // Convertir a un objeto Date primero
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      console.warn('Fecha inválida:', dateInput);
      return formatForDateInput(new Date(), timezone);
    }
    // Convertir a zona horaria local y formatear para input de tipo fecha
    return formatForDateInput(date, timezone);
  }
  
  try {
    return formatForDateInput(dateInput, timezone);
  } catch (error) {
    console.error('Error al procesar fecha:', error);
    return formatForDateInput(new Date(), timezone);
  }
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
  // Obtener el usuario actual para acceder a su zona horaria
  const { currentUser } = useAuth();
  const userTimezone = currentUser?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Estilo para botones de acción principal (sin cambios)
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

  // Calcular fecha de vencimiento basada en la zona horaria
  const calculateExpiryDate = (docType) => {
    if (isInvoice || docType !== DOCUMENT_TYPES.QUOTE) return null;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    return formatLocalDate(expiryDate, userTimezone);
  };

  const getInitialFormState = () => ({
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
    tax: 0,
    taxAmount: 0,
    total: 0,
    notes: '',
    terms: ''
  });

  // Ahora inicializamos el estado usando la función ya definida
  const [formData, setFormData] = useState(getInitialFormState());
  const [selectedProducts, setSelectedProducts] = useState([]);

  // useEffect para cargar initialData (modificado para timezone)
  useEffect(() => {
    setProductWarnings([]);
    setSubmitStockErrors([]);

    if (open) {
      if (initialData) {
        console.log('Cargando initialData:', initialData);
        console.log('Lista de productos disponibles:', products);

        const warnings = [];
        const documentProductsForAutocomplete = (initialData.items || [])
          .map(item => {
            const productId = item.product?._id || item.product;
            const fullProduct = products.find(p => p._id === productId);
            if (fullProduct) {
              return fullProduct;
            } else {
              console.warn(`Producto con ID ${productId} (desc: ${item.descripcion}) no encontrado en la lista general.`);
              warnings.push(`El producto "${item.descripcion || productId}" no se encontró en la lista actual y podría no mostrarse correctamente.`);
              return null;
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
             return {
                product: productId,
                codigo: fullProduct?.codigo || item.codigo || 'N/A',
                descripcion: fullProduct?.nombre || item.descripcion || 'Producto Desconocido',
                quantity: item.quantity || 1,
                price: item.price ?? fullProduct?.precio ?? 0,
                taxExempt: item.taxExempt || false,
                subtotal: (item.quantity || 1) * (item.price ?? fullProduct?.precio ?? 0)
             };
        });

        // Convertir fechas de UTC a zona horaria local
        let dateValue = initialData.date;
        if (dateValue) {
          // Convertir la fecha UTC a zona horaria local
          dateValue = formatLocalDate(dateValue, userTimezone);
        }
        
        let expiryDateValue = initialData.expiryDate;
        if (expiryDateValue) {
          // Convertir la fecha UTC a zona horaria local
          expiryDateValue = formatLocalDate(expiryDateValue, userTimezone);
        }

        const totals = calculateTotals(loadedItems);

        const loadedData = {
          ...getInitialFormState(),
          ...initialData,
          type: initialData.type || (isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE),
          documentType: initialData.documentType || initialData.type || (isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE),
          documentNumber: initialData.documentNumber || initialData.number || '',
          date: dateValue || formatLocalDate(new Date(), userTimezone),
          expiryDate: expiryDateValue || calculateExpiryDate(initialData.type),
          status: (isInvoice ? (initialData.status || 'DRAFT') : initialData.status || DOCUMENT_STATUS.DRAFT).toUpperCase(),
          client: clients.find(c => c._id === (initialData.client?._id || initialData.client)) || initialData.client || null,
          currency: initialData.currency || initialData.moneda || 'VES',
          moneda: initialData.moneda || initialData.currency || 'VES',
          paymentTerms: initialData.paymentTerms || initialData.condicionesPago || 'Contado',
          condicionesPago: initialData.condicionesPago || initialData.paymentTerms || 'Contado',
          creditDays: initialData.creditDays || initialData.diasCredito || 0,
          diasCredito: initialData.diasCredito || initialData.creditDays || 0,
          items: loadedItems,
          subtotal: totals.subtotal,
          tax: totals.taxAmount,
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
  }, [open, initialData, products, clients, isInvoice, userTimezone]);

  // La función resetForm ahora usa getInitialFormState que ya está definida arriba
  const resetForm = () => {
    setFormData(getInitialFormState());
    setSelectedProducts([]);
    setErrors({});
    setProductWarnings([]);
    setSubmitStockErrors([]);
  };

  // handleFieldChange (sin cambios)
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
      if (field === 'tax') updated.taxAmount = value;
      if (field === 'taxAmount') updated.tax = value;
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

  // handleProductSelect (sin cambios)
   const handleProductSelect = (event, values) => {
    const safeValues = values || [];
    const newItems = safeValues.map(product => {
      const existingItem = formData.items.find(item => item.product === product._id);
      return {
        product: product._id,
        codigo: product.codigo || '',
        descripcion: product.nombre || '',
        quantity: existingItem?.quantity || 1,
        price: product.precio || 0,
        taxExempt: product.isExempt || false,
        subtotal: (existingItem?.quantity || 1) * (product.precio || 0)
      };
    });

    setSelectedProducts(safeValues);
    const totals = calculateTotals(newItems);
    setFormData(prev => ({
      ...prev,
      items: newItems,
      subtotal: totals.subtotal,
      tax: totals.taxAmount,
      taxAmount: totals.taxAmount,
      total: totals.total
    }));
    setSubmitStockErrors([]);
  };

  // handleItemChange (sin cambios)
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    const item = { ...updatedItems[index] };
    item[field] = value;
    if (field === 'quantity' || field === 'price') {
      item.subtotal = (item.quantity || 0) * (item.price || 0);
    }
    updatedItems[index] = item;
    const totals = calculateTotals(updatedItems);
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal: totals.subtotal,
      tax: totals.taxAmount,
      taxAmount: totals.taxAmount,
      total: totals.total
    }));
    setSubmitStockErrors([]);
  };

  // handleSubmit modificado para convertir fechas a UTC antes de guardar
  const handleSubmit = () => {
    setErrors({});
    setSubmitStockErrors([]);

    const formErrors = validateForm(formData, isInvoice);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      console.log("Errores de validación básicos:", formErrors);
      return;
    }

    const stockValidationErrors = [];
    let hasStockError = false;
    formData.items.forEach((item, index) => {
        const productId = item.product;
        const fullProduct = products.find(p => p._id === productId);

        if (fullProduct && fullProduct.tipo === 'producto' && typeof fullProduct.stock === 'number') {
            const requestedQuantity = item.quantity;
            const availableStock = fullProduct.stock;

            if (requestedQuantity > availableStock) {
                hasStockError = true;
                const errorMsg = `Stock insuficiente para "${fullProduct.nombre}" (Código: ${fullProduct.codigo || 'N/A'}). Solicitado: ${requestedQuantity}, Disponible: ${availableStock}.`;
                stockValidationErrors.push(errorMsg);
                console.warn(errorMsg);
            }
        }
    });

    if (hasStockError) {
        setSubmitStockErrors(stockValidationErrors);
        setErrors(prev => ({...prev, submit: 'No se puede guardar: hay productos con stock insuficiente.'}));
        console.log("Errores de validación de stock:", stockValidationErrors);
        return;
    }

    setSaving(true);
    const statusToSend = isInvoice ? formData.status.toLowerCase() : formData.status;
    
    // Convertir fechas de la zona horaria local a UTC antes de guardar
    let utcDate;
    try {
      // Primero convertir a objeto Date si es string
      const localDate = typeof formData.date === 'string' 
        ? new Date(formData.date) 
        : formData.date;
      
      // Convertir a UTC
      utcDate = localTimeToUtc(localDate, userTimezone);
    } catch (error) {
      console.error("Error al convertir fecha a UTC:", error);
      utcDate = new Date(); // Fallback a fecha actual
    }
    
    // Procesar fecha de vencimiento si existe
    let utcExpiryDate = null;
    if (formData.expiryDate) {
      try {
        const localExpiryDate = typeof formData.expiryDate === 'string'
          ? new Date(formData.expiryDate)
          : formData.expiryDate;
        
        utcExpiryDate = localTimeToUtc(localExpiryDate, userTimezone);
      } catch (error) {
        console.error("Error al convertir fecha de vencimiento a UTC:", error);
      }
    }
    
    const documentToSave = {
      _id: initialData?._id,
      type: formData.type,
      documentType: formData.documentType,
      number: formData.documentNumber || undefined,
      documentNumber: formData.documentNumber || undefined,
      date: utcDate.toISOString().split('T')[0], // Formato YYYY-MM-DD en UTC
      expiryDate: utcExpiryDate ? utcExpiryDate.toISOString().split('T')[0] : null,
      status: statusToSend,
      client: formData.client?._id || formData.client,
      currency: formData.currency,
      moneda: formData.moneda,
      paymentTerms: formData.paymentTerms,
      condicionesPago: formData.condicionesPago,
      creditDays: parseInt(formData.creditDays, 10) || 0,
      diasCredito: parseInt(formData.diasCredito, 10) || 0,
      items: formData.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        taxExempt: item.taxExempt || false
      })),
      subtotal: formData.subtotal,
      tax: formData.tax,
      taxAmount: formData.taxAmount,
      total: formData.total,
      notes: formData.notes || '',
      terms: formData.terms || '',
      usePrefix: isInvoice ? 'INV' : undefined
    };

    console.log('Guardando documento (sin errores de stock):', documentToSave);
    onSave(documentToSave)
      .then(() => {
        onClose();
      })
      .catch(error => {
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

  // renderTotalsBar (sin cambios)
  const renderTotalsBar = () => {
    if (formData.items.length === 0) return null;
    const totals = calculateTotals(formData.items);
    return (
      <Box sx={{ width: '100%', mb: 2, bgcolor: '#2a2a2a', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Grid container alignItems="center" sx={{ p: 2 }}>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'center' }, mb: { xs: 1, sm: 0 } }}>
            <Typography variant="subtitle2" color="text.secondary">Subtotal:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{getCurrencySymbol()} {totals.subtotal.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'center' }, mb: { xs: 1, sm: 0 } }}>
            <Typography variant="subtitle2" color="text.secondary">IVA (16%):</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{getCurrencySymbol()} {totals.taxAmount.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
            <Typography variant="subtitle2" color="text.secondary">Total:</Typography>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>{getCurrencySymbol()} {totals.total.toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Obtener símbolo de moneda (sin cambios)
  const getCurrencySymbol = () => {
    switch (formData.currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'VES': default: return 'Bs.';
    }
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      disableEscapeKeyDown={saving}
      PaperProps={{ sx: { bgcolor: '#1e1e1e', backgroundImage: 'none' } }}
    >
      <DialogTitle sx={{
        backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {getDocumentTitle()}
        <IconButton onClick={onClose} sx={{ color: 'white' }} disabled={saving}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Mostrar advertencias de productos no encontrados */}
      {productWarnings.length > 0 && (
          <Box sx={{ p: 2, pt: 0 }}>
              {productWarnings.map((warning, index) => (
                  <Alert severity="warning" key={index} icon={<WarningIcon fontSize="inherit" />} sx={{ mb: 1 }}>
                      {warning}
                  </Alert>
              ))}
          </Box>
      )}

      {renderTotalsBar()}

      <DialogContent sx={{ p: 2, bgcolor: '#1e1e1e', color: 'white' }}>
        {/* Mostrar errores de stock al intentar guardar */}
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
        {/* Mostrar error general de submit (si existe) */}
        {errors.submit && !submitStockErrors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>{errors.submit}</Alert>
        )}

        <Grid container spacing={2}>
          {/* DocumentTypeSection */}
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
          {/* ClientSection */}
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
          {/* ItemsSection */}
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
          {/* NotesSection */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
          color="error"
          onClick={resetForm}
          startIcon={<ResetIcon />}
          disabled={saving}
          sx={{ borderColor: 'rgba(255, 77, 77, 0.5)', '&:hover': { borderColor: 'error.main', bgcolor: 'rgba(255, 77, 77, 0.1)' } }}
        >
          Limpiar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={saving}
          sx={{ ...actionButtonStyle }}
        >
          {saving ? 'GUARDANDO...' : 'GUARDAR'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnifiedDocumentForm;