import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  Autocomplete,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

// Tax rates constants
const TAX_RATES = [
  { value: 0, label: '0%' },
  { value: 4, label: '4%' },
  { value: 10, label: '10%' },
  { value: 21, label: '21%' }
];

const ItemsSection = ({ formData, onChange, products }) => {
  const [items, setItems] = useState(formData.items || []);
  const [editItemIndex, setEditItemIndex] = useState(-1);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    description: '',
    quantity: 1,
    price: 0,
    taxRate: 21,
    taxAmount: 0,
    total: 0,
    product: null
  });

  // Update parent form data whenever items change
  useEffect(() => {
    onChange('items', items);
    
    // Calculate totals
    calculateTotals(items);
  }, [items, onChange]);

  // Calculate subtotal, tax and total
  const calculateTotals = (itemsList) => {
    const subtotal = itemsList.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    const taxAmount = itemsList.reduce(
      (sum, item) => sum + (((item.price || 0) * (item.quantity || 1)) * (item.taxRate || 0) / 100), 
      0
    );
    const total = subtotal + taxAmount;

    onChange('subtotal', subtotal);
    onChange('taxAmount', taxAmount);
    onChange('total', total);
  };

  // Calculate the current item total
  const calculateItemTotals = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    const taxRate = parseFloat(item.taxRate) || 0;
    
    const subTotal = quantity * price;
    const taxAmount = subTotal * (taxRate / 100);
    const total = subTotal + taxAmount;
    
    return {
      ...item,
      taxAmount,
      total
    };
  };

  // Handle form input changes
  const handleItemChange = (field, value) => {
    const updatedItem = { 
      ...currentItem, 
      [field]: value 
    };
    
    // If it's a product selection, update fields
    if (field === 'product' && value) {
      const selectedProduct = products.find(p => p._id === value);
      if (selectedProduct) {
        updatedItem.name = selectedProduct.name;
        updatedItem.description = selectedProduct.description || '';
        updatedItem.price = selectedProduct.price || 0;
      }
    }
    
    // Recalculate totals
    const recalculatedItem = calculateItemTotals(updatedItem);
    setCurrentItem(recalculatedItem);
  };

  // Open dialog to add new item
  const handleAddItem = () => {
    setEditItemIndex(-1);
    setCurrentItem({
      name: '',
      description: '',
      quantity: 1,
      price: 0,
      taxRate: 21,
      taxAmount: 0,
      total: 0,
      product: null
    });
    setShowItemDialog(true);
  };

  // Open dialog to edit existing item
  const handleEditItem = (index) => {
    setEditItemIndex(index);
    setCurrentItem(items[index]);
    setShowItemDialog(true);
  };

  // Remove item from the list
  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Save item to the list
  const handleSaveItem = () => {
    // Validate item
    if (!currentItem.name || parseFloat(currentItem.quantity) <= 0 || parseFloat(currentItem.price) < 0) {
      // Show error message (consider adding a proper error handling)
      console.error('Por favor complete todos los campos requeridos');
      return;
    }
    
    const finalItem = calculateItemTotals(currentItem);
    
    if (editItemIndex >= 0) {
      // Update existing item
      const newItems = [...items];
      newItems[editItemIndex] = finalItem;
      setItems(newItems);
    } else {
      // Add new item
      setItems([...items, finalItem]);
    }
    
    // Close dialog
    setShowItemDialog(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: formData.currency || 'EUR'
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Productos y Servicios
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Items Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'background.default' }}>
              <TableCell width="40%">Producto/Servicio</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">IVA</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No hay productos añadidos
                  </Typography>
                  <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={handleAddItem}
                    sx={{ mt: 1 }}
                  >
                    Añadir Producto
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                  <TableCell align="right">{item.taxRate}%</TableCell>
                  <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditItem(index)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteItem(index)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Item Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
        >
          Añadir Producto
        </Button>
      </Box>

      {/* Item Dialog */}
      <Dialog
        open={showItemDialog}
        onClose={() => setShowItemDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editItemIndex >= 0 ? 'Editar Producto' : 'Añadir Producto'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Product Selection */}
            <Grid item xs={12}>
              <Autocomplete
                id="product-select"
                options={products || []}
                getOptionLabel={(option) => option.name || ''}
                value={products?.find(p => p._id === currentItem.product) || null}
                onChange={(event, newValue) => handleItemChange('product', newValue?._id)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleccionar Producto"
                    variant="outlined"
                    fullWidth
                    size="small"
                    helperText="Seleccione un producto o complete manualmente"
                  />
                )}
              />
            </Grid>

            {/* Product Name */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                size="small"
                value={currentItem.name || ''}
                onChange={(e) => handleItemChange('name', e.target.value)}
                required
              />
            </Grid>

            {/* Product Price */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Precio"
                variant="outlined"
                fullWidth
                size="small"
                type="number"
                value={currentItem.price || ''}
                onChange={(e) => handleItemChange('price', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
                required
              />
            </Grid>

            {/* Product Description */}
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                variant="outlined"
                fullWidth
                size="small"
                multiline
                rows={2}
                value={currentItem.description || ''}
                onChange={(e) => handleItemChange('description', e.target.value)}
              />
            </Grid>

            {/* Product Quantity */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Cantidad"
                variant="outlined"
                fullWidth
                size="small"
                type="number"
                value={currentItem.quantity || ''}
                onChange={(e) => handleItemChange('quantity', parseFloat(e.target.value))}
                required
              />
            </Grid>

            {/* Tax Rate */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="tax-rate-label">Tipo de IVA</InputLabel>
                <Select
                  labelId="tax-rate-label"
                  value={currentItem.taxRate || 21}
                  label="Tipo de IVA"
                  onChange={(e) => handleItemChange('taxRate', parseFloat(e.target.value))}
                >
                  {TAX_RATES.map((rate) => (
                    <MenuItem key={rate.value} value={rate.value}>
                      {rate.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Item Totals */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">
                    Subtotal: {formatCurrency((currentItem.price || 0) * (currentItem.quantity || 0))}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">
                    IVA: {formatCurrency(currentItem.taxAmount || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">
                    Total: {formatCurrency(currentItem.total || 0)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowItemDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveItem} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItemsSection;