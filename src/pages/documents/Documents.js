// src/pages/documents/Documents.js
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
  Alert,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  CloudDownload as ExportIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import DocumentTable from './DocumentTable';
import { getDocuments, deleteDocument } from '../../services/DocumentsApi';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_NAMES } from './constants/documentTypes';

const Documents = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);

  // Cargar documentos
  useEffect(() => {
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

    fetchDocuments();
  }, []);

  // Menú de tipos de documento
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Crear nuevo documento
  const handleCreateNew = () => {
    navigate('/documents/new');
  };

  // Crear documento con tipo específico
  const handleCreateType = (type) => {
    navigate(`/documents/new?type=${type}`);
    handleMenuClose();
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
              >
                Nueva Cotización
              </Button>
              <IconButton size="small" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleCreateType(DOCUMENT_TYPES.QUOTE)}>
                  Nuevo Presupuesto
                </MenuItem>
                <MenuItem onClick={() => handleCreateType(DOCUMENT_TYPES.PROFORMA)}>
                  Nueva Factura Proforma
                </MenuItem>
                <MenuItem onClick={() => handleCreateType(DOCUMENT_TYPES.DELIVERY_NOTE)}>
                  Nueva Nota de Entrega
                </MenuItem>
              </Menu>
            </Box>
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
              ¿Está seguro de que desea eliminar el {DOCUMENT_TYPE_NAMES[documentToDelete.type]} 
              #{documentToDelete.documentNumber}?
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
    </>
  );
};

export default Documents;