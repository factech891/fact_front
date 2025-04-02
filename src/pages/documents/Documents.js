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
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DocumentTable from './DocumentTable';
import DocumentFormModal from './components/DocumentFormModal';
import { useDocuments } from '../../hooks/useDocuments';

const Documents = () => {
  // Incluimos fetchDocuments del hook
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
      // Forzamos una recarga de documentos después de guardar
      fetchDocuments();
      setSnackbar({ open: true, message: 'Operación completada correctamente', severity: 'success' });
    }
  };

  const handleDeleteRequest = (id) => {
    const doc = documents.find(d => d._id === id);
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDocument(documentToDelete._id);
      setSnackbar({ open: true, message: 'Documento eliminado correctamente', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al eliminar el documento', severity: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h4" component="h1">
              Cotizaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestione sus presupuestos, proformas y notas de entrega
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
              color="primary"
            >
              Nueva Cotización
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        {loading && documents.length === 0 ? (
          <Typography>Cargando documentos...</Typography>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <DocumentTable
            documents={documents}
            onDelete={handleDeleteRequest}
            onEdit={handleEdit}
            onRefresh={fetchDocuments} // Añadimos la función de recarga
          />
        )}
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          {documentToDelete && (
            <Typography>
              ¿Está seguro de que desea eliminar este documento?
              Esta acción no se puede deshacer.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <DocumentFormModal
        open={formOpen}
        onClose={handleFormClose}
        documentId={selectedDocumentId}
      />
    </>
  );
};

export default Documents;