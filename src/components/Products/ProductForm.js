import React from 'react';
import { 
    TextField, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button 
} from '@mui/material';

function ProductForm({ open, onClose, product, onSave }) {
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        if (product) {
            setName(product.name || '');
            setPrice(product.price?.toString() || '');
        }
    }, [product]);

    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'El nombre del producto es requerido';
        if (!price || isNaN(price) || parseFloat(price) <= 0) {
            newErrors.price = 'Ingrese un precio válido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave({
                ...product,
                name,
                price: parseFloat(price),
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setName('');
        setPrice('');
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{product ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nombre del Producto"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    margin="dense"
                    label="Precio"
                    type="number"
                    fullWidth
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    error={!!errors.price}
                    helperText={errors.price}
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

export default ProductForm;