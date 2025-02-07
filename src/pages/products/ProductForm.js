// src/pages/products/ProductForm.js
import { useEffect, useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Box
} from '@mui/material';

export const ProductForm = ({ open, onClose, product, onSave }) => {
  const initialFormData = {
    codigo: '',
    nombre: '',
    precio: '0',
    stock: '0',
    descripcion: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        codigo: product.codigo || '',
        nombre: product.nombre || '',
        precio: product.precio?.toString() || '0',
        stock: product.stock?.toString() || '0',
        descripcion: product.descripcion || ''
      });
    } else {
      setFormData(initialFormData);
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.codigo.trim()) newErrors.codigo = 'El código es requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (isNaN(Number(formData.precio)) || Number(formData.precio) < 0) {
      newErrors.precio = 'Ingrese un precio válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const productData = {
        ...formData,
        precio: Number(formData.precio),
        stock: Number(formData.stock)
      };
      
      console.log('Datos a guardar:', productData); // <-- Añade esta línea
      
      // Si es una edición, mantener el _id
      if (product?._id) {
        productData._id = product._id;
      }

      console.log('Saving product:', productData); // Para debug
      onSave(productData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && Number(value) >= 0)) {
      setFormData(prev => ({...prev, precio: value}));
    }
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
                inputProps={{ 
                  min: "0",
                  step: "0.01"
                }}
                value={formData.precio}
                onChange={handlePriceChange}
                error={!!errors.precio}
                helperText={errors.precio}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock"
                fullWidth
                type="number"
                inputProps={{ 
                  min: "0",
                  step: "1"
                }}
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))}
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