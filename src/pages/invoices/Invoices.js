// src/pages/invoices/Invoices.js - CÓDIGO MODIFICADO CON FORMULARIO UNIFICADO
import { useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import InvoiceTable from './InvoiceTable';
// Importar el formulario unificado en lugar del InvoiceForm original
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
  const [error, setError] = useState(null);

  const { invoices, loading: loadingInvoices, saveInvoice, deleteInvoice, changeInvoiceStatus } = useInvoices();
  const { clients, loading: loadingClients } = useClients();
  const { products, loading: loadingProducts } = useProducts();

  // Nueva función para procesar los datos de la factura de manera consistente
  const processInvoiceData = (invoice) => {
    console.log('Procesando datos de factura:', invoice);
    
    if (!invoice) return null;
    
    try {
      // Asegurarnos de que los items tengan la estructura correcta
      const processedItems = invoice.items?.map(item => {
        // Asegurar que exentoIva se mapee correctamente desde cualquier fuente
        const isExento = item.exentoIva === true || item.taxExempt === true;
        console.log(`Ítem ${item.codigo || item.product?.codigo || 'sin código'}: exentoIva=${isExento}`);
        
        return {
          codigo: item.codigo || item.product?.codigo || '',
          descripcion: item.descripcion || item.product?.nombre || '',
          cantidad: parseFloat(item.quantity || item.cantidad) || 1,
          precioUnitario: parseFloat(item.price || item.precioUnitario) || 0,
          total: parseFloat(item.subtotal) || 
                (parseFloat(item.quantity || item.cantidad) || 1) * 
                (parseFloat(item.price || item.precioUnitario) || 0),
          exentoIva: isExento  // Usar el valor correcto
        };
      }) || [];
      
      // Calcular subtotal, IVA y total
      const subtotal = processedItems.reduce((sum, item) => sum + item.total, 0);
      
      // Calcular IVA solo para los ítems NO exentos
      const iva = processedItems.reduce((sum, item) => {
        if (item.exentoIva !== true) {
          return sum + (item.total * 0.16);
        }
        return sum;
      }, 0);
      
      const total = subtotal + iva;
      
      // Crear un objeto de factura procesado completo
      const processedInvoice = {
        ...invoice,
        items: processedItems,
        subtotal: subtotal,
        iva: iva,
        total: total,
        moneda: invoice.moneda || 'VES',
      };
      
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
      setError({
        severity: 'error',
        message: 'Error al cargar la vista previa: ' + error.message
      });
    }
  };

  const handleDownload = async (invoice) => {
    try {
      const processedInvoice = processInvoiceData(invoice);
      setSelectedInvoice(processedInvoice);
      setOpenPreview(true);

      // Damos tiempo a que se renderice la vista previa antes de generar el PDF
      setTimeout(async () => {
        try {
          const result = await generatePDF(processedInvoice);
          if (!result || !result.success) {
            throw new Error('Error generando PDF');
          }
        } catch (error) {
          console.error('Error generando PDF:', error);
          setError({
            severity: 'error',
            message: 'Error al generar el PDF: ' + error.message
          });
        }
      }, 800); // Aumentamos el tiempo de espera para asegurar que la vista previa se renderice
    } catch (error) {
      console.error('Error preparando factura para descarga:', error);
      setError({
        severity: 'error',
        message: 'Error al preparar la factura: ' + error.message
      });
    }
  };

  const handleEdit = (invoice) => {
    console.log('Editando factura:', invoice);
    setSelectedInvoice(invoice);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta factura?')) {
      try {
        await deleteInvoice(id);
        setError({
          severity: 'success',
          message: 'Factura eliminada exitosamente'
        });
      } catch (err) {
        console.error('Error al eliminar la factura:', err);
        setError({
          severity: 'error',
          message: 'Error al eliminar la factura: ' + (err.message || '')
        });
      }
    }
  };
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      await changeInvoiceStatus(id, newStatus);
      setError({
        severity: 'success',
        message: `Estado de la factura actualizado a "${newStatus === 'draft' ? 'Borrador' : 
                                                     newStatus === 'pending' ? 'Pendiente' : 
                                                     newStatus === 'paid' ? 'Pagada' : 
                                                     newStatus === 'cancelled' ? 'Anulada' :
                                                     newStatus === 'overdue' ? 'Vencida' :
                                                     newStatus === 'partial' ? 'Pago Parcial' : 
                                                     newStatus}"`
      });
    } catch (err) {
      console.error('Error al cambiar el estado de la factura:', err);
      setError({
        severity: 'error',
        message: 'Error al cambiar el estado de la factura: ' + (err.message || '')
      });
    }
  };

  if (loadingInvoices || loadingClients || loadingProducts) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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

      <Paper elevation={0} sx={{ mb: 3, p: 0, borderRadius: '8px', overflow: 'hidden' }}>
        <InvoiceTable
          invoices={invoices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onStatusChange={handleStatusChange}
        />
      </Paper>

      {/* Reemplazar InvoiceForm con el nuevo UnifiedDocumentForm */}
      <UnifiedDocumentForm
        open={openForm}
        initialData={selectedInvoice}
        clients={clients}
        products={products}
        onClose={() => {
          setOpenForm(false);
          setSelectedInvoice(null);
        }}
        onSave={saveInvoice}
        isInvoice={true} // Indicar que es una factura
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
        open={error !== null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity={error?.severity || 'info'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Invoices;