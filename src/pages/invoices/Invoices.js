// src/pages/invoices/Invoices.js
import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { InvoiceTable } from './InvoiceTable';
import { InvoiceForm } from './InvoiceForm';
import { InvoicePreview } from './InvoicePreview/InvoicePreview';
import { useInvoices } from '../../hooks/useInvoices';
import { useClients } from '../../hooks/useClients';
import { useProducts } from '../../hooks/useProducts';

const Invoices = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const { invoices, loading: loadingInvoices, saveInvoice, deleteInvoice } = useInvoices();
  const { clients, loading: loadingClients } = useClients();
  const { products, loading: loadingProducts } = useProducts();

  const handlePreview = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenPreview(true);
  };

  const handleDownload = async (invoice) => {
    // Aquí implementaremos la descarga del PDF
    console.log('Descargando factura:', invoice);
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta factura?')) {
      try {
        await deleteInvoice(id);
      } catch (error) {
        console.error('Error deleting invoice:', error);
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

      <InvoicePreview
        open={openPreview}
        invoice={selectedInvoice}
        onClose={() => {
          setOpenPreview(false);
          setSelectedInvoice(null);
        }}
        onDownload={handleDownload}
      />
    </Box>
  );
};

export default Invoices;