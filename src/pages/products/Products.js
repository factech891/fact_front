// src/pages/products/Products.js
import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton, 
  CircularProgress 
} from '@mui/material';
import { 
  Add as AddIcon, 
  Close as CloseIcon, 
  DeleteForever as DeleteIcon, 
  Cancel as CancelIcon 
} from '@mui/icons-material'; 
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';
import { useProducts } from '../../hooks/useProducts';

const Products = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // 'loading' viene del hook useProducts
  const { products, loading, error, saveProduct, deleteProduct } = useProducts(); 

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false); 

  const handleSave = async (product) => {
    try {
      await saveProduct(product);
      setOpenForm(false);
      setSelectedProduct(null);
      // TODO: Añadir Snackbar de éxito
    } catch (error) {
      console.error('Error saving product:', error);
      // TODO: Añadir Snackbar de error
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    setProductIdToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (productIdToDelete) {
      setDeleting(true); 
      try {
        await deleteProduct(productIdToDelete);
        // TODO: Añadir Snackbar de éxito
      } catch (error) {
        console.error('Error deleting product:', error);
        // TODO: Añadir Snackbar de error
      } finally {
        setDeleting(false); 
        setOpenConfirmDialog(false);
        setProductIdToDelete(null);
      }
    }
  };

  const handleCloseConfirmDialog = () => {
    if (deleting) return; 
    setOpenConfirmDialog(false);
    setProductIdToDelete(null);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedProduct(null);
   }

  // Ahora mostramos el estado de carga principal aquí
  if (loading && !products?.length) return <Typography>Cargando productos...</Typography>; 
  // Mostramos error solo si no hay productos y hay un error (podría mejorarse)
  if (error && !products?.length) return <Typography color="error">Error al cargar productos: {error}</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Productos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { 
             setSelectedProduct(null); 
             setOpenForm(true);
            }}
        >
          Nuevo Producto
        </Button>
      </Box>

      {/* ----- MODIFICACIÓN AQUÍ: Pasar la prop 'loading' ----- */}
      <ProductTable 
        products={products || []} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading} // <-- Se pasa el estado loading a la tabla
      />

      <ProductForm
        open={openForm}
        product={selectedProduct}
        onClose={handleCloseForm} 
        onSave={handleSave}
      />

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
        disableEscapeKeyDown={deleting} 
        PaperProps={{ sx: { bgcolor: '#1e1e1e', backgroundImage: 'none', border: '1px solid rgba(255, 255, 255, 0.1)' } }} 
      >
        <DialogTitle 
          id="confirm-delete-dialog-title" 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 1.5, 
            px: 2
          }}
        >
          Confirmar Eliminación
          <IconButton onClick={handleCloseConfirmDialog} sx={{ color: 'white' }} disabled={deleting}>
            <CloseIcon /> 
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: '#1e1e1e', color: 'rgba(255, 255, 255, 0.8)' }}> 
          <DialogContentText id="confirm-delete-dialog-description" sx={{ color: 'inherit' }}> 
            ¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            bgcolor: '#2a2a2a', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
          }}
        >
          <Button 
            variant="outlined" 
            onClick={handleCloseConfirmDialog} 
            startIcon={<CancelIcon />}
            disabled={deleting}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              borderColor: 'rgba(255, 255, 255, 0.3)', 
              '&:hover': { 
                borderColor: 'rgba(255, 255, 255, 0.5)', 
                bgcolor: 'rgba(255, 255, 255, 0.05)' 
              } 
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmDelete} 
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />} 
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'} 
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;