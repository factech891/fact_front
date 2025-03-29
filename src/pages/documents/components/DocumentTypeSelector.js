import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_NAMES } from '../constants/documentTypes';

// Selector de tipo de documento al crear nuevo
const NewDocumentTypeSelector = ({ open, onClose }) => {
  const navigate = useNavigate();
  
  // Definición de tipos de documentos con iconos
  const documentTypeOptions = [
    {
      type: DOCUMENT_TYPES.QUOTE,
      name: 'Presupuesto',
      description: 'Cotización para un cliente con precios y condiciones',
      icon: (
        <Box sx={{ fontSize: 24 }}>
          <span role="img" aria-label="budget">💰</span>
        </Box>
      )
    },
    {
      type: DOCUMENT_TYPES.PROFORMA,
      name: 'Proforma',
      description: 'Factura preliminar sin valor fiscal',
      icon: (
        <Box sx={{ fontSize: 24 }}>
          <span role="img" aria-label="proforma">🧾</span>
        </Box>
      )
    },
    {
      type: DOCUMENT_TYPES.DELIVERY_NOTE,
      name: 'Nota de Entrega',
      description: 'Documento que acompaña la entrega de productos',
      icon: (
        <Box sx={{ fontSize: 24 }}>
          <span role="img" aria-label="delivery">📦</span>
        </Box>
      )
    }
  ];

  // Manejar selección de tipo
  const handleSelectType = (type) => {
    navigate(`/documents/new?type=${type}`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Seleccionar tipo de documento</Typography>
      </DialogTitle>
      <DialogContent>
        <List sx={{ pt: 0 }}>
          {documentTypeOptions.map((option) => (
            <ListItem
              button
              onClick={() => handleSelectType(option.type)}
              key={option.type}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.08)'
                }
              }}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText 
                primary={option.name} 
                secondary={option.description}
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewDocumentTypeSelector;