// src/pages/users/UserManagement.js - VERSIÓN MEJORADA CON ESTILO NEGRO
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Switch,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  LinearProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  Tooltip
} from '@mui/material';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';

// Iconos
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

// Componentes
import UserForm from './UserForm';

// Componentes estilizados para el tema oscuro
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    color: theme.palette.common.white,
    fontWeight: 800, // Más negrita
    fontSize: '0.95rem',
    border: 'none',
    whiteSpace: 'nowrap',
    padding: '14px 16px'
  },
  '& .MuiTableCell-head:first-of-type': {
    borderTopLeftRadius: '8px'
  },
  '& .MuiTableCell-head:last-of-type': {
    borderTopRightRadius: '8px'
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#161616', // Fila impar más oscura
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#1a1a1a', // Fila par ligeramente menos oscura
  },
  '&:hover': {
    backgroundColor: 'rgba(79, 172, 254, 0.08)', // Azul sutil al pasar el mouse
  },
  '& .MuiTableCell-body': {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.85)'
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: '#121212', // Negro
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)', // Sombra más pronunciada
}));

const SearchBar = styled(Box)(({ theme }) => ({
  marginBottom: '24px',
  padding: '10px 16px',
  borderRadius: '8px',
  backgroundColor: '#1e1e1e',
  border: '1px solid rgba(255, 255, 255, 0.05)'
}));

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

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': { 
    color: '#4facfe',
    '&:hover': { 
      backgroundColor: 'rgba(79, 172, 254, 0.08)' 
    } 
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { 
    backgroundColor: '#4facfe',
    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' 
  },
  '&.Mui-disabled': { 
    opacity: 0.5 
  }
}));

