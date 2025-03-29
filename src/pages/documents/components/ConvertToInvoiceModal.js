// src/pages/documents/components/ConvertToInvoiceModal.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { DOCUMENT_TYPE_NAMES } from '../constants/documentTypes';

const ConvertToInvoiceModal = ({ open, onClose, onConfirm, document }) => {
  // Estados para la configuración de la factura
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [keepDocumentReference, setKeepDocumentReference] = useState(true);
  const [series, setSeries] = useState('');
  const [useCurrentExchangeRate, setUseCurrentExchangeRate] = useState(true);
  
  // Formatear fecha para el campo de fecha
  const formatDateForInput = (date) => {
    if (!date) return '';
    return date instanceof Date
      ? date.toISOString().split('T')[0]
      : new Date(date).toISOString().split('T')[0];
  };
  
  // Formatear moneda
  const formatCurrency = (amount, currency = 'EUR') => {
    if (amount === undefined || amount === null) return '—';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  // Manejar cambio de fecha
  const handleDateChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : new Date();
    setInvoiceDate(newDate);
  };
  
  // Manejar confirmación
  const handleConfirm = () => {
    onConfirm({
      invoiceDate,
      keepDocumentReference,
      series,
      useCurrentExchangeRate,
      documentId: document?._id
    });
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Convertir a Factura
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Está a punto de convertir {document ? `un ${DOCUMENT_TYPE_NAMES[document.type]}` : 'este documento'} en una factura.
          Este proceso creará una nueva factura y marcará el documento original como convertido.
        </DialogContentText>
        
        {/* Información del documento a convertir */}
        {document && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Detalles del documento:
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Número:</strong> {document.documentNumber || '—'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Tipo:</strong> {DOCUMENT_TYPE_NAMES[document.type]}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Cliente:</strong> {document.client?.name || '—'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Fecha:</strong> {document.date ? new Date(document.date).toLocaleDateString() : '—'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Total:</strong> {document.total
                    ? formatCurrency(document.total, document.currency)
                    : '—'
                  }
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Configuración de la factura:
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {/* Fecha de la factura */}
          <TextField
            label="Fecha de factura"
            type="date"
            value={formatDateForInput(invoiceDate)}
            onChange={handleDateChange}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            helperText="Fecha de emisión de la factura"
          />
          
          {/* Serie de factura */}
          <FormControl fullWidth size="small">
            <InputLabel id="invoice-series-label">Serie</InputLabel>
            <Select
              labelId="invoice-series-label"
              value={series}
              label="Serie"
              onChange={(e) => setSeries(e.target.value)}
            >
              <MenuItem value="">Ninguna</MenuItem>
              <MenuItem value="A">Serie A</MenuItem>
              <MenuItem value="B">Serie B</MenuItem>
              <MenuItem value="C">Serie C</MenuItem>
            </Select>
            <FormHelperText>Serie para la numeración de facturas</FormHelperText>
          </FormControl>
          
          {/* Incluir referencia */}
          <FormControlLabel
            control={
              <Checkbox
                checked={keepDocumentReference}
                onChange={(e) => setKeepDocumentReference(e.target.checked)}
              />
            }
            label="Incluir referencia al documento original en la factura"
          />
          
          {/* Tasa de cambio (solo para monedas diferentes a EUR) */}
          {document && document.currency && document.currency !== 'EUR' && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={useCurrentExchangeRate}
                  onChange={(e) => setUseCurrentExchangeRate(e.target.checked)}
                />
              }
              label="Usar tasa de cambio actual (en lugar de la original)"
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="primary"
        >
          Convertir a Factura
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConvertToInvoiceModal;