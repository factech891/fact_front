// src/pages/invoices/InvoiceForm.js
import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid, Select, MenuItem, FormControl, InputLabel, Autocomplete,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, TextField, Card, Box, FormHelperText,
  InputAdornment, Collapse, Divider, Checkbox, FormControlLabel,
  IconButton, Tooltip, RadioGroup, Radio, FormLabel, Chip
} from '@mui/material';
import { 
  CreditCard as CreditCardIcon, 
  Money as MoneyIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';

export const InvoiceForm = ({ open, onClose, invoice, onSave, clients = [], products = [] }) => {
  const [formData, setFormData] = useState({
    client: null,
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    number: '',
    moneda: 'USD',
    condicionesPago: 'Contado',
    diasCredito: 30,
    status: 'draft',
    documentType: 'invoice'
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
        documentType: invoice.documentType || 'invoice'
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
        moneda: 'USD',
        condicionesPago: 'Contado',
        diasCredito: 30,
        status: 'draft',
        documentType: 'invoice'
      });
      setSelectedProducts([]);
    }
  }, [invoice, products]);

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
    const newItems = values.map(product => ({
      product: product._id,
      codigo: product.codigo,
      descripcion: product.nombre,
      quantity: 1,
      price: product.precio,
      taxExempt: product.isExempt || false,
      subtotal: product.precio
    }));

    setSelectedProducts(values);
    
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

  const handleDocumentTypeChange = (event) => {
    setFormData({
      ...formData,
      documentType: event.target.value
    });
  };

  const handleStatusChange = (event) => {
    setFormData({
      ...formData,
      status: event.target.value
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
        documentType: formData.documentType
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
            <Card sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Documento</InputLabel>
                    <Select
                      value={formData.documentType}
                      onChange={handleDocumentTypeChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="invoice">Factura</MenuItem>
                      <MenuItem value="quote">Presupuesto</MenuItem>
                      <MenuItem value="proforma">Factura Proforma</MenuItem>
                      <MenuItem value="draft">Borrador</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* Eliminamos el campo de número - lo determinará el backend */}
                  {invoice ? (
                    <TextField
                      fullWidth
                      label="Número de Documento"
                      value={invoice.number || ""}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ReceiptIcon color="primary" />
                          </InputAdornment>
                        ),
                        readOnly: true
                      }}
                    />
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                      El número de documento se generará automáticamente
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Estado del documento */}
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Estado del Documento
              </Typography>
              <Divider sx={{ my: 1 }} />
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={formData.status}
                  onChange={handleStatusChange}
                >
                  <FormControlLabel 
                    value="draft" 
                    control={<Radio />} 
                    label="Borrador" 
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        color: 'text.secondary',
                        fontWeight: formData.status === 'draft' ? 'bold' : 'normal'
                      } 
                    }}
                  />
                  <FormControlLabel 
                    value="pending" 
                    control={<Radio />} 
                    label="Pendiente" 
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        color: 'warning.main',
                        fontWeight: formData.status === 'pending' ? 'bold' : 'normal'
                      } 
                    }}
                  />
                  <FormControlLabel 
                    value="paid" 
                    control={<Radio />} 
                    label="Pagada" 
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        color: 'success.main',
                        fontWeight: formData.status === 'paid' ? 'bold' : 'normal'
                      } 
                    }}
                  />
                </RadioGroup>
              </FormControl>
            </Card>
          </Grid>

          {/* Datos del Cliente */}
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Datos del Cliente
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={clients}
                    getOptionLabel={(option) => `${option.nombre} - ${option.rif}`}
                    value={formData.client}
                    onChange={(_, client) => setFormData(prev => ({ ...prev, client }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cliente"
                        error={!!errors.client}
                        helperText={errors.client}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <FormControl fullWidth>
                    <InputLabel>Moneda</InputLabel>
                    <Select
                      value={formData.moneda}
                      onChange={(e) => setFormData(prev => ({...prev, moneda: e.target.value}))}
                      startAdornment={
                        <InputAdornment position="start">
                          <CreditCardIcon color="primary" sx={{ mr: 1 }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="USD">Dólares (USD)</MenuItem>
                      <MenuItem value="VES">Bolívares (VES)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <FormControl fullWidth>
                    <InputLabel>Condiciones de Pago</InputLabel>
                    <Select
                      value={formData.condicionesPago}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        condicionesPago: e.target.value
                      }))}
                      startAdornment={
                        <InputAdornment position="start">
                          <PaymentIcon color="primary" sx={{ mr: 1 }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="Contado">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MoneyIcon fontSize="small" sx={{ mr: 1 }} />
                          Contado
                        </Box>
                      </MenuItem>
                      <MenuItem value="Crédito">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                          Crédito
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Campo de días de crédito condicional */}
                <Grid item xs={12} md={6} lg={4}>
                  <Collapse in={formData.condicionesPago === 'Crédito'} unmountOnExit>
                    <FormControl fullWidth error={!!errors.diasCredito}>
                      <TextField
                        label="Días de Crédito"
                        type="number"
                        value={formData.diasCredito}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          diasCredito: parseInt(e.target.value) || ''
                        }))}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              días
                            </InputAdornment>
                          )
                        }}
                        error={!!errors.diasCredito}
                        helperText={errors.diasCredito}
                      />
                    </FormControl>
                  </Collapse>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Productos/Servicios - VERSIÓN MEJORADA */}
          <Grid item xs={12}>
            <Card sx={{ 
              p: 0, 
              bgcolor: '#333', 
              color: 'white',
              overflow: 'hidden',
              borderRadius: '8px'
            }}>
              <Box sx={{ p: 2 }}>
                {/* Título y selector de servicios */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 1
                }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                    Servicios
                  </Typography>
                  <Tooltip title="Puede marcar servicios individuales como exentos de IVA">
                    <IconButton size="small" sx={{ color: 'primary.main' }}>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Selector de servicios */}
                <Box sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '4px',
                  p: 1,
                  mb: 2
                }}>
                  <Autocomplete
                    multiple
                    options={products}
                    getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
                    value={selectedProducts}
                    onChange={handleProductSelect}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderTags={(value, getTagProps) => 
                      value.map((option, index) => (
                        <Chip
                          label={`${option.codigo} - ${option.nombre}`}
                          {...getTagProps({ index })}
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            '& .MuiChip-deleteIcon': {
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                color: 'white'
                              }
                            }
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Seleccionar Servicios"
                        error={!!errors.items}
                        helperText={errors.items}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'transparent',
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)'
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)'
                          },
                          '& .MuiFormHelperText-root': {
                            color: 'error.light'
                          }
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Tabla de servicios seleccionados */}
                {formData.items.length > 0 && (
                  <>
                    <Box sx={{ 
                      backgroundColor: 'white', 
                      borderRadius: '4px',
                      overflow: 'hidden',
                      mt: 2
                    }}>
                      <TableContainer>
                        <Table>
                          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Precio Unit.</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Exento IVA</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {formData.items.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.codigo}</TableCell>
                                <TableCell>{item.descripcion}</TableCell>
                                <TableCell align="center">
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                    InputProps={{
                                      inputProps: { min: 1, style: { textAlign: 'center' } }
                                    }}
                                    sx={{ width: 80 }}
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start">{formData.moneda}</InputAdornment>,
                                      inputProps: { min: 0, step: 0.01, style: { textAlign: 'right' } }
                                    }}
                                    sx={{ width: 140 }}
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  {formData.moneda} {(item.quantity * item.price).toFixed(2)}
                                </TableCell>
                                <TableCell align="center">
                                  <Checkbox
                                    checked={item.taxExempt}
                                    onChange={(e) => handleItemChange(index, 'taxExempt', e.target.checked)}
                                    color="primary"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>

                    {/* Total simplificado */}
                    <Box sx={{ 
                      mt: 4, 
                      mb: 2,
                      display: 'flex', 
                      justifyContent: 'flex-end'
                    }}>
                      <Box sx={{ 
                        backgroundColor: 'white', 
                        borderRadius: '4px',
                        p: 2,
                        minWidth: '300px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                          Total:
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                          {formData.moneda} {formData.total.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Botones de acción mejorados */}
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