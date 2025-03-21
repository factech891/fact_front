// src/pages/invoices/Invoices.js
import { useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import InvoiceTable from './InvoiceTable';
import { InvoiceForm } from './InvoiceForm';
import { InvoicePreview } from './InvoicePreview/InvoicePreview';
import { useInvoices } from '../../hooks/useInvoices';
import { useClients } from '../../hooks/useClients';
import { useProducts } from '../../hooks/useProducts';
import { generatePDF } from '../../utils/pdfGenerator';

const Invoices = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const { invoices, loading: loadingInvoices, saveInvoice, deleteInvoice, changeInvoiceStatus } = useInvoices();
  const { clients, loading: loadingClients } = useClients();
  const { products, loading: loadingProducts } = useProducts();

  const handlePreview = async (invoice) => {
    console.log('Datos originales de factura:', invoice);
    
    try {
      const processedItems = invoice.items?.map(item => ({
        product: {
          codigo: item.codigo || item.product?.codigo,
          nombre: item.descripcion || item.product?.nombre
        },
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price
      })) || [];

      const processedInvoice = {
        ...invoice,
        items: processedItems,
        subtotal: Number(invoice.subtotal || 0),
        tax: Number(invoice.tax || 0),
        total: Number(invoice.total || 0),
        moneda: invoice.moneda || 'USD',
        client: invoice.client || null
      };

      console.log('Factura procesada:', processedInvoice);
      setSelectedInvoice(processedInvoice);
      setOpenPreview(true);
    } catch (error) {
      console.error('Error procesando factura:', error);
      setError({
        severity: 'error',
        message: 'Error al cargar la vista previa'
      });
    }
  };

  const handleDownload = async (invoice) => {
    setSelectedInvoice(invoice);
    setOpenPreview(true);

    // Damos tiempo a que se renderice la vista previa antes de generar el PDF
    setTimeout(async () => {
      const success = await generatePDF(invoice);
      if (!success) {
        setError({
          severity: 'error',
          message: 'Error al generar el PDF'
        });
      }
    }, 500);
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
          message: 'Error al eliminar la factura'
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
        message: 'Error al cambiar el estado de la factura'
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

      <InvoiceForm
        open={openForm}
        invoice={selectedInvoice}
        clients={clients}
        products={products}
        onClose={() => {
          setOpenForm(false);
          setSelectedInvoice(null);
        }}
        onSave={saveInvoice}
      />

      <InvoicePreview
        open={openPreview}
        invoice={selectedInvoice}
        onClose={() => {
          setOpenPreview(false);
          setSelectedInvoice(null);
        }}
        onDownload={handleDownload}
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