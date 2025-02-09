// src/pages/invoices/InvoicePreview/InvoicePreview.js
import { Paper, Dialog, DialogContent } from '@mui/material';
import { InvoiceHeader } from './InvoiceHeader';
import { ClientInfo } from './ClientInfo';
import { InvoiceItemsTable } from './InvoiceItemsTable';
import { InvoiceTotals } from './InvoiceTotals';

const styles = {
 invoiceContainer: {
   padding: '0',
   backgroundColor: '#fff',
   minHeight: '842px', // Altura A4
   width: '595px',     // Ancho A4
   margin: '0 auto',
   position: 'relative'
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

export const InvoicePreview = ({ open, onClose, invoice }) => {
 if (!invoice) return null;

 console.log('Datos originales de invoice:', invoice);
 console.log('Items originales:', invoice.items);

 // Formatear los datos del cliente
 const clientData = {
   nombre: invoice.client?.nombre || '',
   rif: invoice.client?.rif || '',
   direccion: invoice.client?.direccion || '',
   telefono: invoice.client?.telefono || '',
   email: invoice.client?.email || ''
 };

 // Estructura base de la factura
 const defaultInvoiceData = {
   numero: 'INV-0001',
   fecha: new Date(),
   moneda: 'USD',
   items: [],
   subtotal: 0,
   iva: 0,
   ivaRate: 16,
   total: 0
 };

 // Procesar los items para que coincidan con la estructura del backend
 const processedItems = (invoice.items || []).map(item => ({
   product: {
     codigo: item.product?.codigo || item.codigo,
     nombre: item.product?.nombre || item.descripcion
   },
   quantity: item.quantity || item.cantidad,
   price: item.price || item.precioUnit
 }));

 console.log('Items procesados:', processedItems);

 // Combinar datos con el formato correcto
 const invoiceData = {
   ...defaultInvoiceData,
   ...invoice,
   items: processedItems,
   // Calcular totales basados en la nueva estructura
   subtotal: processedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0),
   iva: processedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0) * 0.16,
   total: processedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0) * 1.16
 };

 console.log('Datos finales de la factura:', invoiceData);

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
           empresa={empresaDefault}
           invoice={invoiceData} 
         />
         <div style={styles.content}>
           <ClientInfo 
             client={clientData} 
           />
           {invoiceData.items && invoiceData.items.length > 0 && (
             <InvoiceItemsTable 
               items={invoiceData.items} 
               moneda={invoiceData.moneda} 
             />
           )}
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