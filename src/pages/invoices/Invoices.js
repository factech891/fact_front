// src/pages/invoices/Invoices.js
import { useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon, FileDownload } from '@mui/icons-material';
import { InvoiceTable } from './InvoiceTable';
import { InvoiceForm } from './InvoiceForm';
import { InvoicePreview } from './InvoicePreview/InvoicePreview';
import { useInvoices } from '../../hooks/useInvoices';
import { useClients } from '../../hooks/useClients';
import { useProducts } from '../../hooks/useProducts';
import { invoicesApi } from '../../services/api';

const Invoices = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const { invoices, loading: loadingInvoices, saveInvoice, deleteInvoice } = useInvoices();
  const { clients, loading: loadingClients } = useClients();
  const { products, loading: loadingProducts } = useProducts();

  // Manejador para previsualizar una factura
  const handlePreview = async (invoice) => {
    console.log('Datos completos de la factura:', invoice);
    try {
      // Obtener datos completos del cliente y productos si es necesario
      const fullInvoice = {
        ...invoice,
        client: clients.find(c => c._id === invoice.client._id),
        items: invoice.items.map(item => ({
          ...item,
          product: products.find(p => p._id === (item.product._id || item.product))
        }))
      };
      console.log('Factura procesada para preview:', fullInvoice);
      setSelectedInvoice(fullInvoice);
      setOpenPreview(true);
    } catch (error) {
      console.error('Error al procesar factura para preview:', error);
      setError({
        severity: 'error',
        message: 'Error al cargar la vista previa'
      });
    }
  };

  // Manejador para descargar una factura como PDF
  const handleDownload = async (invoice) => {
    setDownloading(true);
    setError(null);
    try {
      await invoicesApi.downloadPDF(invoice._id);
      setError({
        severity: 'success',
        message: 'Factura descargada exitosamente'
      });
    } catch (err) {
      console.error('Error al descargar la factura:', err);
      setError({
        severity: 'error',
        message: 'Error al descargar la factura. Por favor intente nuevamente.'
      });
    } finally {
      setDownloading(false);
    }
  };

  // Manejador para editar una factura
  const handleEdit = (invoice) => {
    console.log('Editando factura:', invoice);
    setSelectedInvoice(invoice);
    setOpenForm(true);
  };

  // Manejador para eliminar una factura
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

  if (loadingInvoices || loadingClients || loadingProducts) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Facturas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedInvoice(null);
            setOpenForm(true);
          }}
        >
          Nueva Factura
        </Button>
      </Box>

      <InvoiceTable
        invoices={invoices}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={handlePreview}
        onDownload={handleDownload}
      />

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

      {/* La vista previa ahora recibe más datos procesados */}
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