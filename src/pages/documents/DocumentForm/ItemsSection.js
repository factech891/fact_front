// src/pages/documents/DocumentForm/ItemsSection.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Button,
  Divider // Aseguramos que Divider esté importado
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

const ItemsSection = ({ formData, selectedProducts, products, errors, onProductSelect, onItemChange }) => {
  // Estilos para campos uniformes
  const cellStyles = {
    padding: '8px',
    textAlign: 'center',
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' },
      '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.87)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    }
  };

  // Manejar selección de productos
  const handleProductSelection = (event, values) => {
    onProductSelect(values);
  };

  // Manejar cambios en items individuales
  const handleItemFieldChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Actualizar subtotal si cambia cantidad o precio
    if (field === 'quantity' || field === 'price') {
      const quantity = field === 'quantity' ? value : updatedItems[index].quantity;
      const price = field === 'price' ? value : updatedItems[index].price;
      updatedItems[index].subtotal = quantity * price;
    }
    
    onItemChange(updatedItems);
  };

  // Manejar eliminación de items
  const handleDeleteItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    onItemChange(updatedItems);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Productos / Servicios
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Selector de productos */}
      <Box sx={{ mb: 3 }}>
        <Autocomplete
          multiple
          options={products || []}
          getOptionLabel={(option) => `${option.codigo || ''} - ${option.nombre || ''}`}
          value={selectedProducts}
          onChange={handleProductSelection}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar Productos"
              placeholder="Buscar productos..."
              error={!!errors?.items}
              helperText={errors?.items}
              fullWidth
              size="small"
            />
          )}
        />
      </Box>
      
      {/* Tabla de items */}
      {formData.items.length > 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="center">Precio</TableCell>
                <TableCell align="center">Subtotal</TableCell>
                <TableCell align="center">Exento IVA</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.codigo}</TableCell>
                  <TableCell>
                    <TextField
                      value={item.descripcion || ''}
                      onChange={(e) => handleItemFieldChange(index, 'descripcion', e.target.value)}
                      fullWidth
                      size="small"
                      variant="outlined"
                      margin="none"
                      sx={cellStyles}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={item.quantity || 1}
                      onChange={(e) => handleItemFieldChange(index, 'quantity', Number(e.target.value) || 0)}
                      inputProps={{ min: 0, step: 1 }}
                      size="small"
                      sx={{ width: '80px', ...cellStyles }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={item.price || 0}
                      onChange={(e) => handleItemFieldChange(index, 'price', Number(e.target.value) || 0)}
                      inputProps={{ min: 0, step: 0.01 }}
                      size="small"
                      sx={{ width: '100px', ...cellStyles }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {(item.subtotal || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.taxExempt || false}
                          onChange={(e) => handleItemFieldChange(index, 'taxExempt', e.target.checked)}
                          size="small"
                        />
                      }
                      label=""
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleDeleteItem(index)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>
            No hay productos seleccionados. Use el buscador para agregar productos.
          </Typography>
        </Box>
      )}

      {/* Botón para agregar item manual */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => {
            const newItem = {
              product: null,
              codigo: '',
              descripcion: 'Producto/Servicio manual',
              quantity: 1,
              price: 0,
              taxExempt: false,
              subtotal: 0
            };
            onItemChange([...formData.items, newItem]);
          }}
        >
          Agregar Item Manual
        </Button>
      </Box>
    </Box>
  );
};

export default ItemsSection;