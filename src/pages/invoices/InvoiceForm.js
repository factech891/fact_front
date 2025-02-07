// src/pages/invoices/InvoiceForm.js
import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid, Select, MenuItem, FormControl, InputLabel, Autocomplete,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, TextField, Card, Box, Chip
} from '@mui/material';
import { Calculate as CalculateIcon } from '@mui/icons-material';

export const InvoiceForm = ({ open, onClose, invoice, onSave, clients = [], products = [] }) => {
  const [formData, setFormData] = useState({
    client: null,
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    number: `INV-${Date.now()}`,
    moneda: 'USD',
    condicionesPago: 'Contado',
    diasCredito: 30,
    status: 'draft'
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      const invoiceProducts = invoice.items.map(item => ({
        _id: item.product._id,
        codigo: item.product.codigo,
        nombre: item.product.nombre,
        precio: item.price
      }));
      
      setSelectedProducts(invoiceProducts);
      setFormData({
        ...invoice,
        client: invoice.client,
        items: invoice.items.map(item => ({
          product: item.product._id,
          codigo: item.product.codigo,
          descripcion: item.product.nombre,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        })),
        tax: invoice.tax || 0
      });
    }
  }, [invoice]);

  const calcularTotales = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = subtotal * 0.16;
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleProductSelect = (event, values) => {
    const newItems = values.map(product => ({
      product: product._id,
      codigo: product.codigo,
      descripcion: product.nombre,
      quantity: 1,
      price: product.precio,
      subtotal: product.precio
    }));
    
    setSelectedProducts(values);
    setFormData(prev => ({
      ...prev,
      items: newItems,
      ...calcularTotales(newItems)
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
      subtotal: field === 'quantity' || field === 'price' ? 
        value * (field === 'quantity' ? updatedItems[index].price : updatedItems[index].quantity) :
        updatedItems[index].subtotal
    };

    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      ...calcularTotales(updatedItems)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.client?._id) newErrors.client = 'Seleccione un cliente';
    if (!formData.items.length) newErrors.items = 'Agregue al menos un producto';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const invoiceToSave = {
        _id: invoice?._id,
        number: formData.number,
        client: formData.client._id,
        items: formData.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        })),
        subtotal: formData.subtotal,
        tax: formData.tax,
        total: formData.total,
        moneda: formData.moneda,
        condicionesPago: formData.condicionesPago,
        diasCredito: parseInt(formData.diasCredito),
        status: 'draft'
      };
      onSave(invoiceToSave);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', mb: 2 }}>
        {invoice ? 'Editar Factura' : 'Nueva Factura'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Datos del Cliente y Factura */}
          <Grid item xs={12}>
            <Card sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Información General
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Moneda</InputLabel>
                    <Select
                      value={formData.moneda}
                      onChange={(e) => setFormData(prev => ({...prev, moneda: e.target.value}))}
                    >
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="VES">VES</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Condiciones de Pago</InputLabel>
                    <Select
                      value={formData.condicionesPago}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        condicionesPago: e.target.value
                      }))}
                    >
                      <MenuItem value="Contado">Contado</MenuItem>
                      <MenuItem value="Crédito">Crédito</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Productos */}
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Productos
              </Typography>
              <Autocomplete
                multiple
                options={products}
                getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
                value={selectedProducts}
                onChange={handleProductSelect}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleccionar Productos"
                    error={!!errors.items}
                    helperText={errors.items}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={`${option.codigo} - ${option.nombre}`}
                      {...getTagProps({ index })}
                      sx={{ m: 0.5 }}
                    />
                  ))
                }
              />

              {formData.items.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">Precio Unit.</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="right">IVA</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.codigo}</TableCell>
                          <TableCell>{item.descripcion}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              size="small"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              size="small"
                              value={item.price}
                              onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {(item.quantity * item.price).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {(item.quantity * item.price * 0.16).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Totales */}
              {formData.items.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Card sx={{ p: 2, minWidth: 300 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          Subtotal: {formData.moneda} {formData.subtotal.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          IVA (16%): {formData.moneda} {formData.tax.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" color="primary">
                          Total: {formData.moneda} {formData.total.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<CalculateIcon />}
        >
          Guardar Factura
        </Button>
      </DialogActions>
    </Dialog>
  );
};