// InvoiceFooter.js 
import React from 'react';
import { Typography, Box } from '@mui/material';

const styles = {
   footer: {
       marginTop: '40px',
       borderTop: '1px solid #D4E0F7',
       padding: '20px',
       color: '#666'
   },
   section: {
       marginBottom: '10px'
   },
   title: {
       fontWeight: 'bold',
       marginBottom: '5px'
   }
};

const InvoiceFooter = ({ invoice }) => (
   <Box sx={styles.footer}>
       <Box sx={styles.section}>
           <Typography variant="subtitle2" sx={styles.title}>
               Información de Pago:
           </Typography>
           <Typography variant="body2">
               {invoice.infoBancaria || 'No especificada'}
           </Typography>
       </Box>

       <Box sx={styles.section}>
           <Typography variant="subtitle2" sx={styles.title}>
               Forma de Pago:
           </Typography>
           <Typography variant="body2">
               {invoice.condicionesPago} 
               {invoice.condicionesPago === 'Crédito' && invoice.diasCredito && 
                   ` - ${invoice.diasCredito} días`}
           </Typography>
       </Box>

       {invoice.observaciones && (
           <Box sx={styles.section}>
               <Typography variant="subtitle2" sx={styles.title}>
                   Observaciones:
               </Typography>
               <Typography variant="body2">
                   {invoice.observaciones}
               </Typography>
           </Box>
       )}
   </Box>
);

export default InvoiceFooter;