// src/pages/documents/components/DocumentPreviewModal.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Paper,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Transform as TransformIcon
} from '@mui/icons-material';
import { getDocument, convertToInvoice } from '../../../services/DocumentsApi';
import { useCompany } from '../../../hooks/useCompany';
import { DOCUMENT_TYPE_NAMES, DOCUMENT_STATUS } from '../constants/documentTypes';

const DocumentPreviewModal = ({ open, onClose, documentId, onRefresh }) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const { company } = useCompany();

  useEffect(() => {
    const fetchDocument = async () => {
      if (documentId && open) {
        try {
          setLoading(true);
          const data = await getDocument(documentId);
          console.log("Documento cargado:", data);
          setDocument(data);
        } catch (error) {
          console.error("Error al cargar documento:", error);
          setSnackbar({
            open: true,
            message: "Error al cargar el documento",
            severity: "error"
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDocument();
  }, [documentId, open]);

  // Depurar items cuando cambia el documento
  useEffect(() => {
    if (document && document.items) {
      console.log("Items del documento:", document.items);
    }
  }, [document]);

  if (!open) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleConvert = async () => {
    if (!document || !documentId) {
      setSnackbar({
        open: true,
        message: "No hay documento válido para convertir",
        severity: "error"
      });
      return;
    }
    
    try {
      setConverting(true);
      console.log("Intentando convertir documento:", documentId);
      
      await convertToInvoice(documentId);
      
      setSnackbar({
        open: true,
        message: "Documento convertido a factura exitosamente",
        severity: "success"
      });
      
      // Recargar datos si es necesario
      if (typeof onRefresh === 'function') {
        onRefresh();
      }
      
      // Cerrar el modal después de un breve retraso
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Error al convertir documento:", error);
      setSnackbar({
        open: true,
        message: "Error al convertir documento a factura",
        severity: "error"
      });
    } finally {
      setConverting(false);
    }
  };

  // Formatear moneda
  const formatCurrency = (amount, currency = 'USD') => {
    if (amount === undefined || amount === null) return '—';
    
    if (currency === 'VES') {
      return `Bs.S ${new Intl.NumberFormat('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)}`;
    } else if (currency === 'USD') {
      return `USD ${new Intl.NumberFormat('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)}`;
    } else {
      // Para otras monedas
      return `${currency} ${new Intl.NumberFormat('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)}`;
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-VE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '80vh',
            maxHeight: '90vh',
            overflow: 'auto',
            backgroundColor: '#2a2a2a',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#1e1e1e', color: 'white', py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">
              {document ? DOCUMENT_TYPE_NAMES[document.type] || 'Documento' : 'Cargando...'}
              {document && ` #${document.documentNumber || ''}`}
            </Typography>
            <Box>
              <IconButton onClick={onClose} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3, bgcolor: '#2a2a2a' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress />
            </Box>
          ) : !document ? (
            <Typography variant="h6">No se pudo cargar el documento</Typography>
          ) : (
            <Paper sx={{ p: 4, bgcolor: '#333', color: 'white' }}>
              {/* Encabezado con datos de empresa y documento */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    De:
                  </Typography>
                  <Typography variant="h6">{company?.nombre || 'Transporte Express'}</Typography>
                  <Typography>{company?.direccion || 'Puerto Cabello'}</Typography>
                  {company?.ciudad && <Typography>{company.ciudad}</Typography>}
                  <Typography>RIF: {company?.rif || 'J-87789299383'}</Typography>
                  <Typography>Tel: {company?.telefono || '0663566772'}</Typography>
                  <Typography>Email: {company?.email || 'bit@gmail.com'}</Typography>
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

              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.12)' }} />

              {/* Información del cliente */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Para:
                </Typography>
                {document.client ? (
                  <>
                    <Typography variant="h6">{document.client.nombre || document.client.name}</Typography>
                    <Typography>{document.client.direccion || document.client.address || ''}</Typography>
                    <Typography>
                      {document.client.tipoDocumento === 'J' ? 'RIF: ' : 'C.I.: '}
                      {document.client.rif || document.client.documento || ''}
                    </Typography>
                    <Typography>Tel: {document.client.telefono || document.client.phone || ''}</Typography>
                    <Typography>Email: {document.client.email || ''}</Typography>
                  </>
                ) : (
                  <Typography>Cliente no especificado</Typography>
                )}
              </Box>

              {/* Tabla de productos */}
              <Box sx={{ mb: 4 }}>
                <Table sx={{ 
                  minWidth: 700, 
                  '& .MuiTableCell-root': { 
                    borderColor: 'rgba(255,255,255,0.12)',
                    color: 'white'
                  },
                  '& .MuiTableHead-root .MuiTableCell-root': {
                    backgroundColor: '#1e1e1e'
                  }
                }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto/Servicio</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="right">Precio</TableCell>
                      <TableCell align="center">IVA</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {document.items && document.items.length > 0 ? (
                      document.items.map((item, index) => {
                        // Obtener datos del producto de la manera más completa posible
                        const productName = 
                          item.descripcion || 
                          item.description || 
                          (typeof item.product === 'object' ? 
                            (item.product.nombre || item.product.name || item.product.descripcion) : 
                            '') ||
                          item.codigo || 
                          item.code ||
                          'Producto sin nombre';
                        
                        const quantity = item.quantity || 1;
                        const price = item.price || 0;
                        const itemTotal = quantity * price;
                        const taxStatus = item.taxExempt ? 'Exento' : '16%';
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>{productName}</TableCell>
                            <TableCell align="center">{quantity}</TableCell>
                            <TableCell align="right">
                              {formatCurrency(price, document.currency || 'VES')}
                            </TableCell>
                            <TableCell align="center">{taxStatus}</TableCell>
                            <TableCell align="right">
                              {formatCurrency(itemTotal, document.currency || 'VES')}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No hay productos en este documento
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>

              {/* Totales */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Paper 
                  sx={{ 
                    width: 300, 
                    p: 2, 
                    bgcolor: '#1e1e1e',
                    borderRadius: 1
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>{formatCurrency(document.subtotal, document.currency)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>IVA:</Typography>
                    <Typography>{formatCurrency(document.taxAmount, document.currency)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.12)' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {formatCurrency(document.total, document.currency)}
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              {/* Notas */}
              {document.notes && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Notas:</Typography>
                  <Typography>{document.notes}</Typography>
                </Box>
              )}

              {/* Términos */}
              {document.terms && (
                <Box>
                  <Typography variant="subtitle2">Términos y condiciones:</Typography>
                  <Typography>{document.terms}</Typography>
                </Box>
              )}
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ bgcolor: '#1e1e1e', p: 2, justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<TransformIcon />}
            onClick={handleConvert}
            disabled={!document || document.status === 'CONVERTED' || converting}
          >
            {converting ? 'Convirtiendo...' : 'Convertir a Factura'}
          </Button>
          <Box>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              Imprimir
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
            >
              Descargar PDF
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DocumentPreviewModal;