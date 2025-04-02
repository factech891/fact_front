// src/pages/clients/Clients.js
import { useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ClientTable } from './ClientTable';
import { ClientForm } from './ClientForm';
import useClients from '../../hooks/useClients';

const Clients = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  
  // Usamos el hook
  const { clients, loading, error, saveClient, deleteClient } = useClients();

  const handleSave = async (client) => {
    try {
      setSaving(true);
      console.log("Cliente enviado para guardar:", client);
      
      await saveClient(client);
      
      setOpenForm(false);
      setSelectedClient(null);
      setAlert({
        open: true,
        message: 'Cliente guardado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving client:', error);
      // Aquí mostramos el error al usuario con un mensaje amigable
      setAlert({
        open: true,
        message: error.message || 'No se pudo guardar el cliente',
        severity: 'error'
      });
    } finally {
      setSaving(false);
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
        setAlert({
          open: true,
          message: 'Cliente eliminado exitosamente',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error deleting client:', error);
        setAlert({
          open: true,
          message: error.message || 'No se pudo eliminar el cliente',
          severity: 'error'
        });
      }
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Typography color="error" variant="h6" sx={{ textAlign: 'center', my: 4 }}>
      Error: {error}
    </Typography>
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedClient(null);
            setOpenForm(true);
          }}
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

      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Clients;