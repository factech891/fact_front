// src/pages/invoices/InvoiceForm/DocumentSection.js
import { 
    Card, Grid, FormControl, InputLabel, Select, MenuItem, 
    Typography, InputAdornment, TextField
  } from '@mui/material';
  import DescriptionIcon from '@mui/icons-material/Description';
  import ReceiptIcon from '@mui/icons-material/Receipt';
  import { DOCUMENT_TYPE_LIST } from '../constants/invoiceTypes';
  
  const DocumentSection = ({ documentType, invoiceNumber, onChange }) => {
    return (
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Documento</InputLabel>
              <Select
                value={documentType}
                onChange={(e) => onChange(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                  </InputAdornment>
                }
              >
                {DOCUMENT_TYPE_LIST.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            {invoiceNumber ? (
              <TextField
                fullWidth
                label="Número de Documento"
                value={invoiceNumber || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ReceiptIcon color="primary" />
                    </InputAdornment>
                  ),
                  readOnly: true
                }}
              />
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                El número de documento se generará automáticamente
              </Typography>
            )}
          </Grid>
        </Grid>
      </Card>
    );
  };
  
  export default DocumentSection;