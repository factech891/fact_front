// src/pages/products/Products.js - ESTILO NEGRO CON GRADIENTE AZUL
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
  Snackbar,
  Alert,
  LinearProgress,
  styled
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

// Componentes estilizados
const PageContainer = styled(Box)(({ theme }) => ({
  padding: '24px',
  backgroundColor: '#121212',
  color: 'white',
  minHeight: 'calc(100vh - 64px)',
  position: 'relative'
}));

const GradientButton = styled(Button)(({ theme }) => ({
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
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 24px',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 'calc(100vh - 64px)',
  backgroundColor: '#121212'
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  padding: '24px',
  backgroundColor: '#121212',
  color: 'white',
  minHeight: 'calc(100vh - 64px)'
}));

const Products = () => {
  const { userRole, canCreate } = useRoleAccess();
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, loading, error, saveProduct, deleteProduct, fetchProducts } = useProducts();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (product) => {
    setIsSubmitting(true);
    try {
      await saveProduct(product);
      setOpenForm(false);
      setSelectedProduct(null);
      setSnackbar({
        open: true,
        message: product._id ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente',
        severity: 'success'
      });
      if (typeof fetchProducts === 'function') await fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      setSnackbar({
        open: true,
        message: error.message || 'No se pudo guardar el producto',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
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
      setIsSubmitting(true);
      try {
        await deleteProduct(productIdToDelete);
        setSnackbar({
          open: true,
          message: 'Producto eliminado exitosamente',
          severity: 'success'
        });
        if (typeof fetchProducts === 'function') await fetchProducts();
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
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseConfirmDialog = () => {
    if (deleting) return;
    setOpenConfirmDialog(false);
    setProductIdToDelete(null);
  };

  const handleCloseForm = () => {
    if (isSubmitting) return;
    setOpenForm(false);
    setSelectedProduct(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Estados de carga y error
  if (loading && !products?.length) {
    return (
      <LoadingContainer>
        <CircularProgress sx={{ color: '#4facfe' }} />
        <Typography sx={{ color: 'white', ml: 2 }}>Cargando productos...</Typography>
      </LoadingContainer>
    );
  }

  if (error && !products?.length) {
    return (
      <ErrorContainer>
        <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
          Error al cargar los productos: {error.message || 'Error desconocido.'}
        </Alert>
      </ErrorContainer>
    );
  }

  return (
    <PageContainer>
      {/* Indicador de carga global */}
      {isSubmitting && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1500 }}>
          <LinearProgress 
            sx={{
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
              },
              backgroundColor: 'rgba(0,0,0,0.2)'
            }}
          />
        </Box>
      )}

      {/* Botón Nuevo Producto */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        {canCreate && canCreate() && (
          <GradientButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedProduct(null);
              setOpenForm(true);
            }}
            disabled={isSubmitting}
          >
            NUEVO PRODUCTO
          </GradientButton>
        )}
      </Box>

      {/* Tabla de productos */}
      <Box sx={{ mb: 3 }}>
        <ProductTable
          products={products || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading || isSubmitting}
          isVisor={userRole === 'visor'}
        />
      </Box>

      {/* Formulario Modal de Producto */}
      <ProductForm
        open={openForm}
        product={selectedProduct}
        onClose={handleCloseForm}
        onSave={handleSave}
      />

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        PaperProps={{ 
          sx: { 
            backgroundColor: '#2a2a2a', 
            color: 'white', 
            borderRadius: '8px', 
            border: '1px solid rgba(255, 255, 255, 0.1)' 
          } 
        }}
      >
        <StyledDialogTitle>
          Confirmar eliminación
          <IconButton 
            onClick={handleCloseConfirmDialog} 
            sx={{ color: 'white' }} 
            disabled={deleting}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handleCloseConfirmDialog} 
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.5)'
              } 
            }} 
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            sx={{ 
              background: 'linear-gradient(to right, #ff416c, #ff4b2b)', 
              boxShadow: '0 4px 15px rgba(255, 75, 43, 0.4)' 
            }} 
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alertas */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Mensaje para usuarios con rol visor */}
      {userRole === 'visor' && (
        <Box 
          sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: 'rgba(33, 150, 243, 0.1)', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center' 
          }}
        >
          <InfoIcon sx={{ color: '#2196f3', mr: 1 }} />
          <Typography color="#2196f3">
            Modo de solo lectura: Como Visor, puedes ver todos los datos pero no puedes crear, editar o eliminar registros.
          </Typography>
        </Box>
      )}
    </PageContainer>
  );
};

export default Products;