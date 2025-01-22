import React from 'react';
import { 
    TextField, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button 
} from '@mui/material';

function InvoiceForm({ open, onClose, invoice, onSave }) {
    const [cliente, setCliente] = React.useState({ nombre: '', direccion: '', cuit: '', condicionIva: '' });
    const [total, setTotal] = React.useState('');
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        if (invoice) {
            setCliente(invoice.client || { nombre: '', direccion: '', cuit: '', condicionIva: '' });
            setTotal(invoice.total?.toString() || '');
        }
    }, [invoice]);

    const validateForm = () => {
        const newErrors = {};
        if (!cliente.nombre.trim()) newErrors.cliente = 'El nombre del cliente es requerido';
        if (!total || isNaN(total) || parseFloat(total) <= 0) {
            newErrors.total = 'Ingrese un total válido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave({
                ...invoice,
                client: cliente,
                total: parseFloat(total),
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setCliente({ nombre: '', direccion: '', cuit: '', condicionIva: '' });
        setTotal('');
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{invoice ? 'Editar Factura' : 'Nueva Factura'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nombre del Cliente"
                    fullWidth
                    value={cliente.nombre}
                    onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                    error={!!errors.cliente}
                    helperText={errors.cliente}
                />
                <TextField
                    margin="dense"
                    label="Dirección del Cliente"
                    fullWidth
                    value={cliente.direccion}
                    onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="CUIT del Cliente"
                    fullWidth
                    value={cliente.cuit}
                    onChange={(e) => setCliente({ ...cliente, cuit: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Condición de IVA"
                    fullWidth
                    value={cliente.condicionIva}
                    onChange={(e) => setCliente({ ...cliente, condicionIva: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Total"
                    type="number"
                    fullWidth
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    error={!!errors.total}
                    helperText={errors.total}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button
                    onClick={handleSave}
                    sx={{
                        backgroundColor: 'var(--primary-color)',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: 'var(--secondary-color)',
                        },
                    }}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default InvoiceForm;