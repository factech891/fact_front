// InvoiceFooter.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const styles = {
   footer: {
       marginTop: '40px',
       borderTop: '1px solid #D4E0F7',
       padding: '20px',
       color: '#666'
   }
};

const InvoiceFooter = ({ invoice }) => (
   <Box sx={styles.footer}>
       <Typography variant="caption" display="block" gutterBottom>
           <strong>Información de Pago:</strong> {invoice.infoBancaria || '-'}
       </Typography>
       {invoice.observaciones && (
           <Typography variant="caption" display="block">
               <strong>Observaciones:</strong> {invoice.observaciones}
           </Typography>
       )}
   </Box>
);

export default InvoiceFooter;