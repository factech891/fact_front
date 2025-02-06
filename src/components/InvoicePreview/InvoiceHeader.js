import React from 'react';
import { Grid, Typography, Box } from '@mui/material';

const styles = {
    header: {
        backgroundColor: '#002855',
        color: 'white',
        padding: '30px 20px',
        marginBottom: '20px',
        height: '150px'
    },
    companyInfo: {
        padding: '10px',
    },
    companyName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: '24px',
        marginBottom: '10px'
    },
    companyText: {
        color: 'white',
        fontSize: '10px',
        marginBottom: '5px'
    },
    invoiceBox: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '4px',
        color: '#002855',
        marginTop: '-10px',
        height: '100px'
    },
    invoiceTitle: {
        color: '#002855',
        fontWeight: 'bold',
        fontSize: '20px',
        marginBottom: '15px'
    }
};

const empresaDefault = {
    nombre: 'Tu Empresa',
    direccion: 'Dirección de la empresa',
    rif: 'J-123456789',
    telefono: '+58 424-1234567',
    email: 'info@tuempresa.com'
};

const InvoiceHeader = ({ invoice }) => (
    <Grid container sx={styles.header}>
        <Grid item xs={6}>
            <Box sx={styles.companyInfo}>
                <Typography sx={styles.companyName}>
                    {empresaDefault.nombre}
                </Typography>
                <Typography sx={styles.companyText}>
                    {empresaDefault.direccion}
                </Typography>
                <Typography sx={styles.companyText}>
                    RIF: {empresaDefault.rif}
                </Typography>
                <Typography sx={styles.companyText}>
                    Tel: {empresaDefault.telefono}
                </Typography>
                <Typography sx={styles.companyText}>
                    Email: {empresaDefault.email}
                </Typography>
            </Box>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Box sx={styles.invoiceBox}>
                <Typography sx={styles.invoiceTitle}>FACTURA</Typography>
                <Typography>N°: {invoice.number}</Typography>
                <Typography>
                    Fecha: {new Date(invoice.date).toLocaleDateString()}
                </Typography>
                <Typography>
                    {invoice.condicionesPago === 'Crédito' && 
                     `Días de crédito: ${invoice.diasCredito}`}
                </Typography>
            </Box>
        </Grid>
    </Grid>
);

export default InvoiceHeader;