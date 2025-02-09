// src/pages/invoices/InvoicePreview/InvoiceTotals.js
import { Box, Typography, Divider } from '@mui/material';

const styles = {
  totalsContainer: {
    width: '300px',
    marginLeft: 'auto',
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e0e0e7',
    borderRadius: '4px'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#2c3e50'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#002855'
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

  // Calcular los totales
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
        <Typography>TOTAL:</Typography>
        <Typography sx={styles.amount}>
          {invoice.moneda} {formatNumber(total)}
        </Typography>
      </Box>
    </Box>
  );
};

export default InvoiceTotals;