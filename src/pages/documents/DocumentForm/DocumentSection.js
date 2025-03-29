import React, { useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Typography,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { addDays } from 'date-fns';
import DocumentTypeSelector from '../components/DocumentTypeSelector';
import { DOCUMENT_TYPES, DOCUMENT_VALIDITY_DAYS } from '../constants/documentTypes';

// Solución alternativa para DatePicker sin usar AdapterDateFns
const SimpleDatePicker = ({ label, value, onChange, helperText }) => {
  // Convertir la fecha a formato yyyy-MM-dd para el input
  const dateValue = value 
    ? new Date(value).toISOString().split('T')[0] 
    : '';

  const handleChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    onChange(newDate);
  };

  return (
    <TextField
      label={label}
      type="date"
      fullWidth
      size="small"
      value={dateValue}
      onChange={handleChange}
      helperText={helperText}
      InputLabelProps={{ shrink: true }}
    />
  );
};

const DocumentSection = ({ formData, onChange }) => {
  // Update expiry date based on document type and date
  useEffect(() => {
    if (formData.date && formData.type) {
      const validityDays = DOCUMENT_VALIDITY_DAYS[formData.type];
      // If the document type has a validity period, calculate expiry date
      if (validityDays !== null) {
        const newExpiryDate = addDays(new Date(formData.date), validityDays);
        onChange('expiryDate', newExpiryDate);
      } else {
        // If the document type doesn't have expiry, set to null
        onChange('expiryDate', null);
      }
    }
  }, [formData.type, formData.date, onChange]);

  // Handle document type change
  const handleTypeChange = (event) => {
    onChange('type', event.target.value);
  };

  // Handle date changes
  const handleDateChange = (date) => {
    onChange('date', date);
  };

  const handleExpiryDateChange = (date) => {
    onChange('expiryDate', date);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Información del Documento
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Document Type */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="document-type-label">Tipo de Documento</InputLabel>
            <Select
              labelId="document-type-label"
              value={formData.type || DOCUMENT_TYPES.QUOTE}
              label="Tipo de Documento"
              onChange={handleTypeChange}
            >
              <MenuItem value={DOCUMENT_TYPES.QUOTE}>Presupuesto</MenuItem>
              <MenuItem value={DOCUMENT_TYPES.PROFORMA}>Factura Proforma</MenuItem>
              <MenuItem value={DOCUMENT_TYPES.DELIVERY_NOTE}>Nota de Entrega</MenuItem>
            </Select>
            <FormHelperText>Seleccione el tipo de documento</FormHelperText>
          </FormControl>
        </Grid>

        {/* Document Number */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Número de Documento"
            variant="outlined"
            size="small"
            value={formData.documentNumber || ''}
            onChange={(e) => onChange('documentNumber', e.target.value)}
            placeholder="Se generará automáticamente si lo deja en blanco"
            helperText="Número de referencia del documento"
          />
        </Grid>

        {/* Document Date */}
        <Grid item xs={12} md={6}>
          <SimpleDatePicker
            label="Fecha del Documento"
            value={formData.date || new Date()}
            onChange={handleDateChange}
            helperText="Fecha de emisión del documento"
          />
        </Grid>

        {/* Expiry Date - Only if the document type has a validity period */}
        {DOCUMENT_VALIDITY_DAYS[formData.type] !== null && (
          <Grid item xs={12} md={6}>
            <SimpleDatePicker
              label="Fecha de Vencimiento"
              value={formData.expiryDate || null}
              onChange={handleExpiryDateChange}
              helperText="Fecha de vencimiento del documento"
            />
          </Grid>
        )}

        {/* Currency */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="currency-label">Moneda</InputLabel>
            <Select
              labelId="currency-label"
              value={formData.currency || 'EUR'}
              label="Moneda"
              onChange={(e) => onChange('currency', e.target.value)}
            >
              <MenuItem value="EUR">Euro (€)</MenuItem>
              <MenuItem value="USD">Dólar ($)</MenuItem>
              <MenuItem value="GBP">Libra Esterlina (£)</MenuItem>
            </Select>
            <FormHelperText>Moneda en la que se emite el documento</FormHelperText>
          </FormControl>
        </Grid>

        {/* Document Notes */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notas"
            variant="outlined"
            size="small"
            multiline
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => onChange('notes', e.target.value)}
            helperText="Notas o comentarios adicionales para este documento"
          />
        </Grid>

        {/* Terms and Conditions */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Términos y Condiciones"
            variant="outlined"
            size="small"
            multiline
            rows={3}
            value={formData.terms || ''}
            onChange={(e) => onChange('terms', e.target.value)}
            helperText="Términos y condiciones aplicables al documento"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentSection;