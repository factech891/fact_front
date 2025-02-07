// src/pages/invoices/Invoices.js
import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { InvoiceTable } from './InvoiceTable';
import { InvoiceForm } from './InvoiceForm';
import { useInvoices } from '../../hooks/useInvoices';

const Invoices = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { invoices, loading, error, saveInvoice, deleteInvoice } = useInvoices();

  const handleSave = async (invoice) => {
    try {
      await saveInvoice(invoice);
      setOpenForm(false);
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
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

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Facturas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Nueva Factura
        </Button>
      </Box>

      <InvoiceTable 
        invoices={invoices}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <InvoiceForm
        open={openForm}
        invoice={selectedInvoice}
        onClose={() => {
          setOpenForm(false);
          setSelectedInvoice(null);
        }}
        onSave={handleSave}
      />
    </Box>
  );
};

export default Invoices;