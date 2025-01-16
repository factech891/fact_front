import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Box } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';

function Clients() {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [editing, setEditing] = useState(null);

    // Fetch clients from backend
    useEffect(() => {
        fetch('http://localhost:5002/api/clients')  // ✅ Ruta actualizada
            .then(response => response.json())
            .then(data => {
                setClients(data);
                setFilteredClients(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    // Search filter
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredClients(clients.filter(client => client.name.toLowerCase().includes(term) || client.email.toLowerCase().includes(term)));
    };

    // Open and close dialog
    const handleOpen = (client) => {
        setEditing(client || null);
        setName(client ? client.name : '');
        setEmail(client ? client.email : '');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setName('');
        setEmail('');
        setEditing(null);
    };

    // Save or update client
    const handleSave = () => {
        if (!name || !email) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        const newClient = { name, email };
        const url = editing ? `http://localhost:5002/api/clients/${editing.id}` : 'http://localhost:5002/api/clients';  // ✅ Ruta actualizada
        const method = editing ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClient),
        })
            .then(response => response.json())
            .then(data => {
                const updatedClients = editing
                    ? clients.map(c => (c.id === data.id ? data : c))
                    : [...clients, data];

                setClients(updatedClients);
                setFilteredClients(updatedClients);
                handleClose();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al guardar el cliente. Inténtalo nuevamente.');
            });
    };

    // Delete client
    const handleDelete = (id) => {
        fetch(`http://localhost:5002/api/clients/${id}`, { method: 'DELETE' })  // ✅ Ruta actualizada
            .then(() => {
                const updatedClients = clients.filter(c => c.id !== id);
                setClients(updatedClients);
                setFilteredClients(updatedClients);
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant="h4" gutterBottom>Gestión de Clientes</Typography>
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
                Nuevo Cliente
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredClients.map(client => (
                            <TableRow key={client.id}>
                                <TableCell>{client.id}</TableCell>
                                <TableCell>{client.name}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(client)} color="primary"><Edit /></IconButton>
                                    <IconButton onClick={() => handleDelete(client.id)} color="error"><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editing ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

export default Clients;
