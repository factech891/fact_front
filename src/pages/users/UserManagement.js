// src/pages/users/UserManagement.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
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
  LinearProgress // *** CORRECCIÓN: Añadida la importación que faltaba ***
} from '@mui/material';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';

// Iconos
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Componentes
import UserForm from './UserForm';

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
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para operaciones

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

  // --- Estilos (sin cambios) ---
  const actionButtonStyle = {
    borderRadius: '50px', color: 'white', fontWeight: 600, padding: '8px 22px', textTransform: 'none',
    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)', transition: 'all 0.2s ease-in-out', border: 'none',
    backgroundColor: 'transparent', fontSize: '14px',
    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)', backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', backgroundColor: 'transparent' },
    '&:active': { transform: 'translateY(0)', boxShadow: '0 2px 10px rgba(79, 172, 254, 0.4)' },
    '&.Mui-disabled': { backgroundImage: 'linear-gradient(to right, #919191 0%, #b7b7b7 100%)', color: 'rgba(255, 255, 255, 0.6)', cursor: 'not-allowed' }
  };
  const switchStyle = {
    '& .MuiSwitch-switchBase.Mui-checked': { color: '#4facfe', '&:hover': { backgroundColor: 'rgba(79, 172, 254, 0.08)' } },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4facfe', backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' },
    '&.Mui-disabled': { opacity: 0.5 }
  };

  // Verificación de permisos
  const canManageUsers = hasRole && hasRole('admin');

  // --- Renderizado ---
  if (loading && !isSubmitting) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)', backgroundColor: '#121212' }}>
        <CircularProgress sx={{ color: '#4facfe' }} />
        <Typography sx={{ color: 'white', ml: 2 }}>Cargando usuarios...</Typography>
      </div>
    );
  }

  if (error && !loading) {
     return (
      <div style={{ padding: '24px', backgroundColor: '#121212', color: 'white', minHeight: 'calc(100vh - 64px)' }}>
         <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
            Error al cargar los usuarios: {error.message || 'Error desconocido.'}
         </Alert>
      </div>
     );
  }


  return (
    <div style={{ padding: '24px', backgroundColor: '#121212', color: 'white', minHeight: 'calc(100vh - 64px)', position: 'relative' /* Para posicionar LinearProgress */ }}>
      {/* Indicador de carga global para acciones */}
      {isSubmitting && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1500 }}> {/* Cambiado a absolute */}
              {/* *** CORRECCIÓN: LinearProgress ahora está definido *** */}
              <LinearProgress sx={{
                  '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
                  },
                  backgroundColor: 'rgba(0,0,0,0.2)'
              }} />
          </Box>
      )}

      {/* Botón Nuevo Usuario */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        {canManageUsers && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
            sx={actionButtonStyle}
            disabled={isSubmitting}
          >
            NUEVO USUARIO
          </Button>
        )}
      </div>

      {/* Buscador */}
      <div style={{ marginBottom: '24px', padding: '8px 16px', borderRadius: '4px', backgroundColor: '#1e1e1e', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <TextField
          fullWidth
          placeholder="Buscar usuarios por nombre, email o rol..."
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isSubmitting}
          InputProps={{
            disableUnderline: true,
            startAdornment: ( <InputAdornment position="start"> <SearchIcon style={{ color: 'rgba(255, 255, 255, 0.5)' }} /> </InputAdornment> ),
            style: { color: 'white' }
          }}
          style={{ marginTop: '-5px' }}
        />
      </div>

      {/* Tabla de usuarios */}
      <div style={{ overflowX: 'auto', opacity: isSubmitting ? 0.7 : 1, transition: 'opacity 0.3s' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 16px', color: 'white', textAlign: 'left', fontWeight: 'bold', background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', borderTopLeftRadius: '4px' }}>Nombre</th>
              <th style={{ padding: '12px 16px', color: 'white', textAlign: 'left', fontWeight: 'bold', background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' }}>Email</th>
              <th style={{ padding: '12px 16px', color: 'white', textAlign: 'left', fontWeight: 'bold', background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' }}>Rol</th>
              <th style={{ padding: '12px 16px', color: 'white', textAlign: 'left', fontWeight: 'bold', background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' }}>Estado</th>
              <th style={{ padding: '12px 16px', color: 'white', textAlign: 'center', fontWeight: 'bold', background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', borderTopRightRadius: '4px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                user && user._id ? (
                  <tr key={user._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'transparent' }}>
                    <td style={{ padding: '12px 16px', color: 'white' }}>{user.name || user.nombre}</td>
                    <td style={{ padding: '12px 16px', color: 'white' }}>{user.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{
                          display: 'inline-block',
                          backgroundColor: user.role === 'admin' ? '#f44336'
                                        : user.role === 'manager' ? '#4285F4'
                                        : user.role === 'facturador' ? '#ff9800'
                                        : user.role === 'visor' ? '#4CAF50'
                                        : '#607d8b',
                          color: 'white', padding: '4px 8px', borderRadius: '16px', fontSize: '12px', fontWeight: '500', textTransform: 'capitalize'
                      }}>
                        {user.role === 'admin' ? 'Administrador' : user.role}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {isMainAdmin(user) ? (
                          <Typography variant="body2" style={{ opacity: 0.8, marginLeft: '12px' }}> Activo (Admin principal) </Typography>
                        ) : (
                          <>
                            <Switch
                              checked={!!user.active}
                              onChange={() => toggleUserStatus(user._id, user.active)}
                              sx={switchStyle}
                              disabled={isSubmitting || (isCurrentUser(user) && user.active)}
                            />
                            <Typography variant="body2" style={{ opacity: isSubmitting ? 0.5 : 0.8 }}>
                              {user.active ? 'Activo' : 'Inactivo'}
                              {isCurrentUser(user) ? ' (Tu usuario)' : ''}
                            </Typography>
                          </>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {canManageUsers && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          {!isMainAdmin(user) && (
                            <IconButton onClick={() => handleEditUser(user)} size="small" sx={{ color: 'white' }} disabled={isSubmitting}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          {!isMainAdmin(user) && !isCurrentUser(user) && (
                            <IconButton onClick={() => handleDeleteClick(user)} size="small" sx={{ color: 'white' }} disabled={isSubmitting}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ) : null
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
                  {searchTerm ? "No se encontraron usuarios que coincidan" : "No hay usuarios registrados"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
        PaperProps={{ style: { backgroundColor: '#2a2a2a', color: 'white', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', py: 1.5 }}> Confirmar eliminación </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            ¿Estás seguro de que deseas eliminar al usuario {selectedUser?.name || selectedUser?.nombre}? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={handleDeleteCancel} sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }} disabled={isSubmitting}> Cancelar </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" sx={{ background: 'linear-gradient(to right, #ff416c, #ff4b2b)', boxShadow: '0 4px 15px rgba(255, 75, 43, 0.4)' }} autoFocus disabled={isSubmitting}>
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
    </div>
  );
};

export default UserManagement;