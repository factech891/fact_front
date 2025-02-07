// src/pages/invoices/InvoicePreview/InvoiceTotals.js
import { Box, Typography, Divider } from '@mui/material';

export const InvoiceTotals = ({ invoice }) => (
  <Box sx={{ width: 300, ml: 'auto', mt: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography>Subtotal:</Typography>
      <Typography>
        {invoice.moneda} {invoice.subtotal?.toFixed(2)}
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography>IVA (16%):</Typography>
      <Typography>
        {invoice.moneda} {invoice.tax?.toFixed(2)}
      </Typography>
    </Box>
    <Divider sx={{ my: 1 }} />
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="h6">Total:</Typography>
      <Typography variant="h6" color="primary">
        {invoice.moneda} {invoice.total?.toFixed(2)}
      </Typography>
    </Box>
  </Box>
);

export default InvoiceTotals;