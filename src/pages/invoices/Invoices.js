// src/pages/invoices/Invoices.js (CORREGIDO - Ocultar botón Nueva Factura)
import React, { useState, useMemo } from 'react';
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
import { InvoiceTable } from './InvoiceTable'; // Asegúrate que la ruta sea correcta
import UnifiedDocumentForm from '../documents/UnifiedDocumentForm'; // Ajusta ruta si es necesario
import { InvoicePreview } from './InvoicePreview/InvoicePreview'; // Ajusta ruta si es necesario
import { useInvoices } from '../../hooks/useInvoices'; // Ajusta ruta si es necesario
import { useClients } from '../../hooks/useClients'; // Ajusta ruta si es necesario
import { useProducts } from '../../hooks/useProducts'; // Ajusta ruta si es necesario
import { generatePDF } from '../../utils/pdfGenerator'; // Ajusta ruta si es necesario
// Importar el hook de acceso por rol
import { useRoleAccess } from '../../hooks/useRoleAccess'; // Ajusta la ruta si es necesario

const Invoices = () => {
  // Estilo para botones de acción (sin cambios)
  const actionButtonStyle = {
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
     '&.Mui-disabled': { // Estilo para botón deshabilitado si se usara
      backgroundImage: 'linear-gradient(to right, #919191 0%, #b7b7b7 100%)',
      color: 'rgba(255, 255, 255, 0.6)',
      boxShadow: 'none',
      cursor: 'not-allowed'
    }
  };

  // Obtener permisos del hook
  const { canCreate } = useRoleAccess();

  const [openForm, setOpenForm] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [snackbarInfo, setSnackbarInfo] = useState({ open: false, message: '', severity: 'info' });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { invoices, loading: loadingInvoices, saveInvoice, deleteInvoice, changeInvoiceStatus, fetchInvoices } = useInvoices(); // Añadir fetchInvoices si no está
  const { clients, loading: loadingClients } = useClients();
  const { products, loading: loadingProducts } = useProducts();

  // Ordenar facturas por fecha descendente (sin cambios)
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

  // Función para procesar datos (sin cambios)
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
    } catch (error) { console.error('Error procesando factura:', error); throw error; }
   };

  // Funciones de manejo (handlePreview, handleDownload, etc. sin cambios en lógica principal)
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

  // handleEdit no necesita chequeo aquí, se verifica en InvoiceActions
  const handleEdit = (invoice) => {
    console.log('Editando factura:', invoice);
    setSelectedInvoice(invoice);
    setOpenForm(true);
  };

  // handleDelete no necesita chequeo aquí, se verifica en InvoiceActions
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
        // fetchInvoices(); // Refrescar datos si el hook no lo hace automáticamente
      } catch (err) {
        console.error('Error al eliminar la factura:', err);
        showSnackbar('Error al eliminar la factura: ' + (err.message || 'Error desconocido'), 'error');
      } finally {
        setDeleting(false);
        setOpenConfirmDialog(false);
        setInvoiceIdToDelete(null);
        // Asegurar refresco
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
    try {
      await changeInvoiceStatus(id, newStatus);
       const statusLabels = { draft: 'Borrador', pending: 'Pendiente', paid: 'Pagada', partial: 'Pago Parcial', overdue: 'Vencida', cancelled: 'Anulada' };
       const statusLabel = statusLabels[newStatus] || newStatus;
      showSnackbar(`Estado de la factura actualizado a "${statusLabel}"`, 'success');
       // fetchInvoices(); // Refrescar datos si el hook no lo hace automáticamente
       if (typeof fetchInvoices === 'function') fetchInvoices();
    } catch (err) {
      console.error('Error al cambiar el estado de la factura:', err);
      showSnackbar('Error al cambiar el estado: ' + (err.message || 'Error desconocido'), 'error');
    }
  };

  // Manejo de carga (sin cambios)
  if (loadingInvoices || loadingClients /* || loadingProducts */) { // Considera añadir loadingProducts si es relevante
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
        </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {/* Renderizar botón "NUEVA FACTURA" solo si tiene permiso canCreate */}
        {canCreate() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedInvoice(null); // Asegurarse de limpiar la selección
              setOpenForm(true);
            }}
            sx={{ ...actionButtonStyle, fontSize: '14px' }} // Quitado marginLeft: 'auto' si solo hay un botón
          >
            NUEVA FACTURA
          </Button>
        )}
      </Box>

      {/* Resto del componente (Paper, InvoiceTable, Forms, Modals, Snackbar) sin cambios */}
      <Paper elevation={1} sx={{
        mb: 3,
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        bgcolor: '#1e1e1e',
      }}>
        <InvoiceTable
          invoices={sortedInvoices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onStatusChange={handleStatusChange}
          // Pasando estilos (sin cambios)
          tableHeaderStyle={{
            fontWeight: 700,
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.9)',
          }}
          tableCellStyle={{
            fontWeight: 600,
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.85)',
          }}
          statusChipStyle={{
            fontWeight: 600,
            textShadow: '0px 0px 1px rgba(0,0,0,0.5)',
          }}
        />
      </Paper>

      {/* Modal de Formulario Unificado */}
      <UnifiedDocumentForm
        open={openForm}
        initialData={selectedInvoice}
        clients={clients || []} // Asegurar que clients y products sean arrays
        products={products || []}
        onClose={() => {
          setOpenForm(false);
          setSelectedInvoice(null); // Limpiar al cerrar
        }}
        onSave={async (data) => {
            try {
                await saveInvoice(data);
                showSnackbar(data._id ? 'Factura actualizada correctamente' : 'Factura creada correctamente', 'success');
                setOpenForm(false); // Cerrar modal al guardar con éxito
                setSelectedInvoice(null); // Limpiar selección
                // fetchInvoices(); // Refrescar si el hook no lo hace
                if (typeof fetchInvoices === 'function') fetchInvoices();
            } catch(err) {
                 console.error("Error al guardar desde form:", err);
                 showSnackbar('Error al guardar la factura: ' + (err.message || 'Error desconocido'), 'error');
                 // No cerrar el modal en caso de error para que el usuario pueda corregir
                 // throw err; // Opcional: relanzar si se maneja más arriba
            }
        }}
        isInvoice={true} // Indicar que es para una factura
      />

      {/* Modal de Vista Previa */}
      <InvoicePreview
        open={openPreview}
        invoice={selectedInvoice}
        onClose={() => {
          setOpenPreview(false);
          setSelectedInvoice(null); // Limpiar al cerrar
        }}
      />

      {/* Snackbar (sin cambios) */}
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

      {/* Diálogo de Confirmación de Borrado (sin cambios) */}
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
          <DialogContentText id="confirm-delete-dialog-description" sx={{ color: 'inherit', fontWeight: 500 }}>
            ¿Está seguro de que desea eliminar esta factura? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#2a2a2a', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} >
          <Button
            variant="outlined"
            onClick={handleCloseConfirmDialog}
            startIcon={<CancelIcon />}
            disabled={deleting}
            sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.3)', fontWeight: 600, '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)', bgcolor: 'rgba(255, 255, 255, 0.05)' } }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            disabled={deleting}
            sx={{ fontWeight: 600 }}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Invoices;