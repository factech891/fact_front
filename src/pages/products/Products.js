// src/pages/products/Products.js (CORREGIDO - Layout Botón Nuevo)
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
  CircularProgress,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  DeleteForever as DeleteIcon,
  Cancel as CancelIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';
import { useProducts } from '../../hooks/useProducts';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import ActionButton from '../../components/ActionButton'; // VERIFICA RUTA

const Products = () => {
  // Estilo para botones de acción principal (sin cambios)
  const actionButtonStyle = {
    borderRadius: '50px',
    color: 'white',
    fontWeight: 600,
    padding: '8px 22px',
    textTransform: 'none',
    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
    transition: 'all 0.2s ease-in-out',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)',
      backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
      backgroundColor: 'transparent',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 10px rgba(79, 172, 254, 0.4)',
    },
    '&.Mui-disabled': {
      backgroundImage: 'linear-gradient(to right, #919191 0%, #b7b7b7 100%)',
      color: 'rgba(255, 255, 255, 0.6)',
    }
  };

  const { userRole, canCreate } = useRoleAccess(); // Obtener canCreate también
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, loading, error, saveProduct, deleteProduct, fetchProducts } = useProducts(); // Añadir fetchProducts
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSave = async (product) => {
    try {
      await saveProduct(product);
      setOpenForm(false);
      setSelectedProduct(null);
      setSnackbar({
        open: true,
        message: product._id ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente',
        severity: 'success'
      });
      // fetchProducts(); // Refrescar si el hook no lo hace
    } catch (error) {
      console.error('Error saving product:', error);
      setSnackbar({
        open: true,
        message: error.message || 'No se pudo guardar el producto',
        severity: 'error'
      });
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
        setSnackbar({
          open: true,
          message: 'Producto eliminado exitosamente',
          severity: 'success'
        });
        // fetchProducts(); // Refrescar si el hook no lo hace
      } catch (error) {
        console.error('Error deleting product:', error);
        setSnackbar({
          open: true,
          message: error.message || 'No se pudo eliminar el producto',
          severity: 'error'
        });
      } finally {
        setDeleting(false);
        setOpenConfirmDialog(false);
        setProductIdToDelete(null);
        // Asegurar refresco
        if (typeof fetchProducts === 'function') fetchProducts();
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Carga y Error (sin cambios)
  if (loading && !products?.length) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
    </Box>
  );
  if (error && !products?.length) return (
      <Typography color="error" variant="h6" sx={{ textAlign: 'center', my: 4 }}>
          Error al cargar productos: {typeof error === 'string' ? error : error?.message || 'Error desconocido'}
      </Typography>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Contenedor del botón "NUEVO PRODUCTO" */}
      {/* CORREGIDO: Usar justifyContent: 'flex-end' para alinear a la derecha */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {/* Usar ActionButton para controlar visibilidad */}
        {canCreate() && ( // Solo mostrar si puede crear
            <ActionButton
              type="create" // No necesita onClick aquí si se maneja en buttonProps
              tooltipTitle="Crear nuevo producto"
              buttonProps={{
                variant: "contained",
                startIcon: <AddIcon />,
                sx: { ...actionButtonStyle }, // Quitamos marginLeft: 'auto'
                onClick: () => { // onClick va dentro de buttonProps
                  setSelectedProduct(null);
                  setOpenForm(true);
                }
              }}
            >
              NUEVO PRODUCTO
            </ActionButton>
        )}
      </Box>

      {/* Resto del componente (Paper, ProductTable, etc. sin cambios) */}
      <Paper elevation={1} sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', bgcolor: '#1e1e1e' }}>
        <ProductTable
          products={products || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          isVisor={userRole === 'visor'}
        />
      </Paper>

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
          sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, px: 2 }}
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
        <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#2a2a2a', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button
            variant="outlined"
            onClick={handleCloseConfirmDialog}
            startIcon={<CancelIcon />}
            disabled={deleting}
            sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.3)', '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)', bgcolor: 'rgba(255, 255, 255, 0.05)' } }}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {userRole === 'visor' && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
          <InfoIcon sx={{ color: '#2196f3', mr: 1 }} />
          <Typography color="#2196f3">
            Modo de solo lectura: Como Visor, puedes ver todos los datos pero no puedes crear, editar o eliminar registros.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Products;