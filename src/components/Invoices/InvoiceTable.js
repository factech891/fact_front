import React from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    IconButton,
    CircularProgress,
    Typography,
    Box
} from '@mui/material';
import { Edit, Delete, Visibility, Download } from '@mui/icons-material';

function InvoiceTable({ facturas, onEdit, onDelete, onPreview, onDownload, loading, error }) {
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );
    }

    if (!facturas?.length) {
        return (
            <Typography align="center" py={3}>
                No hay facturas disponibles
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {facturas.map(factura => (
                        <TableRow key={factura.id}>
                            <TableCell>{factura.id}</TableCell>
                            <TableCell>{factura.client.nombre}</TableCell> {/* Acceder a la propiedad nombre */}
                            <TableCell>
                                ${new Intl.NumberFormat('es-ES').format(factura.total)}
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    onClick={() => onPreview(factura)}
                                    sx={{ color: 'var(--icon-view)' }}
                                >
                                    <Visibility />
                                </IconButton>
                                <IconButton
                                    onClick={() => onEdit(factura)}
                                    sx={{ color: 'var(--icon-edit)' }}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    onClick={() => onDelete(factura.id)}
                                    sx={{ color: 'var(--icon-delete)' }}
                                >
                                    <Delete />
                                </IconButton>
                                <IconButton
                                    onClick={() => onDownload(factura.id)}
                                    sx={{ color: 'var(--icon-download)' }}
                                >
                                    <Download />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default InvoiceTable;