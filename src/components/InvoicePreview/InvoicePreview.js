// InvoicePreview.js
import React from 'react';
import { Paper, Dialog, DialogContent } from '@mui/material';
import InvoiceHeader from './InvoiceHeader';
import ClientInfo from './ClientInfo';
import InvoiceItemsTable from './InvoiceItemsTable';
import InvoiceTotals from './InvoiceTotals';

const styles = {
   invoiceContainer: {
       padding: '0',
       backgroundColor: '#fff',
       minHeight: '842px', // Altura A4
       width: '595px',     // Ancho A4
       margin: '0 auto'
   },
   content: {
       padding: '20px'
   }
};

const empresaDefault = {
   nombre: 'Tu Empresa',
   direccion: 'Dirección de la empresa',
   rif: 'J-123456789',
   telefono: '+58 424-1234567',
   email: 'info@tuempresa.com'
};

const InvoicePreview = ({ open, onClose, invoice }) => {
   if (!invoice) return null;

   const clientData = invoice.client || {
       nombre: '',
       rif: '',
       direccion: '',
       telefono: '',
       email: ''
   };

   const defaultInvoiceData = {
       number: '',
       date: new Date(),
       moneda: 'USD',
       condicionesPago: 'Contado',
       diasCredito: 30,
       items: [],
       subtotal: 0,
       tax: 0,
       total: 0,
       status: 'draft'
   };

   const invoiceData = { ...defaultInvoiceData, ...invoice };

   return (
       <Dialog 
           open={open} 
           onClose={onClose} 
           maxWidth={false}
           PaperProps={{
               sx: { 
                   minWidth: '595px',
                   height: '842px',
                   margin: '20px'
               }
           }}
       >
           <DialogContent sx={{ padding: 0 }}>
               <Paper sx={styles.invoiceContainer}>
                   <InvoiceHeader 
                       invoice={invoiceData} 
                   />
                   <div style={styles.content}>
                       <ClientInfo 
                           client={clientData} 
                       />
                       <InvoiceItemsTable 
                           items={invoiceData.items} 
                           moneda={invoiceData.moneda} 
                       />
                       <InvoiceTotals 
                           invoice={invoiceData} 
                       />
                   </div>
               </Paper>
           </DialogContent>
       </Dialog>
   );
};

export default InvoicePreview;