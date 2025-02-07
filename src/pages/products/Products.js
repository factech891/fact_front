// src/pages/products/Products.js
import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';
import { useProducts } from '../../hooks/useProducts';

const Products = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, loading, error, saveProduct, deleteProduct } = useProducts();

  const handleSave = async (product) => {
    try {
      console.log('2. Products - Recibido del form:', {
        precio: product.precio,
        productoCompleto: product
      });
      await saveProduct(product);
      setOpenForm(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Productos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Nuevo Producto
        </Button>
      </Box>

      <ProductTable 
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductForm
        open={openForm}
        product={selectedProduct}
        onClose={() => {
          setOpenForm(false);
          setSelectedProduct(null);
        }}
        onSave={handleSave}
      />
    </Box>
  );
};

export default Products;