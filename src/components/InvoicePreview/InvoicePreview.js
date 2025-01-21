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
        borderBottom: '2px solid #002855',
        marginBottom: '20px',
        padding: '20px'
    },
    companyName: {
        color: '#002855',
        fontWeight: 'bold',
        fontSize: '24px',
        marginBottom: '10px'
    },
    companyInfo: {
        backgroundColor: '#F8F9FA',
        padding: '15px',
        borderRadius: '4px',
        border: '1px solid #D4E0F7'
    },
    clientInfo: {
        backgroundColor: '#F8F9FA',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #D4E0F7'
    },
    sectionTitle: {
        color: '#284B8C',
        fontWeight: 'bold',
        marginBottom: '10px'
    },
    invoiceTitle: {
        color: '#002855',
        fontWeight: 'bold',
        fontSize: '32px',
        marginBottom: '15px'
    },
    tableHeader: {
        backgroundColor: '#002855',
        color: 'white'
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#F8F9FA'
        }
    },
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
    },
    footer: {
        marginTop: '40px',
        borderTop: '1px solid #D4E0F7',
        padding: '20px',
        color: '#666'
    }
};

const InvoicePreview = ({ invoice }) => {
    return (
        <Paper sx={styles.invoiceContainer}>
            {/* Encabezado */}
            <Grid container sx={styles.header} spacing={2}>
                <Grid item xs={6}>
                    <Box sx={styles.companyInfo}>
                        <Typography sx={styles.companyName}>EMPRESA S.A.</Typography>
                        <Typography>CUIT: 30-12345678-9</Typography>
                        <Typography>Dirección: Calle Principal 123</Typography>
                        <Typography>Tel: (011) 4444-5555</Typography>
                        <Typography>Email: contacto@empresa.com</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography sx={styles.invoiceTitle}>FACTURA</Typography>
                    <Typography><strong>Serie:</strong> {invoice.series || invoice.id}</Typography>
                    <Typography><strong>Fecha:</strong> {new Date().toLocaleDateString()}</Typography>
                    <Typography><strong>Vencimiento:</strong> {new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}</Typography>
                </Grid>
            </Grid>

            {/* Información del cliente */}
            <Box sx={styles.clientInfo}>
                <Typography variant="h6" sx={styles.sectionTitle}>DATOS DEL CLIENTE</Typography>
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
                        <TableRow>
                            <TableCell sx={styles.tableHeader}>Descripción</TableCell>
                            <TableCell align="center" sx={styles.tableHeader}>Cantidad</TableCell>
                            <TableCell align="right" sx={styles.tableHeader}>Precio Unit.</TableCell>
                            <TableCell align="right" sx={styles.tableHeader}>Subtotal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(invoice.items || [{ 
                            descripcion: 'Producto/Servicio', 
                            cantidad: 1, 
                            precioUnitario: invoice.total, 
                            subtotal: invoice.total 
                        }]).map((item, index) => (
                            <TableRow key={index} sx={styles.tableRow}>
                                <TableCell>{item.descripcion}</TableCell>
                                <TableCell align="center">{item.cantidad}</TableCell>
                                <TableCell align="right">${item.precioUnitario.toFixed(2)}</TableCell>
                                <TableCell align="right">${item.subtotal.toFixed(2)}</TableCell>
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
                <Typography sx={styles.totalAmount}>
                    TOTAL: ${invoice.total}
                </Typography>
            </Box>

            {/* Pie de página */}
            <Box sx={styles.footer}>
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