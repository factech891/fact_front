// src/pages/invoices/InvoicePreview/ClientInfo.js
import { Typography, Box } from '@mui/material';

const styles = {
  clientInfo: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    marginBottom: '30px',
    border: '1px solid #e0e0e7'
  },
  title: {
    color: '#002855',
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '15px'
  },
  infoRow: {
    fontSize: '10px',
    color: '#2c3e50',
    marginBottom: '5px'
  },
  label: {
    fontWeight: 'bold',
    display: 'inline-block',
    marginRight: '5px'
  },
  content: {
    display: 'inline-block'
  }
};

export const ClientInfo = ({ client }) => {
  if (!client) return null;

  return (
    <Box sx={styles.clientInfo}>
      <Typography sx={styles.title}>
        DATOS DEL CLIENTE
      </Typography>
      
      <Typography sx={styles.infoRow}>
        <span style={styles.label}>Cliente:</span>
        <span style={styles.content}>{client.nombre || 'N/A'}</span>
      </Typography>
      
      <Typography sx={styles.infoRow}>
        <span style={styles.label}>RIF/CI:</span>
        <span style={styles.content}>{client.rif || 'N/A'}</span>
      </Typography>
      
      <Typography sx={styles.infoRow}>
        <span style={styles.label}>Dirección:</span>
        <span style={styles.content}>{client.direccion || 'N/A'}</span>
      </Typography>
      
      {client.telefono && (
        <Typography sx={styles.infoRow}>
          <span style={styles.label}>Teléfono:</span>
          <span style={styles.content}>{client.telefono}</span>
        </Typography>
      )}
      
      {client.email && (
        <Typography sx={styles.infoRow}>
          <span style={styles.label}>Email:</span>
          <span style={styles.content}>{client.email}</span>
        </Typography>
      )}
    </Box>
  );
};

export default ClientInfo;