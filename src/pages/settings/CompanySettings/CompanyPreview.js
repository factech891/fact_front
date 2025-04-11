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

  // Añadimos este console.log para ver qué está llegando
  console.log("VAMOS A VER BIEN ESTA VAINA:", company);

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
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt="Logo de la empresa"
                crossOrigin="anonymous" 
                style={{
                  maxWidth: 200,
                  maxHeight: 100,
                  objectFit: 'contain',
                  border: '1px solid #ddd'
                }}
                onError={(e) => {
                  console.error("JODIDO EL LOGO:", e);
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200x100?text=Logo';
                }}
              />
            ) : (
              <Typography variant="h5" fontWeight="bold">
                {company.nombre}
              </Typography>
            )}
          </Box>
          <Box textAlign="right">
            <Typography variant="h6">FACTURA</Typography>
            <Typography color="text.secondary"># EJEMPLO</Typography>
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
              {company.nombre}
            </Typography>
            <Typography>RIF: {company.rif}</Typography>
            <Typography>
              {company.direccion}
              {company.ciudad && <br />}
              {company.ciudad && `${company.ciudad}`}
              {company.estado && `, ${company.estado}`}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Contacto:
            </Typography>
            <Typography>
              Email: {company.email}
              <br />
              Teléfono: {company.telefono || 'No especificado'}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Ejemplo de cliente */}
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
                Fecha: {new Date().toLocaleDateString()}
                <br />
                Vencimiento: {new Date(Date.now() + 15*24*60*60*1000).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="caption" color="text.secondary">
            Esta es una vista previa de cómo se mostrarán los datos de su empresa en las facturas.
            Los datos del cliente y las fechas son ejemplos.
          </Typography>
        </Box>
      </Paper>
    </Paper>
  );
};

export default CompanyPreview;