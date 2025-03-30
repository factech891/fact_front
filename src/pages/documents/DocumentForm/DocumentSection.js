// src/pages/documents/DocumentForm/DocumentSection.js
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider
} from '@mui/material';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_NAMES, DOCUMENT_VALIDITY_DAYS, DOCUMENT_STATUS } from '../constants/documentTypes';
import { CURRENCY_LIST } from '../../invoices/constants/taxRates';

const DocumentSection = ({ formData, onFieldChange }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Información del Documento
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={3}>
        {/* Tipo de documento */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="document-type-label">Tipo de Documento</InputLabel>
            <Select
              labelId="document-type-label"
              value={formData.type}
              label="Tipo de Documento"
              onChange={(e) => onFieldChange('type', e.target.value)}
            >
              <MenuItem value={DOCUMENT_TYPES.QUOTE}>{DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.QUOTE]}</MenuItem>
              <MenuItem value={DOCUMENT_TYPES.PROFORMA}>{DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.PROFORMA]}</MenuItem>
              <MenuItem value={DOCUMENT_TYPES.DELIVERY_NOTE}>{DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.DELIVERY_NOTE]}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Fecha */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha"
            type="date"
            value={formData.date || ''}
            onChange={(e) => onFieldChange('date', e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            helperText="Fecha del documento"
          />
        </Grid>
        
        {/* Fecha de vencimiento */}
        {DOCUMENT_VALIDITY_DAYS[formData.type] !== null && (
          <Grid item xs={12} md={6}>
            <TextField
              label="Fecha de Vencimiento"
              type="date"
              value={formData.expiryDate || ''}
              onChange={(e) => onFieldChange('expiryDate', e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              helperText={`Vence a los ${DOCUMENT_VALIDITY_DAYS[formData.type]} días`}
            />
          </Grid>
        )}
        
        {/* Moneda */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="currency-label">Moneda</InputLabel>
            <Select
              labelId="currency-label"
              value={formData.currency || 'VES'}
              label="Moneda"
              onChange={(e) => onFieldChange('currency', e.target.value)}
            >
              {CURRENCY_LIST.map((currency) => (
                <MenuItem key={currency.value} value={currency.value}>
                  {currency.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Estado */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-label">Estado</InputLabel>
            <Select
              labelId="status-label"
              value={formData.status}
              label="Estado"
              onChange={(e) => onFieldChange('status', e.target.value)}
            >
              <MenuItem value={DOCUMENT_STATUS.DRAFT}>Borrador</MenuItem>
              <MenuItem value={DOCUMENT_STATUS.SENT}>Enviado</MenuItem>
              <MenuItem value={DOCUMENT_STATUS.APPROVED}>Aprobado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Notas */}
        <Grid item xs={12}>
          <TextField
            label="Notas"
            value={formData.notes || ''}
            onChange={(e) => onFieldChange('notes', e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
            helperText="Notas adicionales para el documento"
          />
        </Grid>
        
        {/* Términos */}
        <Grid item xs={12}>
          <TextField
            label="Términos y Condiciones"
            value={formData.terms || ''}
            onChange={(e) => onFieldChange('terms', e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
            helperText="Términos y condiciones del documento"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentSection;