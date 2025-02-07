// src/pages/products/ProductForm.js
import { useEffect, useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Box
} from '@mui/material';

export const ProductForm = ({ open, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    precio: '',
    stock: '',
    descripcion: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        codigo: product.codigo || '',
        nombre: product.nombre || '',
        precio: product.precio?.toString() || '',
        stock: product.stock?.toString() || '',
        descripcion: product.descripcion || ''
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.codigo.trim()) newErrors.codigo = 'El código es requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.precio) newErrors.precio = 'El precio es requerido';
    if (Number(formData.precio) < 0) newErrors.precio = 'El precio no puede ser negativo';
    if (Number(formData.stock) < 0) newErrors.stock = 'El stock no puede ser negativo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const productData = {
        ...product, // Mantener el _id si existe
        ...formData,
        precio: Number(formData.precio) || 0,
        stock: Number(formData.stock) || 0
      };
      onSave(productData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      codigo: '',
      nombre: '',
      precio: '',
      stock: '',
      descripcion: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        {product ? 'Editar Producto' : 'Nuevo Producto'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Código"
                fullWidth
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({...prev, codigo: e.target.value}))}
                error={!!errors.codigo}
                helperText={errors.codigo}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                fullWidth
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({...prev, nombre: e.target.value}))}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Precio"
                fullWidth
                type="number"
                inputProps={{ min: "0", step: "0.01" }}
                value={formData.precio}
                onChange={(e) => setFormData(prev => ({...prev, precio: e.target.value}))}
                error={!!errors.precio}
                helperText={errors.precio}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock"
                fullWidth
                type="number"
                inputProps={{ min: "0", step: "1" }}
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))}
                error={!!errors.stock}
                helperText={errors.stock}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({...prev, descripcion: e.target.value}))}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};