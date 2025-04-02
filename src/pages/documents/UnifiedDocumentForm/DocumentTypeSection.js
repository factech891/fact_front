// src/pages/documents/UnifiedDocumentForm/DocumentTypeSection.js
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Divider
} from '@mui/material';
import {
  CalendarMonth as DateIcon,
  Description as DocumentIcon
} from '@mui/icons-material';

// Importar constantes de documentos
import {
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_NAMES,
  DOCUMENT_STATUS, // Estados para documentos generales
  DOCUMENT_STATUS_NAMES,
  DOCUMENT_STATUS_COLORS
} from '../constants/documentTypes';

// Definir estados de factura explícitamente (usar MAYÚSCULAS)
const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED'
};

const INVOICE_STATUS_NAMES = {
  [INVOICE_STATUS.DRAFT]: 'Borrador',
  [INVOICE_STATUS.PENDING]: 'Pendiente',
  [INVOICE_STATUS.PAID]: 'Pagada',
  [INVOICE_STATUS.CANCELLED]: 'Cancelada'
};

// Definir colores para estados de factura (puedes ajustar)
const INVOICE_STATUS_COLORS = {
    [INVOICE_STATUS.DRAFT]: 'default', // o 'grey'
    [INVOICE_STATUS.PENDING]: 'warning',
    [INVOICE_STATUS.PAID]: 'success',
    [INVOICE_STATUS.CANCELLED]: 'error'
};


/**
 * Sección para tipo de documento, fechas y estado
 */
