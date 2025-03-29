// src/pages/documents/DocumentPreview/index.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Transform as ConvertIcon
} from '@mui/icons-material';

// Importar servicios y constantes
import { getDocument, deleteDocument, convertToInvoice } from '../../../services/DocumentsApi';
import { DOCUMENT_TYPE_NAMES, DOCUMENT_STATUS, DOCUMENT_STATUS_NAMES, DOCUMENT_STATUS_COLORS } from '../constants/documentTypes';
import ConvertToInvoiceModal from '../components/ConvertToInvoiceModal';

const DocumentPreview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Estados
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Cargar documento
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const data = await getDocument(id);
        setDocument(data);
      } catch (err) {
        console.error('Error al cargar documento:', err);
        setError('Error al cargar el documento');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDocument();
    }
  }, [id]);
  
  // Volver a la lista
  const handleGoBack = () => {
    navigate('/documents');
  };
  
  // Ir a editar
  const handleEdit = () => {
    navigate(`/documents/edit/${id}`);
  };
  
  // Eliminar documento
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await deleteDocument(id);
      setSnackbar({
        open: true,
        message: 'Documento eliminado correctamente',
        severity: 'success'
      });
      // Redirigir a la lista después de un breve delay
      setTimeout(() => {
        navigate('/documents');
      }, 1500);
    } catch (err) {
      console.error('Error al eliminar documento:', err);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el documento',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  
  // Abrir modal para convertir a factura
  const handleConvertClick = () => {
    setConvertModalOpen(true);
  };
  
  // Manejar confirmación de conversión a factura
  const handleConvertConfirm = async (invoiceData) => {
    try {
      await convertToInvoice(id, invoiceData);
      // Recargar el documento para ver el estado actualizado
      const updatedDoc = await getDocument(id);
      setDocument(updatedDoc);
      
      setSnackbar({
        open: true,
        message: 'Documento convertido a factura correctamente',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error al convertir a factura:', err);
      setSnackbar({
        open: true,
        message: 'Error al convertir el documento a factura',
        severity: 'error'
      });
    } finally {
      setConvertModalOpen(false);
    }
  };
  
  // Imprimir documento
  const handlePrint = () => {
    window.print();
  };
  
  // Formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Formatear moneda
  const formatCurrency = (amount, currency = 'EUR') => {
    if (amount === undefined || amount === null) return '—';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  if (loading) {
    return <Typography>Cargando documento...</Typography>;
  }
  
  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mt: 2 }}>
          Volver a la lista
        </Button>
      </Box>
    );
  }
  
  if (!document) {
    return (
      <Box>
        <Alert severity="warning">Documento no encontrado</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mt: 2 }}>
          Volver a la lista
        </Button>
      </Box>
    );
  }
  
  // Verificar si el documento ya está convertido a factura
  const isConverted = document.status === DOCUMENT_STATUS.CONVERTED;
  
  return (
    <Box>
      {/* Cabecera con acciones */}
      <Box sx={{ mb: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4">
                {DOCUMENT_TYPE_NAMES[document.type]} #{document.documentNumber || '—'}
              </Typography>
              <Chip 
                label={DOCUMENT_STATUS_NAMES[document.status]} 
                color={DOCUMENT_STATUS_COLORS[document.status]}
                size="small"
                sx={{ ml: 2 }}
              />
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!isConverted && (
                <Button
                  variant="outlined"
                  startIcon={<ConvertIcon />}
                  onClick={handleConvertClick}
                >
                  Convertir a Factura
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
              >
                Imprimir
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
              >
                Descargar PDF
              </Button>
              {!isConverted && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Editar
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Documento */}
      <Paper sx={{ p: 4, mb: 4 }}>
        {/* Encabezado */}
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              De:
            </Typography>
            {document.company ? (
              <>
                <Typography variant="h6">{document.company.name}</Typography>
                <Typography>{document.company.address}</Typography>
                <Typography>{document.company.city}, {document.company.postalCode}</Typography>
                <Typography>CIF/NIF: {document.company.taxId}</Typography>
              </>
            ) : (
              <Typography>Información de empresa no disponible</Typography>
            )}
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="h5" color="primary">
              {DOCUMENT_TYPE_NAMES[document.type]}
            </Typography>
            <Typography variant="h6">#{document.documentNumber || '—'}</Typography>
            <Typography>Fecha: {formatDate(document.date)}</Typography>
            {document.expiryDate && (
              <Typography>Válido hasta: {formatDate(document.expiryDate)}</Typography>
            )}
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Cliente */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Para:
          </Typography>
          {document.client ? (
            <>
              <Typography variant="h6">{document.client.name}</Typography>
              <Typography>{document.client.address}</Typography>
              <Typography>{document.client.city}, {document.client.postalCode}</Typography>
              <Typography>CIF/NIF: {document.client.taxId}</Typography>
            </>
          ) : (
            <Typography>Cliente no especificado</Typography>
          )}
        </Box>
        
        {/* Tabla de ítems */}
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell>Producto/Servicio</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">IVA</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {document.items && document.items.length > 0 ? (
                document.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2">{item.name}</Typography>
                      {item.description && (
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.price, document.currency)}
                    </TableCell>
                    <TableCell align="right">{item.taxRate}%</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.total, document.currency)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay items en este documento
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Totales */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Paper variant="outlined" sx={{ width: 300, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">
                {formatCurrency(document.subtotal, document.currency)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">IVA:</Typography>
              <Typography variant="body2">
                {formatCurrency(document.taxAmount, document.currency)}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">Total:</Typography>
              <Typography variant="subtitle2" fontWeight="bold">
                {formatCurrency(document.total, document.currency)}
              </Typography>
            </Box>
          </Paper>
        </Box>
        
        {/* Notas y términos */}
        {(document.notes || document.terms) && (
          <Box>
            {document.notes && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Notas:</Typography>
                <Typography variant="body2">{document.notes}</Typography>
              </Box>
            )}
            {document.terms && (
              <Box>
                <Typography variant="subtitle2">Términos y condiciones:</Typography>
                <Typography variant="body2">{document.terms}</Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
      
      {/* Botón eliminar (fuera del documento) */}
      {!isConverted && (
        <Box sx={{ textAlign: 'right' }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Eliminar Documento
          </Button>
        </Box>
      )}
      
      {/* Modal de conversión a factura */}
      <ConvertToInvoiceModal
        open={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
        onConfirm={handleConvertConfirm}
        document={document}
      />
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar este {DOCUMENT_TYPE_NAMES[document.type]}?
            Esta acción no se puede deshacer.
          </DialogContentText>
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
    </Box>
  );
};

export default DocumentPreview;