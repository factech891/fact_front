import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Box } from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import { useProducts } from './useProducts';

function Products() {
    const { products, loading, error, handleSave, handleDelete } = useProducts();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpen = (product) => {
        setEditing(product || null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditing(null);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredProducts = products.filter(product =>
        product.nombre && product.nombre.toLowerCase().includes(searchTerm)
    );

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant="h4" gutterBottom>Gestión de Productos</Typography>
                <TextField
                    variant="outlined"
                    label="Buscar producto"
                    value={searchTerm}
                    onChange={handleSearch}
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
                Nuevo Producto
            </Button>

            {loading ? (
                <Typography>Cargando productos...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <ProductTable
                    products={filteredProducts}
                    onEdit={handleOpen}
                    onDelete={handleDelete}  // Pasa handleDelete aquí
                />
            )}

            <ProductForm
                open={open}
                onClose={handleClose}
                product={editing}
                onSave={handleSave}
            />
        </Container>
    );
}

export default Products;