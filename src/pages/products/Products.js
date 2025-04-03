// src/pages/products/Products.js - MODIFICADO PARA QUITAR TÍTULO Y ALINEAR BOTÓN
import { useState } from 'react';
import {
  Box,
  Button,
  Typography, // Ya no se usa para el título principal
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  CircularProgress,
  // Considerar importar Paper si quieres envolver la tabla como en los otros
  // Paper
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
      console.log('Producto guardado (simulado, añadir snackbar)');
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
        console.log('Producto eliminado (simulado, añadir snackbar)');
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

  // Indicador de carga más robusto
  if (loading && !products?.length) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
    </Box>
  );

  // Manejo de error
  if (error && !products?.length) return (
      <Typography color="error" variant="h6" sx={{ textAlign: 'center', my: 4 }}>
          Error al cargar productos: {typeof error === 'string' ? error : error?.message || 'Error desconocido'}
      </Typography>
  );


  return (
    <Box>
      {/* --- Bloque Modificado --- */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        {/* Typography eliminado */}

        {/* Botón con margen automático a la izquierda */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
             setSelectedProduct(null);
             setOpenForm(true);
            }}
          sx={{ marginLeft: 'auto' }} // <--- ¡CAMBIO CLAVE AQUÍ!
        >
          Nuevo Producto
        </Button>
      </Box>
      {/* --- Fin Bloque Modificado --- */}


      {/* Nota: Aquí la tabla no está envuelta en Paper como en Invoices/Clients */}
      {/* Si quieres consistencia visual, puedes envolverla */}
      {/* <Paper elevation={1} sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', bgcolor: '#1e1e1e' }}> */}
        <ProductTable
          products={products || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading} // Se pasa el estado loading
        />
      {/* </Paper> */}


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