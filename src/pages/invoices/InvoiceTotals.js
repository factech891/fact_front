// src/pages/invoices/InvoiceTotals.js
import { Box, Card, Grid, Typography } from '@mui/material';

export const InvoiceTotals = ({ subtotal, tax, total, moneda = 'USD' }) => {
  return (
    <Card sx={{ p: 2, minWidth: 300 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="body1">
              {moneda} {subtotal?.toFixed(2)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" color="text.secondary">
              IVA (16%)
            </Typography>
            <Typography variant="body1">
              {moneda} {tax?.toFixed(2)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 1
          }}>
            <Typography variant="h6">
              Total
            </Typography>
            <Typography variant="h6" color="primary">
              {moneda} {total?.toFixed(2)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};