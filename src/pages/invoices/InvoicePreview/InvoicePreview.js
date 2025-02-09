// src/pages/invoices/InvoicePreview/InvoicePreview.js
import { Paper, Dialog, DialogContent } from '@mui/material';
import { InvoiceHeader } from './InvoiceHeader';
import { ClientInfo } from './ClientInfo';
import { InvoiceItemsTable } from './InvoiceItemsTable';
import { InvoiceTotals } from './InvoiceTotals';
import { InvoiceFooter } from './InvoiceFooter';

const styles = {
  invoiceContainer: {
    padding: '0',
    backgroundColor: '#fff',
    minHeight: '842px', // Altura A4
    width: '595px',     // Ancho A4
    margin: '0 auto',
    position: 'relative', // Importante para el footer
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(to right, #002855, #0057a8)'
    }
  },
  content: {
    padding: '20px 25px',
    paddingBottom: '200px', // Espacio para el footer
    position: 'relative'
  }
};

export const InvoicePreview = ({ open, onClose, invoice }) => {
  if (!invoice) return null;

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
      <DialogContent sx={{ padding: 0 }} id="invoice-preview">
        <Paper sx={styles.invoiceContainer}>
          <InvoiceHeader 
            invoice={invoice} 
            empresa={invoice.empresa || {
              nombre: 'Tu Empresa',
              direccion: 'Dirección de la empresa',
              rif: 'J-123456789',
              telefono: '+58 424-1234567',
              email: 'info@tuempresa.com'
            }}
          />
          <div style={styles.content}>
            <ClientInfo 
              client={invoice.client} 
            />
            {invoice.items && invoice.items.length > 0 && (
              <InvoiceItemsTable 
                items={invoice.items} 
                moneda={invoice.moneda} 
              />
            )}
            <InvoiceTotals 
              invoice={invoice} 
            />
          </div>
          <InvoiceFooter invoice={invoice} />
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreview;