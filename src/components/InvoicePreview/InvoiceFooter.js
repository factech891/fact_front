// InvoiceFooter.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const styles = {
   footer: {
       position: 'absolute',
       bottom: 0,
       left: 0,
       right: 0,
       padding: '20px 50px',
       backgroundColor: '#f8f9fa',
       borderTop: '1px solid #e0e0e7'
   },
   section: {
       marginBottom: '5px'
   },
   title: {
       color: '#2c3e50',
       fontWeight: 'bold',
       fontSize: '9px'
   },
   content: {
       color: '#2c3e50',
       fontSize: '8px'
   }
};

const InvoiceFooter = ({ invoice }) => (
   <Box sx={styles.footer}>
       <Box sx={styles.section}>
           <Typography sx={styles.title}>
               Información de Pago:
           </Typography>
           <Typography sx={styles.content}>
               {invoice.condicionesPago} 
               {invoice.condicionesPago === 'Crédito' && 
                ` - ${invoice.diasCredito} días`}
           </Typography>
       </Box>

       <Box sx={styles.section}>
           <Typography sx={styles.title}>
               Notas:
           </Typography>
           <Typography sx={styles.content}>
               • Esta factura es un documento legal y sirve como comprobante fiscal.
               <br/>
               • Los precios incluyen IVA según corresponda.
               <br/>
               • Para cualquier consulta, por favor contacte a nuestro departamento de atención al cliente.
           </Typography>
       </Box>
   </Box>
);

export default InvoiceFooter;