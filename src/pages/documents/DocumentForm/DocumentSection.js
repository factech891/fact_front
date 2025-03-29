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
          <DocumentTypeSelector 
            value={formData.type} 
            onChange={handleTypeChange}
            helperText="Seleccione el tipo de documento"
          />
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
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Fecha del Documento"
              value={formData.date || null}
              onChange={handleDateChange}
              format="dd/MM/yyyy"
              slotProps={{ 
                textField: { 
                  fullWidth: true, 
                  size: "small",
                  helperText: "Fecha de emisión del documento" 
                } 
              }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Expiry Date - Only if the document type has a validity period */}
        {DOCUMENT_VALIDITY_DAYS[formData.type] !== null && (
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha de Vencimiento"
                value={formData.expiryDate || null}
                onChange={handleExpiryDateChange}
                format="dd/MM/yyyy"
                slotProps={{ 
                  textField: { 
                    fullWidth: true, 
                    size: "small",
                    helperText: "Fecha de vencimiento del documento" 
                  } 
                }}
              />
            </LocalizationProvider>
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