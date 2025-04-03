// src/pages/clients/Clients.js - MODIFICADO PARA QUITAR TÍTULO Y ALINEAR BOTÓN
import { useState } from 'react';
import {
    Box,
    Button,
    Typography, // Ya no se usa para el título principal aquí
    Snackbar,
    Alert,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    DeleteForever as DeleteIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { ClientTable } from './ClientTable';
import { ClientForm } from './ClientForm';
import useClients from '../../hooks/useClients';

const Clients = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { clients, loading, error, saveClient, deleteClient, fetchClients } = useClients();

  const handleSave = async (client) => {
    try {
      console.log("Cliente enviado para guardar:", client);
      await saveClient(client);
      setOpenForm(false);
      setSelectedClient(null);
      setAlert({
        open: true,
        message: client._id ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente',
        severity: 'success'
      });
      if (fetchClients) fetchClients();
    } catch (error) {
      console.error('Error saving client:', error);
      setAlert({
        open: true,
        message: error.message || 'No se pudo guardar el cliente',
        severity: 'error'
      });
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    setClientIdToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (clientIdToDelete) {
      setDeleting(true);
      try {
        await deleteClient(clientIdToDelete);
        setAlert({ open: true, message: 'Cliente eliminado exitosamente', severity: 'success' });
         if (fetchClients) fetchClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        setAlert({ open: true, message: error.message || 'No se pudo eliminar el cliente', severity: 'error' });
      } finally {
        setDeleting(false);
        setOpenConfirmDialog(false);
        setClientIdToDelete(null);
      }
    }
  };

  const handleCloseConfirmDialog = () => {
    if (deleting) return;
    setOpenConfirmDialog(false);
    setClientIdToDelete(null);
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"> {/* Usar minHeight para mejor visualización */}
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Typography color="error" variant="h6" sx={{ textAlign: 'center', my: 4 }}>
      Error: {error.message || 'Ocurrió un error cargando los clientes'}
    </Typography>
  );

  return (
    <Box>
      {/* --- Bloque Modificado --- */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        {/* Typography eliminado */}

        {/* Botón con margen automático a la izquierda */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedClient(null);
            setOpenForm(true);
          }}
          sx={{ marginLeft: 'auto' }} // <--- ¡CAMBIO CLAVE AQUÍ!
        >
          Nuevo Cliente
        </Button>
      </Box>
      {/* --- Fin Bloque Modificado --- */}


       <Paper elevation={1} sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', bgcolor: '#1e1e1e' }}>
          <ClientTable
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
       </Paper>

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
        <Alert onClose={handleCloseAlert} severity={alert.severity} variant="filled" sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>

       <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
        disableEscapeKeyDown={deleting}
        PaperProps={{ sx: { bgcolor: '#1e1e1e', backgroundImage: 'none', border: '1px solid rgba(255, 255, 255, 0.1)' } }}
      >
        <DialogTitle
          id="confirm-delete-dialog-title"
          sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, px: 2 }}
        >
          Confirmar Eliminación
          <IconButton onClick={handleCloseConfirmDialog} sx={{ color: 'white' }} disabled={deleting}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: '#1e1e1e', color: 'rgba(255, 255, 255, 0.8)' }}>
          <DialogContentText id="confirm-delete-dialog-description" sx={{ color: 'inherit' }}>
            ¿Está seguro de que desea eliminar este cliente? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#2a2a2a', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} >
          <Button
            variant="outlined"
            onClick={handleCloseConfirmDialog}
            startIcon={<CancelIcon />}
            disabled={deleting}
            sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.3)', '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)', bgcolor: 'rgba(255, 255, 255, 0.05)' } }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Clients;