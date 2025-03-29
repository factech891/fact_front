// src/pages/documents/DocumentForm/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Importando tus componentes modulares existentes
import DocumentSection from './DocumentSection';
import ClientSection from './ClientSection';
import ItemsSection from './ItemsSection';
import TotalsSection from './TotalsSection';

// Servicios y constantes
import { getDocument, createDocument, updateDocument } from '../../../services/DocumentsApi';
import { DOCUMENT_TYPES, DOCUMENT_STATUS } from '../constants/documentTypes';
import { useClients } from '../../../hooks/useClients';
import { useProducts } from '../../../hooks/useProducts';

const DocumentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { clients } = useClients();
  const { products } = useProducts();
  
  // Estado del formulario - mantenemos lo mismo
  const [formData, setFormData] = useState({
    type: searchParams.get('type') || DOCUMENT_TYPES.QUOTE,
    documentNumber: '',
    date: new Date().toISOString().split('T')[0],
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

  // Estados para UI
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Abrir modal directamente
  const [isOpen, setIsOpen] = useState(true);
  
  // Resto de efectos y handlers...
  
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
  
  // Guardar documento
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación, guardado y navegación...
  };
  
  // Cancelar
  const handleCancel = () => {
    setIsOpen(false);
    navigate('/documents');
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            {id ? 'Editar' : 'Nueva'} Cotización
          </Typography>
          <IconButton onClick={handleCancel} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, bgcolor: '#2a2a2a' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
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
              onProductSelect={(products) => {
                // Tu lógica de manejo de productos aquí
              }}
              onItemChange={(updatedItems) => {
                setFormData(prev => ({ ...prev, items: updatedItems }));
                calculateTotals(updatedItems);
              }}
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
          onClick={handleCancel}
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
    </Dialog>
  );
};

export default DocumentForm;