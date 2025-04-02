// src/pages/documents/UnifiedDocumentForm/NotesSection.js
import React from 'react';
import { Box, Typography, TextField, Grid } from '@mui/material';
import { Description as NotesIcon, Assignment as TermsIcon } from '@mui/icons-material';

// Versión actualizada para recibir notes y terms directamente, en lugar de formData
const NotesSection = ({ notes = '', terms = '', onNotesChange, onTermsChange }) => {
  // Si las funciones específicas onNotesChange y onTermsChange están disponibles, úsalas
  const handleNotesChange = (e) => {
    console.log('Notas cambiadas:', e.target.value);
    if (onNotesChange) {
      onNotesChange(e.target.value);
    }
  };

  const handleTermsChange = (e) => {
    console.log('Términos cambiados:', e.target.value);
    if (onTermsChange) {
      onTermsChange(e.target.value);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Notas y Términos
      </Typography>
      
      <Grid container spacing={2}>
        {/* Notas */}
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" mb={1}>
            <NotesIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1">Notas para el cliente</Typography>
          </Box>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            placeholder="Añadir notas o comentarios para el cliente..."
            value={notes}
            onChange={handleNotesChange}
            InputProps={{
              style: { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
            }}
          />
        </Grid>
        
        {/* Términos */}
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" mb={1}>
            <TermsIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1">Términos y condiciones</Typography>
          </Box>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            placeholder="Añadir términos y condiciones..."
            value={terms}
            onChange={handleTermsChange}
            InputProps={{
              style: { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotesSection;