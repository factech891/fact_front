// src/pages/invoices/Invoices.js - VERSIÓN MEJORADA CON ESTILO NEGRO
import React, { useState, useMemo } from 'react';
import {
    Box,
    Button,
    Typography,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    CircularProgress,
    LinearProgress,
    styled
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    DeleteForever as DeleteIcon,
    Cancel as CancelIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { InvoiceTable } from './InvoiceTable';
import UnifiedDocumentForm from '../documents/UnifiedDocumentForm';
import { InvoicePreview } from './InvoicePreview/InvoicePreview';
import { useInvoices } from '../../hooks/useInvoices';
import { useClients } from '../../hooks/useClients';
import { useProducts } from '../../hooks/useProducts';
import { generatePDF } from '../../utils/pdfGenerator';
import { useRoleAccess } from '../../hooks/useRoleAccess';

// Componentes estilizados
const PageContainer = styled(Box)(({ theme }) => ({
  padding: '24px',
  backgroundColor: '#121212',
  color: 'white',
  minHeight: 'calc(100vh - 64px)',
  position: 'relative'
}));

const GradientButton = styled(Button)(({ theme }) => ({
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
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 24px',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 'calc(100vh - 64px)',
  backgroundColor: '#121212'
}));

const Invoices = () => {
  // Obtener permisos del hook
  const { canCreate } = useRoleAccess();

  const [openForm, setOpenForm] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [snackbarInfo, setSnackbarInfo] = useState({ open: false, message: '', severity: 'info' });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { invoices, loading: loadingInvoices, saveInvoice, deleteInvoice, changeInvoiceStatus, fetchInvoices } = useInvoices();
  const { clients, loading: loadingClients } = useClients();
  const { products, loading: loadingProducts } = useProducts();

  // Ordenar facturas por fecha descendente
  const sortedInvoices = useMemo(() => {
    if (!invoices) return [];
    return [...invoices].sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
    });
  }, [invoices]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarInfo({ open: true, message, severity });
  };

  // Función para procesar datos
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
        // Asumiendo IVA del 16% si no es exento
        if (item.exentoIva !== true) { return sum + (item.total * 0.16); }
        return sum;
      }, 0);
      const total = subtotal + iva;
      const processedInvoice = { ...invoice, items: processedItems, subtotal, iva, total, moneda: invoice.moneda || 'VES' };
      console.log('Factura procesada:', processedInvoice);
      return processedInvoice;
    } catch (error) { 
      console.error('Error procesando factura:', error); 
      throw error; 
    }
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
    setIsSubmitting(true);
    try {
      const processedInvoice = processInvoiceData(invoice);
      if (!processedInvoice) throw new Error("No se pudo procesar la factura.");
      setSelectedInvoice(processedInvoice);
      showSnackbar('Generando PDF...', 'info');
      await generatePDF(processedInvoice);
    } catch (error) {
      console.error('Error preparando/generando PDF:', error);
      showSnackbar('Error al generar el PDF: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
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
      setIsSubmitting(true);
      try {
        await deleteInvoice(invoiceIdToDelete);
        showSnackbar('Factura eliminada exitosamente', 'success');
      } catch (err) {
        console.error('Error al eliminar la factura:', err);
        showSnackbar('Error al eliminar la factura: ' + (err.message || 'Error desconocido'), 'error');
      } finally {
        setDeleting(false);
        setIsSubmitting(false);
        setOpenConfirmDialog(false);
        setInvoiceIdToDelete(null);
        if (typeof fetchInvoices === 'function') fetchInvoices();
      }
    }
  };

  const handleCloseConfirmDialog = () => {
    if (deleting) return;
    setOpenConfirmDialog(false);
    setInvoiceIdToDelete(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    setIsSubmitting(true);
    try {
      await changeInvoiceStatus(id, newStatus);
      const statusLabels = { 
        draft: 'Borrador', 
        pending: 'Pendiente', 
        paid: 'Pagada', 
        partial: 'Pago Parcial', 
        overdue: 'Vencida', 
        cancelled: 'Anulada' 
      };
      const statusLabel = statusLabels[newStatus] || newStatus;
      showSnackbar(`Estado de la factura actualizado a "${statusLabel}"`, 'success');
      if (typeof fetchInvoices === 'function') fetchInvoices();
    } catch (err) {
      console.error('Error al cambiar el estado de la factura:', err);
      showSnackbar('Error al cambiar el estado: ' + (err.message || 'Error desconocido'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Indicador de carga principal
  if (loadingInvoices || loadingClients) {
    return (
      <LoadingContainer>
        <CircularProgress sx={{ color: '#4facfe' }} />
        <Typography sx={{ color: 'white', ml: 2 }}>Cargando facturas...</Typography>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      {/* Indicador de carga global para acciones */}
      {isSubmitting && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1500 }}>
          <LinearProgress 
            sx={{
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
              },
              backgroundColor: 'rgba(0,0,0,0.2)'
            }}
          />
        </Box>
      )}

      {/* Botón Nueva Factura */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        {canCreate() && (
          <GradientButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedInvoice(null);
              setOpenForm(true);
            }}
            disabled={isSubmitting}
          >
            NUEVA FACTURA
          </GradientButton>
        )}
      </Box>

      {/* Tabla de facturas con estilo unificado */}
      <Box sx={{ mb: 3 }}>
        <InvoiceTable
          invoices={sortedInvoices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onStatusChange={handleStatusChange}
        />
      </Box>

      {/* Modal de Formulario Unificado */}
      <UnifiedDocumentForm
        open={openForm}
        initialData={selectedInvoice}
        clients={clients || []}
        products={products || []}
        onClose={() => {
          setOpenForm(false);
          setSelectedInvoice(null);
        }}
        onSave={async (data) => {
          setIsSubmitting(true);
          try {
            await saveInvoice(data);
            showSnackbar(data._id ? 'Factura actualizada correctamente' : 'Factura creada correctamente', 'success');
            setOpenForm(false);
            setSelectedInvoice(null);
            if (typeof fetchInvoices === 'function') fetchInvoices();
          } catch(err) {
            console.error("Error al guardar desde form:", err);
            showSnackbar('Error al guardar la factura: ' + (err.message || 'Error desconocido'), 'error');
          } finally {
            setIsSubmitting(false);
          }
        }}
        isInvoice={true}
      />

      {/* Modal de Vista Previa */}
      <InvoicePreview
        open={openPreview}
        invoice={selectedInvoice}
        onClose={() => {
          setOpenPreview(false);
          setSelectedInvoice(null);
        }}
      />

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        disableEscapeKeyDown={deleting}
        PaperProps={{ 
          sx: { 
            backgroundColor: '#2a2a2a', 
            color: 'white', 
            borderRadius: '8px', 
            border: '1px solid rgba(255, 255, 255, 0.1)' 
          } 
        }}
      >
        <StyledDialogTitle>
          Confirmar eliminación
          <IconButton 
            onClick={handleCloseConfirmDialog} 
            sx={{ color: 'white' }} 
            disabled={deleting}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
            ¿Está seguro de que desea eliminar esta factura? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handleCloseConfirmDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              fontWeight: 600,
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.5)'
              } 
            }} 
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained" 
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            sx={{ 
              background: 'linear-gradient(to right, #ff416c, #ff4b2b)', 
              boxShadow: '0 4px 15px rgba(255, 75, 43, 0.4)',
              fontWeight: 600
            }} 
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbarInfo.open}
        autoHideDuration={6000}
        onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
          severity={snackbarInfo.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
            borderRadius: '8px',
            ...(snackbarInfo.severity === 'success' && {
              backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
              '& .MuiAlert-icon': { color: 'white' },
              color: 'white'
            })
          }}
        >
          {snackbarInfo.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default Invoices;