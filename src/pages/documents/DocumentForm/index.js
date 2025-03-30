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
  Divider, // ¡IMPORTANTE! - Esta importación es la que faltaba
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
import StatusSection from './StatusSection';

// Servicios y constantes
import { getDocument, createDocument, updateDocument } from '../../../services/DocumentsApi';
import { DOCUMENT_TYPES, DOCUMENT_STATUS } from '../constants/documentTypes';
import { useClients } from '../../../hooks/useClients';
import { useProducts } from '../../../hooks/useProducts';
import { calculateTotals } from './utils/calculations';

const DocumentForm = ({ open, onClose, initialData = null, onSave, clientsList = [], productsList = [] }) => {
  const navigate = useNavigate();
  const { clients } = useClients();
  const { products } = useProducts();
  
  const allClients = clientsList.length > 0 ? clientsList : clients;
  const allProducts = productsList.length > 0 ? productsList : products;
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    type: DOCUMENT_TYPES.QUOTE,
    date: new Date().toISOString().split('T')[0],
    expiryDate: null,
    client: null,
    items: [],
    notes: '',
    terms: '',
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    currency: 'VES',
    status: DOCUMENT_STATUS.DRAFT,
    paymentTerms: 'Contado',
    creditDays: 0
  });

  // Estados para UI
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  
  // Cargar datos iniciales si se está editando
  useEffect(() => {
    if (initialData) {
      console.log('Cargando documento para editar:', initialData);
      
      // Encontrar los productos completos basados en los IDs
      const documentProducts = initialData.items?.map(item => {
        const fullProduct = allProducts.find(p => p._id === item.product?._id || item.product);
        return {
          _id: fullProduct?._id,
          codigo: fullProduct?.codigo,
          nombre: fullProduct?.nombre,
          precio: item.price
        };
      }) || [];
      
      setSelectedProducts(documentProducts);
      
      setFormData({
        ...initialData,
        client: initialData.client,
        items: initialData.items || [],
        type: initialData.type || DOCUMENT_TYPES.QUOTE,
        status: initialData.status || DOCUMENT_STATUS.DRAFT,
        currency: initialData.currency || 'VES',
      });
    }
  }, [initialData, allProducts]);
  
  // Manejar cambios en los campos
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Manejar selección de productos
  const handleProductSelect = (event, values) => {
    console.log('Productos seleccionados:', values);
    
    // Verificación defensiva
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
    
    // Actualizamos los items y calculamos los totales
    const updatedItems = [...newItems];
    setFormData(prev => ({ 
      ...prev, 
      items: updatedItems,
      ...calculateTotals(updatedItems)
    }));
  };
  
  // Manejar cambios en los items
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    
    if (field === 'taxExempt') {
      updatedItems[index] = {
        ...updatedItems[index],
        taxExempt: value
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
        subtotal: field === 'quantity' || field === 'price' ? 
          value * (field === 'quantity' ? updatedItems[index].price : updatedItems[index].quantity) :
          updatedItems[index].subtotal
      };
    }
    
    // Actualizamos los items y calculamos los totales
    setFormData(prev => ({ 
      ...prev, 
      items: updatedItems,
      ...calculateTotals(updatedItems)
    }));
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.client?._id) newErrors.client = 'Seleccione un cliente';
    if (!formData.items.length) newErrors.items = 'Agregue al menos un producto/servicio';
    if (formData.paymentTerms === 'Crédito' && (!formData.creditDays || formData.creditDays <= 0)) {
      newErrors.creditDays = 'Ingrese días de crédito válidos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Guardar documento
  const handleSubmit = () => {
    if (validateForm()) {
      setSaving(true);
      
      const documentToSave = {
        _id: initialData?._id,
        type: formData.type,
        documentNumber: formData.documentNumber,
        date: formData.date,
        expiryDate: formData.expiryDate,
        client: formData.client._id,
        items: formData.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          taxExempt: item.taxExempt,
          subtotal: item.quantity * item.price
        })),
        notes: formData.notes,
        terms: formData.terms,
        subtotal: formData.subtotal,
        taxAmount: formData.taxAmount,
        total: formData.total,
        currency: formData.currency,
        status: formData.status,
        paymentTerms: formData.paymentTerms,
        creditDays: parseInt(formData.creditDays) || 0
      };
      
      console.log('Guardando documento:', documentToSave);
      
      if (onSave) {
        onSave(documentToSave);
        onClose();
      } else {
        // Lógica de guardado si no se proporciona onSave
        const savePromise = initialData?._id 
          ? updateDocument(initialData._id, documentToSave)
          : createDocument(documentToSave);
          
        savePromise
          .then(response => {
            console.log('Documento guardado:', response);
            onClose();
          })
          .catch(error => {
            console.error('Error al guardar documento:', error);
          })
          .finally(() => {
            setSaving(false);
          });
      }
    }
  };
  
  // Función para obtener el título según el tipo de documento
  const getDocumentTitle = () => {
    switch (formData.type) {
      case DOCUMENT_TYPES.QUOTE:
        return initialData ? 'Editar Cotización' : 'Nueva Cotización';
      case DOCUMENT_TYPES.PROFORMA:
        return initialData ? 'Editar Factura Proforma' : 'Nueva Factura Proforma';
      case DOCUMENT_TYPES.DELIVERY_NOTE:
        return initialData ? 'Editar Nota de Entrega' : 'Nueva Nota de Entrega';
      default:
        return initialData ? 'Editar Documento' : 'Nuevo Documento';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { bgcolor: '#1e1e1e' }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {getDocumentTitle()}
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2, bgcolor: '#1e1e1e' }}>
        {/* Datos del Cliente */}
        <Box sx={{ p: 2, bgcolor: '#333', borderRadius: 1, mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" color="white">
            Datos del Cliente
          </Typography>
          <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
          
          {/* Vista simplificada del selector de cliente */}
          <Box sx={{ mb: 2 }}>
            <ClientSection 
              formData={formData}
              clients={allClients}
              errors={errors}
              onFieldChange={handleFieldChange}
            />
          </Box>
        </Box>

        {/* Servicios/Productos */}
        <Box sx={{ 
          p: 2, 
          bgcolor: '#333', 
          borderRadius: 1, 
          mb: 2,
          color: 'white'
        }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Servicios
          </Typography>
          <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
          
          <ItemsSection 
            formData={formData}
            selectedProducts={selectedProducts}
            products={allProducts}
            errors={errors}
            onProductSelect={handleProductSelect}
            onItemChange={handleItemChange}
          />
        </Box>

        {/* Totales */}
        {formData.items.length > 0 && (
          <Box sx={{ 
            p: 2, 
            bgcolor: '#333', 
            borderRadius: 1,
            color: 'white'
          }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Totales
            </Typography>
            <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
            
            <TotalsSection 
              formData={formData}
              onFieldChange={handleFieldChange}
            />
          </Box>
        )}
      </DialogContent>
      
      {/* Botones de acción */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        p: 2,
        bgcolor: '#1e1e1e'
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.3)',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.8)',
            }
          }}
        >
          CANCELAR
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          color="primary"
          disabled={saving}
        >
          {saving ? 'GUARDANDO...' : 'GUARDAR'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default DocumentForm;