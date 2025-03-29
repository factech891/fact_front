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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { DOCUMENT_TYPE_NAMES } from '../constants/documentTypes';

const ConvertToInvoiceModal = ({ open, onClose, onConfirm, document }) => {
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [keepDocumentReference, setKeepDocumentReference] = useState(true);
  const [series, setSeries] = useState('');
  const [useCurrentExchangeRate, setUseCurrentExchangeRate] = useState(true);
  
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
          Está a punto de convertir un {DOCUMENT_TYPE_NAMES[document?.type] || 'documento'} en una factura. 
          Este proceso creará una nueva factura y marcará el documento original como convertido.
        </DialogContentText>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Detalles del documento:
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Número:</strong> {document?.documentNumber || '-'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Cliente:</strong> {document?.client?.name || '-'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Fecha:</strong> {document?.date ? new Date(document.date).toLocaleDateString() : '-'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Total:</strong> {document?.total 
              ? new Intl.NumberFormat('es-ES', { 
                  style: 'currency', 
                  currency: document.currency || 'EUR' 
                }).format(document.total) 
              : '-'}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Configuración de la factura:
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker 
              label="Fecha de factura"
              value={invoiceDate}
              onChange={(newDate) => setInvoiceDate(newDate)}
              format="dd/MM/yyyy"
              slotProps={{ textField: { fullWidth: true, size: "small" } }}
            />
          </LocalizationProvider>
          
          <FormControl size="small">
            <InputLabel id="series-label">Serie</InputLabel>
            <Select
              labelId="series-label"
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
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={keepDocumentReference} 
                onChange={(e) => setKeepDocumentReference(e.target.checked)}
              />
            }
            label="Incluir referencia al documento original en la factura"
          />
          
          {document?.currency !== 'EUR' && (
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
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Convertir a Factura
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConvertToInvoiceModal;<strong>Número:</strong> {document?.documentNumber || '-'}
          </Typography>
          <Typography variant="body2" gutterBottom></Typography>