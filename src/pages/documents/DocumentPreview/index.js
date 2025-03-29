import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Transform as ConvertIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useDocuments from '../../../hooks/useDocuments';
import useCompany from '../../../hooks/useCompany';
import { DOCUMENT_TYPE_NAMES, DOCUMENT_STATUS_NAMES } from '../constants/documentTypes';
import DocumentStatusChip from '../components/DocumentStatusChip';
import ConvertToInvoiceModal from '../components/ConvertToInvoiceModal';

// Reusing invoice preview components
import InvoiceHeader from '../../invoices/InvoicePreview/InvoiceHeader';
import ClientInfo from '../../invoices/InvoicePreview/ClientInfo';
import InvoiceFooter from '../../invoices/InvoicePreview/InvoiceFooter';

const DocumentPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, deleteDocument, convertToInvoice } = useDocuments();
  const { company } = useCompany();
  
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const data = await getDocument(id);
        setDocument(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error loading document');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id, getDocument]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: es });
  };

  // Format currency
  const formatCurrency = (amount, currency = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount || 0);
  };

  // Handle edit document
  const handleEdit = () => {
    navigate(`/documents/edit/${id}`);
  };

  // Handle go back
  const handleGoBack = () => {
    navigate('/documents');
  };

  // Handle delete document
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
      // Navigate back after short delay
      setTimeout(() => {
        navigate('/documents');
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error al eliminar el documento: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // Handle convert to invoice
  const handleConvertClick = () => {
    setConvertModalOpen(true);
  };

  const handleConvertConfirm = async (invoiceData) => {
    try {
      await convertToInvoice(id, invoiceData);
      setSnackbar({
        open: true,
        message: 'Documento convertido a factura correctamente',
        severity: 'success'
      });
      // Reload document to update status
      const updatedDoc = await getDocument(id);
      setDocument(updatedDoc);
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error al convertir a factura: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setConvertModalOpen(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mt: 2 }}>
          Volver a Documentos
        </Button>
      </Box>
    );
  }

  if (!document) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="warning">No se encontró el documento</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mt: 2 }}>
          Volver a Documentos
        </Button>
      </Box>
    );
  }

  // Check if document is converted (to disable some actions)
  const isConverted = document.status === 'CONVERTED';

  return (
    <>
      {/* Actions bar */}
      <Box sx={{ mb: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4">
                {DOCUMENT_TYPE_NAMES[document.type] || 'Documento'} #{document.documentNumber || 'Sin número'}
              </Typography>
              <DocumentStatusChip status={document.status} sx={{ ml: 2 }} />
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
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
              <Button
                variant="outlined"
                startIcon={<ConvertIcon />}
                onClick={handleConvertClick}
                disabled={isConverted}
              >
                Convertir a Factura
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                disabled={isConverted}
              >
                Editar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Document Preview */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4,
          "@media print": {
            boxShadow: "none",
            padding: 0
          }
        }}
        className="document-preview"
      >
        {/* Header with company and document info */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {company && (
                <>
                  {company.logo && (
                    <Box sx={{ mb: 2, maxWidth: 200 }}>
                      <img src={company.logo} alt={company.name} style={{ width: '100%' }} />
                    </Box>
                  )}
                  <Typography variant="h6">{company.name}</Typography>
                  <Typography variant="body2">{company.address}</Typography>
                  <Typography variant="body2">{company.postalCode}, {company.city}</Typography>
                  <Typography variant="body2">CIF/NIF: {company.taxId}</Typography>
                </>
              )}
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="h5" sx={{ color: 'primary.main', mb: 1 }}>
                {DOCUMENT_TYPE_NAMES[document.type]}
              </Typography>
              <Typography variant="h6">#{document.documentNumber || 'Sin número'}</Typography>
              <Typography variant="body2">Fecha: {formatDate(document.date)}</Typography>
              {document.expiryDate && (
                <Typography variant="body2">Válido hasta: {formatDate(document.expiryDate)}</Typography>
              )}
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Client Information */}
        {document.client && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Cliente:</Typography>
            <Typography variant="body1">{document.client.name}</Typography>
            <Typography variant="body2">{document.client.address}</Typography>
            <Typography variant="body2">{document.client.postalCode}, {document.client.city}</Typography>
            <Typography variant="body2">CIF/NIF: {document.client.taxId}</Typography>
          </Box>
        )}

        {/* Items Table */}
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell>Producto</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Impuesto</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {document.items && document.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="caption" color="textSecondary">{item.description}</Typography>
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(item.price, document.currency)}</TableCell>
                  <TableCell align="right">{item.taxRate}%</TableCell>
                  <TableCell align="right">{formatCurrency(item.total, document.currency)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Card variant="outlined" sx={{ width: 300 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">{formatCurrency(document.subtotal, document.currency)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Impuestos:</Typography>
                <Typography variant="body2">{formatCurrency(document.taxAmount, document.currency)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">Total:</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {formatCurrency(document.total, document.currency)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Notes and Terms */}
        {(document.notes || document.terms) && (
          <Box sx={{ mb: 3 }}>
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

      {/* Convert to Invoice Modal */}
      <ConvertToInvoiceModal
        open={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
        onConfirm={handleConvertConfirm}
        document={document}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar este documento? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
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

export default DocumentPreview;