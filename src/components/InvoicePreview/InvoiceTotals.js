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

const InvoiceTotals = ({ invoice, iva }) => (
   <Box sx={styles.totalsSection}>
       <Typography><strong>Subtotal:</strong> ${invoice.subtotal?.toFixed(2)}</Typography>
       <Typography>
           <strong>IVA ({iva.tasa}%):</strong> ${iva.monto?.toFixed(2)}
       </Typography>
       <Typography sx={styles.totalAmount}>
           TOTAL: ${invoice.total?.toFixed(2)}
       </Typography>
   </Box>
);

export default InvoiceTotals;