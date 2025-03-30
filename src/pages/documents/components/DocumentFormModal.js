// src/pages/documents/components/DocumentFormModal.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  Typography,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Importaciones para DocumentForm
import DocumentSection from '../DocumentForm/DocumentSection';
import ClientSection from '../DocumentForm/ClientSection';
import ItemsSection from '../DocumentForm/ItemsSection';
import TotalsSection from '../DocumentForm/TotalsSection';

import { getDocument, createDocument, updateDocument } from '../../../services/DocumentsApi';
import { DOCUMENT_TYPES, DOCUMENT_STATUS } from '../constants/documentTypes';
import { useClients } from '../../../hooks/useClients';
import { useProducts } from '../../../hooks/useProducts';

const DocumentFormModal = ({ open, onClose, documentId = null }) => {
  const { clients } = useClients();
  const { products } = useProducts();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    type: DOCUMENT_TYPES.QUOTE,
    documentNumber: '',
    date: new Date().toLocaleDateString('en-CA'), // formato YYYY-MM-DD sin conversión UTC
    expiryDate: null,
    client: null,
    items: [],
    notes: '',
    terms: '',
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    currency: ' VES',
    status: DOCUMENT_STATUS.DRAFT,
    paymentTerms: 'Contado',
    creditDays: 0
  });

  // Estados para la selección de productos
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Estado para validaciones
  const [errors, setErrors] = useState({});
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Cargar documento para edición
  useEffect(() => {
    const fetchDocument = async () => {
      if (documentId) {
        try {
          setLoading(true);
          const data = await getDocument(documentId);
          if (data) {
            // Formatear fechas
            const dateFormatted = data.date 
              ? new Date(data.date).toLocaleDateString('en-CA')
              : new Date().toLocaleDateString('en-CA');
              
            const expiryDateFormatted = data.expiryDate 
              ? new Date(data.expiryDate).toLocaleDateString('en-CA')
              : null;
              
            const formattedData = {
              ...data,
              date: dateFormatted,
              expiryDate: expiryDateFormatted,
              paymentTerms: data.paymentTerms || 'Contado',
              creditDays: data.creditDays || 0
            };
            
            setFormData(formattedData);
            
            // Configurar productos seleccionados
            if (data.items && data.items.length > 0 && products.length > 0) {
              const itemProducts = data.items.map(item => {
                const product = products.find(p => p._id === item.product);
                return product || {
                  _id: item.product,
                  codigo: item.code || '',
                  nombre: item.name || ''
                };
              }).filter(Boolean);
              
              setSelectedProducts(itemProducts);
            }
          }
        } catch (err) {
          console.error('Error al cargar documento:', err);
          setSnackbar({
            open: true,
            message: 'Error al cargar el documento',
            severity: 'error'
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    if (documentId && open) {
      fetchDocument();
    }
  }, [documentId, products, open]);
  
  // Efecto para calcular fecha de vencimiento
  useEffect(() => {
    if (formData.date && formData.type) {
      const DOCUMENT_VALIDITY_DAYS = {
        'QUOTE': 30,
        'PROFORMA': 15,
        'DELIVERY_NOTE': null
      };
      
      const validityDays = DOCUMENT_VALIDITY_DAYS[formData.type];
      if (validityDays !== null) {
        // Convertir la fecha de string a Date, sumar días, y volver a string
        const dateObj = new Date(formData.date + 'T12:00:00');
        dateObj.setDate(dateObj.getDate() + validityDays);
        const expiryDateStr = dateObj.toLocaleDateString('en-CA');
        setFormData(prev => ({ ...prev, expiryDate: expiryDateStr }));
      } else {
        setFormData(prev => ({ ...prev, expiryDate: null }));
      }
    }
  }, [formData.type, formData.date]);
  
  // Manejar cambios en los campos
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Calcular totales
  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => 
      sum + ((item.quantity || 1) * (item.price || 0)), 0
    );
    
    const taxAmount = items.reduce((sum, item) => {
      if (item.taxExempt) return sum;
      const itemSubtotal = (item.quantity || 1) * (item.price || 0);
      return sum + (itemSubtotal * 0.16); // 16% de IVA
    }, 0);
    
    const total = subtotal + taxAmount;
    
    setFormData(prev => ({ 
      ...prev, 
      subtotal,
      taxAmount,
      total
    }));
  };
  
  // Handler para selección de productos - adaptado para trabajar con tu ItemsSection
  const handleProductSelect = (selectedProds) => {
    setSelectedProducts(selectedProds);
    
    // Transformar productos seleccionados a items
    const items = selectedProds.map(product => {
      // Buscar si ya existe un item para este producto
      const existingItem = formData.items.find(i => i.product === product._id);
      
      if (existingItem) {
        return existingItem;
      } else {
        // Crear nuevo item
        return {
          product: product._id,
          codigo: product.codigo,
          descripcion: product.nombre,
          quantity: 1,
          price: product.precio || 0,
          taxExempt: false,
          taxRate: 16, // Tasa por defecto
          subtotal: product.precio || 0
        };
      }
    });
    
    // Actualizar items y calcular totales
    setFormData(prev => ({ ...prev, items }));
    calculateTotals(items);
  };
  
  // Handler para cambios en items - adaptado para trabajar con tu ItemsSection
  const handleItemChange = (updatedItems) => {
    setFormData(prev => ({ ...prev, items: updatedItems }));
    calculateTotals(updatedItems);
  };
  
  // Preparar datos para enviar al API
  const prepareDataForSubmit = () => {
    // Crear fecha que represente exactamente el día local seleccionado
    const dateObj = formData.date ? new Date(formData.date + 'T12:00:00') : new Date();
    const expiryDateObj = formData.expiryDate ? new Date(formData.expiryDate + 'T12:00:00') : null;
    
    return {
      ...formData,
      // Usamos toISOString pero garantizamos que el día sea correcto con el offset de 12 horas
      date: dateObj.toISOString(),
      expiryDate: expiryDateObj ? expiryDateObj.toISOString() : null,
      // Asegurarnos que el cliente sea solo el ID si es un objeto
      client: formData.client?._id || formData.client,
      // Asegurarnos que cada item tenga el formato correcto
      items: formData.items.map(item => ({
        product: item.product?._id || item.product,
        quantity: item.quantity || 1,
        price: item.price || 0,
        taxExempt: item.taxExempt || false,
        subtotal: (item.quantity || 1) * (item.price || 0)
      }))
    };
  };
  
  // Guardar documento
  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      // Validar datos
      if (!formData.client) {
        setSnackbar({
          open: true,
          message: 'Debe seleccionar un cliente',
          severity: 'error'
        });
        setSaving(false);
        return;
      }
      
      if (!formData.items.length) {
        setSnackbar({
          open: true,
          message: 'Debe agregar al menos un ítem',
          severity: 'error'
        });
        setSaving(false);
        return;
      }
      
      // Preparar datos
      const dataToSubmit = prepareDataForSubmit();
      console.log("Datos a enviar al servidor:", JSON.stringify(dataToSubmit, null, 2));
      
      if (documentId) {
        await updateDocument(documentId, dataToSubmit);
      } else {
        await createDocument(dataToSubmit);
      }
      
      setSnackbar({
        open: true,
        message: 'Documento guardado correctamente',
        severity: 'success'
      });
      
      setTimeout(() => {
        onClose(true); // Indicar éxito
      }, 1500);
      
    } catch (error) {
      console.error('Error al guardar:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar el documento: ' + (error.message || 'Error desconocido'),
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => onClose(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh', maxHeight: '90vh', overflow: 'auto' }
        }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">
              {documentId ? 'Editar' : 'Nueva'} Cotización
            </Typography>
            <IconButton onClick={() => onClose(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, bgcolor: '#2a2a2a' }}>
          <Box sx={{ p: 3 }}>
            {/* Documento */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <DocumentSection 
                formData={formData} 
                onFieldChange={handleFieldChange}
              />
            </Paper>
            
            {/* Cliente */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <ClientSection 
                formData={formData}
                clients={clients}
                errors={errors}
                onFieldChange={handleFieldChange}
              />
            </Paper>
            
            {/* Items */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <ItemsSection 
                formData={formData}
                selectedProducts={selectedProducts}
                products={products}
                errors={errors}
                onProductSelect={handleProductSelect}
                onItemChange={handleItemChange}
              />
            </Paper>
            
            {/* Totales */}
            <Paper sx={{ p: 3 }}>
              <TotalsSection 
                formData={formData} 
                onFieldChange={handleFieldChange}
              />
            </Paper>
          </Box>
        </DialogContent>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          bgcolor: '#333', 
          p: 2 
        }}>
          <Button 
            onClick={() => onClose(false)}
            variant="outlined"
            color="inherit"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DocumentFormModal;