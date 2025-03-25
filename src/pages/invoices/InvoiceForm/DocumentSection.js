import { 
  Card, Grid, FormControl, Select, MenuItem, 
  Typography, InputAdornment, TextField 
} from '@mui/material';
import Description from '@mui/icons-material/Description';
import Receipt from '@mui/icons-material/Receipt';

// Constantes para tipos de documento
const DOCUMENT_TYPES = [
  { value: 'invoice', label: 'Factura' },
  { value: 'quote', label: 'Presupuesto' },
  { value: 'proforma', label: 'Factura Proforma' },
  { value: 'delivery', label: 'Nota de Entrega' }, // Nuevo tipo añadido
  { value: 'draft', label: 'Borrador' }
];

const DocumentSection = ({ documentType, invoiceNumber, onChange }) => {
  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography 
              component="label" 
              htmlFor="document-type-select" 
              sx={{ 
                mb: 1, 
                fontWeight: 'medium', 
                color: 'text.secondary',
                display: 'block'
              }}
            >
              Tipo de Documento
            </Typography>
            <Select
              id="document-type-select"
              value={documentType}
              onChange={(e) => onChange(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <Description color="primary" sx={{ mr: 1 }} />
                </InputAdornment>
              }
              // Estilos para mejorar visualización
              sx={{
                '& .MuiSelect-select': {
                  paddingLeft: '45px' // Espacio para el ícono
                }
              }}
            >
              {DOCUMENT_TYPES.map(type => (
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
                    <Receipt color="primary" />
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