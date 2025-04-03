import React, { useState, useMemo } from 'react'; // Añadido useMemo
import {
    Box,
    Button,
    Typography,
    Snackbar,
    Alert,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    DeleteForever as DeleteIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { InvoiceTable } from './InvoiceTable';
import UnifiedDocumentForm from '../documents/UnifiedDocumentForm';
import { InvoicePreview } from './InvoicePreview/InvoicePreview';
import { useInvoices } from '../../hooks/useInvoices';
import { useClients } from '../../hooks/useClients';
import { useProducts } from '../../hooks/useProducts';
import { generatePDF } from '../../utils/pdfGenerator';

const Invoices = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [snackbarInfo, setSnackbarInfo] = useState({ open: false, message: '', severity: 'info' });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { invoices, loading: loadingInvoices, saveInvoice, deleteInvoice, changeInvoiceStatus } = useInvoices();
  const { clients, loading: loadingClients } = useClients();
  const { products, loading: loadingProducts } = useProducts();

  // Ordenar facturas por fecha descendente
  const sortedInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [invoices]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarInfo({ open: true, message, severity });
  };

  const processInvoiceData = (invoice) => {
     console.log('Procesando datos de factura:', invoice);
    if (!invoice) return null;
    try {
      const processedItems = invoice.items?.map(item => {
        const isExento = item.exentoIva === true || item.taxExempt === true;
        return {
          codigo: item.codigo || item.product?.codigo || '',
          descripcion: item.descripcion || item.product?.nombre || '',
          cantidad: parseFloat(item.quantity || item.cantidad) || 1,
          precioUnitario: parseFloat(item.price || item.precioUnitario) || 0,
          total: parseFloat(item.subtotal) ||
                (parseFloat(item.quantity || item.cantidad) || 1) * (parseFloat(item.price || item.precioUnitario) || 0),
          exentoIva: isExento
        };
      }) || [];
      const subtotal = processedItems.reduce((sum, item) => sum + item.total, 0);
      const iva = processedItems.reduce((sum, item) => {
        if (item.exentoIva !== true) { return sum + (item.total * 0.16); }
        return sum;
      }, 0);
      const total = subtotal + iva;
      const processedInvoice = { ...invoice, items: processedItems, subtotal, iva, total, moneda: invoice.moneda || 'VES' };
      console.log('Factura procesada:', processedInvoice);
      return processedInvoice;
    } catch (error) { console.error('Error procesando factura:', error); throw error; }
   };

  const handlePreview = (invoice) => {
    try {
      const processedInvoice = processInvoiceData(invoice);
      setSelectedInvoice(processedInvoice);
      setOpenPreview(true);
    } catch (error) {
      console.error('Error al procesar factura para vista previa:', error);
      showSnackbar('Error al cargar la vista previa: ' + error.message, 'error');
    }
  };

  const handleDownload = async (invoice) => {
    try {
      const processedInvoice = processInvoiceData(invoice);
      if (!processedInvoice) throw new Error("No se pudo procesar la factura.");
      setSelectedInvoice(processedInvoice);
      showSnackbar('Generando PDF...', 'info');
      await generatePDF(processedInvoice);
    } catch (error) {
      console.error('Error preparando/generando PDF:', error);
      showSnackbar('Error al generar el PDF: ' + error.message, 'error');
    }
  };

  const handleEdit = (invoice) => {
    console.log('Editando factura:', invoice);
    setSelectedInvoice(invoice);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    setInvoiceIdToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (invoiceIdToDelete) {
      setDeleting(true);
      try {
        await deleteInvoice(invoiceIdToDelete);
        showSnackbar('Factura eliminada exitosamente', 'success');
      } catch (err) {
        console.error('Error al eliminar la factura:', err);
        showSnackbar('Error al eliminar la factura: ' + (err.message || ''), 'error');
      } finally {
        setDeleting(false);
        setOpenConfirmDialog(false);
        setInvoiceIdToDelete(null);
      }
    }
  };

  const handleCloseConfirmDialog = () => {
    if (deleting) return;
    setOpenConfirmDialog(false);
    setInvoiceIdToDelete(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await changeInvoiceStatus(id, newStatus);
       const statusLabels = { draft: 'Borrador', pending: 'Pendiente', paid: 'Pagada', partial: 'Pago Parcial', overdue: 'Vencida', cancelled: 'Anulada' };
       const statusLabel = statusLabels[newStatus] || newStatus;
      showSnackbar(`Estado de la factura actualizado a "${statusLabel}"`, 'success');
    } catch (err) {
      console.error('Error al cambiar el estado de la factura:', err);
      showSnackbar('Error al cambiar el estado: ' + (err.message || ''), 'error');
    }
  };

  if (loadingInvoices || loadingClients) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
        </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}> {/* Añadido padding aquí */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedInvoice(null);
            setOpenForm(true);
          }}
          sx={{ marginLeft: 'auto' }}
        >
          NUEVA FACTURA
        </Button>
      </Box>

      <Paper elevation={1} sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', bgcolor: '#1e1e1e' }}>
        <InvoiceTable
          invoices={sortedInvoices} // Pasa la lista ordenada
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onStatusChange={handleStatusChange}
        />
      </Paper>

      <UnifiedDocumentForm
        open={openForm}
        initialData={selectedInvoice}
        clients={clients}
        products={products}
        onClose={() => {
          setOpenForm(false);
          setSelectedInvoice(null);
        }}
        onSave={async (data) => {
            try {
                await saveInvoice(data);
                showSnackbar(data._id ? 'Factura actualizada' : 'Factura creada', 'success');
            } catch(err) {
                 console.error("Error al guardar desde form:", err);
                 showSnackbar('Error al guardar: ' + (err.message || ''), 'error');
                 throw err;
            }
        }}
        isInvoice={true}
      />

      <InvoicePreview
        open={openPreview}
        invoice={selectedInvoice}
        onClose={() => {
          setOpenPreview(false);
          setSelectedInvoice(null);
        }}
      />

      <Snackbar
        open={snackbarInfo.open}
        autoHideDuration={6000}
        onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
          severity={snackbarInfo.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarInfo.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
        disableEscapeKeyDown={deleting}
        PaperProps={{ sx: { bgcolor: '#1e1e1e', backgroundImage: 'none', border: '1px solid rgba(255, 255, 255, 0.1)' } }}
      >
        <DialogTitle
          id="confirm-delete-dialog-title"
          sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, px: 2 }}
        >
          Confirmar Eliminación
          <IconButton onClick={handleCloseConfirmDialog} sx={{ color: 'white' }} disabled={deleting}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: '#1e1e1e', color: 'rgba(255, 255, 255, 0.8)' }}>
          <DialogContentText id="confirm-delete-dialog-description" sx={{ color: 'inherit' }}>
            ¿Está seguro de que desea eliminar esta factura? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#2a2a2a', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} >
          <Button
            variant="outlined"
            onClick={handleCloseConfirmDialog}
            startIcon={<CancelIcon />}
            disabled={deleting}
            sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.3)', '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)', bgcolor: 'rgba(255, 255, 255, 0.05)' } }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Invoices;