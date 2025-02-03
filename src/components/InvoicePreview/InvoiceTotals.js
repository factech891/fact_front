// InvoiceTotals.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const styles = {
  totalsSection: {
      backgroundColor: '#F8F9FA',
      padding: '20px',
      marginTop: '20px',
      textAlign: 'right',
      borderRadius: '4px',
      border: '1px solid #D4E0F7'
  },
  totalAmount: {
      color: '#002855',
      fontWeight: 'bold',
      fontSize: '20px'
  }
};

const InvoiceTotals = ({ invoice, moneda = 'USD' }) => {
   // Asumimos que el IVA es 16% si no está exento
   const subtotal = invoice.subtotal || 0;
   const descuentoGlobal = invoice.descuentoGlobal || 0;
   const ivaAmount = (invoice.iva?.monto || subtotal * 0.16);
   const total = (subtotal - descuentoGlobal + ivaAmount);

   return (
       <Box sx={styles.totalsSection}>
           <Typography>
               <strong>Subtotal:</strong> {moneda} {subtotal.toFixed(2)}
           </Typography>
           {descuentoGlobal > 0 && (
               <Typography>
                   <strong>Descuento Global:</strong> {moneda} {descuentoGlobal.toFixed(2)}
               </Typography>
           )}
           <Typography>
               <strong>IVA (16%):</strong> {moneda} {ivaAmount.toFixed(2)}
           </Typography>
           <Typography sx={styles.totalAmount}>
               <strong>TOTAL:</strong> {moneda} {total.toFixed(2)}
           </Typography>
       </Box>
   );
};

export default InvoiceTotals;