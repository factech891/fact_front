import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Button,
  Typography,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Card,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import useDocuments from '../../../hooks/useDocuments';
import useClients from '../../../hooks/useClients';
import useProducts from '../../../hooks/useProducts';
import DocumentSection from './DocumentSection';
import ClientSection from '../../invoices/InvoiceForm/ClientSection'; // Reutilizando componente
import ItemsSection from '../../invoices/InvoiceForm/ItemsSection'; // Reutilizando componente
import TotalsSection from '../../invoices/InvoiceForm/TotalsSection'; // Reutilizando componente
import { DOCUMENT_TYPES } from '../constants/documentTypes';

// Steps for the document form
const steps = ['Documento', 'Cliente', 'Ítems', 'Totales'];

const DocumentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing document
  const [searchParams] = useSearchParams(); // For pre-selecting document type
  const { 
    createDocument, 
    getDocument, 
    updateDocument, 
    loading, 
    error: apiError 
  } = useDocuments();
  const { clients } = useClients();
  const { products } = useProducts();

  // State for stepper
  const [activeStep, setActiveStep] = useState(0);

  // Form state
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
    currency: 'EUR'
  });

  // UI state
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isEditMode, setIsEditMode] = useState(Boolean(id));

  // Load document data if editing
  useEffect(() => {
    const fetchDocument = async () => {
      if (id) {
        try {
          const document = await getDocument(id);
          if (document) {
            setFormData({
              ...document,
              // Ensure date objects are properly converted
              date: document.date ? new Date(document.date) : new Date(),
              expiryDate: document.expiryDate ? new Date(document.expiryDate) : null
            });
            setIsEditMode(true);
          }
        } catch (err) {
          setError('Error al cargar el documento');
        }
      }
    };

    fetchDocument();
  }, [id, getDocument]);

  // Handle step navigation
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Form field changes
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      if (isEditMode) {
        await updateDocument(id, formData);
        setSnackbar({
          open: true,
          message: 'Documento actualizado correctamente',
          severity: 'success'
        });
      } else {
        const result = await createDocument(formData);
        setSnackbar({
          open: true,
          message: 'Documento creado correctamente',
          severity: 'success'
        });
        // Navigate to edit mode with the new ID
        if (result?._id) {
          navigate(`/documents/edit/${result._id}`, { replace: true });
        }
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error: ${err.message || 'Ha ocurrido un error'}`,
        severity: 'error'
      });
    }
  };

  // Preview document
  const handlePreview = () => {
    if (id) {
      navigate(`/documents/view/${id}`);
    } else {
      setSnackbar({
        open: true,
        message: 'Guarde el documento primero para poder previsualizarlo',
        severity: 'info'
      });
    }
  };

  // Navigate back to documents list
  const handleGoBack = () => {
    navigate('/documents');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box sx={{ mb: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" component="h1">
                {isEditMode ? 'Editar Documento' : 'Nuevo Documento'}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<PreviewIcon />}
                onClick={handlePreview}
                disabled={!isEditMode}
              >
                Vista Previa
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Guardar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Form Content */}
      <Card sx={{ mb: 3, p: 2 }}>
        {/* Document Info */}
        {activeStep === 0 && (
          <DocumentSection
            formData={formData}
            onChange={handleFieldChange}
          />
        )}

        {/* Client Section */}
        {activeStep === 1 && (
          <ClientSection
            formData={formData}
            onChange={handleFieldChange}
            clients={clients}
          />
        )}

        {/* Items Section */}
        {activeStep === 2 && (
          <ItemsSection
            formData={formData}
            onChange={handleFieldChange}
            products={products}
          />
        )}

        {/* Totals Section */}
        {activeStep === 3 && (
          <TotalsSection
            formData={formData}
            onChange={handleFieldChange}
          />
        )}
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              Guardar Documento
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

      {/* Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DocumentForm;