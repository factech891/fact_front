import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Tooltip,
  IconButton
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_NAMES, DOCUMENT_VALIDITY_DAYS } from '../constants/documentTypes';

const DocumentTypeSelector = ({ value, onChange, error, helperText }) => {
  // Generate tooltip text with validity information
  const getValidityText = (type) => {
    const days = DOCUMENT_VALIDITY_DAYS[type];
    if (days === null) {
      return 'Sin vencimiento';
    }
    return `Validez: ${days} días`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormControl fullWidth error={Boolean(error)} size="small">
          <InputLabel id="document-type-label">Tipo de Documento</InputLabel>
          <Select
            labelId="document-type-label"
            value={value || DOCUMENT_TYPES.QUOTE}
            label="Tipo de Documento"
            onChange={onChange}
          >
            <MenuItem value={DOCUMENT_TYPES.QUOTE}>{DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.QUOTE]}</MenuItem>
            <MenuItem value={DOCUMENT_TYPES.PROFORMA}>{DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.PROFORMA]}</MenuItem>
            <MenuItem value={DOCUMENT_TYPES.DELIVERY_NOTE}>{DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.DELIVERY_NOTE]}</MenuItem>
          </Select>
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
        
        {value && (
          <Tooltip title={getValidityText(value)}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      
      {value && DOCUMENT_VALIDITY_DAYS[value] !== null && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Este documento tiene una validez de {DOCUMENT_VALIDITY_DAYS[value]} días
        </Typography>
      )}
    </Box>
  );
};

export default DocumentTypeSelector;