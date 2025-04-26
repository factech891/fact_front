// src/pages/documents/Documents.js - VERSIÓN MEJORADA CON ESTILO NEGRO
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
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
import DocumentTable from './DocumentTable';
import DocumentFormModal from './components/DocumentFormModal';
import { useDocuments } from '../../hooks/useDocuments';
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

const StyledAlert = styled(Alert)(({ theme }) => ({
  width: '100%',
  borderRadius: '8px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
}));

const Documents = () => {
  // Obtener funciones de permiso del hook
  const { canCreate } = useRoleAccess();

  const {
    documents,
    loading,
    error,
    deleteDocument,
    fetchDocuments
  } = useDocuments();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateNew = () => {
    if (!canCreate()) {
        console.warn("Intento de crear sin permisos.");
        setSnackbar({ open: true, message: 'No tienes permisos para crear documentos.', severity: 'warning' });
        return;
    }
    console.log('Abriendo formulario para nueva cotización');
    setSelectedDocumentId(null);
    setFormOpen(true);
  };

  const handleEdit = (id) => {
    console.log('Abriendo formulario para editar documento con ID:', id);
    setSelectedDocumentId(id);
    setFormOpen(true);
  };

  const handleFormClose = (success) => {
    setFormOpen(false);
    setSelectedDocumentId(null);
    if (success) {
      fetchDocuments(); // Refrescar datos si hubo éxito
      setSnackbar({ open: true, message: 'Operación completada correctamente', severity: 'success' });
    }
  };

  const handleDeleteRequest = (id) => {
    const doc = documents.find(d => d._id === id);
    if (!doc) {
        console.error("Documento no encontrado para eliminar:", id);
        setSnackbar({ open: true, message: 'Error: Documento no encontrado.', severity: 'error' });
        return;
    }
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if(deleting) return;
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  }

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;
    setDeleting(true);
    setIsSubmitting(true);
    try {
      await deleteDocument(documentToDelete._id);
      setSnackbar({ open: true, message: 'Documento eliminado correctamente', severity: 'success' });
    } catch (err) {
      console.error("Error eliminando documento:", err)
      setSnackbar({ open: true, message: 'Error al eliminar el documento: ' + (err.message || 'Error desconocido'), severity: 'error' });
    } finally {
      setDeleting(false);
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
      fetchDocuments();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Indicador de carga principal
  if (loading && documents.length === 0) {
      return (
          <LoadingContainer>
            <CircularProgress sx={{ color: '#4facfe' }} />
            <Typography sx={{ color: 'white', ml: 2 }}>Cargando documentos...</Typography>
          </LoadingContainer>
      );
  }
  
  // Manejo de error principal
  if (error && documents.length === 0) {
      return (
          <PageContainer>
            <StyledAlert severity="error" variant="filled">
              Error al cargar documentos: {typeof error === 'string' ? error : error?.message || 'Error desconocido'}
            </StyledAlert>
          </PageContainer>
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

      {/* Botón Nueva Cotización */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        {canCreate() && (
          <GradientButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            disabled={isSubmitting}
          >
            NUEVA COTIZACIÓN
          </GradientButton>
        )}
      </Box>

      {/* Tabla de documentos con estilo unificado */}
      <Box sx={{ mb: 3 }}>
        {loading && documents.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} sx={{ color: '#4facfe' }} />
          </Box>
        )}
        
        {error && (
          <StyledAlert severity="error" variant="filled" sx={{ mb: 2 }}>
            Error: {typeof error === 'string' ? error : error?.message || 'No se pudieron cargar/actualizar los documentos'}
          </StyledAlert>
        )}
        
        {!(error && documents.length === 0) && (
          <DocumentTable
            documents={documents || []}
            onDelete={handleDeleteRequest}
            onEdit={handleEdit}
            onRefresh={fetchDocuments}
          />
        )}
      </Box>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        disableEscapeKeyDown={deleting}
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
            onClick={handleCloseDeleteDialog} 
            sx={{ color: 'white' }} 
            disabled={deleting}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          {documentToDelete && (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              ¿Está seguro de que desea eliminar el documento <Typography component="span" fontWeight="bold" sx={{ color: 'white' }}>{documentToDelete.documentNumber}</Typography>? Esta acción no se puede deshacer.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handleCloseDeleteDialog}
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
            onClick={handleDeleteConfirm} 
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

      {/* Snackbar para mensajes */}
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
          sx={{ 
            width: '100%',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
            borderRadius: '8px',
            ...(snackbar.severity === 'success' && {
              backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
              '& .MuiAlert-icon': { color: 'white' },
              color: 'white'
            })
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Modal de formulario de documento */}
      <DocumentFormModal
        open={formOpen}
        onClose={handleFormClose}
        documentId={selectedDocumentId}
      />
    </PageContainer>
  );
};

export default Documents;