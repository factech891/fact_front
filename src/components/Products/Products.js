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

function Productos() {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [editando, setEditando] = useState(null);

    // Cargar productos desde el backend
    useEffect(() => {
        fetch('http://localhost:5002/productos')
            .then(response => response.json())
            .then(data => {
                setProductos(data);
                setFilteredProductos(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    // Filtro de búsqueda
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredProductos(productos.filter(producto =>
            producto.nombre.toLowerCase().includes(term)
        ));
    };

    // Abrir y cerrar el modal
    const handleOpen = (producto) => {
        setEditando(producto || null);
        setNombre(producto ? producto.nombre : '');
        setPrecio(producto ? producto.precio : '');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNombre('');
        setPrecio('');
        setEditando(null);
    };

    // Guardar o actualizar un producto
    const handleSave = () => {
        if (!nombre || !precio) {
            alert('Todos los campos son obligatorios.');
            return;
        }
        if (isNaN(precio) || parseFloat(precio) <= 0) {
            alert('El precio debe ser un número positivo.');
            return;
        }

        const nuevoProducto = { nombre, precio };
        const url = editando ? `http://localhost:5002/productos/${editando.id}` : 'http://localhost:5002/productos';
        const method = editando ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProducto),
        })
            .then(response => response.json())
            .then(data => {
                const updatedProductos = editando
                    ? productos.map(p => (p.id === data.id ? data : p))
                    : [...productos, data];

                setProductos(updatedProductos);
                setFilteredProductos(updatedProductos);
                handleClose();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al guardar los datos. Inténtalo nuevamente.');
            });
    };

    // Eliminar un producto
    const handleDelete = (id) => {
        fetch(`http://localhost:5002/productos/${id}`, { method: 'DELETE' })
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

            <Button variant="contained" color="primary" onClick={() => handleOpen(null)} startIcon={<Add />} sx={{ marginBottom: '20px' }}>
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
                                <TableCell>{producto.nombre}</TableCell>
                                <TableCell>${producto.precio}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(producto)} color="primary"><Edit /></IconButton>
                                    <IconButton onClick={() => handleDelete(producto.id)} color="error"><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editando ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
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
                        fullWidth
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Productos;
