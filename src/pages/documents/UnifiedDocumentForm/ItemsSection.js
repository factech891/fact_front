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
  Autocomplete,
  Paper,
  Divider,
  InputAdornment,
  Tooltip,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as ProductIcon,
  Inventory2Outlined as StockIcon,
  WarningAmberRounded as WarningIcon
} from '@mui/icons-material';

import { formatCurrency } from './utils/calculations';

const FISCAL_TYPES = {
  GRAVADO: 'gravado',
  EXENTO: 'exento',
  NO_GRAVADO: 'no_gravado'
};

const ItemsSection = ({
  formData,
  selectedProducts,
  products,
  errors,
  onProductSelect,
  onItemChange
}) => {
  const [stockErrors, setStockErrors] = useState({});

  const handleDeleteItem = (index) => {
    const currentItems = formData.items ? [...formData.items] : [];
    currentItems.splice(index, 1);

    const productsToReselect = selectedProducts.filter((_, i) => i !== index);
    onProductSelect(null, productsToReselect);

    setStockErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleQuantityChange = (index, value) => {
    const newQuantity = Math.max(1, parseInt(value) || 1);
    const currentItem = formData.items[index];
    const productId = currentItem.product;
    const fullProduct = products.find(p => p._id === productId);

    setStockErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[index];
      return newErrors;
    });

    if (fullProduct && fullProduct.tipo === 'producto' && typeof fullProduct.stock === 'number') {
      const availableStock = fullProduct.stock;
      if (newQuantity > availableStock) {
        setStockErrors(prev => ({
            ...prev,
            [index]: `Stock insuficiente. Disponible: ${availableStock}`
        }));
      }
    }
    onItemChange(index, 'quantity', newQuantity);
  };

  const handlePriceChange = (index, value) => {
    const price = Math.max(0, parseFloat(value) || 0);
    onItemChange(index, 'price', price);
    setStockErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[index];
      return newErrors;
    });
  };

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

      <Box sx={{ mb: 3 }}>
        <Autocomplete
          multiple
          options={products}
          getOptionLabel={(option) => `${option.codigo || 'S/C'} - ${option.nombre}`}
          value={selectedProducts}
          onChange={(event, newValue) => {
            onProductSelect(event, newValue);
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
            const isProduct = option.tipo === 'producto';
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

      {formData.items && formData.items.length > 0 ? (
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
                <TableCell align="center" sx={{ bgcolor: '#333', color: 'white', fontWeight: 'bold' }}>Tipo Fiscal</TableCell>
                <TableCell align="right" sx={{ bgcolor: '#333', color: 'white', fontWeight: 'bold' }}>Subtotal</TableCell>
                <TableCell align="center" sx={{ bgcolor: '#333', color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.items.map((item, index) => (
                <TableRow
                  key={`item-row-${item.product || index}`}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                    bgcolor: item.taxType === FISCAL_TYPES.EXENTO ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    ...(stockErrors[index] && { bgcolor: 'rgba(255, 0, 0, 0.1)' })
                  }}
                >
                  <TableCell>{item.codigo}</TableCell>
                  <TableCell>{item.descripcion}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 1, style: { textAlign: 'center' } }}
                      sx={{ width: '100px' }}
                      error={!!stockErrors[index]}
                    />
                    {stockErrors[index] && (
                      <Tooltip title={stockErrors[index]} placement="top">
                        <WarningIcon color="error" sx={{ fontSize: '1rem', verticalAlign: 'middle', ml: 0.5 }} />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="right">
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
                    />
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={item.taxType || (item.taxExempt ? 'exento' : 'gravado')}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          console.log(`Cambiando tipo fiscal en índice ${index} a ${newValue}`);
                          
                          onItemChange(index, 'taxType', newValue);
                          onItemChange(index, 'taxExempt', newValue === 'exento');
                        }}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                          '& .MuiSelect-icon': { color: 'rgba(255, 255, 255, 0.7)' },
                           '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                          '& .MuiSelect-select': { paddingY: 1 }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#2a2a2a',
                              color: 'white',
                              '& .MuiMenuItem-root:hover': {
                                bgcolor: 'rgba(79, 172, 254, 0.1)'
                              },
                              '& .MuiMenuItem-root.Mui-selected': {
                                bgcolor: 'rgba(79, 172, 254, 0.2)',
                                '&:hover': {
                                  bgcolor: 'rgba(79, 172, 254, 0.3)'
                                }
                              }
                            }
                          }
                        }}
                      >
                        <MenuItem value={'gravado'}>Gravado</MenuItem>
                        <MenuItem value={'exento'}>Exento</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(item.quantity * item.price, formData.currency)}
                  </TableCell>
                  <TableCell align="center">
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

      {/* INICIO DE SECCIÓN DE RESUMEN DE TOTALES MODIFICADA */}
      {formData.items && formData.items.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              bgcolor: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              minWidth: '300px'
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={7}>
                <Typography variant="body2" color="text.secondary">Base Imponible:</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body2" align="right">
                  {formatCurrency(formData.subtotalGravado || 0, formData.currency)}
                </Typography>
              </Grid>
              
              <Grid item xs={7}>
                <Typography variant="body2" color="text.secondary">Exento:</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body2" align="right">
                  {formatCurrency(formData.subtotalExento || 0, formData.currency)}
                </Typography>
              </Grid>
              
              <Grid item xs={7}>
                <Typography variant="body2" color="text.secondary">IVA (16%):</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body2" align="right">
                  {formatCurrency(formData.tax || formData.taxAmount || 0, formData.currency)}
                </Typography>
              </Grid>
              
              {/* La fila de "Subtotal No Gravado" ha sido eliminada */}
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
              </Grid>
              
              <Grid item xs={7}>
                <Typography variant="subtitle2" fontWeight="bold">Total:</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="subtitle2" fontWeight="bold" align="right">
                  {formatCurrency(formData.total, formData.currency)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
      {/* FIN DE SECCIÓN DE RESUMEN DE TOTALES MODIFICADA */}
    </Box>
  );
};

export default ItemsSection;