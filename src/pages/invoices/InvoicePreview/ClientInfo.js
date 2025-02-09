// src/pages/invoices/InvoicePreview/ClientInfo.js
import { Typography, Box } from '@mui/material';

const styles = {
  clientInfo: {
    backgroundColor: '#ffffff',
    padding: '15px 20px',
    marginBottom: '20px',
    border: '1px solid #e0e0e7',
    borderRadius: '6px',
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '3px',
      background: 'linear-gradient(to bottom, #002855, #0057a8)'
    }
  },
  title: {
    color: '#002855',
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '15px',
    paddingBottom: '8px',
    borderBottom: '1px solid #f0f0f0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px'
  },
  infoRow: {
    fontSize: '13px',
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    fontWeight: '600',
    minWidth: '100px',
    color: '#4a5568',
    position: 'relative',
    '&::after': {
      content: '":"',
      position: 'absolute',
      right: '8px'
    }
  },
  content: {
    flex: 1,
    paddingLeft: '5px'
  }
};

export const ClientInfo = ({ client }) => {
  if (!client) return null;

  const clientFields = [
    { label: 'Cliente', value: client.nombre },
    { label: 'RIF/CI', value: client.rif },
    { label: 'Dirección', value: client.direccion },
    { label: 'Teléfono', value: client.telefono, optional: true },
    { label: 'Email', value: client.email, optional: true }
  ];

  return (
    <Box sx={styles.clientInfo}>
      <Typography sx={styles.title}>
        DATOS DEL CLIENTE
      </Typography>
      
      <Box sx={styles.infoGrid}>
        {clientFields.map((field, index) => {
          if (field.optional && !field.value) return null;
          
          return (
            <Box key={index} sx={styles.infoRow}>
              <span style={styles.label}>{field.label}</span>
              <span style={styles.content}>{field.value || 'N/A'}</span>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ClientInfo;