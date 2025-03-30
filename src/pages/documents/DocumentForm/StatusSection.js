// src/pages/documents/DocumentForm/StatusSection.js
import React from 'react';
import { 
  Box, Typography, Divider, // Aseguramos que Divider esté correctamente importado
  FormControl, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import { DOCUMENT_STATUS } from '../constants/documentTypes';

// Lista de estados para los documentos
const DOCUMENT_STATUS_LIST = [
  { value: DOCUMENT_STATUS.DRAFT, label: 'Borrador', color: 'text.secondary' },
  { value: DOCUMENT_STATUS.SENT, label: 'Enviado', color: 'warning.main' },
  { value: DOCUMENT_STATUS.APPROVED, label: 'Aprobado', color: 'success.main' }
];

const StatusSection = ({ status, onChange }) => {
  return (
    <Box sx={{ p: 2, bgcolor: '#333', borderRadius: 1, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="white">
        Estado del Documento
      </Typography>
      <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
      
      <FormControl component="fieldset">
        <RadioGroup
          row
          value={status || DOCUMENT_STATUS.DRAFT}
          onChange={(e) => onChange(e.target.value)}
        >
          {DOCUMENT_STATUS_LIST.map((statusOption) => (
            <FormControlLabel 
              key={statusOption.value}
              value={statusOption.value} 
              control={<Radio sx={{ 
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-checked': {
                  color: statusOption.value === DOCUMENT_STATUS.DRAFT ? 'white' : 
                         statusOption.value === DOCUMENT_STATUS.SENT ? 'warning.main' : 'success.main',
                }
              }} />} 
              label={statusOption.label} 
              sx={{ 
                '& .MuiFormControlLabel-label': { 
                  color: 'white',
                  fontWeight: status === statusOption.value ? 'bold' : 'normal'
                } 
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default StatusSection;