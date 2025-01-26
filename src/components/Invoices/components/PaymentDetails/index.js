// components/PaymentDetails/index.js
import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { styles } from './styles';

const PaymentDetails = ({ formData, onChange }) => (
   <Grid container spacing={2} sx={styles.container}>
       <Grid item xs={12} md={4}>
           <FormControl fullWidth>
               <InputLabel>Condiciones de Pago</InputLabel>
               <Select
                   value={formData.condicionesPago}
                   onChange={(e) => onChange('condicionesPago', e.target.value)}
                   label="Condiciones de Pago"
               >
                   <MenuItem value="Contado">Contado</MenuItem>
                   <MenuItem value="Crédito">Crédito</MenuItem>
               </Select>
           </FormControl>
       </Grid>
       {formData.condicionesPago === 'Crédito' && (
           <Grid item xs={12} md={4}>
               <TextField
                   label="Días de Crédito"
                   type="number"
                   value={formData.diasCredito}
                   onChange={(e) => onChange('diasCredito', e.target.value)}
                   fullWidth
                   InputProps={{ inputProps: { min: 1, max: 90 } }}
               />
           </Grid>
       )}
   </Grid>
);

export default PaymentDetails;