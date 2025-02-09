// src/pages/invoices/InvoicePreview/ClientInfo.js
import { Typography, Box } from '@mui/material';

const styles = {
  clientInfo: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    marginBottom: '30px',
    border: '1px solid #e0e0e7',
    borderRadius: '4px'
  },
  title: {
    color: '#002855',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '15px',
    borderBottom: '1px solid #e0e0e7',
    paddingBottom: '8px'
  },
  infoRow: {
    fontSize: '14px',
    color: '#2c3e50',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    fontWeight: '600',
    minWidth: '100px',
    display: 'inline-block',
    marginRight: '10px'
  },
  content: {
    display: 'inline-block'
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
      
      {clientFields.map((field, index) => {
        // Si el campo es opcional y no tiene valor, no lo mostramos
        if (field.optional && !field.value) return null;

        return (
          <Typography key={index} sx={styles.infoRow}>
            <span style={styles.label}>{field.label}:</span>
            <span style={styles.content}>
              {field.value || 'N/A'}
            </span>
          </Typography>
        );
      })}
    </Box>
  );
};

export default ClientInfo;