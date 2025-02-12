// src/pages/settings/CompanySettings/CompanyPreview.js
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Grid
} from '@mui/material';
import { useCompany } from '../../../hooks/useCompany';

const CompanyPreview = () => {
  const { company, loading } = useCompany();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!company) {
    return (
      <Box p={3}>
        <Typography color="text.secondary">
          No hay información de la empresa disponible
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Vista Previa de Factura
      </Typography>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 2,
          backgroundColor: '#fff',
          maxWidth: 800,
          mx: 'auto'
        }}
      >
        {/* Encabezado */}
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Box>
            {company.logo?.url ? (
              <img
                src={company.logo.url}
                alt="Logo de la empresa"
                style={{
                  maxWidth: 200,
                  maxHeight: 100,
                  objectFit: 'contain'
                }}
              />
            ) : (
              <Typography variant="h5" fontWeight="bold">
                {company.name}
              </Typography>
            )}
          </Box>
          <Box textAlign="right">
            <Typography variant="h6">FACTURA</Typography>
            <Typography color="text.secondary"># 000000</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Información de la empresa */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              De:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {company.name}
            </Typography>
            <Typography>RIF: {company.rif}</Typography>
            <Typography>
              {company.address.street}
              <br />
              {company.address.city}, {company.address.state}
              {company.address.zip && ` - ${company.address.zip}`}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Contacto:
            </Typography>
            <Typography>
              Email: {company.contact.email}
              <br />
              Teléfono: {company.contact.phone}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Información del cliente (ejemplo) */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Para:
            </Typography>
            <Typography color="text.secondary" fontStyle="italic">
              [Información del cliente]
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box textAlign="right">
              <Typography variant="body2" color="text.secondary">
                Fecha: DD/MM/YYYY
                <br />
                Vencimiento: DD/MM/YYYY
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="caption" color="text.secondary">
            Esta es una vista previa de cómo se mostrará la información de su empresa en las facturas.
            Los datos del cliente, productos y totales variarán según cada factura.
          </Typography>
        </Box>
      </Paper>
    </Paper>
  );
};

export default CompanyPreview;