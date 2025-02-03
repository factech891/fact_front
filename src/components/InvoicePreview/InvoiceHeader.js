import React from 'react';
import { Grid, Typography, Box } from '@mui/material';

const styles = {
   header: {
       borderBottom: '2px solid #002855',
       marginBottom: '20px',
       padding: '20px'
   },
   companyInfo: {
       backgroundColor: '#F8F9FA',
       padding: '15px',
       borderRadius: '4px',
       border: '1px solid #D4E0F7'
   },
   companyName: {
       color: '#002855',
       fontWeight: 'bold',
       fontSize: '24px',
       marginBottom: '10px'
   },
   invoiceTitle: {
       color: '#002855',
       fontWeight: 'bold',
       fontSize: '32px',
       marginBottom: '15px'
   }
};

const InvoiceHeader = ({ empresa, invoice }) => (
   <Grid container sx={styles.header} spacing={2}>
       <Grid item xs={6}>
           <Box sx={styles.companyInfo}>
               <Typography sx={styles.companyName}>{empresa.nombre}</Typography>
               <Typography>RIF: {empresa.rif}</Typography>
               <Typography>Dirección: {empresa.direccion}</Typography>
               <Typography>Teléfono: {empresa.telefono}</Typography>
               <Typography>Email: {empresa.email}</Typography>
           </Box>
       </Grid>
       <Grid item xs={6} sx={{ textAlign: 'right' }}>
           <Typography sx={styles.invoiceTitle}>FACTURA</Typography>
           <Typography><strong>N°:</strong> {invoice.series}</Typography>
           <Typography><strong>Fecha:</strong> {new Date(invoice.fechaEmision).toLocaleDateString()}</Typography>
           <Typography><strong>Vencimiento:</strong> {new Date(invoice.fechaVencimiento).toLocaleDateString()}</Typography>
           <Typography><strong>Moneda:</strong> {invoice.moneda}</Typography>
           <Typography><strong>Condición de Pago:</strong> {invoice.condicionesPago}</Typography>
       </Grid>
   </Grid>
);

export default InvoiceHeader;