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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Importamos componentes del módulo de facturas
import ClientSection from '../../invoices/InvoiceForm/ClientSection';
import ItemsSection from '../../invoices/InvoiceForm/ItemsSection';
import TotalsSection from '../../invoices/InvoiceForm/TotalsSection';

// Importar servicios y constantes
import { getDocument, createDocument, updateDocument } from '../../../services/DocumentsApi';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_NAMES, DOCUMENT_VALIDITY_DAYS } from '../constants/documentTypes';
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
    date: new Date(),
    expiryDate: null,
    client: null,
    items: [],
    notes: '',
    terms: '',
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    currency: 'EUR',
    status: 'DRAFT'
  });
  
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
            // Formatear fechas como objetos Date
            const formattedData = {
              ...data,
              date: data.date ? new Date(data.date) : new Date(),
              expiryDate: data.expiryDate ? new Date(data.expiryDate) : null
            };
            setFormData(formattedData);
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
  }, [id]);
  
  // Calcular fecha de vencimiento cuando cambia el tipo o la fecha
  useEffect(() => {
    if (formData.date && formData.type) {
      const validityDays = DOCUMENT_VALIDITY_DAYS[formData.type];
      if (validityDays !== null) {
        const expiryDate = new Date(formData.date);
        expiryDate.setDate(expiryDate.getDate() + validityDays);
        setFormData(prev => ({ ...prev, expiryDate }));
      } else {
        setFormData(prev => ({ ...prev, expiryDate: null }));
      }
    }
  }, [formData.type, formData.date]);
  
  // Manejar cambios en los campos
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Navegación de stepper
  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  // Guardar documento
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      if (id) {
        // Actualizar documento existente
        await updateDocument(id, formData);
        setSnackbar({
          open: true,
          message: 'Documento actualizado correctamente',
          severity: 'success'
        });
      } else {
        // Crear nuevo documento
        const result = await createDocument(formData);
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
  
  // Renderizar campo de fecha simple (sin MUI DatePicker para evitar problemas)
  const SimpleDateField = ({ label, value, onChange, helperText }) => {
    const dateValue = value ? value.toISOString().split('T')[0] : '';
    
    const handleDateChange = (e) => {
      const newDate = e.target.value ? new Date(e.target.value) : null;
      onChange(newDate);
    };
    
    return (
      <TextField
        label={label}
        type="date"
        value={dateValue}
        onChange={handleDateChange}
        fullWidth
        size="small"
        InputLabelProps={{ shrink: true }}
        helperText={helperText}
      />
    );
  };
  
  // Sección de documento
  const DocumentSection = () => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Información del Documento
      </Typography>
      
      <Grid container spacing={3}>
        {/* Tipo de documento */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="document-type-label">Tipo de Documento</InputLabel>
            <Select
              labelId="document-type-label"
              value={formData.type}
              label="Tipo de Documento"
              onChange={(e) => handleFieldChange('type', e.target.value)}
            >
              <MenuItem value={DOCUMENT_TYPES.QUOTE}>{DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.QUOTE]}</MenuItem>
              <MenuItem value={DOCUMENT_TYPES.PROFORMA}>{DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.PROFORMA]}</MenuItem>
              <MenuItem value={DOCUMENT_TYPES.DELIVERY_NOTE}>{DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.DELIVERY_NOTE]}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Número de documento */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Número de Documento"
            value={formData.documentNumber || ''}
            onChange={(e) => handleFieldChange('documentNumber', e.target.value)}
            fullWidth
            size="small"
            helperText="Se generará automáticamente si se deja en blanco"
          />
        </Grid>
        
        {/* Fecha */}
        <Grid item xs={12} md={6}>
          <SimpleDateField
            label="Fecha"
            value={formData.date}
            onChange={(value) => handleFieldChange('date', value)}
            helperText="Fecha del documento"
          />
        </Grid>
        
        {/* Fecha de vencimiento */}
        {DOCUMENT_VALIDITY_DAYS[formData.type] !== null && (
          <Grid item xs={12} md={6}>
            <SimpleDateField
              label="Fecha de Vencimiento"
              value={formData.expiryDate}
              onChange={(value) => handleFieldChange('expiryDate', value)}
              helperText={`Vence a los ${DOCUMENT_VALIDITY_DAYS[formData.type]} días`}
            />
          </Grid>
        )}
        
        {/* Moneda */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="currency-label">Moneda</InputLabel>
            <Select
              labelId="currency-label"
              value={formData.currency || 'EUR'}
              label="Moneda"
              onChange={(e) => handleFieldChange('currency', e.target.value)}
            >
              <MenuItem value="EUR">Euro (€)</MenuItem>
              <MenuItem value="USD">Dólar ($)</MenuItem>
              <MenuItem value="GBP">Libra Esterlina (£)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Notas */}
        <Grid item xs={12}>
          <TextField
            label="Notas"
            value={formData.notes || ''}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
            helperText="Notas adicionales para el documento"
          />
        </Grid>
        
        {/* Términos */}
        <Grid item xs={12}>
          <TextField
            label="Términos y Condiciones"
            value={formData.terms || ''}
            onChange={(e) => handleFieldChange('terms', e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
            helperText="Términos y condiciones del documento"
          />
        </Grid>
      </Grid>
    </Box>
  );

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
                {id ? 'Editar' : 'Nuevo'} {DOCUMENT_TYPE_NAMES[formData.type]}
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
          {activeStep === 0 && <DocumentSection />}
          {activeStep === 1 && (
            <ClientSection 
              formData={formData} 
              onChange={handleFieldChange} 
              clients={clients} 
            />
          )}
          {activeStep === 2 && (
            <ItemsSection 
              formData={formData} 
              onChange={handleFieldChange} 
              products={products} 
            />
          )}
          {activeStep === 3 && (
            <TotalsSection 
              formData={formData} 
              onChange={handleFieldChange} 
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