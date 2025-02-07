// src/pages/invoices/InvoicePreview/ClientInfo.js
import { Box, Typography, Grid } from '@mui/material';

export const ClientInfo = ({ client }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" gutterBottom>
      Información del Cliente
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography>
          <strong>Nombre:</strong> {client?.nombre}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          <strong>RIF:</strong> {client?.rif}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          <strong>Dirección:</strong> {client?.direccion}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          <strong>Teléfono:</strong> {client?.telefono}
        </Typography>
      </Grid>
    </Grid>
  </Box>
);

export default ClientInfo;