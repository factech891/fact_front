import React, { useState } from 'react';
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
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  CloudDownload as ExportIcon
} from '@mui/icons-material';
import DocumentTable from './DocumentTable';
import useDocuments from '../../hooks/useDocuments';
import NewDocumentTypeSelector from './components/NewDocumentTypeSelector';

const Documents = () => {
  const navigate = useNavigate();
  const { documents, loading, error, deleteDocument } = useDocuments();

  // Estados para UI interactions
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);

  // Handle create new document click - ahora abre el selector
  const handleCreateNew = () => {
    setTypeSelectorOpen(true);
  };

  // Handle document delete
  const handleDeleteRequest = (id) => {
    const document = documents.find(doc => doc._id === id);
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDocument(documentToDelete._id);
      setSnackbar({
        open: true,
        message: 'Documento eliminado correctamente',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error al eliminar el documento: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  // Handle document send
  const handleSendDocument = (id) => {
    // Implementation for sending document
    setSnackbar({
      open: true,
      message: 'Funcionalidad de envío no implementada',
      severity: 'info'
    });
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
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FilterIcon />}
              >
                Filtrar
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ExportIcon />}
              >
                Exportar
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
                sx={{ ml: 1 }}
              >
                Nueva Cotización
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        {loading ? (
          <Typography>Cargando documentos...</Typography>
        ) : error ? (
          <Alert severity="error">Error al cargar los documentos: {error}</Alert>
        ) : (
          <DocumentTable
            documents={documents}
            onDelete={handleDeleteRequest}
            onSend={handleSendDocument}
          />
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar este documento?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Documento Type Selector */}
      <NewDocumentTypeSelector 
        open={typeSelectorOpen}
        onClose={() => setTypeSelectorOpen(false)}
      />

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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
    </>
  );
};

export default Documents;