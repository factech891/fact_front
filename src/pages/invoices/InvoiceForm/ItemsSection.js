import React from 'react';
// src/pages/invoices/InvoiceForm/ItemsSection.js
import { 
  Card, Box, Typography, Autocomplete, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Checkbox, IconButton, Tooltip, Chip
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const ItemsSection = ({ 
  items, 
  selectedProducts, 
  products, 
  moneda, 
  errors,
  onProductSelect, 
  onItemChange 
}) => {
  // Función wrapper para asegurar que los parámetros se pasan correctamente
  const handleProductSelectWrapper = (_, newValue) => {
    // Asegurarse de que newValue no sea undefined
    onProductSelect(_, newValue || []);
  };

  return (
    <Card sx={{ 
      p: 0, 
      bgcolor: '#3f3f3f', 
      color: 'white',
      overflow: 'hidden',
      borderRadius: '8px'
    }}>
      <Box sx={{ p: 2 }}>
        {/* Título y selector de servicios */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 1
        }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
            Servicios
          </Typography>
          <Tooltip title="Puede marcar servicios individuales como exentos de IVA">
            <IconButton size="small" sx={{ color: '#4dabf5' }}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Selector de servicios con manejo defensivo */}
        <Box sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.15)', 
          borderRadius: '4px',
          p: 1,
          mb: 2
        }}>
          <Autocomplete
            multiple
            options={products || []}
            getOptionLabel={(option) => `${option.codigo || ''} - ${option.nombre || ''}`}
            value={selectedProducts || []}
            onChange={handleProductSelectWrapper}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Seleccionar Servicios"
                error={!!errors.items}
                helperText={errors.items}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'transparent',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.7)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4dabf5'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.8)'
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#ff8080',
                    fontWeight: 'bold',
                    marginTop: '8px'
                  }
                }}
              />
            )}
            renderTags={(value, getTagProps) => 
              value.map((option, index) => (
                <Chip
                  label={`${option.codigo || ''} - ${option.nombre || ''}`}
                  {...getTagProps({ index })}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        color: 'white'
                      }
                    }
                  }}
                />
              ))
            }
          />
        </Box>

        {/* Tabla de servicios seleccionados */}
        {items.length > 0 && (
          <Box sx={{ 
            backgroundColor: '#1E1E1E', 
            borderRadius: '4px',
            overflow: 'hidden',
            mt: 2
          }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#1E1E1E' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Precio Unit.</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Exento IVA</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.codigo || ''}</TableCell>
                      <TableCell>{item.descripcion || ''}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          value={item.quantity || 0}
                          onChange={(e) => onItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          InputProps={{
                            inputProps: { min: 1, style: { textAlign: 'center' } }
                          }}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          value={item.price || 0}
                          onChange={(e) => onItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">{moneda}</InputAdornment>,
                            inputProps: { min: 0, step: 0.01, style: { textAlign: 'right' } }
                          }}
                          sx={{ width: 140 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {moneda} {((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={!!item.taxExempt}
                          onChange={(e) => onItemChange(index, 'taxExempt', e.target.checked)}
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default ItemsSection;