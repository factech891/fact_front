// src/pages/invoices/InvoiceForm/index.js
import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid, Box
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Importaciones de componentes modularizados
import DocumentSection from './DocumentSection';
import StatusSection from './StatusSection';
import ClientSection from './ClientSection';
import ItemsSection from './ItemsSection';
import TotalsSection from './TotalsSection';
import NotesSection from './NotesSection';

// Importaciones de utilidades
import { calculateTotals } from '../utils/calculations';
import { validateInvoiceForm } from '../utils/validators';

export const InvoiceForm = ({ open, onClose, invoice, onSave, clients = [], products = [] }) => {
  const [formData, setFormData] = useState({
    client: null,
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    number: '',
    moneda: 'VES',  // Cambiado a VES por defecto
    condicionesPago: 'Contado',
    diasCredito: 30,
    status: 'draft',
    documentType: 'invoice',
    // Nuevos campos:
    notes: '',
    terms: ''
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log('Invoice recibida para editar:', invoice);
    if (invoice) {
      // Encontrar los productos completos basados en los IDs
      const invoiceProducts = invoice.items?.map(item => {
        const fullProduct = products.find(p => p._id === item.product?._id || item.product);
        return {
          _id: fullProduct?._id,
          codigo: fullProduct?.codigo,
          nombre: fullProduct?.nombre,
          precio: item.price
        };
      }) || [];

      console.log('Productos procesados:', invoiceProducts);
      setSelectedProducts(invoiceProducts);

      setFormData({
        ...invoice,
        client: invoice.client,
        items: invoice.items?.map(item => ({
          product: item.product?._id || item.product,
          codigo: item.product?.codigo,
          descripcion: item.product?.nombre,
          quantity: item.quantity,
          price: item.price,
          taxExempt: item.taxExempt || false,
          subtotal: item.quantity * item.price
        })) || [],
        tax: invoice.tax || 0,
        diasCredito: invoice.diasCredito || 30,
        documentType: invoice.documentType || 'invoice',
        notes: invoice.notes || '',
        terms: invoice.terms || ''
      });
    } else {
      // Reset form para nueva factura - no generamos número aquí
      setFormData({
        client: null,
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        number: '',  // El número se obtendrá del backend o quedará en blanco
        moneda: 'VES',  // Cambiado a VES por defecto
        condicionesPago: 'Contado',
        diasCredito: 30,
        status: 'draft',
        documentType: 'invoice',
        notes: '',
        terms: ''
      });
      setSelectedProducts([]);
    }
  }, [invoice, products]);

  // Función para actualizar cualquier campo del formulario
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calcularTotales = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    // Cálculo de impuestos por item
    const tax = items.reduce((sum, item) => {
      if (item.taxExempt) {
        return sum; // No agregar impuesto si está exento
      } else {
        return sum + (item.quantity * item.price * 0.16);
      }
    }, 0);
    
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleProductSelect = (event, values) => {
    console.log('Productos seleccionados:', values);
    
    // Verificación defensiva - si values es undefined o null, usar array vacío
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
    
    // Primero actualizamos los items
    const updatedFormData = {
      ...formData,
      items: newItems
    };
    
    // Luego calculamos los totales con los items actualizados
    const totals = calcularTotales(newItems);
    
    setFormData({
      ...updatedFormData,
      ...totals
    });
  };

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

    // Primero actualizamos los items
    const updatedFormData = {
      ...formData,
      items: updatedItems
    };
    
    // Luego calculamos los totales con los items actualizados
    const totals = calcularTotales(updatedItems);
    
    setFormData({
      ...updatedFormData,
      ...totals
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.client?._id) newErrors.client = 'Seleccione un cliente';
    if (!formData.items.length) newErrors.items = 'Agregue al menos un servicio';
    if (formData.condicionesPago === 'Crédito' && (!formData.diasCredito || formData.diasCredito <= 0)) {
      newErrors.diasCredito = 'Ingrese días de crédito válidos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const invoiceToSave = {
        _id: invoice?._id,
        number: formData.number, // El número lo manejará el backend si está vacío
        client: formData.client._id,
        items: formData.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          taxExempt: item.taxExempt, // Aseguramos que se envíe este campo
          subtotal: item.quantity * item.price
        })),
        subtotal: formData.subtotal,
        tax: formData.tax,
        total: formData.total,
        moneda: formData.moneda,
        condicionesPago: formData.condicionesPago,
        diasCredito: parseInt(formData.diasCredito) || 30,
        status: formData.status || 'draft',
        documentType: formData.documentType,
        notes: formData.notes,
        terms: formData.terms
      };

      console.log('Guardando factura con exenciones de IVA:', invoiceToSave);
      onSave(invoiceToSave);
      onClose();
    }
  };

  // Función para obtener el título según el tipo de documento
  const getDocumentTitle = () => {
    switch (formData.documentType) {
      case 'invoice':
        return invoice ? 'Editar Factura' : 'Nueva Factura';
      case 'quote':
        return invoice ? 'Editar Presupuesto' : 'Nuevo Presupuesto';
      case 'proforma':
        return invoice ? 'Editar Proforma' : 'Nueva Proforma';
      case 'draft':
        return invoice ? 'Editar Borrador' : 'Nuevo Borrador';
      default:
        return invoice ? 'Editar Documento' : 'Nuevo Documento';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText', 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '1.25rem',
        fontWeight: 'bold'
      }}>
        {getDocumentTitle()}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Tipo de Documento */}
          <Grid item xs={12}>
            <DocumentSection 
              documentType={formData.documentType}
              invoiceNumber={invoice?.number}
              onChange={(value) => handleFormChange('documentType', value)}
            />
          </Grid>

          {/* Estado del documento */}
          <Grid item xs={12}>
            <StatusSection 
              status={formData.status}
              onChange={(value) => handleFormChange('status', value)}
            />
          </Grid>

          {/* Datos del Cliente */}
          <Grid item xs={12}>
            <ClientSection 
              client={formData.client}
              moneda={formData.moneda}
              condicionesPago={formData.condicionesPago}
              diasCredito={formData.diasCredito}
              clients={clients}
              errors={errors}
              onClientChange={(client) => handleFormChange('client', client)}
              onMonedaChange={(moneda) => handleFormChange('moneda', moneda)}
              onCondicionesChange={(condiciones) => {
                handleFormChange('condicionesPago', condiciones);
                // Resetear días de crédito si cambia a contado
                if (condiciones !== 'Crédito') {
                  handleFormChange('diasCredito', 30);
                }
              }}
              onDiasCreditoChange={(dias) => handleFormChange('diasCredito', dias)}
            />
          </Grid>

          {/* Productos/Servicios */}
          <Grid item xs={12}>
            <ItemsSection 
              items={formData.items}
              selectedProducts={selectedProducts}
              products={products}
              moneda={formData.moneda}
              errors={errors}
              onProductSelect={handleProductSelect}
              onItemChange={handleItemChange}
            />
          </Grid>

          {/* Totales */}
          {formData.items.length > 0 && (
            <Grid item xs={12}>
              <TotalsSection 
                subtotal={formData.subtotal}
                tax={formData.tax}
                total={formData.total}
                moneda={formData.moneda}
              />
            </Grid>
          )}
          
          {/* Notas y Términos */}
          {formData.items.length > 0 && (
            <Grid item xs={12}>
              <NotesSection 
                notes={formData.notes}
                terms={formData.terms}
                onNotesChange={(value) => handleFormChange('notes', value)}
                onTermsChange={(value) => handleFormChange('terms', value)}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      {/* Botones de acción */}
      <DialogActions sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit"
          startIcon={<CloseIcon />}
          sx={{
            fontSize: '0.9rem',
            py: 1,
            px: 3,
            borderRadius: '4px',
            textTransform: 'uppercase'
          }}
        >
          CANCELAR
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{
            fontSize: '0.9rem',
            py: 1,
            px: 3,
            borderRadius: '4px',
            textTransform: 'uppercase',
            boxShadow: 2
          }}
        >
          GUARDAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceForm;