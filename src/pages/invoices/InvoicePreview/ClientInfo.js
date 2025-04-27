import React from 'react';
// src/pages/invoices/InvoicePreview/ClientInfo.js
import { Typography, Box } from '@mui/material';

const getStyles = (theme) => ({
  clientInfo: {
    backgroundColor: theme.background.primary,
    padding: '15px 20px',
    marginBottom: '20px',
    border: `1px solid ${theme.border}`,
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
      background: theme.gradient
    }
  },
  title: {
    color: theme.primary,
    fontWeight: '600',
    fontSize: theme.fontSize.subtitle,
    marginBottom: '15px',
    paddingBottom: '8px',
    borderBottom: `1px solid ${theme.border}`,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px'
  },
  infoRow: {
    fontSize: theme.fontSize.body,
    color: theme.text.primary,
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    fontWeight: '600',
    minWidth: '100px',
    color: theme.text.secondary,
    position: 'relative',
    '&::after': {
      content: '":"',
      position: 'absolute',
      right: '8px'
    }
  },
  content: {
    flex: 1,
    paddingLeft: '5px',
    color: theme.text.primary
  }
});

export const ClientInfo = ({ client, theme }) => {
  if (!client) return null;

  const styles = getStyles(theme);

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