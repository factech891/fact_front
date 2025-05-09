// src/pages/settings/ProfilePage.js
import React, { useState, useEffect } from 'react';
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
  Snackbar,
  Tooltip,
  FormControl, // Added
  InputLabel,  // Added
  Select,      // Added
  MenuItem     // Added
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Added

// --- API Imports ---
import { authApi } from '../../services/AuthApi';
import { usersApi } from '../../services/UsersApi';

// --- Utils Imports ---
import { detectBrowserTimezone, commonTimezones } from '../../utils/dateUtils'; // Added

// --- URLs de Avatares Disponibles ---
const availableAvatarUrls = [
  'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/Disen%CC%83o%20sin%20ti%CC%81tulo/1.png',
  'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/Disen%CC%83o%20sin%20ti%CC%81tulo/2.png',
  'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/Disen%CC%83o%20sin%20ti%CC%81tulo/3.png',
  'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/Disen%CC%83o%20sin%20ti%CC%81tulo/4.png',
  'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/Disen%CC%83o%20sin%20ti%CC%81tulo/5.png',
  'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/Disen%CC%83o%20sin%20ti%CC%81tulo/6.png'
];

const ProfilePage = () => {
  // --- Contexto y Estados ---
  const { currentUser, company, token, updateUserContext } = useAuth();

  // Estado para los datos del perfil (nombre, email)
  const [profileData, setProfileData] = useState({
    nombre: '',
    email: ''
  });

  // Estado para el formulario de cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  // Estados para la interfaz (cargas, errores, alertas)
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ severity: 'success', message: '' });

  // --- Estados para Avatar ---
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  // Añadir estado para timezone
  const [timezoneData, setTimezoneData] = useState({
    timezone: '',
    loading: false,
    error: null
  });

  // --- useEffect para inicializar datos del perfil y avatar al cargar ---
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        nombre: currentUser.nombre || currentUser.name || '',
        email: currentUser.email || ''
      });

      // Añadir esta línea para la zona horaria
      setTimezoneData(prev => ({
        ...prev,
        timezone: currentUser.timezone || detectBrowserTimezone()
      }));
      
      // Usar el avatar guardado en el backend, o el primero de la lista como fallback
      let avatarToSet = currentUser.selectedAvatarUrl; // Prioridad 1: Backend
      if (!avatarToSet) {
        // Prioridad 2: LocalStorage específico del usuario (si existe)
        const userId = currentUser.id || currentUser._id;
        if (userId) {
            const avatarKey = `userAvatar_${userId}`;
            avatarToSet = localStorage.getItem(avatarKey);
            console.log(`Avatar local para ${userId} encontrado: ${avatarToSet}`);
        }
      }
      // Prioridad 3: Fallback a avatar por defecto
      if (!avatarToSet) {
        avatarToSet = availableAvatarUrls[0];
        console.log('Usando avatar por defecto.');
      }

      setCurrentAvatarUrl(avatarToSet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // --- Manejadores y Funciones ---

  // Manejador para cambios en los inputs de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Cambiar contraseña del usuario
  const handleChangePassword = async () => {
    // Validar que las contraseñas nuevas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      setAlertInfo({ severity: 'error', message: 'Las contraseñas nuevas no coinciden'});
      setShowAlert(true);
      return;
    }
    // Validar longitud mínima de nueva contraseña
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      setAlertInfo({ severity: 'error', message: 'La nueva contraseña debe tener al menos 6 caracteres.'});
      setShowAlert(true);
      return;
    }

    setLoadingPassword(true);
    setPasswordError(null);
    try {
      // Llama a la API para cambiar la contraseña
      const { currentPassword, newPassword } = passwordData;
      const response = await authApi.changePassword(currentPassword, newPassword, token);

      if (response.success) {
        // Limpiar el formulario
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setAlertInfo({ severity: 'success', message: 'Contraseña actualizada correctamente.' });
        setShowAlert(true);
      } else {
        // Usar el mensaje de error del backend
        throw new Error(response.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      setPasswordError(error.message);
      setAlertInfo({ severity: 'error', message: `Error: ${error.message}` });
      setShowAlert(true);
    } finally {
      setLoadingPassword(false);
    }
  };

  // Manejar Selección de Avatar
  const handleAvatarSelect = async (selectedUrl) => {
    // Evitar llamadas si se selecciona el mismo avatar o si ya está cargando
    if (selectedUrl === currentAvatarUrl || loadingAvatar) {
      return;
    }

    setLoadingAvatar(true);
    try {
      console.log('Actualizando avatar a:', selectedUrl);

      // Llama a la función del servicio UsersApi para actualizar el avatar
      const response = await usersApi.updateMyAvatar(selectedUrl);

      console.log('Respuesta de usersApi.updateMyAvatar:', response);

      if (response && response.success) {
        // Usar la URL devuelta (que será la seleccionada en el caso de fallback)
        const newAvatarUrl = response.selectedAvatarUrl;

        // Actualizar el estado local para reflejar el cambio inmediatamente
        setCurrentAvatarUrl(newAvatarUrl);

        // Actualizar el contexto para que el cambio se refleje en otras partes (ej. Navbar)
        if (updateUserContext && currentUser) {
          const updatedUser = {
            ...currentUser,
            selectedAvatarUrl: newAvatarUrl
          };
          updateUserContext(updatedUser);
          console.log('Contexto de usuario actualizado con nuevo avatar:', updatedUser);
        } else {
          console.warn("ProfilePage: updateUserContext no está disponible en AuthContext.");
        }

        // Mostrar confirmación
        setAlertInfo({
          severity: 'success',
          message: response.message || 'Avatar actualizado.'
        });
        setShowAlert(true);
      } else {
        throw new Error(response?.message || 'Error desconocido al actualizar el avatar');
      }
    } catch (error) {
      console.error("Error guardando avatar:", error);
      setAlertInfo({
        severity: 'error',
        message: `Error al guardar avatar: ${error.message || 'Error desconocido'}`
      });
      setShowAlert(true);
    } finally {
      setLoadingAvatar(false);
    }
  };

  // Añadir estas funciones para manejar la zona horaria
  const handleTimezoneChange = (e) => {
    setTimezoneData(prev => ({
      ...prev,
      timezone: e.target.value
    }));
  };

  const handleSaveTimezone = async () => {
    if (timezoneData.loading) return;
    
    setTimezoneData(prev => ({
      ...prev,
      loading: true,
      error: null
    }));
    
    try {
      const response = await usersApi.updateMyTimezone(timezoneData.timezone);
      
      if (response && response.success) {
        // Actualizar el contexto
        if (updateUserContext && currentUser) {
          const updatedUser = {
            ...currentUser,
            timezone: timezoneData.timezone
          };
          updateUserContext(updatedUser);
        }
        
        // Mostrar mensaje de éxito
        setAlertInfo({
          severity: 'success',
          message: 'Zona horaria actualizada correctamente'
        });
        setShowAlert(true);
      } else {
        throw new Error(response?.message || 'Error al actualizar la zona horaria');
      }
    } catch (error) {
      console.error("Error al guardar zona horaria:", error);
      setTimezoneData(prev => ({
        ...prev,
        error: error.message
      }));
      setAlertInfo({
        severity: 'error',
        message: `Error: ${error.message}`
      });
      setShowAlert(true);
    } finally {
      setTimezoneData(prev => ({
        ...prev,
        loading: false
      }));
    }
  };

  // Función para obtener el rol del usuario en formato legible
  const getUserRoleDisplay = () => {
    if (!currentUser || !currentUser.role) return 'Usuario';
    switch(currentUser.role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'facturador': return 'Facturador';
      case 'visor': return 'Visor';
      case 'platform_admin': return 'Admin Plataforma';
      default: return currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    }
  };

  // --- Estilos ---
  const mainColor = '#4CAF50';
  const buttonGradient = 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)';

  // --- Renderizado del Componente ---
  return (
    <Box sx={{
      padding: '24px',
      backgroundColor: '#121212',
      color: 'white',
      minHeight: 'calc(100vh - 64px)'
    }}>

      <Grid container spacing={3}>
        {/* --- Columna Izquierda: Información Personal y Avatar --- */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3, bgcolor: '#1e1e1e', color: 'white',
              border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px'
            }}
          >
            {/* Cabecera sin botón de editar */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="500">
                Información Personal
              </Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

            {/* Avatar Principal y Nombre/Rol */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              {/* Contenedor para Avatar y Progress */}
              <Box sx={{ position: 'relative', mr: 2 }}>
                <Avatar
                  src={currentAvatarUrl || ''}
                  alt={profileData.nombre || 'Avatar'}
                  sx={{
                    width: 120, height: 120,
                    bgcolor: '#1e1e1e',
                    fontWeight: 'bold',
                    fontSize: '48px',
                    color: 'white',
                    overflow: 'hidden',
                    '& img': {
                      objectFit: 'cover',
                      transform: 'scale(2.3)',
                      transformOrigin: 'center',
                      width: '100%',
                      height: '100%'
                    }
                  }}
                >
                  {!currentAvatarUrl && profileData.nombre ? profileData.nombre.charAt(0).toUpperCase() : null}
                </Avatar>

                {/* Indicador de carga mientras se guarda el avatar */}
                {loadingAvatar && (
                  <CircularProgress
                    size={128}
                    thickness={2}
                    sx={{ color: mainColor, position: 'absolute', top: -4, left: -4, zIndex: 1 }}
                  />
                )}
              </Box>
              {/* Nombre y Rol */}
              <Box>
                <Typography variant="h6" fontWeight="500">
                  {profileData.nombre || "Usuario"}
                </Typography>
                <Typography variant="body1" color="rgba(255,255,255,0.6)">
                  {getUserRoleDisplay()}
                </Typography>
              </Box>
            </Box>

            {/* Sección de Selección de Avatar */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 1.5 }}>
                Elige tu avatar:
              </Typography>
              <Grid container spacing={1.5}>
                {availableAvatarUrls.map((url, index) => (
                  <Grid item key={index}>
                    <Tooltip title={`Seleccionar Avatar ${index + 1}`} placement="top">
                      <IconButton
                        onClick={() => handleAvatarSelect(url)}
                        disabled={loadingAvatar}
                        sx={{
                          p: 0.25,
                          border: currentAvatarUrl === url ? `3px solid ${mainColor}` : '3px solid transparent',
                          borderRadius: '50%',
                          transition: 'border 0.2s ease-in-out',
                          '&:hover': { opacity: currentAvatarUrl === url ? 1 : 0.8 }
                        }}
                      >
                        <Avatar
                          src={url}
                          alt={`Avatar ${index + 1}`}
                          sx={{ width: 48, height: 48 }}
                        />
                        {currentAvatarUrl === url && (
                           <CheckCircleIcon sx={{
                               color: mainColor,
                               position: 'absolute', bottom: -2, right: -2,
                               backgroundColor: '#1e1e1e',
                               borderRadius: '50%', fontSize: '18px',
                               border: '1px solid #121212'
                           }}/>
                        )}
                      </IconButton>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Campos de Texto para Nombre y Email (ambos deshabilitados con tooltips) */}
            <Tooltip 
              title="Para modificar tu nombre, contacta con soporte técnico" 
              placement="right" 
              arrow
            >
              <TextField
                fullWidth label="Nombre" variant="outlined" name="nombre"
                value={profileData.nombre} disabled={true}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255, 255, 255, 0.5)' }
                }}
              />
            </Tooltip>
            <Tooltip 
              title="El email no puede ser modificado. Para cambios, contacta con soporte" 
              placement="right" 
              arrow
            >
              <TextField
                fullWidth label="Email" variant="outlined" name="email"
                value={profileData.email} disabled={true}
                sx={{
                  // mb: 2, // Original mb was here, moved to timezone section if it replaces this block's bottom margin
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255, 255, 255, 0.5)' }
                }}
              />
            </Tooltip>
            
            {/* Añadir después de los campos de nombre y email */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" gutterBottom>
                Zona Horaria
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl fullWidth sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    '&:hover fieldset': { borderColor: mainColor },
                    '&.Mui-focused fieldset': { borderColor: mainColor },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: mainColor },
                  '& .MuiSelect-icon': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputBase-input': { color: 'white' }
                }}>
                  <InputLabel>Zona Horaria</InputLabel>
                  <Select
                    value={timezoneData.timezone}
                    onChange={handleTimezoneChange}
                    label="Zona Horaria"
                    // Posible conflicto: `startAdornment` no es una prop directa de `Select`.
                    // Debería estar en un `Input` o `OutlinedInput` usado como `inputComponent` del `Select`
                    // o como parte del InputLabel. Se mantiene como solicitado.
                    startAdornment={ 
                      <AccessTimeIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                    }
                  >
                    {commonTimezones.map((tz) => (
                      <MenuItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Button
                  variant="contained"
                  onClick={handleSaveTimezone}
                  disabled={timezoneData.loading}
                  sx={{
                    height: 40,
                    mb: 2,
                    backgroundImage: buttonGradient,
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': { opacity: 0.9 }
                  }}
                >
                  {timezoneData.loading ? <CircularProgress size={24} color="inherit"/> : 'Guardar'}
                </Button>
              </Box>
              
              {timezoneData.error && (
                <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211,47,47,0.1)', color: '#f44336' }}>
                  {timezoneData.error}
                </Alert>
              )}
            </Box>

            {/* Información de la Empresa */}
            {company && (
              <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
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

        {/* --- Columna Derecha: Cambio de Contraseña --- */}
        <Grid item xs={12} md={6}>
           <Paper
             elevation={0}
             sx={{ p: 3, bgcolor: '#1e1e1e', color: 'white', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}
           >
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
               <LockOutlinedIcon sx={{ mr: 1, color: mainColor }} />
               <Typography variant="h6" fontWeight="500">
                 Cambiar Contraseña
               </Typography>
             </Box>
             <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

             {/* Mostrar error específico de contraseña */}
             {passwordError && (
               <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211,47,47,0.1)', color: '#f44336' }}>
                 {passwordError}
               </Alert>
             )}

             <TextField
               fullWidth label="Contraseña Actual" variant="outlined" type="password" name="currentPassword"
               value={passwordData.currentPassword} onChange={handlePasswordChange}
               sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                     '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                     '&:hover fieldset': { borderColor: mainColor },
                     '&.Mui-focused fieldset': { borderColor: mainColor },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: mainColor },
                  '& .MuiInputBase-input': { color: 'white' }
                }}
             />
             <TextField
               fullWidth label="Nueva Contraseña" variant="outlined" type="password" name="newPassword"
               value={passwordData.newPassword} onChange={handlePasswordChange}
               sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                     '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                     '&:hover fieldset': { borderColor: mainColor },
                     '&.Mui-focused fieldset': { borderColor: mainColor },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: mainColor },
                  '& .MuiInputBase-input': { color: 'white' }
                }}
             />
             <TextField
               fullWidth label="Confirmar Nueva Contraseña" variant="outlined" type="password" name="confirmPassword"
               value={passwordData.confirmPassword} onChange={handlePasswordChange}
               sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                     '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                     '&:hover fieldset': { borderColor: mainColor },
                     '&.Mui-focused fieldset': { borderColor: mainColor },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: mainColor },
                  '& .MuiInputBase-input': { color: 'white' }
                }}
             />

             <Button
               variant="contained" fullWidth onClick={handleChangePassword} disabled={loadingPassword}
               sx={{
                 py: 1.2, backgroundImage: buttonGradient, color: 'white',
                 fontWeight: 'bold', '&:hover': { opacity: 0.9 }
               }}
             >
               {loadingPassword ? <CircularProgress size={24} color="inherit"/> : 'Cambiar Contraseña'}
             </Button>
           </Paper>
        </Grid>
      </Grid>

      {/* --- Snackbar Global para Notificaciones --- */}
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity={alertInfo.severity}
          variant="filled"
          sx={{
            width: '100%',
            bgcolor: alertInfo.severity === 'success' ? '#2e7d32' : '#d32f2f',
            color: '#fff',
          }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;