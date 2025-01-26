// components/InvoiceTotals/index.js
import React from 'react';
import { Typography, Grid } from '@mui/material';
import { styles } from './styles';

const InvoiceTotals = ({ subtotal, iva, total, moneda }) => (
   <Grid container spacing={1} sx={styles.container}>
       <Grid item xs={12}>
           <Typography variant="h6" align="right">
               Subtotal: {moneda} {subtotal.toFixed(2)}
           </Typography>
           <Typography variant="h6" align="right">
               IVA (16%): {moneda} {iva.toFixed(2)}
           </Typography>
           <Typography variant="h6" align="right" sx={styles.total}>
               Total: {moneda} {total.toFixed(2)}
           </Typography>
       </Grid>
   </Grid>
);

export default InvoiceTotals;