const DocumentTypeSection = ({ formData, errors, onFieldChange, isInvoice = false }) => {

  // Manejador genérico para simplificar
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFieldChange(name, value);

    // Lógica adicional si cambia el tipo de documento (y no es factura)
    if (name === 'documentType' && !isInvoice) {
        onFieldChange('type', value); // Mantener compatibilidad
        // No necesitas recalcular fecha aquí, ya lo hace el form principal
    }
  };


  return (
    <Box>
      <Typography variant="h6" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <DocumentIcon sx={{ mr: 1 }} />
        Información del Documento
      </Typography>
      <Divider sx={{ mb: 3, opacity: 0.2 }} />

      <Grid container spacing={3}>
        {/* Tipo de documento */}
        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            error={!!errors.documentType}
            variant="filled"
            sx={{ '& .MuiFilledInput-root': { bgcolor: 'rgba(255, 255, 255, 0.05)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }, '&.Mui-focused': { bgcolor: 'rgba(255, 255, 255, 0.1)' } } }}
          >
            <InputLabel id="document-type-label">Tipo de Documento</InputLabel>
            <Select
              labelId="document-type-label"
              name="documentType" // Añadir name para handleChange genérico
              value={formData.documentType}
              onChange={handleChange}
              label="Tipo de Documento"
              disabled={isInvoice} // Deshabilitar para facturas
            >
              {isInvoice ? (
                <MenuItem value="INVOICE">Factura</MenuItem>
              ) : (
                Object.keys(DOCUMENT_TYPES).map(key => (
                  <MenuItem key={key} value={DOCUMENT_TYPES[key]}>
                    {DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES[key]] || DOCUMENT_TYPES[key]}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.documentType && (
              <FormHelperText error>{errors.documentType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Número de documento */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Número de Documento"
            value={formData.documentNumber || 'Se generará automáticamente'}
            disabled={true}
            variant="filled"
            InputProps={{
              readOnly: true,
              startAdornment: formData.documentNumber && (
                <Chip
                  size="small"
                  // Mostrar "Factura" o el nombre del tipo de documento
                  label={isInvoice ? 'Factura' : (DOCUMENT_TYPE_NAMES[formData.documentType] || formData.documentType)}
                  color="primary"
                  sx={{ mr: 1 }}
                />
              )
            }}
            sx={{ '& .MuiFilledInput-root': { bgcolor: 'rgba(255, 255, 255, 0.05)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } } }}
          />
        </Grid>

        {/* Fecha del documento */}
        <Grid item xs={12} md={isInvoice || formData.documentType !== DOCUMENT_TYPES.QUOTE ? 6 : 4}> {/* Ajustar ancho si hay fecha de exp */}
          <TextField
            fullWidth
            required
            label="Fecha de Emisión"
            type="date"
            name="date" // Añadir name
            value={formData.date}
            onChange={handleChange}
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ shrink: true }}
            variant="filled"
            InputProps={{ startAdornment: <DateIcon sx={{ mr: 1, opacity: 0.7 }} /> }}
            sx={{ '& .MuiFilledInput-root': { bgcolor: 'rgba(255, 255, 255, 0.05)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }, '&.Mui-focused': { bgcolor: 'rgba(255, 255, 255, 0.1)' } } }}
          />
        </Grid>

        {/* Fecha de expiración (solo para cotizaciones) */}
        {!isInvoice && formData.documentType === DOCUMENT_TYPES.QUOTE && (
          <Grid item xs={12} md={4}> {/* Ajustar ancho */}
            <TextField
              fullWidth
              label="Fecha de Vencimiento"
              type="date"
              name="expiryDate" // Añadir name
              value={formData.expiryDate || ''} // Mostrar vacío si es null
              onChange={handleChange}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              InputLabelProps={{ shrink: true }}
              variant="filled"
              InputProps={{ startAdornment: <DateIcon sx={{ mr: 1, opacity: 0.7 }} /> }}
              sx={{ '& .MuiFilledInput-root': { bgcolor: 'rgba(255, 255, 255, 0.05)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }, '&.Mui-focused': { bgcolor: 'rgba(255, 255, 255, 0.1)' } } }}
            />
          </Grid>
        )}

        {/* Estado del documento */}
        {/* Ajustar ancho según si hay fecha de exp o no */}
        <Grid item xs={12} md={isInvoice || formData.documentType !== DOCUMENT_TYPES.QUOTE ? 6 : 4}>
          <FormControl
            fullWidth
            variant="filled"
            error={!!errors.status}
            sx={{ '& .MuiFilledInput-root': { bgcolor: 'rgba(255, 255, 255, 0.05)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }, '&.Mui-focused': { bgcolor: 'rgba(255, 255, 255, 0.1)' } } }}
          >
            <InputLabel id="document-status-label">Estado</InputLabel>
            <Select
              labelId="document-status-label"
              name="status" // Añadir name
              value={formData.status} // Ya debería estar en MAYÚSCULAS por la lógica del form
              onChange={handleChange}
              label="Estado"
            >
              {isInvoice ? (
                // Usar constantes definidas arriba para facturas (MAYÚSCULAS)
                Object.keys(INVOICE_STATUS).map(key => (
                  <MenuItem key={key} value={INVOICE_STATUS[key]}>
                    <Chip
                      size="small"
                      label={INVOICE_STATUS_NAMES[key]}
                      color={INVOICE_STATUS_COLORS[key]}
                      sx={INVOICE_STATUS_COLORS[key] === 'default' ? { bgcolor: 'grey.700', color: 'white'} : {}} // Estilo específico para default
                    />
                  </MenuItem>
                ))
              ) : (
                // Estados para documentos generales
                Object.keys(DOCUMENT_STATUS).map(key => (
                  <MenuItem key={key} value={DOCUMENT_STATUS[key]}>
                    <Chip
                      size="small"
                      label={DOCUMENT_STATUS_NAMES[DOCUMENT_STATUS[key]]}
                      color={DOCUMENT_STATUS_COLORS[DOCUMENT_STATUS[key]]}
                      sx={DOCUMENT_STATUS_COLORS[DOCUMENT_STATUS[key]] === 'default' ? { bgcolor: 'grey.700', color: 'white'} : {}}
                    />
                  </MenuItem>
                ))
              )}
            </Select>
             {errors.status && (
              <FormHelperText error>{errors.status}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentTypeSection;