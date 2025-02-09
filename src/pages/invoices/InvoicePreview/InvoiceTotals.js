// src/pages/invoices/InvoicePreview/InvoiceTotals.js
import { Box, Typography, Divider } from '@mui/material';

const styles = {
  totalsContainer: {
    width: '300px',
    marginLeft: 'auto',
    marginTop: '20px',
    padding: '15px 20px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e7',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '3px',
      background: 'linear-gradient(to bottom, #002855, #0057a8)'
    }
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '13px',
    color: '#2c3e50'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '600',
    fontSize: '15px',
    color: '#002855',
    marginTop: '8px'
  },
  label: {
    fontWeight: '500'
  },
  amount: {
    fontFamily: 'monospace',
    minWidth: '120px',
    textAlign: 'right'
  },
  divider: {
    margin: '12px 0',
    backgroundColor: '#e0e0e7'
  },
  totalAmount: {
    fontFamily: 'monospace',
    minWidth: '120px',
    textAlign: 'right',
    fontWeight: '600',
    color: '#002855'
  }
};

export const InvoiceTotals = ({ invoice }) => {
  // Función para formatear números
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number || 0);
  };

  const subtotal = invoice.subtotal || 0;
  const iva = invoice.tax || invoice.iva || subtotal * 0.16;
  const total = invoice.total || subtotal + iva;

  return (
    <Box sx={styles.totalsContainer}>
      <Box sx={styles.row}>
        <Typography sx={styles.label}>Subtotal:</Typography>
        <Typography sx={styles.amount}>
          {invoice.moneda} {formatNumber(subtotal)}
        </Typography>
      </Box>
      
      <Box sx={styles.row}>
        <Typography sx={styles.label}>IVA (16%):</Typography>
        <Typography sx={styles.amount}>
          {invoice.moneda} {formatNumber(iva)}
        </Typography>
      </Box>
      
      <Divider sx={styles.divider} />
      
      <Box sx={styles.totalRow}>
        <Typography variant="subtitle1">TOTAL:</Typography>
        <Typography sx={styles.totalAmount}>
          {invoice.moneda} {formatNumber(total)}
        </Typography>
      </Box>
    </Box>
  );
};

export default InvoiceTotals;