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
  Alert
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
  const { users, loading, error, deleteUser, updateUser, createUser } = useUsers();
  const { hasRole, user: currentUser } = useAuth();
  
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  
  // Asegurarnos de que users es un array
  const safeUsers = Array.isArray(users) ? users : [];
  
  // Filtrado de usuarios según término de búsqueda
  const filteredUsers = safeUsers.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Identificar al administrador principal (primer admin creado)
  const findMainAdmin = () => {
    if (!Array.isArray(safeUsers) || safeUsers.length === 0) return null;
    
    // Filtrar solo usuarios admin
    const adminUsers = safeUsers.filter(user => user.role === 'admin');
    
    if (adminUsers.length === 0) return null;
    
    // Ordenar por fecha de creación (usando _id como aproximación si no tenemos createdAt)
    // En MongoDB, _id contiene timestamp de creación
    adminUsers.sort((a, b) => {
      if (a.createdAt && b.createdAt) return new Date(a.createdAt) - new Date(b.createdAt);
      return a._id?.localeCompare(b._id);
    });
    
    // Retornar el primer admin
    return adminUsers[0];
  };
  
  const mainAdmin = findMainAdmin();
  
  // Funciones de manejo
  const handleCreateUser = () => {
    setUserToEdit(null); // No estamos editando, creando nuevo
    setOpenForm(true);
  };
  
  const handleEditUser = (user) => {
    setUserToEdit(user); // Establecer el usuario a editar
    setOpenForm(true);
  };
  
  const handleFormClose = () => {
    setOpenForm(false);
    setUserToEdit(null);
  };
  
  const handleSaveUser = async (userData) => {
    try {
      console.log("Guardando usuario:", userData); // Para depuración
      
      // Asegurarnos de que estamos enviando 'nombre' y no 'name'
      const formattedData = { ...userData };
      if (formattedData.name && !formattedData.nombre) {
        formattedData.nombre = formattedData.name;
        delete formattedData.name;
      }
      
      let result;
      if (userData._id) {
        // Editar usuario existente
        result = await updateUser(userData._id, formattedData);
      } else {
        // Crear nuevo usuario
        result = await createUser(formattedData);
      }
      
      return result;
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      setAlertMessage('Error al guardar usuario: ' + error.message);
      setOpenAlert(true);
      throw error;
    }
  };
  
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      // Verificar si es el usuario actual intentando desactivarse a sí mismo
      if (userId === currentUser?._id && currentStatus === true) {
        setAlertMessage('No puedes desactivar tu propio usuario. Esto podría bloquear tu acceso al sistema.');
        setOpenAlert(true);
        return;
      }
      
      await updateUser(userId, { active: !currentStatus });
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      setAlertMessage('Error al cambiar el estado del usuario: ' + error.message);
      setOpenAlert(true);
    }
  };
  
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUser._id);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setAlertMessage('Error al eliminar usuario: ' + error.message);
      setOpenAlert(true);
    }
  };
  
  const handleDeleteCancel = () => {
    setOpenDialog(false);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  // Verificar si un usuario es el administrador principal
  const isMainAdmin = (user) => {
    if (!mainAdmin || !user) return false;
    return mainAdmin._id === user._id;
  };
  
  // Verificar si un usuario es el usuario actual
  const isCurrentUser = (user) => {
    if (!currentUser || !user) return false;
    return currentUser._id === user._id;
  };
  
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
  
  // Estilo para Switch con el mismo gradiente
  const switchStyle = {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#4facfe',
      '&:hover': {
        backgroundColor: 'rgba(79, 172, 254, 0.08)',
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#4facfe',
      backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    },
  };
  
  // Verificación de permisos
  const canManageUsers = hasRole && hasRole('admin');
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#121212'
      }}>
        <div style={{ color: 'white' }}>Cargando...</div>
      </div>
    );
  }
  
  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#121212', 
      color: 'white',
      minHeight: 'calc(100vh - 64px)'
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
          style={{ marginTop: '-5px' }}
        />
      </div>
      
      {/* Tabla de usuarios */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ 
                padding: '12px 16px', 
                color: 'white', 
                textAlign: 'left', 
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                borderTopLeftRadius: '4px',
                borderBottomLeftRadius: '0'
              }}>
                Nombre
              </th>
              <th style={{ 
                padding: '12px 16px', 
                color: 'white', 
                textAlign: 'left', 
                fontWeight: 'bold', 
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
              }}>
                Email
              </th>
              <th style={{ 
                padding: '12px 16px', 
                color: 'white', 
                textAlign: 'left', 
                fontWeight: 'bold', 
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
              }}>
                Rol
              </th>
              <th style={{ 
                padding: '12px 16px', 
                color: 'white', 
                textAlign: 'left', 
                fontWeight: 'bold', 
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
              }}>
                Estado
              </th>
              <th style={{ 
                padding: '12px 16px', 
                color: 'white', 
                textAlign: 'center', 
                fontWeight: 'bold', 
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '0'
              }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} style={{ 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'transparent'
                }}>
                  <td style={{ padding: '12px 16px', color: 'white' }}>{user.name || user.nombre}</td>
                  <td style={{ padding: '12px 16px', color: 'white' }}>{user.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ 
                      display: 'inline-block',
                      backgroundColor: user.role === 'admin' ? '#f44336' : user.role === 'manager' ? '#4285F4' : '#4CAF50',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {user.role === 'admin' ? 'Administrador' : user.role === 'manager' ? 'Gerente' : 'Usuario'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {isMainAdmin(user) ? (
                        // Para el admin principal, no mostrar switch y mostrar siempre "Activo"
                        <Typography variant="body2" style={{ opacity: 0.8, marginLeft: '12px' }}>
                          Activo (Admin principal)
                        </Typography>
                      ) : isCurrentUser(user) ? (
                        // Para el usuario actual, mostrar switch pero con advertencia
                        <>
                          <Switch
                            checked={user.active}
                            onChange={() => toggleUserStatus(user._id, user.active)}
                            sx={switchStyle}
                            disabled={user.active} // Si está activo, deshabilitamos el switch
                          />
                          <Typography variant="body2" style={{ opacity: 0.8 }}>
                            {user.active ? 'Activo (Tu usuario)' : 'Inactivo'}
                          </Typography>
                        </>
                      ) : (
                        // Para los demás usuarios, mostrar el switch normal
                        <>
                          <Switch
                            checked={user.active}
                            onChange={() => toggleUserStatus(user._id, user.active)}
                            sx={switchStyle}
                          />
                          <Typography variant="body2" style={{ opacity: 0.8 }}>
                            {user.active ? 'Activo' : 'Inactivo'}
                          </Typography>
                        </>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {canManageUsers && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {/* Icono Editar - NO mostrar para admin principal */}
                        {!isMainAdmin(user) && (
                          <IconButton
                            onClick={() => handleEditUser(user)}
                            size="small"
                            sx={{ color: 'white' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                        
                        {/* Icono Eliminar - solo mostrar si NO es el admin principal ni el usuario actual */}
                        {!isMainAdmin(user) && !isCurrentUser(user) && (
                          <IconButton
                            onClick={() => handleDeleteClick(user)}
                            size="small"
                            sx={{ color: 'white' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ 
                  padding: '16px', 
                  textAlign: 'center', 
                  color: 'white' 
                }}>
                  {searchTerm 
                    ? "No se encontraron usuarios que coincidan con la búsqueda" 
                    : "No hay usuarios registrados"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Formulario Modal de Usuario */}
      <UserForm 
        open={openForm}
        onClose={handleFormClose}
        user={userToEdit}
        onSave={handleSaveUser}
      />
      
      {/* Diálogo de confirmación para eliminar - directamente usando Dialog de MUI */}
      <Dialog
        open={openDialog}
        onClose={handleDeleteCancel}
        PaperProps={{
          style: { 
            backgroundColor: '#2a2a2a', 
            color: 'white',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          py: 1.5
        }}>
          Confirmar eliminación
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            ¿Estás seguro de que deseas eliminar al usuario {selectedUser?.name || selectedUser?.nombre}? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button 
            onClick={handleDeleteCancel} 
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
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
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerta para mensajes de error o advertencia */}
      <Snackbar 
        open={openAlert} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity="warning" 
          sx={{ 
            width: '100%', 
            backgroundColor: '#2a2a2a', 
            color: 'white',
            '& .MuiAlert-icon': {
              color: '#ff9800'
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