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

   const client = invoice.client || { nombre: '', direccion: '', cuit: '', condicionIva: '' };
   const empresa = invoice.empresa || { nombre: '', cuit: '', direccion: '' };
   const items = invoice.items || [];
   const iva = invoice.iva || { tasa: 0, monto: 0 };

   return (
       <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
           <DialogContent>
               <Paper sx={styles.invoiceContainer}>
                   <InvoiceHeader empresa={empresa} invoice={invoice} />
                   <ClientInfo client={client} />
                   <InvoiceItemsTable items={items} />
                   <InvoiceTotals invoice={invoice} iva={iva} />
                   <InvoiceFooter invoice={invoice} />
               </Paper>
           </DialogContent>
       </Dialog>
   );
};

export default InvoicePreview;