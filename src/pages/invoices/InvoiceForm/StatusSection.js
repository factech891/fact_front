// src/pages/invoices/InvoiceForm/StatusSection.js
import { 
    Card, Typography, Divider, FormControl, RadioGroup, 
    FormControlLabel, Radio, Box 
  } from '@mui/material';
  import { INVOICE_STATUS_LIST } from '../constants/invoiceStatus';
  
  const StatusSection = ({ status, onChange }) => {
    return (
      <Card sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Estado del Documento
        </Typography>
        <Divider sx={{ my: 1 }} />
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={status}
            onChange={(e) => onChange(e.target.value)}
          >
            {INVOICE_STATUS_LIST.filter(item => 
              ['draft', 'pending', 'paid'].includes(item.value)
            ).map((statusOption) => (
              <FormControlLabel 
                key={statusOption.value}
                value={statusOption.value} 
                control={<Radio />} 
                label={statusOption.label} 
                sx={{ 
                  '& .MuiFormControlLabel-label': { 
                    color: statusOption.value === 'draft' ? 'text.secondary' : 
                           statusOption.value === 'pending' ? 'warning.main' : 
                           statusOption.value === 'paid' ? 'success.main' : 'text.primary',
                    fontWeight: status === statusOption.value ? 'bold' : 'normal'
                  } 
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Card>
    );
  };
  
  export default StatusSection;