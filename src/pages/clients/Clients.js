// src/pages/clients/Clients.js (CORREGIDO)
import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Snackbar,
    Alert,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Grid
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    DeleteForever as DeleteIcon,
    Cancel as CancelIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { ClientTable } from './ClientTable';
import { ClientForm } from './ClientForm';
import useClients from '../../hooks/useClients';
import { useRoleAccess } from '../../hooks/useRoleAccess'; // Importamos el hook
import ActionButton from '../../components/ActionButton'; // Importamos el componente ActionButton

const Clients = () => {
  // Estilo para botones de acción principal
  const actionButtonStyle = {
    borderRadius: '50px',
    color: 'white',
    fontWeight: 600,
    padding: '8px 22px',
    textTransform: 'none',
    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
    transition: 'all 0.2s ease-in-out',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)',
      backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
      backgroundColor: 'transparent',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 10px rgba(79, 172, 254, 0.4)',
    },
    '&.Mui-disabled': {
      backgroundImage: 'linear-gradient(to right, #919191 0%, #b7b7b7 100%)',
      color: 'rgba(255, 255, 255, 0.6)',
    }
  };

  // Usar nuestro hook de control de acceso
  const { userRole } = useRoleAccess();

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
      
      // Verificar existencia de API
      if (!saveClient) {
        throw new Error("La función saveClient no está disponible");
      }
      
      // Asegurar que tenemos todos los campos necesarios
      const preparedClient = {
        ...client,
        // Asegurar valores por defecto para campos críticos
        telefono: client.telefono || '',
        direccion: client.direccion || '',
        tipoPersona: client.tipoPersona || 'natural',
        tipoCliente: client.tipoCliente || 'regular'
      };
      
      const savedClient = await saveClient(preparedClient);
      console.log("Cliente guardado correctamente:", savedClient);
      
      setOpenForm(false);
      setSelectedClient(null);
      setAlert({
        open: true,
        message: client._id ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente',
        severity: 'success'
      });
      
      // Asegurarse de actualizar la lista de clientes
      if (fetchClients) {
        console.log("Actualizando lista de clientes...");
        await fetchClients();
      }
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
        
        // Asegurarse de actualizar la lista de clientes
        if (fetchClients) {
          console.log("Actualizando lista de clientes después de eliminar...");
          await fetchClients();
        }
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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Typography color="error" variant="h6" sx={{ textAlign: 'center', my: 4 }}>
      Error: {error.message || 'Ocurrió un error cargando los clientes'}
    </Typography>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        {/* Reemplazamos el botón normal por ActionButton, manteniendo alineación a la derecha */}
        <ActionButton
          type="create"
          onClick={() => {
            setSelectedClient(null);
            setOpenForm(true);
          }}
          tooltipTitle="Crear nuevo cliente"
          buttonProps={{
            variant: "contained",
            startIcon: <AddIcon />,
            sx: { ...actionButtonStyle }
          }}
        >
          NUEVO CLIENTE
        </ActionButton>
      </Box>

       <Paper elevation={1} sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', bgcolor: '#1e1e1e' }}>
          <ClientTable
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isVisor={userRole === 'visor'} // Pasamos la prop para informar si es visor
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

      {/* Mensaje para usuarios con rol visor */}
      {userRole === 'visor' && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
          <InfoIcon sx={{ color: '#2196f3', mr: 1 }} />
          <Typography color="#2196f3">
            Modo de solo lectura: Como Visor, puedes ver todos los datos pero no puedes crear, editar o eliminar registros.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Clients;