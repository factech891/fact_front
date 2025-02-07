// src/pages/invoices/InvoicePreview/InvoicePreview.js
import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Box,
  Divider
} from '@mui/material';
import { ClientInfo } from './ClientInfo';
import { InvoiceHeader } from './InvoiceHeader';
import { InvoiceItemsTable } from './InvoiceItemsTable';
import { InvoiceTotals } from './InvoiceTotals';
import { FileDownload } from '@mui/icons-material';

export const InvoicePreview = ({ open, onClose, invoice, onDownload }) => {
  if (!invoice) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        Previsualización de Factura
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <InvoiceHeader invoice={invoice} />
          <Divider sx={{ my: 2 }} />
          <ClientInfo client={invoice.client} />
          <InvoiceItemsTable items={invoice.items} moneda={invoice.moneda} />
          <InvoiceTotals invoice={invoice} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        <Button
          onClick={() => onDownload(invoice)}
          variant="contained"
          startIcon={<FileDownload />}
        >
          Descargar PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoicePreview;