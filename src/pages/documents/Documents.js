// src/pages/documents/Documents.js (CORREGIDO)
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Close as CloseIcon, DeleteForever as DeleteIcon, Cancel as CancelIcon } from '@mui/icons-material';
import DocumentTable from './DocumentTable';
import DocumentFormModal from './components/DocumentFormModal';
import { useDocuments } from '../../hooks/useDocuments';
// Importar el hook de acceso por rol
import { useRoleAccess } from '../../hooks/useRoleAccess'; // Ajusta la ruta si es necesario

const Documents = () => {
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

  const handleCreateNew = () => {
    // Verificar permiso antes de abrir (aunque el botón ya estará oculto)
    if (!canCreate()) {
        console.warn("Intento de crear sin permisos.");
        setSnackbar({ open: true, message: 'No tienes permisos para crear documentos.', severity: 'warning' });
        return;
    }
    console.log('Abriendo formulario para nueva cotización');
    setSelectedDocumentId(null);
    setFormOpen(true);
  };

  // handleEdit no necesita chequeo de permiso aquí,
  // porque se llama desde DocumentTable -> DocumentActions, donde ya se verifica canEdit
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

  // handleDeleteRequest no necesita chequeo de permiso aquí,
  // porque se llama desde DocumentTable -> DocumentActions, donde ya se verifica canDelete
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
    try {
      await deleteDocument(documentToDelete._id);
      setSnackbar({ open: true, message: 'Documento eliminado correctamente', severity: 'success' });
      // fetchDocuments(); // useDocuments hook debería manejar la actualización tras borrar
    } catch (err) {
      console.error("Error eliminando documento:", err)
      setSnackbar({ open: true, message: 'Error al eliminar el documento: ' + (err.message || 'Error desconocido'), severity: 'error' });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
       // Asegurarse de refrescar por si el hook no lo hizo automáticamente
       fetchDocuments();
    }
  };

  // Indicador de carga principal (sin cambios)
  if (loading && documents.length === 0) {
      return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
              <CircularProgress />
          </Box>
      );
  }
  // Manejo de error principal (sin cambios)
  if (error && documents.length === 0) {
      return (
          <Box sx={{ p: 3 }}>
              <Alert severity="error">Error al cargar documentos: {typeof error === 'string' ? error : error?.message || 'Error desconocido'}</Alert>
          </Box>
      );
  }


  return (
    <Box sx={{p: 3}}>
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
          {/* Renderizar el botón solo si el usuario tiene permiso para crear */}
          {canCreate() && (
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
                sx={{
                  ...actionButtonStyle,
                }}
              >
                NUEVA COTIZACIÓN
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Resto del componente (Paper, DocumentTable, Dialogs, Snackbar, DocumentFormModal) sin cambios */}
      <Paper sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', bgcolor: '#1e1e1e' }}>
         {loading && documents.length > 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={24} /></Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>Error: {typeof error === 'string' ? error : error?.message || 'No se pudieron cargar/actualizar los documentos'}</Alert>
          ) : null}
          { !(error && documents.length === 0) &&
            <DocumentTable
              documents={documents || []}
              onDelete={handleDeleteRequest} // Pasa la función para solicitar borrado
              onEdit={handleEdit}           // Pasa la función para editar
              onRefresh={fetchDocuments}    // Pasa la función para refrescar
              // onConvertToInvoice se maneja dentro de DocumentTable/DocumentActions
            />
           }
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} disableEscapeKeyDown={deleting}>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, px: 2 }}>
            Confirmar eliminación
             <IconButton onClick={handleCloseDeleteDialog} sx={{ color: 'white' }} disabled={deleting}>
                 <CloseIcon />
             </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: '#1e1e1e', color: 'rgba(255, 255, 255, 0.8)' }}>
          {documentToDelete && (
            <Typography sx={{ color: 'inherit' }}>
              ¿Está seguro de que desea eliminar el documento <Typography component="span" fontWeight="bold">{documentToDelete.documentNumber}</Typography>? Esta acción no se puede deshacer.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#2a2a2a', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button
             variant="outlined"
             onClick={handleCloseDeleteDialog}
             startIcon={<CancelIcon />}
             disabled={deleting}
             sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.3)', '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)', bgcolor: 'rgba(255, 255, 255, 0.05)' } }}
            >
                Cancelar
            </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            >
               {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* El modal de formulario se renderiza aquí, pero se abre/cierra con estado */}
      {/* No necesita chequeo de permiso aquí porque handleCreateNew ya lo hace */}
      <DocumentFormModal
        open={formOpen}
        onClose={handleFormClose}
        documentId={selectedDocumentId} // Pasa null para crear, o un ID para editar
      />
    </Box>
  );
};

export default Documents;