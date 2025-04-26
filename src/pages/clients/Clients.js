// src/pages/clients/Clients.js - MEJORADO CON MUI + ESTILO PERSONALIZADO
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
    LinearProgress,
    Paper,
    styled
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Cancel as CancelIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { ClientTable } from './ClientTable';
import { ClientForm } from './ClientForm';
import useClients from '../../hooks/useClients';
import { useRoleAccess } from '../../hooks/useRoleAccess';

// Componentes estilizados
const PageContainer = styled(Box)(({ theme }) => ({
  padding: '24px',
  backgroundColor: '#121212',
  color: 'white',
  minHeight: 'calc(100vh - 64px)',
  position: 'relative'
}));

const GradientButton = styled(Button)(({ theme }) => ({
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
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 24px',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 'calc(100vh - 64px)',
  backgroundColor: '#121212'
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  padding: '24px',
  backgroundColor: '#121212',
  color: 'white',
  minHeight: 'calc(100vh - 64px)'
}));

const Clients = () => {
  // Usar nuestro hook de control de acceso
  const { userRole, canCreate } = useRoleAccess();

  const [openForm, setOpenForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { clients, loading, error, saveClient, deleteClient, fetchClients } = useClients();

  const handleSave = async (client) => {
    setIsSubmitting(true);
    try {
      if (!saveClient) {
        throw new Error("La función saveClient no está disponible");
      }
      
      const preparedClient = {
        ...client,
        telefono: client.telefono || '',
        direccion: client.direccion || '',
        tipoPersona: client.tipoPersona || 'natural',
        tipoCliente: client.tipoCliente || 'regular'
      };
      
      const savedClient = await saveClient(preparedClient);
      
      setOpenForm(false);
      setSelectedClient(null);
      setAlert({
        open: true,
        message: client._id ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente',
        severity: 'success'
      });
      
      if (fetchClients) {
        await fetchClients();
      }
    } catch (error) {
      console.error('Error saving client:', error);
      setAlert({
        open: true,
        message: error.message || 'No se pudo guardar el cliente',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
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
      setIsSubmitting(true);
      try {
        await deleteClient(clientIdToDelete);
        setAlert({ open: true, message: 'Cliente eliminado exitosamente', severity: 'success' });
        
        if (fetchClients) {
          await fetchClients();
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        setAlert({ open: true, message: error.message || 'No se pudo eliminar el cliente', severity: 'error' });
      } finally {
        setDeleting(false);
        setOpenConfirmDialog(false);
        setClientIdToDelete(null);
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseConfirmDialog = () => {
    if (deleting) return;
    setOpenConfirmDialog(false);
    setClientIdToDelete(null);
  };

  const handleCloseForm = () => {
    if (isSubmitting) return;
    setOpenForm(false);
    setSelectedClient(null);
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  if (loading && !clients?.length) {
    return (
      <LoadingContainer>
        <CircularProgress sx={{ color: '#4facfe' }} />
        <Typography sx={{ color: 'white', ml: 2 }}>Cargando clientes...</Typography>
      </LoadingContainer>
    );
  }

  if (error && !clients?.length) {
    return (
      <ErrorContainer>
        <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
          Error al cargar los clientes: {error.message || 'Error desconocido.'}
        </Alert>
      </ErrorContainer>
    );
  }

  return (
    <PageContainer>
      {/* Indicador de carga global */}
      {isSubmitting && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1500 }}>
          <LinearProgress 
            sx={{
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
              },
              backgroundColor: 'rgba(0,0,0,0.2)'
            }} 
          />
        </Box>
      )}

      {/* Botón Nuevo Cliente */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        {canCreate && canCreate() && (
          <GradientButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedClient(null);
              setOpenForm(true);
            }}
            disabled={isSubmitting}
          >
            NUEVO CLIENTE
          </GradientButton>
        )}
      </Box>

      {/* Tabla de clientes mejorada */}
      <Paper 
        elevation={0} 
        sx={{ 
          backgroundColor: 'transparent', 
          mb: 3 
        }}
      >
        <ClientTable
          clients={clients || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading || isSubmitting}
          isVisor={userRole === 'visor'}
        />
      </Paper>

      {/* Formulario Modal de Cliente */}
      <ClientForm
        open={openForm}
        client={selectedClient}
        onClose={handleCloseForm}
        onSave={handleSave}
      />

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        PaperProps={{ 
          sx: { 
            backgroundColor: '#2a2a2a', 
            color: 'white', 
            borderRadius: '8px', 
            border: '1px solid rgba(255, 255, 255, 0.1)' 
          } 
        }}
      >
        <StyledDialogTitle>
          Confirmar eliminación
          <IconButton 
            onClick={handleCloseConfirmDialog} 
            sx={{ color: 'white' }} 
            disabled={deleting}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            ¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handleCloseConfirmDialog} 
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.5)'
              } 
            }} 
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained" 
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            sx={{ 
              background: 'linear-gradient(to right, #ff416c, #ff4b2b)', 
              boxShadow: '0 4px 15px rgba(255, 75, 43, 0.4)' 
            }} 
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerta para mensajes */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Mensaje para usuarios con rol visor */}
      {userRole === 'visor' && (
        <Box 
          sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: 'rgba(33, 150, 243, 0.1)', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center' 
          }}
        >
          <InfoIcon sx={{ color: '#2196f3', mr: 1 }} />
          <Typography color="#2196f3">
            Modo de solo lectura: Como Visor, puedes ver todos los datos pero no puedes crear, editar o eliminar registros.
          </Typography>
        </Box>
      )}
    </PageContainer>
  );
};

export default Clients;