// src/pages/invoices/InvoicePreview/InvoiceHeader.js
import { Box, Typography, Grid } from '@mui/material';

export const InvoiceHeader = ({ invoice }) => (
  <Box sx={{ mb: 4 }}>
    <Grid container justifyContent="space-between" alignItems="flex-start">
      <Grid item>
        <Typography variant="h4" gutterBottom>
          FACTURA
        </Typography>
        <Typography>
          N°: {invoice.number}
        </Typography>
        <Typography>
          Fecha: {new Date(invoice.createdAt).toLocaleDateString()}
        </Typography>
      </Grid>
      <Grid item>
        <Typography>
          <strong>Estatus:</strong> {invoice.status === 'paid' ? 'Pagada' : 'Pendiente'}
        </Typography>
        <Typography>
          <strong>Moneda:</strong> {invoice.moneda}
        </Typography>
        <Typography>
          <strong>Condiciones:</strong> {invoice.condicionesPago}
        </Typography>
      </Grid>
    </Grid>
  </Box>
);

export default InvoiceHeader;