// src/pages/documents/Documents.js

// Mantén los imports necesarios
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
  Add as AddIcon
} from '@mui/icons-material';
import DocumentTable from './DocumentTable';
import DocumentFormModal from './components/DocumentFormModal';
import { getDocuments, deleteDocument } from '../../services/DocumentsApi';

const Documents = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [modalOpen, setModalOpen] = useState(false);

  // Cargar documentos
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Error al cargar documentos:', err);
      setError('Error al cargar los documentos. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Crear nuevo documento - modificado
  const handleCreateNew = () => {
    setModalOpen(true);
  };

  const handleModalClose = (success) => {
    setModalOpen(false);
    if (success) {
      // Recargar los documentos si se guardó correctamente
      fetchDocuments();
    }
  };

  // Solicitar eliminar documento
  const handleDeleteRequest = (id) => {
    const doc = documents.find(d => d._id === id);
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  // Confirmar eliminación
  const handleDeleteConfirm = async () => {
    try {
      await deleteDocument(documentToDelete._id);
      setDocuments(documents.filter(doc => doc._id !== documentToDelete._id));
      setSnackbar({
        open: true,
        message: 'Documento eliminado correctamente',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error al eliminar documento:', err);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el documento',
        severity: 'error'
      });
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
        {loading ? (
          <Typography>Cargando documentos...</Typography>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <DocumentTable
            documents={documents}
            onDelete={handleDeleteRequest}
          />
        )}
      </Paper>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
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
          <Button onClick={handleDeleteConfirm} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
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

      {/* Modal de formulario de documento */}
      <DocumentFormModal 
        open={modalOpen} 
        onClose={handleModalClose}
      />
    </>
  );
};

export default Documents;