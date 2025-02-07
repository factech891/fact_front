// src/pages/clients/Clients.js
import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ClientTable } from './ClientTable';
import { ClientForm } from './ClientForm';
import { useClients } from '../../hooks/useClients';

const Clients = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const { clients, loading, error, saveClient, deleteClient } = useClients();

  const handleSave = async (client) => {
    try {
      await saveClient(client);
      setOpenForm(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await deleteClient(id);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Nuevo Cliente
        </Button>
      </Box>

      <ClientTable 
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ClientForm
        open={openForm}
        client={selectedClient}
        onClose={() => {
          setOpenForm(false);
          setSelectedClient(null);
        }}
        onSave={handleSave}
      />
    </Box>
  );
};

export default Clients;