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
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import '../../styles/global.css'; // Importar global.css

function Productos() {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [editing, setEditing] = useState(null);

    // Fetch products from backend
    useEffect(() => {
        fetch('http://localhost:5002/api/products')
            .then(response => response.json())
            .then(data => {
                setProductos(data);
                setFilteredProductos(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    // Search filter
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredProductos(productos.filter(producto => producto.name.toLowerCase().includes(term)));
    };

    // Open and close dialog
    const handleOpen = (producto) => {
        setEditing(producto || null);
        setNombre(producto ? producto.name : '');
        setPrecio(producto ? producto.price : '');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNombre('');
        setPrecio('');
        setEditing(null);
    };

    // Save or update product
    const handleSave = () => {
        if (!nombre || !precio) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        const newProduct = { name: nombre, price: precio };
        const url = editing ? `http://localhost:5002/api/products/${editing.id}` : 'http://localhost:5002/api/products';
        const method = editing ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct),
        })
            .then(response => response.json())
            .then(data => {
                const updatedProductos = editing
                    ? productos.map(p => (p.id === data.id ? data : p))
                    : [...productos, data];

                setProductos(updatedProductos);
                setFilteredProductos(updatedProductos);
                handleClose();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al guardar el producto. Inténtalo nuevamente.');
            });
    };

    // Delete product
    const handleDelete = (id) => {
        fetch(`http://localhost:5002/api/products/${id}`, { method: 'DELETE' })
            .then(() => {
                const updatedProductos = productos.filter(p => p.id !== id);
                setProductos(updatedProductos);
                setFilteredProductos(updatedProductos);
            })
            .catch(error => console.error('Error:', error));
    };

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

            {/* Botón "Nuevo Producto" */}
            <Button
                variant="contained"
                sx={{
                    backgroundColor: 'var(--primary-color)', // Usamos la variable de global.css
                    color: '#fff',
                    marginBottom: '20px',
                    '&:hover': {
                        backgroundColor: 'var(--secondary-color)', // Cambia al color secundario en hover
                    },
                }}
                onClick={() => handleOpen(null)}
                startIcon={<Add />}
            >
                Nuevo Producto
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProductos.map(producto => (
                            <TableRow key={producto.id}>
                                <TableCell>{producto.id}</TableCell>
                                <TableCell>{producto.name}</TableCell>
                                <TableCell>${producto.price}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleOpen(producto)}
                                        sx={{ color: 'var(--icon-edit)' }} // Verde para editar
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(producto.id)}
                                        sx={{ color: 'var(--icon-delete)' }} // Rojo para borrar
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editing ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Precio"
                        type="number"
                        fullWidth
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
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
        </Container>
    );
}

export default Productos;