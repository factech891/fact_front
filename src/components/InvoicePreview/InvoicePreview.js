import React from 'react';
import {
    Paper,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
} from '@mui/material';

const styles = {
    invoiceContainer: {
        padding: '40px',
        maxWidth: '800px',
        margin: '20px auto',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    },
    header: {
        borderBottom: '2px solid #1a237e',
        marginBottom: '20px',
        padding: '20px'
    },
    companyInfo: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px'
    },
    clientInfo: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    totalsSection: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        marginTop: '20px',
        textAlign: 'right'
    },
    title: {
        color: '#1a237e',
        fontWeight: 'bold'
    }
};

const InvoicePreview = ({ invoice }) => {
    return (
        <Paper sx={styles.invoiceContainer}>
            {/* Encabezado */}
            <Grid container sx={styles.header} spacing={2}>
                <Grid item xs={6}>
                    <Box sx={styles.companyInfo}>
                        <Typography variant="h6" sx={styles.title}>EMPRESA S.A.</Typography>
                        <Typography>CUIT: 30-12345678-9</Typography>
                        <Typography>Dirección: Calle Principal 123</Typography>
                        <Typography>Tel: (011) 4444-5555</Typography>
                        <Typography>Email: contacto@empresa.com</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" sx={styles.title}>FACTURA</Typography>
                    <Typography>Serie: {invoice.series || invoice.id}</Typography>
                    <Typography>Fecha: {new Date().toLocaleDateString()}</Typography>
                    <Typography>Vencimiento: {new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}</Typography>
                </Grid>
            </Grid>

            {/* Información del cliente */}
            <Box sx={styles.clientInfo}>
                <Typography variant="h6" gutterBottom sx={styles.title}>DATOS DEL CLIENTE</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography>
                            <strong>Cliente:</strong> {typeof invoice.client === 'string' 
                                ? invoice.client 
                                : invoice.client.nombre}
                        </Typography>
                        <Typography>
                            <strong>CUIT:</strong> {invoice.client?.cuit || '-'}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>
                            <strong>Dirección:</strong> {invoice.client?.direccion || '-'}
                        </Typography>
                        <Typography>
                            <strong>Cond. IVA:</strong> {invoice.client?.condicionIva || '-'}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Tabla de items */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1a237e' }}>
                            <TableCell sx={{ color: 'white' }}>Descripción</TableCell>
                            <TableCell align="center" sx={{ color: 'white' }}>Cantidad</TableCell>
                            <TableCell align="right" sx={{ color: 'white' }}>Precio Unit.</TableCell>
                            <TableCell align="right" sx={{ color: 'white' }}>Subtotal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(invoice.items || [{ 
                            descripcion: 'Producto/Servicio', 
                            cantidad: 1, 
                            precioUnitario: invoice.total, 
                            subtotal: invoice.total 
                        }]).map((item, index) => (
                            <TableRow key={index} sx={{ 
                                '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' }
                            }}>
                                <TableCell>{item.descripcion}</TableCell>
                                <TableCell align="center">{item.cantidad}</TableCell>
                                <TableCell align="right">${item.precioUnitario}</TableCell>
                                <TableCell align="right">${item.subtotal}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Sección de totales */}
            <Box sx={styles.totalsSection}>
                <Typography><strong>Subtotal:</strong> ${invoice.subtotal || invoice.total}</Typography>
                <Typography>
                    <strong>IVA ({invoice.iva?.tasa || 21}%):</strong> ${invoice.iva?.monto || (invoice.total * 0.21).toFixed(2)}
                </Typography>
                <Typography variant="h6" sx={styles.title}>
                    TOTAL: ${invoice.total}
                </Typography>
            </Box>

            {/* Pie de página */}
            <Box sx={{ marginTop: '40px', borderTop: '1px solid #ddd', padding: '20px' }}>
                <Typography variant="caption" display="block" gutterBottom>
                    <strong>Información de Pago:</strong> {invoice.infoBancaria || 'Datos bancarios para transferencias'}
                </Typography>
                {invoice.observaciones && (
                    <Typography variant="caption" display="block">
                        <strong>Observaciones:</strong> {invoice.observaciones}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default InvoicePreview;