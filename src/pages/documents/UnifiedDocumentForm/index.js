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

// Función auxiliar para formatear fechas en zona horaria local, versión robusta
const formatLocalDate = (dateInput) => {
  // Protección para valores nulos o indefinidos
  if (!dateInput) {
    return new Date().toISOString().split('T')[0];
  }
  
  // Si es un string, extraemos solo la parte YYYY-MM-DD sin conversiones
  if (typeof dateInput === 'string') {
    // Primero verificamos si tiene formato "T"
    if (dateInput.includes('T')) {
      return dateInput.split('T')[0];
    }
    // Si no tiene "T", verificamos si tiene guiones (formato YYYY-MM-DD)
    if (dateInput.includes('-')) {
      // Aseguramos de devolver solo la parte YYYY-MM-DD
      return dateInput.split(' ')[0];
    }
    // Si llega aquí, formato desconocido, usamos la fecha actual
    console.warn('Formato de fecha desconocido:', dateInput);
    return new Date().toISOString().split('T')[0];
  }
  
  // Para objetos Date, usamos toISOString() que es más confiable
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      // Fecha inválida
      console.warn('Fecha inválida:', dateInput);
      return new Date().toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error al procesar fecha:', error);
    return new Date().toISOString().split('T')[0];
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
  // Estilo para botones de acción principal
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

  const calculateExpiryDate = (docType) => {
    if (isInvoice || docType !== DOCUMENT_TYPES.QUOTE) return null;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    return formatLocalDate(expiryDate);
  };

  const getInitialFormState = () => ({
    type: isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE,
    documentType: isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE,
    documentNumber: '', // Dejamos vacío, backend lo generará si es necesario
    date: formatLocalDate(new Date()),
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

  const [formData, setFormData] = useState(getInitialFormState());
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        console.log('Cargando initialData:', initialData);
        const documentProducts = (initialData.items || []).map(item => {
          const fullProduct = products.find(p => p._id === (item.product?._id || item.product));
          return {
            _id: fullProduct?._id || item.product,
            codigo: fullProduct?.codigo || item.codigo || '',
            nombre: fullProduct?.nombre || item.descripcion || '',
            precio: item.price || fullProduct?.precio || 0
          };
        });
        setSelectedProducts(documentProducts);

        // Extraer las fechas de manera segura
        let dateValue = initialData.date;
        // Esta es una protección adicional para asegurar que la fecha no se modifique
        if (dateValue && typeof dateValue === 'string' && dateValue.includes('T')) {
          dateValue = dateValue.split('T')[0];
        }

        let expiryDateValue = initialData.expiryDate;
        if (expiryDateValue && typeof expiryDateValue === 'string' && expiryDateValue.includes('T')) {
          expiryDateValue = expiryDateValue.split('T')[0];
        }

        const loadedData = {
          ...getInitialFormState(),
          ...initialData,
          type: initialData.type || (isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE),
          documentType: initialData.documentType || initialData.type || (isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE),
          documentNumber: initialData.documentNumber || initialData.number || '', // Usamos lo que venga del backend
          // Usando directamente las fechas extrayendo la parte YYYY-MM-DD sin pasar por formatLocalDate
          date: dateValue || formatLocalDate(new Date()),
          expiryDate: expiryDateValue || calculateExpiryDate(initialData.type),
          status: isInvoice ? (initialData.status || 'DRAFT').toUpperCase() : initialData.status || DOCUMENT_STATUS.DRAFT,
          client: initialData.client || null,
          currency: initialData.currency || initialData.moneda || 'VES',
          moneda: initialData.moneda || initialData.currency || 'VES',
          paymentTerms: initialData.paymentTerms || initialData.condicionesPago || 'Contado',
          condicionesPago: initialData.condicionesPago || initialData.paymentTerms || 'Contado',
          creditDays: initialData.creditDays || initialData.diasCredito || 0,
          diasCredito: initialData.diasCredito || initialData.creditDays || 0,
          items: (initialData.items || []).map(item => ({
            product: item.product?._id || item.product,
            codigo: item.codigo || '',
            descripcion: item.descripcion || '',
            quantity: item.quantity || 1,
            price: item.price || 0,
            taxExempt: item.taxExempt || false,
            subtotal: (item.quantity || 0) * (item.price || 0)
          })),
          subtotal: initialData.subtotal || 0,
          tax: initialData.tax || initialData.taxAmount || 0,
          taxAmount: initialData.tax || initialData.taxAmount || 0,
          total: initialData.total || 0,
          notes: initialData.notes || '',
          terms: initialData.terms || ''
        };
        
        // Log adicional para verificar
        console.log(`Fecha original: ${initialData.date}, Fecha procesada: ${loadedData.date}`);
        
        setFormData(loadedData);
      } else {
        resetForm();
      }
    }
  }, [open, initialData, products, isInvoice]);

  const resetForm = () => {
    setFormData(getInitialFormState());
    setSelectedProducts([]);
    setErrors({});
  };

  const handleFieldChange = (field, value) => {
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

  const handleProductSelect = (event, values) => {
    const safeValues = values || [];
    const newItems = safeValues.map(product => ({
      product: product._id,
      codigo: product.codigo || '',
      descripcion: product.nombre || '',
      quantity: 1,
      price: product.precio || 0,
      taxExempt: product.isExempt || false,
      subtotal: product.precio || 0
    }));

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
  };

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
  };

  const handleSubmit = () => {
    const updatedErrors = validateForm(formData, isInvoice);
    // Quitamos la validación manual de documentNumber
    setErrors(updatedErrors);

    if (Object.keys(updatedErrors).length === 0) {
      setSaving(true);
      const statusToSend = isInvoice ? formData.status.toLowerCase() : formData.status;
      const documentToSave = {
        _id: initialData?._id,
        type: formData.type,
        documentType: formData.documentType,
        number: formData.documentNumber || undefined, // Enviamos undefined si está vacío
        documentNumber: formData.documentNumber || undefined, // Backend lo generará si es necesario
        date: formData.date, // Enviamos la fecha tal cual, sin manipulación adicional
        expiryDate: formData.expiryDate,
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

      console.log('Guardando documento:', documentToSave);
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
    }
  };

  const getDocumentTitle = () => {
    const action = initialData ? 'Editar' : 'Nuevo';
    return isInvoice 
      ? `${action} Factura`
      : `${action} ${DOCUMENT_TYPE_NAMES[formData.type] || 'Documento'}`;
  };

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

      {renderTotalsBar()}

      <DialogContent sx={{ p: 2, bgcolor: '#1e1e1e', color: 'white' }}>
        {errors.submit && (
          <Typography color="error" sx={{ mb: 2 }}>{errors.submit}</Typography>
        )}
        <Grid container spacing={2}>
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