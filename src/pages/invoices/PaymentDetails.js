// src/pages/invoices/PaymentDetails.js
import { Card, Grid, Typography, Box } from '@mui/material';

export const PaymentDetails = ({ 
  condicionesPago,
  diasCredito,
  moneda,
  status
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success.main';
      case 'pending':
        return 'warning.main';
      default:
        return 'text.secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Pagada';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Borrador';
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Detalles de Pago
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">
              Condiciones
            </Typography>
            <Typography>
              {condicionesPago}
            </Typography>
          </Box>
        </Grid>
        {condicionesPago === 'Crédito' && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">
                Días de Crédito
              </Typography>
              <Typography>
                {diasCredito} días
              </Typography>
            </Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">
              Moneda
            </Typography>
            <Typography>
              {moneda}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">
              Estado
            </Typography>
            <Typography sx={{ color: getStatusColor(status) }}>
              {getStatusText(status)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};