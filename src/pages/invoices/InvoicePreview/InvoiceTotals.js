// src/pages/invoices/InvoicePreview/InvoiceTotals.js
import { Box, Typography, Divider } from '@mui/material';

const getStyles = (theme) => ({
  totalsContainer: {
    width: '300px',
    marginLeft: 'auto',
    marginTop: '20px',
    padding: '15px 20px',
    backgroundColor: theme.background.primary,
    border: `1px solid ${theme.border}`,
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
      background: theme.gradient
    }
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: theme.fontSize.body,
    color: theme.text.primary
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '600',
    fontSize: theme.fontSize.subtitle,
    color: theme.primary,
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
    backgroundColor: theme.border
  },
  totalAmount: {
    fontFamily: 'monospace',
    minWidth: '120px',
    textAlign: 'right',
    fontWeight: '600',
    color: theme.primary
  }
});

export const InvoiceTotals = ({ invoice, theme }) => {
  const styles = getStyles(theme);

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
        <Typography>TOTAL:</Typography>
        <Typography sx={styles.totalAmount}>
          {invoice.moneda} {formatNumber(total)}
        </Typography>
      </Box>
    </Box>
  );
};

export default InvoiceTotals;