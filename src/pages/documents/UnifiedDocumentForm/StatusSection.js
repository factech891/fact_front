// src/pages/documents/UnifiedDocumentForm/StatusSection.js
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider
} from '@mui/material';
import {
  Flag as StatusIcon
} from '@mui/icons-material';

// Importar constantes
import { 
  DOCUMENT_STATUS, 
  DOCUMENT_STATUS_NAMES,
  DOCUMENT_STATUS_COLORS
} from '../constants/documentTypes';

/**
 * Sección para el estado del documento
 */
const StatusSection = ({ formData, onFieldChange, isInvoice = false }) => {
  // Manejar cambio de estado
  const handleStatusChange = (event) => {
    onFieldChange('status', event.target.value);
  };
  
  // Estados para facturas (adaptar según tu sistema)
  const invoiceStatuses = [
    { value: 'DRAFT', label: 'Borrador', color: 'default' },
    { value: 'PENDING', label: 'Pendiente', color: 'warning' },
    { value: 'PAID', label: 'Pagada', color: 'success' },
    { value: 'CANCELLED', label: 'Cancelada', color: 'error' }
  ];
  
  return (
    <Box>
      <Typography variant="h6" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <StatusIcon sx={{ mr: 1 }} />
        Estado del Documento
      </Typography>
      <Divider sx={{ mb: 3, opacity: 0.2 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl 
            fullWidth
            variant="filled"
            sx={{
              '& .MuiFilledInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                },
                '&.Mui-focused': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }
            }}
          >
            <InputLabel id="document-status-label">Estado</InputLabel>
            <Select
              labelId="document-status-label"
              value={formData.status}
              onChange={handleStatusChange}
              label="Estado"
            >
              {isInvoice ? (
                // Estados para facturas
                invoiceStatuses.map(status => (
                  <MenuItem key={status.value} value={status.value}>
                    <Chip 
                      size="small" 
                      label={status.label}
                      color={status.color}
                    />
                  </MenuItem>
                ))
              ) : (
                // Estados para documentos
                Object.keys(DOCUMENT_STATUS).map(key => (
                  <MenuItem key={key} value={DOCUMENT_STATUS[key]}>
                    <Chip 
                      size="small" 
                      label={DOCUMENT_STATUS_NAMES[DOCUMENT_STATUS[key]]} 
                      color={DOCUMENT_STATUS_COLORS[DOCUMENT_STATUS[key]]}
                    />
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Espacio para futuros campos relacionados con el estado */}
        <Grid item xs={12} md={6}>
          {/* Contenido futuro */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatusSection;