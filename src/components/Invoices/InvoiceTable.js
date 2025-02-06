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
import PropTypes from 'prop-types';

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
                        <TableCell>Número</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {facturas.map(factura => (
                        <TableRow 
                            key={factura._id} 
                            hover 
                            sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                        >
                            <TableCell>{factura.number}</TableCell>
                            <TableCell>{factura.client?.nombre || 'Cliente desconocido'}</TableCell>
                            <TableCell>
                                ${new Intl.NumberFormat('es-ES').format(factura.total)}
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    onClick={() => onPreview(factura)}
                                    sx={{ color: 'var(--icon-view)' }}
                                    aria-label="Previsualizar factura"
                                >
                                    <Visibility />
                                </IconButton>
                                <IconButton
                                    onClick={() => onEdit(factura)}
                                    sx={{ color: 'var(--icon-edit)' }}
                                    aria-label="Editar factura"
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    onClick={() => onDelete(factura._id)}
                                    sx={{ color: 'var(--icon-delete)' }}
                                    aria-label="Eliminar factura"
                                >
                                    <Delete />
                                </IconButton>
                                <IconButton
                                    onClick={() => onDownload(factura._id)}
                                    sx={{ color: 'var(--icon-download)' }}
                                    aria-label="Descargar factura"
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

InvoiceTable.propTypes = {
    facturas: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            number: PropTypes.string.isRequired,
            client: PropTypes.shape({
                nombre: PropTypes.string
            }),
            total: PropTypes.number.isRequired
        })
    ),
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onPreview: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string
};

export default InvoiceTable;