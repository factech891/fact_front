import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Box } from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import InvoiceForm from './InvoiceForm';
import InvoiceTable from './InvoiceTable';
import { useInvoices } from './useInvoices';
import InvoicePreview from '../InvoicePreview/InvoicePreview';

function Invoices() {
    const {
        facturas,
        filteredFacturas,
        searchTerm,
        handleSearch,
        handleSave,
        handleDelete,
    } = useInvoices();

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const handleOpen = (factura) => {
        setEditing(factura || null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditing(null);
    };

    const handlePreviewOpen = (factura) => {
        setSelectedInvoice(factura);
        setPreviewOpen(true);
    };

    const handlePreviewClose = () => {
        setSelectedInvoice(null);
        setPreviewOpen(false);
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
                    onChange={(e) => handleSearch(e.target.value)}
                    sx={{ width: '300px' }}
                    InputProps={{ endAdornment: <Search /> }}
                />
            </Box>

            <Button
                variant="contained"
                sx={{
                    backgroundColor: 'var(--primary-color)',
                    color: '#fff',
                    marginBottom: '20px',
                    '&:hover': {
                        backgroundColor: 'var(--secondary-color)',
                    },
                }}
                onClick={() => handleOpen(null)}
                startIcon={<Add />}
            >
                Nueva Factura
            </Button>

            <InvoiceTable
                facturas={filteredFacturas}
                onEdit={handleOpen}
                onDelete={handleDelete}
                onPreview={handlePreviewOpen}
                onDownload={handleDownloadPDF}
            />

            <InvoiceForm
                open={open}
                onClose={handleClose}
                invoice={editing}
                onSave={handleSave}
            />

            <InvoicePreview
                open={previewOpen && !!selectedInvoice}
                onClose={handlePreviewClose}
                invoice={selectedInvoice}
            />
        </Container>
    );
}

export default Invoices;