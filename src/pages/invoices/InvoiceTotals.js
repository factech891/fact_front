// src/pages/invoices/InvoicePreview/InvoiceTotals.js
import { Typography, Box, Paper } from '@mui/material';

const styles = {
  totalsBox: {
    width: '300px',
    marginLeft: 'auto',
    backgroundColor: 'white',
    padding: '20px',
    border: '1px solid #e0e0e7',
    borderRadius: '4px'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '10px'
  },
  label: {
    color: '#2c3e50',
    fontWeight: 'normal'
  },
  value: {
    color: '#2c3e50',
    textAlign: 'right'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #e0e0e7'
  },
  totalLabel: {
    color: '#2c3e50',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  totalValue: {
    color: '#2c3e50',
    fontWeight: 'bold',
    fontSize: '12px'
  }
};

export const InvoiceTotals = ({ invoice }) => {
  if (!invoice) return null;

  const moneda = invoice.moneda || 'USD';
  const subtotal = invoice.subtotal || 0;
  const tax = invoice.tax || 0;
  const total = invoice.total || 0;

  return (
    <Paper elevation={0} sx={styles.totalsBox}>
      <Box sx={styles.row}>
        <Typography sx={styles.label}>Subtotal:</Typography>
        <Typography sx={styles.value}>
          {moneda} {subtotal.toFixed(2)}
        </Typography>
      </Box>
      <Box sx={styles.row}>
        <Typography sx={styles.label}>IVA (16%):</Typography>
        <Typography sx={styles.value}>
          {moneda} {tax.toFixed(2)}
        </Typography>
      </Box>
      <Box sx={styles.totalRow}>
        <Typography sx={styles.totalLabel}>TOTAL:</Typography>
        <Typography sx={styles.totalValue}>
          {moneda} {total.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default InvoiceTotals;