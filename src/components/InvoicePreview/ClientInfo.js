// ClientInfo.js
import React from 'react';
import { Grid, Typography, Box } from '@mui/material';

const styles = {
  clientInfo: {
      backgroundColor: '#F8F9FA',
      padding: '15px',
      borderRadius: '4px',
      marginBottom: '20px',
      border: '1px solid #D4E0F7'
  },
  sectionTitle: {
      color: '#284B8C',
      fontWeight: 'bold',
      marginBottom: '10px'
  }
};

const ClientInfo = ({ client }) => (
  <Box sx={styles.clientInfo}>
      <Typography variant="h6" sx={styles.sectionTitle}>DATOS DEL CLIENTE</Typography>
      <Grid container spacing={2}>
          <Grid item xs={6}>
              <Typography><strong>Cliente:</strong> {client.nombre || '-'}</Typography>
              <Typography><strong>RIF/CI:</strong> {client.rif || '-'}</Typography>
              <Typography><strong>Teléfono:</strong> {client.telefono || '-'}</Typography>
          </Grid>
          <Grid item xs={6}>
              <Typography><strong>Dirección:</strong> {client.direccion || '-'}</Typography>
              <Typography><strong>Email:</strong> {client.email || '-'}</Typography>
          </Grid>
      </Grid>
  </Box>
);

export default ClientInfo;