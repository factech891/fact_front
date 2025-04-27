import React from 'react';
// src/pages/products/ProductForm.js
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  IconButton, 
  CircularProgress, 
  Alert, 
  InputAdornment,
  Select,        
  MenuItem,      
  FormControl,   
  InputLabel,
  FormHelperText
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon 
} from '@mui/icons-material';

// Mantener la exportación con nombre para App.js
export const ProductForm = ({ open, onClose, product, onSave }) => {
  // El resto del código sigue igual...
  
  // Estilo para botones de acción principal
  const actionButtonStyle = {
    borderRadius: '50px',
    color: 'white',
    fontWeight: 600,
    padding: '8px 22px',
    textTransform: 'none',
    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
    transition: 'all 0.2s ease-in-out',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)',
      backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
      backgroundColor: 'transparent',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 10px rgba(79, 172, 254, 0.4)',
    },
    '&.Mui-disabled': {
      backgroundImage: 'linear-gradient(to right, #919191 0%, #b7b7b7 100%)',
      color: 'rgba(255, 255, 255, 0.6)',
    }
  };

  const initialFormData = {
    tipo: 'producto',
    codigo: '',
    nombre: '',
    precio: '0',
    stock: '0', 
    descripcion: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (open) {
        setSubmitError(null);
        if (product) {
          setFormData({
            tipo: product.tipo || 'producto',
            codigo: product.codigo || '',
            nombre: product.nombre || '',
            precio: product.precio?.toString() || '0',
            stock: (product.tipo === 'producto' ? product.stock?.toString() : '0') || '0', 
            descripcion: product.descripcion || ''
          });
        } else {
          setFormData(initialFormData);
        }
        setErrors({}); 
    }
  }, [product, open]);

  const validateForm = () => {
    const newErrors = {};
    setSubmitError(null);

    if (!formData.tipo) newErrors.tipo = 'Seleccione un tipo';
    if (!formData.codigo.trim()) newErrors.codigo = 'El código es requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';

    const precioNum = Number(formData.precio);
    if (isNaN(precioNum) || precioNum < 0) {
      newErrors.precio = 'Ingrese un precio válido (mayor o igual a 0)';
    }

    if (formData.tipo === 'producto') {
        const stockNum = Number(formData.stock);
        if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
        newErrors.stock = 'Ingrese un stock válido (número entero >= 0)';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'tipo') {
        setFormData(prev => ({
            ...prev,
            tipo: value,
            stock: value === 'servicio' ? '0' : prev.stock 
        }));
        if (value === 'servicio' && errors.stock) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors.stock;
                return newErrors;
            });
        }
        return;
    }

     if (name === 'precio') {
        if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
            setFormData(prev => ({...prev, [name]: value}));
        }
        return; 
    }
    
    if (name === 'stock') {
        if (formData.tipo === 'producto') {
            if (value === '' || /^[0-9]*$/.test(value)) {
            setFormData(prev => ({...prev, [name]: value}));
            }
        }
        return; 
    }

    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSave = async () => {
    if (validateForm()) {
      setSaving(true);
      setSubmitError(null);

      const productData = {
        ...formData,
        precio: Number(formData.precio) || 0,
        stock: formData.tipo === 'producto' ? (Number(formData.stock) || 0) : 0 
      };

      if (product?._id) {
        productData._id = product._id;
      }

      try {
        console.log('Saving product/service:', productData);
        await onSave(productData);
        handleClose();
      } catch (error) {
        console.error('Error saving product/service in form:', error);
        setSubmitError(error?.response?.data?.message || error?.message || 'Error al guardar. Intente de nuevo.');
      } finally {
         setSaving(false);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitError(null);
  };

  const handleClose = () => {
     if (saving) return;
     onClose();
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
      '& input, & textarea': { color: 'white' } 
    },
    '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)'},
    '& .Mui-error .MuiFormHelperText-root': { color: 'error.main' },
    '& label': { color: 'text.secondary' },
    '& label.Mui-focused': { color: 'primary.main' },
  };
  
  const selectStyles = {
    ...inputStyles,
    '& .MuiSelect-select': { color: 'white' },
    '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={saving}
      PaperProps={{ sx: { bgcolor: '#1e1e1e', backgroundImage: 'none', border: '1px solid rgba(255, 255, 255, 0.1)' } }}
    >
      <DialogTitle
        sx={{ 
          backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          py: 1.5, 
          px: 2 
        }}
      >
        {product ? `Editar ${formData.tipo === 'producto' ? 'Producto' : 'Servicio'}` : `Nuevo ${formData.tipo === 'producto' ? 'Producto' : 'Servicio'}`}
        <IconButton onClick={handleClose} sx={{ color: 'white' }} disabled={saving}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#1e1e1e', color: 'white' }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
            {submitError}
          </Alert>
        )}

        <Box sx={{ mt: 1 }}>
          <Grid container spacing={3}>
             <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" sx={selectStyles} error={!!errors.tipo}>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleFieldChange}
                        label="Tipo"
                        disabled={saving}
                    >
                        <MenuItem value="producto">Producto</MenuItem>
                        <MenuItem value="servicio">Servicio</MenuItem>
                    </Select>
                     {errors.tipo && <FormHelperText sx={{ color: 'error.main', ml: 2 }}>{errors.tipo}</FormHelperText>}
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="codigo" label="Código" fullWidth required value={formData.codigo} onChange={handleFieldChange} error={!!errors.codigo} helperText={errors.codigo} disabled={saving} sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField name="nombre" label="Nombre" fullWidth required value={formData.nombre} onChange={handleFieldChange} error={!!errors.nombre} helperText={errors.nombre} disabled={saving} sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="precio" label="Precio" fullWidth InputProps={{ startAdornment: <InputAdornment position="start" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Bs.</InputAdornment> }} inputProps={{ inputMode: 'decimal' }} value={formData.precio} onChange={handleFieldChange} error={!!errors.precio} helperText={errors.precio} disabled={saving} sx={inputStyles} />
            </Grid>

             {formData.tipo === 'producto' && (
                <Grid item xs={12} sm={6}>
                    <TextField name="stock" label="Stock" fullWidth inputProps={{ inputMode: 'numeric' }} value={formData.stock} onChange={handleFieldChange} error={!!errors.stock} helperText={errors.stock} disabled={saving} sx={inputStyles} />
                </Grid>
             )}

            <Grid item xs={12}>
              <TextField name="descripcion" label="Descripción" fullWidth multiline rows={3} value={formData.descripcion} onChange={handleFieldChange} disabled={saving} sx={inputStyles} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#2a2a2a', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          variant="outlined"
          color="error" 
          onClick={resetForm}
          startIcon={<ResetIcon />}
          disabled={saving}
          sx={{ 
            borderColor: 'rgba(255, 77, 77, 0.5)', 
            color: 'rgba(255, 77, 77, 0.8)',
            '&:hover': { 
              borderColor: 'error.main',
              bgcolor: 'rgba(255, 77, 77, 0.1)'
            } 
          }}
        >
          Limpiar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={saving}
          sx={{ ...actionButtonStyle }}
        >
          {saving ? (product ? 'GUARDANDO...' : 'CREANDO...') : (product ? 'GUARDAR CAMBIOS' : 'CREAR')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Añadir también la exportación por defecto para compatibilidad
export default ProductForm;