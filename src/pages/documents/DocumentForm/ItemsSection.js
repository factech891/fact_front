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
  Divider
} from '@mui/material';
import {
  Delete as DeleteIcon
} from '@mui/icons-material';

const ItemsSection = ({ formData, selectedProducts, products, errors, onProductSelect, onItemChange }) => {
  // Estilos para campos uniformes
  const cellStyles = {
    padding: '8px',
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    },
    '& .MuiInputBase-input': { color: 'white' }
  };

  // Estado para controlar la lógica del Autocomplete
  const [inputValue, setInputValue] = useState('');

  // Manejar selección de productos (desde Autocomplete)
  const handleProductSelection = (event, newValue) => {
    console.log("Nuevos productos seleccionados:", newValue);
    onProductSelect(newValue);
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
    
    // También hay que actualizar selectedProducts
    const updatedSelectedProducts = selectedProducts.filter((_, i) => i !== index);
    
    // Llamar a onItemChange con la lista actualizada
    onItemChange(updatedItems);
    
    // Si hay productos seleccionados y son consistentes con los items, actualizar también
    if (selectedProducts.length === formData.items.length) {
      onProductSelect(updatedSelectedProducts);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom color="white">
        Productos / Servicios
      </Typography>
      
      <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
      
      {/* Selector de productos */}
      <Box sx={{ mb: 3 }}>
        <Autocomplete
          multiple
          options={products || []}
          getOptionLabel={(option) => `${option.codigo || ''} - ${option.nombre || ''}`}
          value={selectedProducts}
          onChange={handleProductSelection}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar Productos"
              placeholder="Buscar productos..."
              error={!!errors?.items}
              helperText={errors?.items}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputBase-input': { color: 'white' }
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Typography color="textPrimary">
                {option.codigo ? `${option.codigo} - ` : ''}{option.nombre}
              </Typography>
            </li>
          )}
        />
      </Box>
      
      {/* Tabla de items */}
      {formData.items.length > 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Código</TableCell>
                <TableCell sx={{ color: 'white' }}>Descripción</TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>Cantidad</TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>Precio</TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>Subtotal</TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>Exento IVA</TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.items.map((item, index) => {
                // Encontrar el producto correspondiente para mostrar su código y nombre
                const product = products.find(p => p._id === (item.product?._id || item.product));
                
                return (
                  <TableRow key={index}>
                    <TableCell sx={{ color: 'white' }}>
                      {/* Mostrar código del producto */}
                      {product?.codigo || item.codigo || ""}
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={item.descripcion || product?.nombre || ""}
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
                    <TableCell align="center" sx={{ color: 'white' }}>
                      {(item.subtotal || 0).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.taxExempt || false}
                            onChange={(e) => handleItemFieldChange(index, 'taxExempt', e.target.checked)}
                            size="small"
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.5)',
                              '&.Mui-checked': { color: 'primary.main' }
                            }}
                          />
                        }
                        label=""
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteItem(index)} 
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ p: 2, textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
          <Typography>
            No hay productos seleccionados. Use el buscador para agregar productos.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ItemsSection;