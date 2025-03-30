// src/pages/documents/components/ConvertToInvoiceModal.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Box,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import {
  Close as CloseIcon,
  Check as CheckIcon
} from '@mui/icons-material';

const ConvertToInvoiceModal = ({ open, onClose, onConfirm, document }) => {
  const [invoiceData, setInvoiceData] = useState({
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
    paymentTerms: 'Contado',
    creditDays: 0,
    documentType: 'invoice',
    convertAll: true // Opción para convertir todos los items
  });

  // Efecto para inicializar los datos basados en el documento
  useEffect(() => {
    if (document) {
      setInvoiceData(prev => ({
        ...prev,
        status: 'draft', // Siempre empezar como borrador
        date: new Date().toISOString().split('T')[0],
        paymentTerms: document.paymentTerms || 'Contado',
        creditDays: document.creditDays || 0,
        currency: document.currency || 'VES',
        documentType: 'invoice'
      }));
    }
  }, [document]);

  const handleChange = (field, value) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    // Preparar los datos para la conversión
    const dataToConvert = {
      ...invoiceData,
      originalDocument: document._id,
      // Mapear los datos necesarios desde el documento original
      client: document.client._id || document.client,
      items: document.items,
      subtotal: document.subtotal,
      tax: document.taxAmount,
      total: document.total,
      currency: document.currency,
      notes: document.notes,
      terms: document.terms
    };
    
    onConfirm(dataToConvert);
  };

  if (!document) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { bgcolor: '#1e1e1e' }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Convertir a Factura
      </DialogTitle>
      
      <DialogContent sx={{ bgcolor: '#1e1e1e', color: 'white' }}>
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Este documento ({document.documentNumber || 'Sin número'}) será convertido a factura manteniendo los datos del cliente, productos y montos.
          </Alert>
          
          <Box sx={{ p: 2, bgcolor: '#333', borderRadius: 1, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="white">
              Información del Documento Original
            </Typography>
            <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  <strong style={{ color: 'white' }}>Tipo:</strong> {document.type || 'No especificado'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  <strong style={{ color: 'white' }}>Cliente:</strong> {document.client?.nombre || 'No especificado'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  <strong style={{ color: 'white' }}>Total:</strong> {document.currency} {document.total?.toFixed(2) || '0.00'}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ p: 2, bgcolor: '#333', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="white">
              Estado de la Nueva Factura
            </Typography>
            <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
            
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={invoiceData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <FormControlLabel
                  value="draft"
                  control={<Radio sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    '&.Mui-checked': { color: 'white' }
                  }} />}
                  label="Borrador"
                  sx={{ 
                    '& .MuiFormControlLabel-label': { 
                      color: 'white',
                      fontWeight: invoiceData.status === 'draft' ? 'bold' : 'normal'
                    }
                  }}
                />
                <FormControlLabel
                  value="pending"
                  control={<Radio sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    '&.Mui-checked': { color: 'warning.main' }
                  }} />}
                  label="Pendiente"
                  sx={{ 
                    '& .MuiFormControlLabel-label': { 
                      color: 'warning.main',
                      fontWeight: invoiceData.status === 'pending' ? 'bold' : 'normal'
                    }
                  }}
                />
                <FormControlLabel
                  value="paid"
                  control={<Radio sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    '&.Mui-checked': { color: 'success.main' }
                  }} />}
                  label="Pagada"
                  sx={{ 
                    '& .MuiFormControlLabel-label': { 
                      color: 'success.main',
                      fontWeight: invoiceData.status === 'paid' ? 'bold' : 'normal'
                    }
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Box>
          
          <Box sx={{ p: 2, bgcolor: '#333', borderRadius: 1, mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="white">
              Datos de la Factura
            </Typography>
            <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Fecha de Emisión"
                  type="date"
                  fullWidth
                  value={invoiceData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiInputBase-input': { color: 'white' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Condiciones de Pago
                  </InputLabel>
                  <Select
                    value={invoiceData.paymentTerms}
                    label="Condiciones de Pago"
                    onChange={(e) => handleChange('paymentTerms', e.target.value)}
                    sx={{ 
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
                    }}
                  >
                    <MenuItem value="Contado">Contado</MenuItem>
                    <MenuItem value="Crédito">Crédito</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {invoiceData.paymentTerms === 'Crédito' && (
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Días de Crédito"
                    type="number"
                    fullWidth
                    value={invoiceData.creditDays}
                    onChange={(e) => handleChange('creditDays', parseInt(e.target.value) || 0)}
                    InputProps={{ inputProps: { min: 0 } }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputBase-input': { color: 'white' }
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        bgcolor: '#1e1e1e' 
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          startIcon={<CloseIcon />}
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.3)',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.8)',
            }
          }}
        >
          CANCELAR
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="primary"
          startIcon={<CheckIcon />}
        >
          CONVERTIR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConvertToInvoiceModal;