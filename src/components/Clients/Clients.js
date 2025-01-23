import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Box } from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import ClientTable from './ClientTable';
import ClientForm from './ClientForm';
import { useClients } from './useClients';

function Clients() {
    const { clients, loading, error, saveClient, deleteClient } = useClients();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpen = (client) => {
        setEditing(client || null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditing(null);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredClients = clients.filter(client =>
        client.name && client.name.toLowerCase().includes(searchTerm)
    );

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
                Nuevo Cliente
            </Button>

            {loading ? (
                <Typography>Cargando clientes...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <ClientTable
                    clients={filteredClients}
                    onEdit={handleOpen}
                    onDelete={deleteClient}
                />
            )}

            <ClientForm
                open={open}
                onClose={handleClose}
                client={editing}
                onSave={saveClient}
            />
        </Container>
    );
}

export default Clients;