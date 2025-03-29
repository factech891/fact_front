// src/pages/documents/DocumentForm/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Importar secciones del formulario
import DocumentSection from './DocumentSection';
import ClientSection from './ClientSection';
import ItemsSection from './ItemsSection';
import TotalsSection from './TotalsSection';

// Importar servicios y constantes
import { getDocument, createDocument, updateDocument } from '../../../services/DocumentsApi';
import { DOCUMENT_TYPES, DOCUMENT_STATUS, DOCUMENT_VALIDITY_DAYS } from '../constants/documentTypes';
import { useClients } from '../../../hooks/useClients';
import { useProducts } from '../../../hooks/useProducts';

// Pasos del formulario
const steps = ['Documento', 'Cliente', 'Ítems', 'Totales'];

const DocumentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { clients } = useClients();
  const { products } = useProducts();
  
  // Estado para el stepper
  const [activeStep, setActiveStep] = useState(0);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    type: searchParams.get('type') || DOCUMENT_TYPES.QUOTE,
    documentNumber: '',
    date: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    expiryDate: null,
    client: null,
    items: [],
    notes: '',
    terms: '',
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    currency: 'USD',
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
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Cargar documento para edición
  useEffect(() => {
    const fetchDocument = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getDocument(id);
          if (data) {
            // Formatear fechas a formato YYYY-MM-DD
            const dateFormatted = data.date 
              ? new Date(data.date).toISOString().split('T')[0] 
              : new Date().toISOString().split('T')[0];
              
            const expiryDateFormatted = data.expiryDate 
              ? new Date(data.expiryDate).toISOString().split('T')[0] 
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
          setError('Error al cargar el documento');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchDocument();
  }, [id, products]);
  
  // Calcular fecha de vencimiento
  useEffect(() => {
    if (formData.date && formData.type) {
      const validityDays = DOCUMENT_VALIDITY_DAYS[formData.type];
      if (validityDays !== null) {
        // Convertir la fecha de string a Date, sumar días, y volver a string
        const dateObj = new Date(formData.date);
        dateObj.setDate(dateObj.getDate() + validityDays);
        const expiryDateStr = dateObj.toISOString().split('T')[0];
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
  
  // Manejar cambios en productos seleccionados
  const handleProductSelect = (products) => {
    setSelectedProducts(products);
    
    // Transformar productos seleccionados a items
    const items = products.map(product => {
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
          subtotal: product.precio || 0,
          total: product.precio || 0
        };
      }
    });
    
    // Actualizar items en formData
    setFormData(prev => ({ 
      ...prev, 
      items,
    }));
    
    // Actualizar totales
    calculateTotals(items);
  };
  
  // Manejar cambios en items
  const handleItemChange = (updatedItems) => {
    setFormData(prev => ({ ...prev, items: updatedItems }));
    
    // Recalcular totales
    calculateTotals(updatedItems);
  };
  
  // Calcular totales
  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => 
      sum + ((item.quantity || 1) * (item.price || 0)), 0
    );
    
    const taxAmount = items.reduce((sum, item) => {
      if (item.taxExempt) return sum;
      const itemSubtotal = (item.quantity || 1) * (item.price || 0);
      return sum + (itemSubtotal * (item.taxRate || 16) / 100);
    }, 0);
    
    const total = subtotal + taxAmount;
    
    setFormData(prev => ({ 
      ...prev, 
      subtotal,
      taxAmount,
      total
    }));
  };
  
  // Navegación de stepper
  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validar cliente
    if (!formData.client) {
      newErrors.client = 'Debe seleccionar un cliente';
    }
    
    // Validar items
    if (!formData.items.length) {
      newErrors.items = 'Debe agregar al menos un ítem';
    }
    
    // Validar condiciones de pago
    if (formData.paymentTerms === 'Crédito' && (!formData.creditDays || formData.creditDays <= 0)) {
      newErrors.diasCredito = 'Debe especificar días de crédito válidos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Preparar datos para enviar al API
  const prepareDataForSubmit = () => {
    // Convertir fechas a formato ISO para el API
    const dateFormatted = formData.date ? new Date(formData.date).toISOString() : null;
    const expiryDateFormatted = formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null;
    
    return {
      ...formData,
      date: dateFormatted,
      expiryDate: expiryDateFormatted
    };
  };
  
  // Guardar documento
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Por favor, corrija los errores antes de guardar',
        severity: 'error'
      });
      return;
    }
    
    try {
      setSaving(true);
      const dataToSubmit = prepareDataForSubmit();
      
      if (id) {
        // Actualizar documento existente
        await updateDocument(id, dataToSubmit);
        setSnackbar({
          open: true,
          message: 'Documento actualizado correctamente',
          severity: 'success'
        });
      } else {
        // Crear nuevo documento
        const result = await createDocument(dataToSubmit);
        setSnackbar({
          open: true,
          message: 'Documento creado correctamente',
          severity: 'success'
        });
        
        // Navegar a la página de edición con el nuevo ID
        if (result?._id) {
          navigate(`/documents/edit/${result._id}`, { replace: true });
        }
      }
    } catch (err) {
      console.error('Error al guardar documento:', err);
      setSnackbar({
        open: true,
        message: 'Error al guardar el documento',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Volver a la lista
  const handleGoBack = () => {
    navigate('/documents');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* Cabecera */}
      <Box sx={{ mb: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4">
                {id ? 'Editar' : 'Nueva'} Cotización
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Stepper */}
      <Paper sx={{ mb: 3, p: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Contenido del paso actual */}
        <Box>
          {activeStep === 0 && (
            <DocumentSection 
              formData={formData} 
              onFieldChange={handleFieldChange}
            />
          )}
          {activeStep === 1 && (
            <ClientSection 
              formData={formData}
              clients={clients}
              errors={errors}
              onFieldChange={handleFieldChange}
            />
          )}
          {activeStep === 2 && (
            <ItemsSection 
              formData={formData}
              selectedProducts={selectedProducts}
              products={products}
              errors={errors}
              onProductSelect={handleProductSelect}
              onItemChange={handleItemChange}
            />
          )}
          {activeStep === 3 && (
            <TotalsSection 
              formData={formData} 
              onFieldChange={handleFieldChange}
            />
          )}
        </Box>

        {/* Botones de navegación */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            disabled={activeStep === 0} 
            onClick={handleBack}
          >
            Atrás
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button 
                type="submit"
                variant="contained" 
                onClick={handleSubmit}
                disabled={saving}
              >
                Guardar
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleNext}
              >
                Siguiente
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Snackbar para notificaciones */}
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
    </Box>
  );
};

export default DocumentForm;