import React from 'react';
import { 
    TextField, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button 
} from '@mui/material';

function ClientForm({ open, onClose, client, onSave }) {
    const [nombre, setNombre] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        if (client) {
            setNombre(client.name || '');
            setEmail(client.email || '');
        }
    }, [client]);

    const validateForm = () => {
        const newErrors = {};
        if (!nombre.trim()) newErrors.nombre = 'El nombre del cliente es requerido';
        if (!email.trim()) newErrors.email = 'El email del cliente es requerido';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave({
                ...client,
                name: nombre,
                email,
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setNombre('');
        setEmail('');
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{client ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nombre del Cliente"
                    fullWidth
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                />
                <TextField
                    margin="dense"
                    label="Email del Cliente"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
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

export default ClientForm;