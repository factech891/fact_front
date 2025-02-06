import React, { useState, useEffect } from 'react';
import { 
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid, Select, MenuItem, FormControl, InputLabel, Autocomplete,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box
} from '@mui/material';

function InvoiceForm({ open, onClose, invoice, onSave, clients, products }) {
  const [formData, setFormData] = useState({
      client: null,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      number: 'INV-' + Date.now(), // Genera un número único para la factura
      moneda: 'USD',
      condicionesPago: 'Contado',
      diasCredito: 30,
      empresa: {
          nombre: 'Tu Empresa',
          direccion: 'Dirección de la empresa',
          rif: 'J-123456789',
          condicionIva: 'Contribuyente'
      },
      status: 'draft' // Estado inicial de la factura
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
      if (invoice) {
          setFormData({
              ...invoice,
              client: invoice.client,
              tax: invoice.tax || 0
          });
          setSelectedProducts(invoice.items || []);
      }
  }, [invoice]);

  const calcularTotales = (items) => {
      const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      const tax = items.reduce((sum, item) => sum + (item.exento ? 0 : item.subtotal * 0.16), 0);
      const total = subtotal + tax;
      return { subtotal, tax, total };
  };

  const handleProductSelect = (event, values) => {
    const newItems = values.map(product => ({
        product: product._id, // Aseguramos que tenemos el _id correcto
        codigo: product.codigo,
        descripcion: product.nombre,
        quantity: 1,
        price: product.precio,
        exento: false,
        subtotal: product.precio,
        tax: product.precio * 0.16
    }));
    console.log('Items formateados:', newItems); // Debug
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

  const handleClientSelect = (event, client) => {
      if (client) {
          setFormData(prev => ({
              ...prev,
              client: client
          }));
      }
  };

  const validateForm = () => {
      const newErrors = {};
      if (!formData.client?._id) newErrors.client = 'Seleccione un cliente';
      if (!formData.items.length) newErrors.items = 'Agregue al menos un producto';
      formData.items.forEach((item, index) => {
          if (!item.quantity || item.quantity < 1) newErrors[`items[${index}].quantity`] = 'Cantidad inválida';
          if (!item.price || item.price < 0) newErrors[`items[${index}].price`] = 'Precio inválido';
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
        const invoiceToSave = {
            _id: invoice?._id, // Incluir _id si es una edición
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
            empresa: formData.empresa,
            status: formData.status
        };
        console.log('Invoice a guardar:', invoiceToSave); // Depuración
        onSave(invoiceToSave);
        onClose();
    }
  };

  return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
          <DialogTitle>{invoice ? 'Editar Factura' : 'Nueva Factura'}</DialogTitle>
          <DialogContent>
              <Grid container spacing={2}>
                  <Grid item xs={12}>
                      <Autocomplete
                          options={clients || []}
                          getOptionLabel={(option) => `${option.nombre} - ${option.rif}`}
                          onChange={handleClientSelect}
                          renderInput={(params) => (
                              <TextField
                                  {...params}
                                  label="Cliente"
                                  margin="dense"
                                  error={!!errors.client}
                                  helperText={errors.client}
                              />
                          )}
                      />
                  </Grid>

                  <Grid item xs={12} md={6}>
                      <FormControl fullWidth margin="dense">
                          <InputLabel id="moneda-label">Moneda</InputLabel>
                          <Select
                              labelId="moneda-label"
                              label="Moneda"
                              value={formData.moneda}
                              onChange={(e) => setFormData(prev => ({...prev, moneda: e.target.value}))}
                          >
                              <MenuItem value="USD">USD</MenuItem>
                              <MenuItem value="VES">VES</MenuItem>
                          </Select>
                      </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                      <FormControl fullWidth margin="dense">
                          <InputLabel id="condiciones-pago-label">Condiciones de Pago</InputLabel>
                          <Select
                              labelId="condiciones-pago-label"
                              label="Condiciones de Pago"
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

                  {formData.condicionesPago === 'Crédito' && (
                      <Grid item xs={12} md={6}>
                          <TextField
                              label="Días de Crédito"
                              type="number"
                              value={formData.diasCredito}
                              onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  diasCredito: e.target.value
                              }))}
                              fullWidth
                              margin="dense"
                          />
                      </Grid>
                  )}

                  <Grid item xs={12}>
                      <Autocomplete
                          multiple
                          options={products || []}
                          getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
                          value={selectedProducts}
                          onChange={handleProductSelect}
                          renderInput={(params) => (
                              <TextField
                                  {...params}
                                  label="Productos"
                                  margin="dense"
                                  error={!!errors.items}
                                  helperText={errors.items}
                              />
                          )}
                      />
                  </Grid>

                  {formData.items.length > 0 && (
                      <Grid item xs={12}>
                          <TableContainer component={Paper}>
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
                                                      value={item.quantity}
                                                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                                      size="small"
                                                      error={!!errors[`items[${index}].quantity`]}
                                                      helperText={errors[`items[${index}].quantity`]}
                                                  />
                                              </TableCell>
                                              <TableCell align="right">
                                                  <TextField
                                                      type="number"
                                                      value={item.price}
                                                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                                                      size="small"
                                                      error={!!errors[`items[${index}].price`]}
                                                      helperText={errors[`items[${index}].price`]}
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
                          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                              <Grid item>
                                  <Typography variant="subtitle1">
                                      Subtotal: {formData.moneda} {formData.subtotal.toFixed(2)}
                                  </Typography>
                                  <Typography variant="subtitle1">
                                      IVA (16%): {formData.moneda} {formData.tax.toFixed(2)}
                                  </Typography>
                                  <Typography variant="h6">
                                      Total: {formData.moneda} {formData.total.toFixed(2)}
                                  </Typography>
                              </Grid>
                          </Grid>
                      </Grid>
                  )}
              </Grid>
          </DialogContent>
          <DialogActions>
              <Button onClick={onClose}>Cancelar</Button>
              <Button
                  onClick={handleSave}
                  variant="contained"
                  sx={{
                      backgroundColor: 'var(--primary-color)',
                      '&:hover': {
                          backgroundColor: 'var(--secondary-color)',
                      }
                  }}
              >
                  Guardar
              </Button>
          </DialogActions>
      </Dialog>
  );
}

export default InvoiceForm;