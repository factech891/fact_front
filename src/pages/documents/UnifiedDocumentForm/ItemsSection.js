// src/pages/documents/UnifiedDocumentForm/ItemsSection.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Switch,
  Autocomplete,
  Paper,
  Divider,
  InputAdornment,
  Tooltip,
  FormHelperText // Importar para mostrar errores
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as ProductIcon,
  Edit as EditIcon,
  Inventory2Outlined as StockIcon, // Icono para stock (opcional)
  WarningAmberRounded as WarningIcon // Icono para advertencia
} from '@mui/icons-material';

import { formatCurrency } from './utils/calculations';

/**
 * Sección para gestionar los productos/servicios
 */
const ItemsSection = ({
  formData,
  selectedProducts,
  products, // Lista completa de productos/servicios con su stock
  errors,
  onProductSelect,
  onItemChange
}) => {
  // Estado para control de edición
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  // --- NUEVO: Estado para errores de stock en la fila ---
  const [stockErrors, setStockErrors] = useState({}); // { index: "Mensaje de error" }

  // Manejar eliminación de item
  const handleDeleteItem = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    onProductSelect(null, updatedProducts);
    // Limpiar error de stock si se elimina la fila
    setStockErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[index];
      return newErrors;
    });
  };

  // --- MODIFICACIÓN: Validar stock al cambiar cantidad ---
  const handleQuantityChange = (index, value) => {
    const newQuantity = Math.max(1, parseInt(value) || 1);
    const currentItem = formData.items[index];
    const productId = currentItem.product; // ID del producto en el item actual

    // Encontrar el producto completo en la lista general para obtener su stock y tipo
    const fullProduct = products.find(p => p._id === productId);

    // Limpiar error previo para esta fila
    setStockErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[index];
      return newErrors;
    });

    // Validar solo si es un producto y tenemos la información completa
    if (fullProduct && fullProduct.tipo === 'producto' && typeof fullProduct.stock === 'number') {
      const availableStock = fullProduct.stock;

      if (newQuantity > availableStock) {
        // --- Hay stock insuficiente ---
        console.warn(`Stock insuficiente para ${fullProduct.nombre}. Solicitado: ${newQuantity}, Disponible: ${availableStock}`);
        // Mostrar error en la fila
        setStockErrors(prev => ({
            ...prev,
            [index]: `Stock insuficiente. Disponible: ${availableStock}`
        }));
        // Opcional: Limitar la cantidad al stock disponible en lugar de solo mostrar error
        // onItemChange(index, 'quantity', availableStock);
        // Por ahora, solo mostramos el error y dejamos que el usuario corrija
         onItemChange(index, 'quantity', newQuantity); // Aún así actualizamos para que vea el número que puso
      } else {
        // --- Hay stock suficiente ---
        onItemChange(index, 'quantity', newQuantity);
      }
    } else {
      // Si no es tipo 'producto' o no se encontró info, simplemente actualiza
      onItemChange(index, 'quantity', newQuantity);
    }
  };
  // --- FIN MODIFICACIÓN ---

  // Manejar cambio de precio (sin cambios)
  const handlePriceChange = (index, value) => {
    const price = Math.max(0, parseFloat(value) || 0);
    onItemChange(index, 'price', price);
     // Limpiar error de stock si se edita el precio (puede que cambie de producto luego)
     setStockErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[index];
        return newErrors;
      });
  };

  // Manejar cambio en exención de impuesto (sin cambios)
  const handleTaxExemptChange = (index, event) => {
    onItemChange(index, 'taxExempt', event.target.checked);
  };

  // Obtener símbolo de moneda (sin cambios)
  const getCurrencySymbol = () => {
    switch (formData.currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'VES':
      default:
        return 'Bs.';
    }
  };

  return (
    <Box>
      <Typography variant="h6" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <ProductIcon sx={{ mr: 1 }} />
        Productos y Servicios
      </Typography>
      <Divider sx={{ mb: 3, opacity: 0.2 }} />

      {/* Selector de productos (sin cambios) */}
      <Box sx={{ mb: 3 }}>
        <Autocomplete
          multiple
          options={products}
          getOptionLabel={(option) => `${option.codigo || 'S/C'} - ${option.nombre}`}
          value={selectedProducts}
          onChange={(event, newValue) => {
            onProductSelect(event, newValue);
            // Limpiar todos los errores de stock al cambiar la selección general
            setStockErrors({});
          }}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar Productos/Servicios"
              error={!!errors.items}
              helperText={errors.items}
              placeholder="Buscar por código o nombre"
              variant="filled"
              sx={{
                '& .MuiFilledInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  },
                  '&.Mui-focused': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }
              }}
            />
          )}
          renderOption={(props, option) => {
            const isProduct = option.tipo === 'producto'; // Verificar si es producto
            const showStock = isProduct && typeof option.stock === 'number';
            const stockColor = showStock && option.stock <= 0 ? 'error.main' : (showStock && option.stock <= 5 ? 'warning.main' : 'text.secondary');

            return (
              <li {...props}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <Typography variant="body1">
                    {option.nombre} {!isProduct && <Typography component="span" variant="caption" color="text.secondary">(Servicio)</Typography>}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Código: {option.codigo || 'S/C'}
                    </Typography>
                    {showStock && (
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: stockColor, fontWeight: option.stock <= 0 ? 'bold' : 'normal' }}>
                        <StockIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
                        Stock: {option.stock}
                      </Typography>
                    )}
                    <Typography variant="caption" color="primary">
                      {formatCurrency(option.precio || 0, formData.currency)}
                    </Typography>
                  </Box>
                </Box>
              </li>
            );
          }}
        />
      </Box>

      {/* Tabla de productos seleccionados */}
      {formData.items.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            mb: 3,
            bgcolor: 'rgba(45, 45, 45, 0.5)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#333', color: 'white', fontWeight: 'bold' }}>Código</TableCell>
                <TableCell sx={{ bgcolor: '#333', color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell align="center" sx={{ bgcolor: '#333', color: 'white', fontWeight: 'bold' }}>Cantidad</TableCell>
                <TableCell align="right" sx={{ bgcolor: '#333', color: 'white', fontWeight: 'bold' }}>Precio Unit.</TableCell>
                <TableCell align="center" sx={{ bgcolor: '#333', color: 'white', fontWeight: 'bold' }}>Exento</TableCell>
                <TableCell align="right" sx={{ bgcolor: '#333', color: 'white', fontWeight: 'bold' }}>Subtotal</TableCell>
                <TableCell align="center" sx={{ bgcolor: '#333', color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.items.map((item, index) => (
                <TableRow
                  key={item.product || index} // Usar ID de producto si existe, sino index
                  sx={{
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                    bgcolor: item.taxExempt ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
                    // --- NUEVO: Resaltar fila con error de stock ---
                    ...(stockErrors[index] && { bgcolor: 'rgba(255, 0, 0, 0.1)' })
                  }}
                >
                  <TableCell>{item.codigo}</TableCell>
                  <TableCell>{item.descripcion}</TableCell>
                  <TableCell align="center">
                    {/* --- MODIFICACIÓN: Mostrar TextField con error si existe --- */}
                    <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                        sx={{ width: '100px' }} // Un poco más ancho para el helper
                        error={!!stockErrors[index]} // Marcar como error si hay mensaje
                        // helperText={stockErrors[index]} // Mostrar mensaje debajo (opcional)
                        onFocus={() => setEditingRowIndex(index)} // Entrar en modo edición al enfocar
                        onBlur={() => {
                           // Opcional: podrías quitar el modo edición al desenfocar si no hay error
                           // if (!stockErrors[index]) setEditingRowIndex(null);
                        }}
                      />
                     {/* Mostrar mensaje de error como tooltip o debajo */}
                     {stockErrors[index] && (
                         <Tooltip title={stockErrors[index]} placement="top">
                             <WarningIcon color="error" sx={{ fontSize: '1rem', verticalAlign: 'middle', ml: 0.5 }} />
                         </Tooltip>
                        // O mostrar como texto:
                        // <FormHelperText error sx={{ textAlign: 'center', width: '100px' }}>
                        //     {stockErrors[index]}
                        // </FormHelperText>
                     )}
                     {/* --- FIN MODIFICACIÓN --- */}
                  </TableCell>
                  <TableCell align="right">
                     {/* --- MODIFICACIÓN: Usar TextField siempre visible para precio --- */}
                     <TextField
                        type="number"
                        value={item.price}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {getCurrencySymbol()}
                            </InputAdornment>
                          )
                        }}
                        sx={{ width: '140px' }}
                        onFocus={() => setEditingRowIndex(index)}
                      />
                     {/* --- FIN MODIFICACIÓN --- */}
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={item.taxExempt || false}
                      onChange={(e) => handleTaxExemptChange(index, e)}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(item.quantity * item.price, formData.currency)}
                  </TableCell>
                  <TableCell align="center">
                    {/* Ya no necesitamos el botón de editar explícito */}
                    {/* <Tooltip title="Editar">...</Tooltip> */}
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
         // (Mensaje "No hay productos agregados" sin cambios)
         <Box
          sx={{
            py: 5,
            textAlign: 'center',
            bgcolor: 'rgba(45, 45, 45, 0.5)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ProductIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay productos agregados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Utilice el buscador para agregar productos o servicios a este documento
          </Typography>
        </Box>
      )}

      {/* Resumen rápido (sin cambios) */}
      {formData.items.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              bgcolor: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              minWidth: '250px'
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" align="right">
                  {formatCurrency(formData.subtotal, formData.currency)}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">IVA (16%):</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" align="right">
                  {formatCurrency(formData.tax || formData.taxAmount, formData.currency)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" fontWeight="bold">Total:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" fontWeight="bold" align="right">
                  {formatCurrency(formData.total, formData.currency)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ItemsSection;
