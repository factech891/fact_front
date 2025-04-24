// src/pages/settings/ProfilePage.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid,
  Avatar,
  CircularProgress,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { authApi } from '../../services/AuthApi';

const ProfilePage = () => {
  const { currentUser, company, token } = useAuth();
  
  // Estado para los datos del perfil
  const [profileData, setProfileData] = useState({
    nombre: currentUser?.nombre || currentUser?.name || '',
    email: currentUser?.email || ''
  });
  
  // Estado para el formulario de cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Estados para la interfaz
  const [editMode, setEditMode] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ severity: 'success', message: '' });
  
  // Manejadores para el formulario de perfil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  // Manejadores para el formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  // Guardar cambios del perfil
  const handleSaveProfile = async () => {
    try {
      setLoadingProfile(true);
      setProfileError(null);
      
      const response = await authApi.updateProfile(profileData, token);
      
      if (response.success) {
        setEditMode(false);
        setAlertInfo({
          severity: 'success',
          message: 'Perfil actualizado correctamente'
        });
        setShowAlert(true);
      } else {
        throw new Error(response.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      setProfileError(error.message);
      setAlertInfo({
        severity: 'error',
        message: `Error: ${error.message}`
      });
      setShowAlert(true);
    } finally {
      setLoadingProfile(false);
    }
  };
  
  // Cambiar contraseña
  const handleChangePassword = async () => {
    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      setAlertInfo({
        severity: 'error',
        message: 'Las contraseñas nuevas no coinciden'
      });
      setShowAlert(true);
      return;
    }
    
    try {
      setLoadingPassword(true);
      setPasswordError(null);
      
      const { currentPassword, newPassword } = passwordData;
      const response = await authApi.changePassword(currentPassword, newPassword, token);
      
      if (response.success) {
        // Limpiar el formulario
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setAlertInfo({
          severity: 'success',
          message: 'Contraseña actualizada correctamente'
        });
        setShowAlert(true);
      } else {
        throw new Error(response.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      setPasswordError(error.message);
      setAlertInfo({
        severity: 'error',
        message: `Error: ${error.message}`
      });
      setShowAlert(true);
    } finally {
      setLoadingPassword(false);
    }
  };
  
  // Cancelar edición
  const handleCancelEdit = () => {
    setEditMode(false);
    setProfileData({
      nombre: currentUser?.nombre || currentUser?.name || '',
      email: currentUser?.email || ''
    });
  };
  
  // Color principal (mismo que en Navbar)
  const mainColor = '#4CAF50';
  
  // Gradiente para botones (igual que en otros componentes)
  const buttonGradient = 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)';
  
  // Función para obtener el rol del usuario en formato legible
  const getUserRoleDisplay = () => {
    if (!currentUser || !currentUser.role) return 'Usuario';
    
    switch(currentUser.role) {
      case 'admin':
        return 'Administrador';
      case 'gerente':
        return 'Gerente';
      case 'facturador':
        return 'Facturador';
      case 'visor':
        return 'Visor';
      default:
        return currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    }
  };
  
  return (
    <Box sx={{ 
      padding: '24px', 
      backgroundColor: '#121212', 
      color: 'white',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Título eliminado para evitar duplicación con la barra de navegación */}
      
      <Grid container spacing={3}>
        {/* Sección de información de perfil */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              bgcolor: '#1e1e1e', 
              color: 'white',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="500">
                Información Personal
              </Typography>
              
              {!editMode ? (
                <IconButton 
                  onClick={() => setEditMode(true)} 
                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <EditIcon />
                </IconButton>
              ) : (
                <Box>
                  <IconButton 
                    onClick={handleCancelEdit} 
                    sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }}
                  >
                    <CancelIcon />
                  </IconButton>
                  <IconButton 
                    onClick={handleSaveProfile} 
                    sx={{ color: mainColor }}
                    disabled={loadingProfile}
                  >
                    {loadingProfile ? <CircularProgress size={24} /> : <SaveIcon />}
                  </IconButton>
                </Box>
              )}
            </Box>
            
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
            
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: mainColor,
                  fontWeight: 'bold',
                  fontSize: '24px',
                  color: 'white',
                  mr: 2
                }}
              >
                {profileData.nombre.charAt(0).toUpperCase()}
              </Avatar>
              
              <Box>
                <Typography variant="body1" fontWeight="500">
                  {profileData.nombre || "Usuario"}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.6)">
                  {getUserRoleDisplay()}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Nombre"
                variant="outlined"
                name="nombre"
                value={profileData.nombre}
                onChange={handleProfileChange}
                disabled={!editMode}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: mainColor,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.6)',
                  },
                }}
              />
              
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                name="email"
                value={profileData.email}
                disabled={true} // Email no se puede cambiar
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: mainColor,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.6)',
                  },
                }}
              />
            </Box>
            
            {editMode && (
              <Button
                variant="contained"
                fullWidth
                onClick={handleSaveProfile}
                disabled={loadingProfile}
                sx={{
                  mt: 2,
                  py: 1.2,
                  backgroundImage: buttonGradient,
                  boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
                  border: 'none',
                  borderRadius: '50px',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)',
                  }
                }}
              >
                {loadingProfile ? <CircularProgress size={24} /> : 'Guardar Cambios'}
              </Button>
            )}
            
            {company && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" gutterBottom>
                  Empresa
                </Typography>
                <Typography variant="body1">
                  {company.nombre}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Sección de cambio de contraseña */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              bgcolor: '#1e1e1e', 
              color: 'white',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LockOutlinedIcon sx={{ mr: 1, color: mainColor }} />
              <Typography variant="h6" fontWeight="500">
                Cambiar Contraseña
              </Typography>
            </Box>
            
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
            
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211,47,47,0.1)', color: '#f44336' }}>
                {passwordError}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Contraseña Actual"
              variant="outlined"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: mainColor,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.6)',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Nueva Contraseña"
              variant="outlined"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: mainColor,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.6)',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Confirmar Nueva Contraseña"
              variant="outlined"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: mainColor,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.6)',
                },
              }}
            />
            
            <Button
              variant="contained"
              fullWidth
              onClick={handleChangePassword}
              disabled={loadingPassword}
              sx={{
                py: 1.2,
                backgroundImage: buttonGradient,
                boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
                border: 'none',
                borderRadius: '50px',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)',
                }
              }}
            >
              {loadingPassword ? <CircularProgress size={24} /> : 'Cambiar Contraseña'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Alerta para notificaciones */}
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity={alertInfo.severity}
          sx={{ 
            width: '100%', 
            backgroundColor: alertInfo.severity === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(211, 47, 47, 0.9)', 
            color: 'white' 
          }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;