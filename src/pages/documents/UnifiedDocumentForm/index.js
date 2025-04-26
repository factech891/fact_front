// src/pages/documents/UnifiedDocumentForm/index.js
// (Importaciones y otras funciones como estaban)
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
  Alert // Importar Alert para mostrar advertencias
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon,
  WarningAmberRounded as WarningIcon // Icono para advertencia
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

// Función auxiliar para formatear fechas (sin cambios)
const formatLocalDate = (dateInput) => {
  if (!dateInput) {
    return new Date().toISOString().split('T')[0];
  }
  if (typeof dateInput === 'string') {
    if (dateInput.includes('T')) {
      return dateInput.split('T')[0];
    }
    if (dateInput.includes('-')) {
      return dateInput.split(' ')[0];
    }
    console.warn('Formato de fecha desconocido:', dateInput);
    return new Date().toISOString().split('T')[0];
  }
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
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
  products = [], // Lista completa de productos/servicios disponibles
  isInvoice = false
}) => {
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
  // --- NUEVO: Estado para advertencias de productos no encontrados ---
  const [productWarnings, setProductWarnings] = useState([]);

  const calculateExpiryDate = (docType) => {
    if (isInvoice || docType !== DOCUMENT_TYPES.QUOTE) return null;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    return formatLocalDate(expiryDate);
  };

  const getInitialFormState = () => ({
    type: isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE,
    documentType: isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE,
    documentNumber: '',
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
  const [selectedProducts, setSelectedProducts] = useState([]); // Estado para el Autocomplete
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Limpiar advertencias al abrir/cambiar datos
    setProductWarnings([]);

    if (open) {
      if (initialData) {
        console.log('Cargando initialData:', initialData);
        console.log('Lista de productos disponibles:', products); // Log para verificar lista

        // --- MODIFICACIÓN: Lógica mejorada para mapear productos para Autocomplete ---
        const warnings = [];
        const documentProductsForAutocomplete = (initialData.items || [])
          .map(item => {
            const productId = item.product?._id || item.product;
            // Buscar el producto COMPLETO en la lista 'products' que viene como prop
            const fullProduct = products.find(p => p._id === productId);

            if (fullProduct) {
              // Si se encuentra, devolver el objeto completo
              return fullProduct;
            } else {
              // Si no se encuentra, registrar una advertencia y crear un objeto básico
              console.warn(`Producto con ID ${productId} (desc: ${item.descripcion}) no encontrado en la lista general.`);
              warnings.push(`El producto "${item.descripcion || productId}" no se encontró en la lista actual y podría no mostrarse correctamente.`);
              // Devolver un objeto mínimo para que la tabla funcione, pero Autocomplete no lo mostrará
              return null; // Devolver null para filtrarlo después
            }
          })
          .filter(p => p !== null); // Filtrar los que no se encontraron

        if (warnings.length > 0) {
            setProductWarnings(warnings);
        }

        console.log('Productos mapeados para Autocomplete:', documentProductsForAutocomplete);
        setSelectedProducts(documentProductsForAutocomplete); // Establecer estado para Autocomplete
        // --- FIN MODIFICACIÓN ---


        // --- Lógica para mapear items para la tabla (más robusta) ---
        const loadedItems = (initialData.items || []).map(item => {
             const productId = item.product?._id || item.product;
             const fullProduct = products.find(p => p._id === productId);
             return {
                product: productId, // ID del producto
                codigo: fullProduct?.codigo || item.codigo || 'N/A', // Código del producto
                descripcion: fullProduct?.nombre || item.descripcion || 'Producto Desconocido', // Nombre/Descripción
                quantity: item.quantity || 1, // Cantidad
                price: item.price ?? fullProduct?.precio ?? 0, // Precio (usar ?? para permitir 0)
                taxExempt: item.taxExempt || false, // Exento de impuestos
                // Calcular subtotal basado en los datos cargados
                subtotal: (item.quantity || 1) * (item.price ?? fullProduct?.precio ?? 0)
             };
        });
        console.log('Items mapeados para la tabla:', loadedItems);
        // --- FIN LÓGICA ITEMS ---

        // Cargar resto de datos del formulario
        let dateValue = initialData.date;
        if (dateValue && typeof dateValue === 'string' && dateValue.includes('T')) {
          dateValue = dateValue.split('T')[0];
        }
        let expiryDateValue = initialData.expiryDate;
        if (expiryDateValue && typeof expiryDateValue === 'string' && expiryDateValue.includes('T')) {
          expiryDateValue = expiryDateValue.split('T')[0];
        }

        // Calcular totales basados en los items cargados
        const totals = calculateTotals(loadedItems);

        const loadedData = {
          ...getInitialFormState(), // Empezar con estado inicial por defecto
          ...initialData, // Sobrescribir con datos iniciales
          // Asegurar campos clave
          type: initialData.type || (isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE),
          documentType: initialData.documentType || initialData.type || (isInvoice ? 'INVOICE' : DOCUMENT_TYPES.QUOTE),
          documentNumber: initialData.documentNumber || initialData.number || '',
          date: dateValue || formatLocalDate(new Date()),
          expiryDate: expiryDateValue || calculateExpiryDate(initialData.type),
          status: (isInvoice ? (initialData.status || 'DRAFT') : initialData.status || DOCUMENT_STATUS.DRAFT).toUpperCase(),
          // Asegurar que el cliente sea el objeto completo si está disponible
          client: clients.find(c => c._id === (initialData.client?._id || initialData.client)) || initialData.client || null,
          currency: initialData.currency || initialData.moneda || 'VES',
          moneda: initialData.moneda || initialData.currency || 'VES',
          paymentTerms: initialData.paymentTerms || initialData.condicionesPago || 'Contado',
          condicionesPago: initialData.condicionesPago || initialData.paymentTerms || 'Contado',
          creditDays: initialData.creditDays || initialData.diasCredito || 0,
          diasCredito: initialData.diasCredito || initialData.creditDays || 0,
          items: loadedItems, // Usar los items procesados
          // Usar los totales recalculados
          subtotal: totals.subtotal,
          tax: totals.taxAmount,
          taxAmount: totals.taxAmount,
          total: totals.total,
          notes: initialData.notes || '',
          terms: initialData.terms || ''
        };

        console.log('Datos finales cargados en formData:', loadedData);
        setFormData(loadedData);

      } else {
        resetForm(); // Si no hay initialData, resetear el formulario
      }
    }
  }, [open, initialData, products, clients, isInvoice]); // Añadir clients a las dependencias

  const resetForm = () => {
    setFormData(getInitialFormState());
    setSelectedProducts([]);
    setErrors({});
    setProductWarnings([]); // Limpiar advertencias al resetear
  };

  // handleFieldChange (sin cambios)
  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // ... (resto de la lógica sin cambios) ...
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

  // handleProductSelect (actualiza items y totales)
   const handleProductSelect = (event, values) => {
    const safeValues = values || [];
    // Mapear los productos seleccionados en el Autocomplete a la estructura de items
    const newItems = safeValues.map(product => {
      // Buscar si este producto ya estaba en la lista de items para mantener su cantidad
      const existingItem = formData.items.find(item => item.product === product._id);
      return {
        product: product._id,
        codigo: product.codigo || '',
        descripcion: product.nombre || '',
        quantity: existingItem?.quantity || 1, // Mantener cantidad si ya existía, sino 1
        price: product.precio || 0,
        taxExempt: product.isExempt || false, // Asumiendo que viene de 'products'
        subtotal: (existingItem?.quantity || 1) * (product.precio || 0) // Recalcular subtotal
      };
    });

    setSelectedProducts(safeValues); // Actualizar estado para Autocomplete
    const totals = calculateTotals(newItems); // Recalcular totales generales
    setFormData(prev => ({
      ...prev,
      items: newItems, // Actualizar la lista de items en el formulario
      subtotal: totals.subtotal,
      tax: totals.taxAmount,
      taxAmount: totals.taxAmount,
      total: totals.total
    }));
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
  };

  // handleSubmit (sin cambios por ahora, se modificará para validar stock antes de guardar)
  const handleSubmit = () => {
    const updatedErrors = validateForm(formData, isInvoice);
    setErrors(updatedErrors);

    if (Object.keys(updatedErrors).length === 0) {
      setSaving(true);
      const statusToSend = isInvoice ? formData.status.toLowerCase() : formData.status;
      const documentToSave = {
        _id: initialData?._id,
        type: formData.type,
        documentType: formData.documentType,
        number: formData.documentNumber || undefined,
        documentNumber: formData.documentNumber || undefined,
        date: formData.date,
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
    } else {
        console.log("Errores de validación:", updatedErrors);
    }
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
    // Calcular totales basados en formData.items actual
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

  // Obtener símbolo de moneda
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

      {/* --- NUEVO: Mostrar advertencias de productos --- */}
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
        {errors.submit && (
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
                clients={clients} // Pasar lista completa de clientes
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
                selectedProducts={selectedProducts} // Los productos seleccionados para el Autocomplete
                products={products} // La lista completa de productos/servicios disponibles
                errors={errors}
                onProductSelect={handleProductSelect} // Función para manejar selección en Autocomplete
                onItemChange={handleItemChange} // Función para manejar cambios en la tabla
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