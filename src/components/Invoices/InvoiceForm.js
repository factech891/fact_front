// InvoiceForm.js
import React, { useState, useEffect } from 'react';
import { 
   TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button,
   Grid, Select, MenuItem, FormControl, InputLabel, Autocomplete,
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   Paper, Typography, Box
} from '@mui/material';

function InvoiceForm({ open, onClose, invoice, onSave, clients, products }) {
   const [formData, setFormData] = useState({
       cliente: null,
       items: [],
       subtotal: 0,
       iva: 0,
       total: 0,
       moneda: 'USD',
       condicionesPago: 'Contado',
       diasCredito: 30
   });

   const [selectedProducts, setSelectedProducts] = useState([]);
   const [errors, setErrors] = useState({});

   useEffect(() => {
       if (invoice) {
           setFormData({
               ...invoice,
               cliente: invoice.client,
               iva: invoice.iva?.monto || 0
           });
           setSelectedProducts(invoice.items || []);
       }
   }, [invoice]);

   const calcularTotales = (items) => {
       const subtotal = items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
       const iva = items.reduce((sum, item) => sum + (item.exento ? 0 : item.subtotal * 0.16), 0);
       const total = subtotal + iva - formData.descuentoGlobal;
       return { subtotal, iva, total };
   };

   const handleProductSelect = (event, values) => {
       const newItems = values.map(product => ({
           id: product.id,
           codigo: product.codigo,
           descripcion: product.nombre,
           cantidad: 1,
           precioUnitario: product.precio,
           exento: false,
           subtotal: product.precio,
           iva: product.precio * 0.16
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
           subtotal: field === 'cantidad' || field === 'precioUnitario' ? 
               value * (field === 'cantidad' ? updatedItems[index].precioUnitario : updatedItems[index].cantidad) :
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
               cliente: client
           }));
       }
   };

   const validateForm = () => {
       const newErrors = {};
       if (!formData.cliente.nombre) newErrors.cliente = 'Seleccione un cliente';
       if (!formData.items.length) newErrors.productos = 'Agregue al menos un producto';
       setErrors(newErrors);
       return Object.keys(newErrors).length === 0;
   };

   const handleSave = () => {
       if (validateForm()) {
           onSave(formData);
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
                                   error={!!errors.cliente}
                                   helperText={errors.cliente}
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
                                   error={!!errors.productos}
                                   helperText={errors.productos}
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
                                                       value={item.cantidad}
                                                       onChange={(e) => handleItemChange(index, 'cantidad', parseFloat(e.target.value))}
                                                       size="small"
                                                   />
                                               </TableCell>
                                               <TableCell align="right">
                                                   <TextField
                                                       type="number"
                                                       value={item.precioUnitario}
                                                       onChange={(e) => handleItemChange(index, 'precioUnitario', parseFloat(e.target.value))}
                                                       size="small"
                                                   />
                                               </TableCell>
                                               <TableCell align="right">
                                                   {(item.cantidad * item.precioUnitario).toFixed(2)}
                                               </TableCell>
                                               <TableCell align="right">
                                                   {(item.cantidad * item.precioUnitario * 0.16).toFixed(2)}
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
                                       IVA (16%): {formData.moneda} {formData.iva.toFixed(2)}
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