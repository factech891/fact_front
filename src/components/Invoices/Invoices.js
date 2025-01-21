import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    Box,
} from '@mui/material';
import { Add, Edit, Delete, Search, Download, Visibility, Close as CloseIcon } from '@mui/icons-material';
import InvoicePreview from '../InvoicePreview/InvoicePreview';

function Invoices() {
    const [facturas, setFacturas] = useState([]);
    const [filteredFacturas, setFilteredFacturas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [cliente, setCliente] = useState('');
    const [total, setTotal] = useState('');
    const [editing, setEditing] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5002/api/invoices')
            .then(response => response.json())
            .then(data => {
                setFacturas(data);
                setFilteredFacturas(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredFacturas(facturas.filter(factura =>
            (typeof factura.client === 'string' 
                ? factura.client 
                : factura.client.nombre
            ).toLowerCase().includes(term)
        ));
    };

    const handleOpen = (factura) => {
        setEditing(factura || null);
        setCliente(factura ? (typeof factura.client === 'string' ? factura.client : factura.client.nombre) : '');
        setTotal(factura ? factura.total : '');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCliente('');
        setTotal('');
        setEditing(null);
    };

    const handlePreviewOpen = (factura) => {
        setSelectedInvoice(factura);
        setPreviewOpen(true);
    };

    const handlePreviewClose = () => {
        setPreviewOpen(false);
        setSelectedInvoice(null);
    };

    const handleSave = () => {
        if (!cliente || !total) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        const newInvoice = { client: cliente, total: parseFloat(total) };
        const url = editing ? `http://localhost:5002/api/invoices/${editing.id}` : 'http://localhost:5002/api/invoices';
        const method = editing ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newInvoice),
        })
            .then(response => response.json())
            .then(data => {
                const updatedFacturas = editing
                    ? facturas.map(f => (f.id === data.id ? data : f))
                    : [...facturas, data];

                setFacturas(updatedFacturas);
                setFilteredFacturas(updatedFacturas);
                handleClose();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al guardar la factura. Inténtalo nuevamente.');
            });
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:5002/api/invoices/${id}`, { method: 'DELETE' })
            .then(() => {
                const updatedFacturas = facturas.filter(f => f.id !== id);
                setFacturas(updatedFacturas);
                setFilteredFacturas(updatedFacturas);
            })
            .catch(error => console.error('Error:', error));
    };

    const handleDownloadPDF = (id) => {
        fetch(`http://localhost:5002/api/invoices/${id}/pdf`)
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error('Error generando el PDF');
                }
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `factura_${id}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error descargando el PDF:', error));
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant="h4" gutterBottom>Gestión de Facturas</Typography>
                <TextField
                    variant="outlined"
                    label="Buscar cliente"
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{ width: '300px' }}
                    InputProps={{ endAdornment: <Search /> }}
                />
            </Box>

            <Button variant="contained" color="primary" onClick={() => handleOpen(null)} startIcon={<Add />} sx={{ marginBottom: '20px' }}>
                Nueva Factura
            </Button>

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
                        {filteredFacturas.map(factura => (
                            <TableRow key={factura.id}>
                                <TableCell>{factura.id}</TableCell>
                                <TableCell>
                                    {typeof factura.client === 'string' ? factura.client : factura.client.nombre}
                                </TableCell>
                                <TableCell>${factura.total}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handlePreviewOpen(factura)} color="info">
                                        <Visibility />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpen(factura)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(factura.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                    <IconButton onClick={() => handleDownloadPDF(factura.id)} color="secondary">
                                        <Download />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editing ? 'Editar Factura' : 'Nueva Factura'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Cliente"
                        fullWidth
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Total"
                        type="number"
                        fullWidth
                        value={total}
                        onChange={(e) => setTotal(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={previewOpen}
                onClose={handlePreviewClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Vista Previa de Factura
                    <IconButton
                        onClick={handlePreviewClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedInvoice && <InvoicePreview invoice={selectedInvoice} />}
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default Invoices;