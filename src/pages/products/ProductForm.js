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
  Select,        // <-- Importado para el selector
  MenuItem,      // <-- Importado para las opciones del selector
  FormControl,   // <-- Importado para envolver el selector
  InputLabel     // <-- Importado para la etiqueta del selector
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon 
} from '@mui/icons-material';

export const ProductForm = ({ open, onClose, product, onSave }) => {
  const initialFormData = {
    // --- Nuevo campo para el tipo ---
    tipo: 'producto', // Valor por defecto
    // --- Fin nuevo campo ---
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
            // --- Cargar tipo si existe ---
            tipo: product.tipo || 'producto', 
            // --- Fin cargar tipo ---
            codigo: product.codigo || '',
            nombre: product.nombre || '',
            precio: product.precio?.toString() || '0',
            // Mostrar stock solo si es producto al cargar, si no 0
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

    if (!formData.tipo) newErrors.tipo = 'Seleccione un tipo'; // Validar tipo
    if (!formData.codigo.trim()) newErrors.codigo = 'El código es requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';

    const precioNum = Number(formData.precio);
    if (isNaN(precioNum) || precioNum < 0) {
      newErrors.precio = 'Ingrese un precio válido (mayor o igual a 0)';
    }

    // --- Validar stock solo si es producto ---
    if (formData.tipo === 'producto') {
        const stockNum = Number(formData.stock);
        if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
        newErrors.stock = 'Ingrese un stock válido (número entero >= 0)';
        }
    }
    // --- Fin validación stock ---

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    
    // --- Lógica especial al cambiar tipo: resetear stock si cambia a servicio ---
    if (name === 'tipo') {
        setFormData(prev => ({
            ...prev,
            tipo: value,
            // Si se cambia a 'servicio', limpiar el stock en el formulario
            stock: value === 'servicio' ? '0' : prev.stock 
        }));
        // Limpiar error de stock si se cambia a servicio
        if (value === 'servicio' && errors.stock) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors.stock;
                return newErrors;
            });
        }
        return; // Terminar aquí para el cambio de tipo
    }
    // --- Fin lógica especial ---

     if (name === 'precio') {
        if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
            setFormData(prev => ({...prev, [name]: value}));
        }
        return; 
    }
    
    if (name === 'stock') {
        // Solo permitir edición de stock si es producto
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
         // Asegurar que stock sea número, o quizás 0/null si es servicio (depende del backend)
        stock: formData.tipo === 'producto' ? (Number(formData.stock) || 0) : 0 
      };

      // Incluir el campo 'tipo' al guardar
      // productData.tipo ya está en formData

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

  // Estilos comunes para los inputs (para no repetir)
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
      // Asegurar color de texto blanco para input y textarea
      '& input, & textarea': { color: 'white' } 
    },
    '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)'}, // Helper text base
     // Color específico para el helper text en estado de error
    '& .Mui-error .MuiFormHelperText-root': { color: 'error.main' },
    // Estilo para el label
    '& label': { color: 'text.secondary' },
    '& label.Mui-focused': { color: 'primary.main' }, // Label focus
  };
  
  // Estilo específico para Select
   const selectStyles = {
    ...inputStyles, // Heredar estilos base
    '& .MuiSelect-select': { color: 'white' }, // Color del texto seleccionado
    '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' }, // Color del icono dropdown
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
        sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, px: 2 }}
      >
        {/* Cambiar título según si edita o crea */}
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
             {/* --- Selector de Tipo --- */}
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
                     {/* Mostrar helper text si hay error */}
                     {errors.tipo && <FormHelperText sx={{ color: 'error.main', ml: 2 }}>{errors.tipo}</FormHelperText>}
                </FormControl>
            </Grid>
            {/* --- Fin Selector de Tipo --- */}

            <Grid item xs={12} sm={6}>
              <TextField name="codigo" label="Código" fullWidth required value={formData.codigo} onChange={handleFieldChange} error={!!errors.codigo} helperText={errors.codigo} disabled={saving} sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={12}> {/* Nombre ocupa toda la fila */}
              <TextField name="nombre" label="Nombre" fullWidth required value={formData.nombre} onChange={handleFieldChange} error={!!errors.nombre} helperText={errors.nombre} disabled={saving} sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="precio" label="Precio" fullWidth InputProps={{ startAdornment: <InputAdornment position="start" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Bs.</InputAdornment> }} inputProps={{ inputMode: 'decimal' }} value={formData.precio} onChange={handleFieldChange} error={!!errors.precio} helperText={errors.precio} disabled={saving} sx={inputStyles} />
            </Grid>

             {/* --- Campo Stock Condicional --- */}
             {formData.tipo === 'producto' && (
                <Grid item xs={12} sm={6}>
                    <TextField name="stock" label="Stock" fullWidth inputProps={{ inputMode: 'numeric' }} value={formData.stock} onChange={handleFieldChange} error={!!errors.stock} helperText={errors.stock} disabled={saving} sx={inputStyles} />
                </Grid>
             )}
             {/* --- Fin Campo Stock Condicional --- */}

            <Grid item xs={12}>
              <TextField name="descripcion" label="Descripción" fullWidth multiline rows={3} value={formData.descripcion} onChange={handleFieldChange} disabled={saving} sx={inputStyles} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#2a2a2a', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          variant="outlined"
          // --- Aplicar color de error al botón Limpiar ---
          color="error" 
          onClick={resetForm}
          startIcon={<ResetIcon />}
          disabled={saving}
          sx={{ 
            // Estilos específicos para botón outlined de error en tema oscuro
            borderColor: 'rgba(255, 77, 77, 0.5)', 
            color: 'rgba(255, 77, 77, 0.8)', // Color texto más claro que el borde
            '&:hover': { 
              borderColor: 'error.main', // Borde más fuerte en hover
              bgcolor: 'rgba(255, 77, 77, 0.1)' // Fondo ligero en hover
            } 
          }}
        >
          Limpiar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={saving}
        >
          {/* Cambiar texto del botón según si edita o crea */}
          {saving ? (product ? 'Guardando...' : 'Creando...') : (product ? 'Guardar Cambios' : 'Crear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// No olvidar importar FormHelperText si lo usas para el error del Select
import { FormHelperText } from '@mui/material';