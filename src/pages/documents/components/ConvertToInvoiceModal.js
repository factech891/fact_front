// src/pages/documents/components/ConvertToInvoiceModal.js
import React, { useState } from 'react';
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
  Typography
} from '@mui/material';

const ConvertToInvoiceModal = ({ open, onClose, onConfirm, document }) => {
  const [invoiceData, setInvoiceData] = useState({
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
    paymentTerms: document?.paymentTerms || 'Contado',
    creditDays: document?.creditDays || 0
  });

  const handleChange = (field, value) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    onConfirm(invoiceData);
  };

  if (!document) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Convertir a Factura</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Este documento ({document.documentNumber}) será convertido a factura con los siguientes datos:
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Fecha"
              type="date"
              fullWidth
              value={invoiceData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Estado de la Factura</InputLabel>
              <Select
                value={invoiceData.status}
                label="Estado de la Factura"
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <MenuItem value="draft">Borrador</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="paid">Pagada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Condiciones de Pago</InputLabel>
              <Select
                value={invoiceData.paymentTerms}
                label="Condiciones de Pago"
                onChange={(e) => handleChange('paymentTerms', e.target.value)}
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
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm} variant="contained">
          Convertir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConvertToInvoiceModal;