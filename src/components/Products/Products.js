import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Box } from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import { useProducts } from './useProducts';

function Products() {
    const { products, loading, error, handleSave, handleDelete } = useProducts();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null); // Aquí almacenaremos el producto que se está editando
    const [searchTerm, setSearchTerm] = useState('');

    // Abre el formulario de edición o creación
    const handleOpen = (product) => {
        setEditing(product || null); // Si no se pasa un producto, es una creación
        setOpen(true);
    };

    // Cierra el formulario
    const handleClose = () => {
        setOpen(false);
        setEditing(null); // Reinicia el estado de edición
    };

    // Maneja la búsqueda de productos
    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    // Filtra los productos según el término de búsqueda
    const filteredProducts = products.filter(product =>
        product.nombre && product.nombre.toLowerCase().includes(searchTerm)
    );

    return (
        <Container>
            {/* Título y barra de búsqueda */}
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

            {/* Botón para agregar un nuevo producto */}
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
                onClick={() => handleOpen(null)} // Abre el formulario para crear un nuevo producto
                startIcon={<Add />}
            >
                Nuevo Producto
            </Button>

            {/* Mostrar mensajes de carga o error */}
            {loading ? (
                <Typography>Cargando productos...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                // Tabla de productos filtrados
                <ProductTable
                    products={filteredProducts}
                    onEdit={handleOpen} // Pasa el producto a editar
                    onDelete={handleDelete} // Pasa la función para eliminar un producto
                />
            )}

            {/* Formulario de edición/creación */}
            <ProductForm
                open={open}
                onClose={handleClose}
                product={editing} // Pasa el producto que se está editando (o null si es nuevo)
                onSave={handleSave} // Pasa la función para guardar el producto
            />
        </Container>
    );
}

export default Products;