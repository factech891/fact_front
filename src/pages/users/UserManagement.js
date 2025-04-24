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
  CircularProgress // Importar CircularProgress para loading
} from '@mui/material';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';

// Iconos
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Componentes
import UserForm from './UserForm'; // Importamos el componente de formulario

const UserManagement = () => {
  const { users, loading, error, deleteUser, updateUser, createUser, fetchUsers } = useUsers(); // Añadir fetchUsers si no está
  const { hasRole, user: currentUser } = useAuth();

  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('warning'); // Para éxito o error
  const [openAlert, setOpenAlert] = useState(false);

  // Asegurarnos de que users es un array
  const safeUsers = Array.isArray(users) ? users : [];

  // Filtrado de usuarios según término de búsqueda
  const filteredUsers = safeUsers.filter(user =>
    // Usar 'nombre' consistentemente si la API devuelve 'nombre'
    (user.nombre?.toLowerCase() || user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Identificar al administrador principal (primer admin creado)
  const findMainAdmin = () => {
    if (!Array.isArray(safeUsers) || safeUsers.length === 0) return null;
    const adminUsers = safeUsers.filter(user => user.role === 'admin');
    if (adminUsers.length === 0) return null;
    adminUsers.sort((a, b) => {
      // Priorizar createdAt si existe, sino usar _id
      const dateA = a.createdAt ? new Date(a.createdAt) : null;
      const dateB = b.createdAt ? new Date(b.createdAt) : null;
      if (dateA && dateB) return dateA - dateB;
      // Fallback a _id si createdAt no está disponible en ambos
      const idA = a._id || '';
      const idB = b._id || '';
      return idA.localeCompare(idB);
    });
    return adminUsers[0];
  };

  const mainAdmin = findMainAdmin();

  // Funciones de manejo
  const handleCreateUser = () => {
    setUserToEdit(null);
    setOpenForm(true);
  };

  const handleEditUser = (user) => {
    // Asegurarse de pasar 'nombre' al formulario si existe
    const userWithNombre = { ...user };
    if (userWithNombre.name && !userWithNombre.nombre) {
        userWithNombre.nombre = userWithNombre.name;
    }
    setUserToEdit(userWithNombre);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setUserToEdit(null);
  };

  // --- MODIFICACIÓN AQUÍ ---
  const handleSaveUser = async (formDataFromForm) => {
    // 1. Eliminar el log que incluye la contraseña
    // console.log("Guardando usuario:", formDataFromForm); // <-- ELIMINADO

    // 2. Asegurar que se envía 'nombre' y no 'name' al backend
    // Crear una copia para no modificar el estado original del formulario
    const dataToSend = { ...formDataFromForm };

    // Si el formulario usa 'name', convertirlo a 'nombre' para el backend
    if (dataToSend.name && !dataToSend.nombre) {
        dataToSend.nombre = dataToSend.name;
        delete dataToSend.name; // Eliminar 'name' para evitar confusión
    }
    // Eliminar la contraseña si está vacía (para evitar enviarla en actualizaciones si no se cambia)
    if (dataToSend.password === '') {
        delete dataToSend.password;
    }

    // Log seguro (sin contraseña)
    const { password, ...safeDataForLog } = dataToSend;
    console.log("Preparando para guardar usuario (datos seguros):", safeDataForLog);


    try {
      let response;
      let successMessage = '';

      if (dataToSend._id) {
        // Editar usuario existente
        console.log(`Actualizando usuario ID: ${dataToSend._id}`);
        response = await updateUser(dataToSend._id, dataToSend);
        successMessage = 'Usuario actualizado correctamente.';
      } else {
        // Crear nuevo usuario
        console.log("Creando nuevo usuario...");
        response = await createUser(dataToSend);
        successMessage = response.message || 'Usuario creado correctamente.'; // Usar mensaje del backend si existe
      }

      console.log("Respuesta del backend:", response);

      // Mostrar mensaje de éxito
      setAlertMessage(successMessage);
      setAlertSeverity('success'); // Cambiar a éxito
      setOpenAlert(true);
      handleFormClose(); // Cerrar el formulario
      fetchUsers(); // Recargar la lista de usuarios

      // No necesitamos retornar aquí, el hook useUsers ya actualiza el estado
      // return response; // Quitado

    } catch (error) {
      console.error("Error al guardar usuario:", error);
      // Usar el mensaje de error del backend si está disponible
      const errorMessage = error.response?.data?.message || error.message || 'Ocurrió un error desconocido.';
      setAlertMessage(`Error al guardar usuario: ${errorMessage}`);
      setAlertSeverity('error'); // Cambiar a error
      setOpenAlert(true);
      // No relanzar el error para no romper el flujo del formulario si está dentro de un try/catch allí
      // throw error; // Quitado
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      if (userId === currentUser?._id && currentStatus === true) {
        setAlertMessage('No puedes desactivar tu propio usuario.');
        setAlertSeverity('warning');
        setOpenAlert(true);
        return;
      }

      await updateUser(userId, { active: !currentStatus });
      setAlertMessage('Estado del usuario actualizado.');
      setAlertSeverity('success');
      setOpenAlert(true);
      fetchUsers(); // Recargar lista

    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Ocurrió un error desconocido.';
      setAlertMessage(`Error al cambiar estado: ${errorMessage}`);
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser._id);
      setAlertMessage('Usuario eliminado correctamente.');
      setAlertSeverity('success');
      setOpenAlert(true);
      setOpenDialog(false);
      setSelectedUser(null); // Limpiar usuario seleccionado
      fetchUsers(); // Recargar lista

    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Ocurrió un error desconocido.';
      setAlertMessage(`Error al eliminar: ${errorMessage}`);
      setAlertSeverity('error');
      setOpenAlert(true);
      setOpenDialog(false); // Cerrar diálogo incluso si hay error
    }
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const isMainAdmin = (user) => !mainAdmin ? false : mainAdmin._id === user._id;
  const isCurrentUser = (user) => !currentUser ? false : currentUser._id === user._id;

  // Estilos (sin cambios)
  const actionButtonStyle = { /* ... tu estilo ... */ };
  const switchStyle = { /* ... tu estilo ... */ };

  const canManageUsers = hasRole && hasRole('admin');

  // Indicador de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)', bgcolor: '#121212' }}>
        <CircularProgress sx={{ color: '#4facfe' }} />
      </Box>
    );
  }

  // Manejo de error general del hook
  if (error && !openAlert) { // Mostrar error del hook si no hay otra alerta activa
     setAlertMessage(`Error al cargar usuarios: ${error.message}`);
     setAlertSeverity('error');
     setOpenAlert(true);
  }

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#121212',
      color: 'white',
      minHeight: 'calc(100vh - 64px)' // Ajustar altura si tienes AppBar
    }}>
      {/* Botón Nuevo Usuario */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '24px'
      }}>
        {canManageUsers && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
            sx={actionButtonStyle}
          >
            NUEVO USUARIO
          </Button>
        )}
      </div>

      {/* Buscador */}
      <div style={{
        marginBottom: '24px',
        padding: '8px 16px',
        borderRadius: '4px',
        backgroundColor: '#1e1e1e',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <TextField
          fullWidth
          placeholder="Buscar usuarios por nombre, email o rol..."
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </InputAdornment>
            ),
            style: { color: 'white' }
          }}
          style={{ marginTop: '-5px' }} // Ajuste visual
        />
      </div>

      {/* Tabla de usuarios */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {/* ... Encabezados de tabla sin cambios ... */}
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
                <tr key={user._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'transparent' }}>
                  {/* Usar 'nombre' si existe, sino 'name' como fallback */}
                  <td style={{ padding: '12px 16px', color: 'white' }}>{user.nombre || user.name}</td>
                  <td style={{ padding: '12px 16px', color: 'white' }}>{user.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'inline-block', backgroundColor: user.role === 'admin' ? '#f44336' : user.role === 'manager' ? '#4285F4' : user.role === 'facturador' ? '#ff9800' : '#4CAF50', color: 'white', padding: '4px 8px', borderRadius: '16px', fontSize: '12px', fontWeight: '500' }}>
                      {/* Capitalizar roles para mostrar */}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {isMainAdmin(user) ? (
                        <Typography variant="body2" style={{ opacity: 0.8, marginLeft: '12px' }}>Activo (Admin)</Typography>
                      ) : isCurrentUser(user) ? (
                        <>
                          <Switch checked={user.active} onChange={() => toggleUserStatus(user._id, user.active)} sx={switchStyle} disabled={user.active} />
                          <Typography variant="body2" style={{ opacity: 0.8 }}>{user.active ? 'Activo (Tú)' : 'Inactivo'}</Typography>
                        </>
                      ) : (
                        <>
                          <Switch checked={user.active} onChange={() => toggleUserStatus(user._id, user.active)} sx={switchStyle} />
                          <Typography variant="body2" style={{ opacity: 0.8 }}>{user.active ? 'Activo' : 'Inactivo'}</Typography>
                        </>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {canManageUsers && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {!isMainAdmin(user) && (
                          <IconButton onClick={() => handleEditUser(user)} size="small" sx={{ color: 'white' }}><EditIcon fontSize="small" /></IconButton>
                        )}
                        {!isMainAdmin(user) && !isCurrentUser(user) && (
                          <IconButton onClick={() => handleDeleteClick(user)} size="small" sx={{ color: 'white' }}><DeleteIcon fontSize="small" /></IconButton>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: 'white' }}>{searchTerm ? "No se encontraron usuarios" : "No hay usuarios"}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulario Modal */}
      {openForm && ( // Renderizar solo si está abierto para resetear estado interno
        <UserForm
          open={openForm}
          onClose={handleFormClose}
          user={userToEdit}
          onSave={handleSaveUser} // Pasar la función corregida
        />
      )}


      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={openDialog} onClose={handleDeleteCancel} PaperProps={{ style: { backgroundColor: '#2a2a2a', color: 'white', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' } }}>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', py: 1.5 }}>Confirmar eliminación</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            ¿Seguro que deseas eliminar al usuario {selectedUser?.nombre || selectedUser?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={handleDeleteCancel} sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" sx={{ background: 'linear-gradient(to right, #ff416c, #ff4b2b)', boxShadow: '0 4px 15px rgba(255, 75, 43, 0.4)' }} autoFocus>Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Alerta para mensajes */}
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {/* Usar severity dinámico */}
        <Alert
          onClose={handleCloseAlert}
          severity={alertSeverity}
          sx={{
            width: '100%',
            backgroundColor: alertSeverity === 'success' ? '#2e7d32' : alertSeverity === 'error' ? '#d32f2f' : '#ed6c02', // Colores según severidad
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white' // Icono blanco para todas las alertas
            }
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserManagement;