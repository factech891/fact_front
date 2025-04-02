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
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as ProductIcon,
  Edit as EditIcon
} from '@mui/icons-material';

import { formatCurrency } from './utils/calculations';

/**
 * Sección para gestionar los productos/servicios
 */
const ItemsSection = ({ 
  formData, 
  selectedProducts, 
  products, 
  errors, 
  onProductSelect, 
  onItemChange 
}) => {
  // Estado para control de edición
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  
  // Manejar eliminación de item
  const handleDeleteItem = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    onProductSelect(null, updatedProducts);
  };
  
  // Manejar cambio de cantidad
  const handleQuantityChange = (index, value) => {
    // Validar que sea un número positivo
    const quantity = Math.max(1, parseInt(value) || 1);
    onItemChange(index, 'quantity', quantity);
  };
  
  // Manejar cambio de precio
  const handlePriceChange = (index, value) => {
    const price = Math.max(0, parseFloat(value) || 0);
    onItemChange(index, 'price', price);
  };
  
  // Manejar cambio en exención de impuesto
  const handleTaxExemptChange = (index, event) => {
    onItemChange(index, 'taxExempt', event.target.checked);
  };
  
  // Obtener símbolo de moneda
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
      
      {/* Selector de productos */}
      <Box sx={{ mb: 3 }}>
        <Autocomplete
          multiple
          options={products}
          getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
          value={selectedProducts}
          onChange={onProductSelect}
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
          renderOption={(props, option) => (
            <li {...props}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Typography variant="body1">
                  {option.nombre}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="body2" color="text.secondary">
                    Código: {option.codigo}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {formatCurrency(option.precio || 0, formData.currency)}
                  </Typography>
                </Box>
              </Box>
            </li>
          )}
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
                  key={index}
                  sx={{ 
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                    bgcolor: item.taxExempt ? 'rgba(25, 118, 210, 0.05)' : 'transparent'
                  }}
                >
                  <TableCell>{item.codigo}</TableCell>
                  <TableCell>{item.descripcion}</TableCell>
                  <TableCell align="center">
                    {editingRowIndex === index ? (
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                        sx={{ width: '80px' }}
                        autoFocus
                      />
                    ) : (
                      <Box 
                        onClick={() => setEditingRowIndex(index)}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { 
                            bgcolor: 'primary.main', 
                            color: 'white',
                            borderRadius: '4px',
                            px: 1
                          }
                        }}
                      >
                        {item.quantity}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editingRowIndex === index ? (
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
                        sx={{ width: '120px' }}
                      />
                    ) : (
                      <Box 
                        onClick={() => setEditingRowIndex(index)}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { 
                            bgcolor: 'primary.main', 
                            color: 'white',
                            borderRadius: '4px',
                            px: 1
                          }
                        }}
                      >
                        {formatCurrency(item.price, formData.currency)}
                      </Box>
                    )}
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
                    <Tooltip title="Editar">
                      <IconButton 
                        size="small"
                        onClick={() => setEditingRowIndex(index === editingRowIndex ? null : index)}
                        color={index === editingRowIndex ? 'primary' : 'default'}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
      
      {/* Resumen rápido */}
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