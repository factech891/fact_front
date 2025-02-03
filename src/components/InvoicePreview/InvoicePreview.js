// InvoicePreview.js
import React from 'react';
import { Paper, Dialog, DialogContent } from '@mui/material';
import InvoiceHeader from './InvoiceHeader';
import ClientInfo from './ClientInfo';
import InvoiceItemsTable from './InvoiceItemsTable';
import InvoiceTotals from './InvoiceTotals';
import InvoiceFooter from './InvoiceFooter';

const styles = {
  invoiceContainer: {
      padding: '40px',
      maxWidth: '800px',
      margin: '20px auto',
      backgroundColor: '#fff',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  }
};

const InvoicePreview = ({ open, onClose, invoice }) => {
  if (!invoice) return null;

  const client = invoice.client || {
      nombre: '',
      rif: '',
      direccion: '',
      telefono: '',
      email: ''
  };

  const empresa = invoice.empresa || {
      nombre: '',
      rif: '',
      direccion: '',
      telefono: '',
      email: ''
  };

  const defaultInvoiceData = {
      series: '',
      fechaEmision: new Date(),
      fechaVencimiento: new Date(),
      moneda: 'USD',
      condicionesPago: 'Contado',
      diasCredito: 0,
      items: [],
      subtotal: 0,
      descuentoGlobal: 0,
      iva: { tasa: 16, monto: 0 },
      total: 0,
      infoBancaria: '',
      observaciones: ''
  };

  const invoiceData = { ...defaultInvoiceData, ...invoice };

  return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <DialogContent>
              <Paper sx={styles.invoiceContainer}>
                  <InvoiceHeader empresa={empresa} invoice={invoiceData} />
                  <ClientInfo client={client} />
                  <InvoiceItemsTable 
                      items={invoiceData.items} 
                      moneda={invoiceData.moneda} 
                  />
                  <InvoiceTotals 
                      invoice={invoiceData} 
                      moneda={invoiceData.moneda}
                  />
                  <InvoiceFooter invoice={invoiceData} />
              </Paper>
          </DialogContent>
      </Dialog>
  );
};

export default InvoicePreview;