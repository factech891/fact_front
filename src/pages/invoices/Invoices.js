// src/pages/invoices/Invoices.js - MODIFICADO CON DIÁLOGO DE BORRADO ESTILIZADO
import { useState } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    Snackbar, 
    Alert, 
    Paper,
    // --- Imports para el Diálogo ---
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    IconButton, 
    CircularProgress 
    // --- Fin Imports Diálogo ---
} from '@mui/material';
import { 
    Add as AddIcon,
    // --- Imports Iconos Diálogo ---
    Close as CloseIcon, 
    DeleteForever as DeleteIcon, 
    Cancel as CancelIcon 
    // --- Fin Imports Iconos ---
} from '@mui/icons-material';
import InvoiceTable from './InvoiceTable'; // Asegúrate que el import sea correcto
import UnifiedDocumentForm from '../documents/UnifiedDocumentForm'; // O la ruta correcta
import { InvoicePreview } from './InvoicePreview/InvoicePreview'; // O la ruta correcta
import { useInvoices } from '../../hooks/useInvoices';
import { useClients } from '../../hooks/useClients';
import { useProducts } from '../../hooks/useProducts';
import { generatePDF } from '../../utils/pdfGenerator'; // O la ruta correcta

const Invoices = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [snackbarInfo, setSnackbarInfo] = useState({ open: false, message: '', severity: 'info' }); // Unificado para Snackbar

  // --- Estado para el diálogo de confirmación ---
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  // --- Fin Estado Diálogo ---

  const { invoices, loading: loadingInvoices, saveInvoice, deleteInvoice, changeInvoiceStatus } = useInvoices();
  const { clients, loading: loadingClients } = useClients();
  // Nota: useProducts puede no ser necesario aquí si UnifiedDocumentForm lo maneja internamente
  const { products, loading: loadingProducts } = useProducts(); 

  // --- Función para mostrar Snackbar (reutilizable) ---
  const showSnackbar = (message, severity = 'info') => {
    setSnackbarInfo({ open: true, message, severity });
  };

  // --- Función de procesamiento (sin cambios) ---
   const processInvoiceData = (invoice) => {
    // ... (tu lógica de processInvoiceData aquí, sin cambios) ...
     console.log('Procesando datos de factura:', invoice);    
    if (!invoice) return null;    
    try {
      const processedItems = invoice.items?.map(item => {
        const isExento = item.exentoIva === true || item.taxExempt === true;
        console.log(`Ítem ${item.codigo || item.product?.codigo || 'sin código'}: exentoIva=${isExento}`);
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
        if (item.exentoIva !== true) { return sum + (item.total * 0.16); } // Asumiendo IVA 16%
        return sum;
      }, 0);      
      const total = subtotal + iva;
      const processedInvoice = { ...invoice, items: processedItems, subtotal, iva, total, moneda: invoice.moneda || 'VES' };
      console.log('Factura procesada:', processedInvoice);
      return processedInvoice;
    } catch (error) { console.error('Error procesando factura:', error); throw error; }
   };

  // --- Manejadores (Preview, Download, Edit - sin cambios funcionales) ---
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
      // Asegurarse de que la vista previa esté lista podría necesitar un enfoque diferente
      // Quizás generar el PDF directamente sin depender del renderizado de InvoicePreview
      // O usar un estado para saber cuándo está listo InvoicePreview
      showSnackbar('Generando PDF...', 'info'); 
      await generatePDF(processedInvoice); // Asumiendo que generatePDF maneja la descarga/apertura
      // showSnackbar('PDF generado exitosamente.', 'success'); // Opcional
    } catch (error) {
      console.error('Error preparando/generando PDF:', error);
      showSnackbar('Error al generar el PDF: ' + error.message, 'error');
    } finally {
        // No es necesario mantener la vista previa abierta si solo se descarga
        // setOpenPreview(false); 
        // setSelectedInvoice(null); 
    }
  };

  const handleEdit = (invoice) => {
    console.log('Editando factura:', invoice);
    // Asegúrate de pasar la factura original, no la procesada, al formulario
    // Asumiendo que `invoice` en este punto es la original de la tabla
    setSelectedInvoice(invoice); 
    setOpenForm(true);
  };


  // --- handleDelete MODIFICADO para usar Diálogo ---
  const handleDelete = (id) => {
    setInvoiceIdToDelete(id); // Guardar ID
    setOpenConfirmDialog(true); // Abrir diálogo
  };
  // --- Fin handleDelete ---


  // --- NUEVA Función para confirmar borrado desde el diálogo ---
  const handleConfirmDelete = async () => {
    if (invoiceIdToDelete) {
      setDeleting(true); 
      try {
        await deleteInvoice(invoiceIdToDelete); // Llamar a la API
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
  // --- Fin handleConfirmDelete ---


  // --- NUEVA Función para cerrar el diálogo de confirmación ---
  const handleCloseConfirmDialog = () => {
    if (deleting) return; 
    setOpenConfirmDialog(false);
    setInvoiceIdToDelete(null);
  };
  // --- Fin handleCloseConfirmDialog ---


  // --- handleStatusChange (sin cambios funcionales, usa Snackbar) ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      await changeInvoiceStatus(id, newStatus);
      // Generar etiqueta del estado para el mensaje
       const statusLabels = { draft: 'Borrador', pending: 'Pendiente', paid: 'Pagada', partial: 'Pago Parcial', overdue: 'Vencida', cancelled: 'Anulada' };
       const statusLabel = statusLabels[newStatus] || newStatus;
      showSnackbar(`Estado de la factura actualizado a "${statusLabel}"`, 'success');
    } catch (err) {
      console.error('Error al cambiar el estado de la factura:', err);
      showSnackbar('Error al cambiar el estado: ' + (err.message || ''), 'error');
    }
  };
  
  // --- Loading state ---
  // Considera un indicador más granular si es necesario
  if (loadingInvoices || loadingClients /* || loadingProducts si es relevante */) { 
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         {/* Título de la página (opcional) */}
         <Typography variant="h4" component="h1">
           Facturas
         </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedInvoice(null);
            setOpenForm(true);
          }}
        >
          NUEVA FACTURA
        </Button>
      </Box>

      {/* --- Tabla envuelta en Paper para estilo (opcional) --- */}
      <Paper elevation={1} sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', // Ejemplo borde oscuro
         bgcolor: '#1e1e1e' // Ejemplo fondo oscuro para tabla si quieres consistencia total
        }}> 
        <InvoiceTable
          invoices={invoices}
          onEdit={handleEdit}
          onDelete={handleDelete} // Ahora abre el diálogo
          onPreview={handlePreview}
          onDownload={handleDownload}
          onStatusChange={handleStatusChange}
          // Podrías pasar loadingInvoices a InvoiceTable si necesita mostrar un spinner interno
          // loading={loadingInvoices} 
        />
      </Paper>

      {/* --- Formulario y Vista Previa (sin cambios) --- */}
      <UnifiedDocumentForm
        open={openForm}
        initialData={selectedInvoice}
        clients={clients}
        products={products} // Pasar productos/items
        onClose={() => {
          setOpenForm(false);
          setSelectedInvoice(null);
        }}
        // Pasar la función saveInvoice aquí
        onSave={async (data) => { 
            try {
                await saveInvoice(data);
                showSnackbar(data._id ? 'Factura actualizada' : 'Factura creada', 'success');
            } catch(err) {
                 console.error("Error al guardar desde form:", err);
                 showSnackbar('Error al guardar: ' + (err.message || ''), 'error');
                 throw err; // Re-lanzar para que el form sepa que falló
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

      {/* --- Snackbar unificado (sin cambios) --- */}
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

      {/* --- NUEVO: Diálogo de Confirmación de Borrado (Estilizado) --- */}
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
            {/* --- Mensaje específico para factura --- */}
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
      {/* --- Fin Diálogo --- */}

    </Box>
  );
};

export default Invoices;