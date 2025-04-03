// src/pages/documents/Documents.js - CORREGIDO CON IMPORT IconButton
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
  IconButton // <--- CORREGIDO: Importación añadida
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
// Importar los iconos del diálogo de borrado
import { Close as CloseIcon, DeleteForever as DeleteIcon, Cancel as CancelIcon } from '@mui/icons-material';
import DocumentTable from './DocumentTable';
import DocumentFormModal from './components/DocumentFormModal';
import { useDocuments } from '../../hooks/useDocuments';

const Documents = () => {
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
      fetchDocuments();
      setSnackbar({ open: true, message: 'Operación completada correctamente', severity: 'success' });
    }
  };

  const handleDeleteRequest = (id) => {
    const doc = documents.find(d => d._id === id);
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
      // fetchDocuments(); // Descomentar si deleteDocument no refresca la lista
    } catch (err) {
      console.error("Error eliminando documento:", err)
      setSnackbar({ open: true, message: 'Error al eliminar el documento: ' + (err.message || ''), severity: 'error' });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  // Indicador de carga principal
  if (loading && documents.length === 0) {
      return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
              <CircularProgress />
          </Box>
      );
  }
  // Manejo de error principal
  if (error && documents.length === 0) {
      return (
          <Box sx={{ p: 3 }}>
              <Alert severity="error">Error al cargar documentos: {typeof error === 'string' ? error : error?.message || 'Error desconocido'}</Alert>
          </Box>
      );
  }


  return (
    <Box sx={{p: 3}}>
      {/* --- Bloque Modificado --- */}
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
          {/* Grid item del título eliminado */}
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
              color="primary"
              // Añadido sx para asegurar margen si es necesario, aunque flex-end debería bastar
              // sx={{ marginLeft: 'auto' }} // Probablemente no necesario con Grid y flex-end
            >
              Nueva Cotización
            </Button>
          </Grid>
        </Grid>
      </Box>
      {/* --- Fin Bloque Modificado --- */}


      <Paper sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', bgcolor: '#1e1e1e' }}>
         {/* Contenido de la tabla con mejor manejo de loading/error dentro */}
         {loading && documents.length > 0 ? ( // Mostrar un spinner pequeño si ya hay datos pero se recarga
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={24} /></Box>
          ) : error ? ( // Mostrar error incluso si hay datos viejos
            <Alert severity="error" sx={{ m: 2 }}>Error: {typeof error === 'string' ? error : error?.message || 'No se pudieron cargar/actualizar los documentos'}</Alert>
          ) : null}
          {/* La tabla siempre se renderiza si hay documentos o no hay error */}
          { !(error && documents.length === 0) && // Evitar renderizar tabla vacía si hubo error inicial
            <DocumentTable
              documents={documents || []}
              onDelete={handleDeleteRequest}
              onEdit={handleEdit}
              onRefresh={fetchDocuments}
            />
           }
      </Paper>

      {/* Diálogo de confirmación de borrado */}
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
              ¿Está seguro de que desea eliminar el documento? Esta acción no se puede deshacer.
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

      {/* Snackbar para notificaciones */}
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

      {/* Modal del formulario */}
      <DocumentFormModal
        open={formOpen}
        onClose={handleFormClose}
        documentId={selectedDocumentId}
      />
    </Box>
  );
};

export default Documents;