// Componente principal
const UserManagement = () => {
  // Hooks y contexto
  const { users, loading, error, deleteUser, updateUser, createUser, fetchUsers } = useUsers();
  const { hasRole, user: currentUser } = useAuth();

  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('warning');
  const [openAlert, setOpenAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Asegurarnos de que users es un array
  const safeUsers = Array.isArray(users) ? users : [];

  // Filtrado de usuarios
  const filteredUsers = safeUsers.filter(user =>
    (user.name || user.nombre)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Identificar al administrador principal
  const findMainAdmin = () => {
    if (!Array.isArray(safeUsers) || safeUsers.length === 0) return null;
    const adminUsers = safeUsers.filter(user => user.role === 'admin');
    if (adminUsers.length === 0) return null;
    adminUsers.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : parseInt(a._id?.substring(0, 8), 16) * 1000;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : parseInt(b._id?.substring(0, 8), 16) * 1000;
      return dateA - dateB;
    });
    return adminUsers[0];
  };

  const mainAdmin = findMainAdmin();

  // --- Funciones de manejo ---
  const handleCreateUser = () => {
    setUserToEdit(null);
    setOpenForm(true);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    if (isSubmitting) return;
    setOpenForm(false);
    setUserToEdit(null);
  };

  const handleSaveUser = async (userData) => {
    setIsSubmitting(true);
    try {
      const formattedData = { ...userData };
      if (formattedData.name && !formattedData.nombre) {
        formattedData.nombre = formattedData.name;
        delete formattedData.name;
      }
      if (userData._id && !formattedData.password) {
          delete formattedData.password;
      }

      let result;
      if (userData._id) {
        console.log(`Iniciando actualización del usuario ID: ${userData._id}`);
        result = await updateUser(userData._id, formattedData);
        setAlertMessage('Usuario actualizado correctamente.');
        setAlertSeverity('success');
      } else {
        console.log("Iniciando creación de nuevo usuario...");
        result = await createUser(formattedData);
        setAlertMessage('Usuario creado correctamente.');
        setAlertSeverity('success');
      }

      setOpenAlert(true);
      handleFormClose();
      if (fetchUsers) {
          await fetchUsers();
      }
      return result;

    } catch (error) {
      console.error("Error al guardar usuario:", error);
      const errorMessage = error?.response?.data?.message || error.message || 'Ocurrió un error desconocido.';
      setAlertMessage(`Error al guardar usuario: ${errorMessage}`);
      setAlertSeverity('error');
      setOpenAlert(true);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    // Verificar si es el usuario actual intentando desactivarse a sí mismo
    if (userId === currentUser?._id && currentStatus === true) {
        setAlertMessage('No puedes desactivar tu propio usuario.');
        setAlertSeverity('warning');
        setOpenAlert(true);
        return; // Detener la ejecución
    }

    setIsSubmitting(true); // Iniciar estado de envío aquí, después de la validación
    try {
      console.log(`Cambiando estado del usuario ID: ${userId} a ${!currentStatus}`);
      await updateUser(userId, { active: !currentStatus });
      setAlertMessage('Estado del usuario actualizado.');
      setAlertSeverity('success');
      setOpenAlert(true);
       if (fetchUsers) {
          await fetchUsers();
       }

    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      const errorMessage = error?.response?.data?.message || error.message || 'Ocurrió un error desconocido.';
      setAlertMessage(`Error al cambiar estado: ${errorMessage}`);
      setAlertSeverity('error');
      setOpenAlert(true);
    } finally {
        setIsSubmitting(false); // Finalizar estado de envío
    }
  };

  const handleDeleteClick = (user) => {
    if (isMainAdmin(user)) {
        setAlertMessage('No se puede eliminar al administrador principal.');
        setAlertSeverity('warning');
        setOpenAlert(true);
        return;
    }
    if (isCurrentUser(user)) {
        setAlertMessage('No puedes eliminar tu propio usuario.');
        setAlertSeverity('warning');
        setOpenAlert(true);
        return;
    }
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);

    try {
      console.log(`Iniciando eliminación del usuario ID: ${selectedUser._id}`);
      await deleteUser(selectedUser._id);
      setAlertMessage('Usuario eliminado correctamente.');
      setAlertSeverity('success');
      setOpenAlert(true);
      setOpenDialog(false);
      setSelectedUser(null);
       if (fetchUsers) {
          await fetchUsers();
       }

    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      const errorMessage = error?.response?.data?.message || error.message || 'Ocurrió un error desconocido.';
      setAlertMessage(`Error al eliminar: ${errorMessage}`);
      setAlertSeverity('error');
      setOpenAlert(true);
      setOpenDialog(false);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (isSubmitting) return;
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  // --- Funciones de verificación ---
  const isMainAdmin = (user) => {
    if (!mainAdmin || !user) return false;
    return mainAdmin._id === user._id;
  };

  const isCurrentUser = (user) => {
    if (!currentUser || !user) return false;
    return currentUser._id === user._id;
  };

  // Verificación de permisos
  const canManageUsers = hasRole && hasRole('admin');

  // --- Renderizado ---
  if (loading && !isSubmitting) {
    return (
      <LoadingContainer>
        <CircularProgress sx={{ color: '#4facfe' }} />
        <Typography sx={{ color: 'white', ml: 2 }}>Cargando usuarios...</Typography>
      </LoadingContainer>
    );
  }

  if (error && !loading) {
     return (
      <Box sx={{ p: 3, bgcolor: '#121212', color: 'white', minHeight: 'calc(100vh - 64px)' }}>
         <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
            Error al cargar los usuarios: {error.message || 'Error desconocido.'}
         </Alert>
      </Box>
     );
  }

  return (
    <PageContainer>
      {/* Indicador de carga global para acciones */}
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

      {/* Botón Nuevo Usuario */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        {canManageUsers && (
          <GradientButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
            disabled={isSubmitting}
          >
            NUEVO USUARIO
          </GradientButton>
        )}
      </Box>

      {/* Buscador */}
      <SearchBar>
        <TextField
          fullWidth
          placeholder="Buscar usuarios por nombre, email o rol..."
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isSubmitting}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </InputAdornment>
            ),
            sx: { color: 'white', fontSize: '0.95rem' }
          }}
        />
      </SearchBar>

      {/* Tabla de usuarios */}
      <StyledTableContainer 
        component={Paper} 
        sx={{ 
          opacity: isSubmitting ? 0.7 : 1,
          transition: 'opacity 0.3s'
        }}
      >
        <Table size="medium">
          <StyledTableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                user && user._id ? (
                  <StyledTableRow key={user._id}>
                    <TableCell sx={{ fontWeight: 500 }}>{user.name || user.nombre}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          backgroundColor: user.role === 'admin' ? '#f44336'
                                        : user.role === 'manager' ? '#4285F4'
                                        : user.role === 'facturador' ? '#ff9800'
                                        : user.role === 'visor' ? '#4CAF50'
                                        : '#607d8b',
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '16px', 
                          fontSize: '12px', 
                          fontWeight: '500', 
                          textTransform: 'capitalize'
                        }}
                      >
                        {user.role === 'admin' ? 'Administrador' : user.role}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isMainAdmin(user) ? (
                          <Typography variant="body2" sx={{ opacity: 0.8, ml: 1 }}>
                            Activo (Admin principal)
                          </Typography>
                        ) : (
                          <>
                            <StyledSwitch
                              checked={!!user.active}
                              onChange={() => toggleUserStatus(user._id, user.active)}
                              disabled={isSubmitting || (isCurrentUser(user) && user.active)}
                            />
                            <Typography variant="body2" sx={{ opacity: isSubmitting ? 0.5 : 0.8 }}>
                              {user.active ? 'Activo' : 'Inactivo'}
                              {isCurrentUser(user) ? ' (Tu usuario)' : ''}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {canManageUsers && (
                        <Box display="flex" justifyContent="center">
                          {!isMainAdmin(user) && (
                            <Tooltip title="Editar usuario">
                              <IconButton 
                                size="small"
                                onClick={() => handleEditUser(user)}
                                disabled={isSubmitting}
                                sx={{ 
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  '&:hover': { 
                                    color: '#4facfe',
                                    backgroundColor: 'rgba(79, 172, 254, 0.1)'
                                  },
                                  marginRight: 1
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {!isMainAdmin(user) && !isCurrentUser(user) && (
                            <Tooltip title="Eliminar usuario">
                              <IconButton 
                                size="small"
                                onClick={() => handleDeleteClick(user)}
                                disabled={isSubmitting}
                                sx={{ 
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  '&:hover': { 
                                    color: '#ff4b2b',
                                    backgroundColor: 'rgba(255, 75, 43, 0.1)'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      )}
                    </TableCell>
                  </StyledTableRow>
                ) : null
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={5} 
                  align="center" 
                  sx={{ 
                    py: 5, 
                    color: 'rgba(255, 255, 255, 0.5)',
                    border: 'none',
                    backgroundColor: '#121212'
                  }}
                >
                  {searchTerm ? "No se encontraron usuarios que coincidan" : "No hay usuarios registrados"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Formulario Modal de Usuario */}
      {openForm && (
          <UserForm
            open={openForm}
            onClose={handleFormClose}
            user={userToEdit}
            onSave={handleSaveUser}
            isSubmitting={isSubmitting}
          />
      )}

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={openDialog}
        onClose={handleDeleteCancel}
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
            onClick={handleDeleteCancel} 
            sx={{ color: 'white' }} 
            disabled={isSubmitting}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            ¿Estás seguro de que deseas eliminar al usuario {selectedUser?.name || selectedUser?.nombre}? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.5)'
              } 
            }} 
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained" 
            sx={{ 
              background: 'linear-gradient(to right, #ff416c, #ff4b2b)', 
              boxShadow: '0 4px 15px rgba(255, 75, 43, 0.4)' 
            }} 
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }}/> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerta para mensajes */}
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
            onClose={handleCloseAlert}
            severity={alertSeverity}
            variant="filled"
            sx={{ width: '100%' }}
        >
            {alertMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default UserManagement;