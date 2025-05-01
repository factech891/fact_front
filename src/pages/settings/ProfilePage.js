// src/pages/settings/ProfilePage.js
import React, { useState, useEffect } from 'react'; // Asegúrate que useEffect esté importado
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
  Tooltip // Añadido para Tooltip en avatares
} from '@mui/material';
import { useAuth } from '../../context/AuthContext'; // Contexto de autenticación
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icono para selección

// --- API Imports ---
// Asume que tienes estas funciones en tus servicios API
// Necesitamos la función para actualizar el perfil (nombre) y cambiar contraseña
import { authApi } from '../../services/AuthApi';
// Necesitamos la función para actualizar el avatar
import { usersApi } from '../../services/UsersApi'; // Asegúrate de importar desde UsersApi

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
  // Asume que useAuth devuelve currentUser, company, token y una función para actualizar el contexto
  const { currentUser, company, token, updateUserContext } = useAuth();

  // Estado para los datos del perfil (nombre editable, email no)
  const [profileData, setProfileData] = useState({
    nombre: '',
    email: ''
  });

  // Estado para el formulario de cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  // Estados para la interfaz (modo edición, cargas, errores, alertas)
  const [editMode, setEditMode] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  // const [profileError, setProfileError] = useState(null); // No se usa, comentado o eliminado
  const [passwordError, setPasswordError] = useState(null); // Para mensaje de error específico de contraseña
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ severity: 'success', message: '' });

  // --- NUEVOS ESTADOS PARA AVATAR ---
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null); // URL del avatar actual
  const [loadingAvatar, setLoadingAvatar] = useState(false); // Estado de carga para guardar avatar

  // --- useEffect para inicializar datos del perfil y avatar al cargar ---
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        nombre: currentUser.nombre || currentUser.name || '', // Compatibilidad por si acaso
        email: currentUser.email || ''
      });
      // Usar el avatar guardado en el backend, o el primero de la lista como fallback
      // Corrección: La lógica para obtener el avatar guardado localmente debe ir aquí
      let avatarToSet = currentUser.selectedAvatarUrl; // Prioridad 1: Backend
      if (!avatarToSet) {
        // Prioridad 2: LocalStorage específico del usuario (si existe)
        const userId = currentUser.id || currentUser._id; // Obtener ID de usuario
        if (userId) {
            const avatarKey = `userAvatar_${userId}`;
            avatarToSet = localStorage.getItem(avatarKey); // Intentar obtener del localStorage
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
  }, [currentUser]); // Se ejecuta cuando currentUser cambia

  // --- Manejadores y Funciones ---

  // Manejador para cambios en el input de nombre (en modo edición)
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador para cambios en los inputs de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Cancelar modo edición del perfil
  const handleCancelEdit = () => {
    setEditMode(false);
    // Restaurar nombre desde el estado actual del contexto
    if (currentUser) {
       setProfileData({
         ...profileData, // Mantener email
         nombre: currentUser.nombre || currentUser.name || '',
       });
    }
  };

  // Guardar cambios del perfil (solo nombre)
  const handleSaveProfile = async () => {
    setLoadingProfile(true);
    // setProfileError(null); // No se usa
    try {
      // Llama a la API para actualizar el perfil (solo nombre)
      // NOTA: Usaremos authApi.updateProfile según la lógica de UsersApi.js
      // (ver el 'intento 2' de la versión anterior)
      // Asumiendo que authApi.updateProfile existe y funciona así:
      const response = await authApi.updateProfile({ nombre: profileData.nombre }, token);

      // La respuesta puede variar, ajusta según tu implementación real de authApi.updateProfile
      if (response && (response.success || response.user)) { // Ajusta la condición de éxito
        const updatedName = response.user?.nombre || profileData.nombre; // Usa el nombre devuelto si existe
        setEditMode(false);
        // Actualizar el contexto para reflejar el cambio de nombre globalmente
        if (updateUserContext && currentUser) {
           updateUserContext({ ...currentUser, nombre: updatedName });
        } else {
           console.warn("ProfilePage: updateUserContext no está disponible en AuthContext.");
           // Considera recargar datos o mostrar mensaje para refrescar
        }
        setAlertInfo({ severity: 'success', message: 'Nombre actualizado correctamente.' });
        setShowAlert(true);
      } else {
        // Usar el mensaje de error del backend si está disponible
        throw new Error(response?.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error("Error guardando perfil:", error);
      // Mostrar error en la alerta
      setAlertInfo({ severity: 'error', message: `Error al guardar: ${error.message}` });
      setShowAlert(true);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Cambiar contraseña del usuario
  const handleChangePassword = async () => {
    // Validar que las contraseñas nuevas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden'); // Mensaje específico
      setAlertInfo({ severity: 'error', message: 'Las contraseñas nuevas no coinciden'}); // Mensaje para Snackbar
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
    setPasswordError(null); // Limpiar error anterior
    try {
      // Llama a la API para cambiar la contraseña
      const { currentPassword, newPassword } = passwordData;
      // Asumiendo que authApi.changePassword necesita estos 3 argumentos
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
       setPasswordError(error.message); // Guardar error para posible lógica adicional
       setAlertInfo({ severity: 'error', message: `Error: ${error.message}` }); // Mostrar en Snackbar
       setShowAlert(true);
    } finally {
      setLoadingPassword(false);
    }
  };

  // NUEVA FUNCIÓN: Manejar Selección de Avatar (usando la API de UsersApi)
  const handleAvatarSelect = async (selectedUrl) => {
    // Evitar llamadas si se selecciona el mismo avatar o si ya está cargando
    if (selectedUrl === currentAvatarUrl || loadingAvatar) {
      return;
    }

    setLoadingAvatar(true); // Iniciar indicador de carga
    try {
      console.log('Actualizando avatar a:', selectedUrl);

      // Llama a la función del servicio UsersApi para actualizar el avatar
      // Esta función ahora maneja la lógica híbrida (backend + localStorage)
      const response = await usersApi.updateMyAvatar(selectedUrl);

      console.log('Respuesta de usersApi.updateMyAvatar:', response);

      if (response && response.success) {
        // Usar la URL devuelta (que será la seleccionada en el caso de fallback)
        const newAvatarUrl = response.selectedAvatarUrl;

        // Actualizar el estado local para reflejar el cambio inmediatamente
        setCurrentAvatarUrl(newAvatarUrl);

        // Actualizar el contexto para que el cambio se refleje en otras partes (ej. Navbar)
        // IMPORTANTE: Asegurarse que la URL guardada en el contexto es la misma que se usa localmente.
        if (updateUserContext && currentUser) {
          const updatedUser = {
            ...currentUser,
            selectedAvatarUrl: newAvatarUrl // Usar la URL confirmada por la API (o el fallback)
          };
          updateUserContext(updatedUser);
          console.log('Contexto de usuario actualizado con nuevo avatar:', updatedUser);
        } else {
          console.warn("ProfilePage: updateUserContext no está disponible en AuthContext.");
        }

        // Mostrar confirmación (usando el mensaje de la respuesta de la API)
        setAlertInfo({
          severity: 'success',
          message: response.message || 'Avatar actualizado.' // Usar mensaje de respuesta
        });
        setShowAlert(true);
      } else {
        // Si la API reporta fallo (aunque no debería con la lógica actual, por si acaso)
        throw new Error(response?.message || 'Error desconocido al actualizar el avatar');
      }
    } catch (error) {
      console.error("Error guardando avatar:", error);
      // Mostrar error en la alerta
      setAlertInfo({
        severity: 'error',
        message: `Error al guardar avatar: ${error.message || 'Error desconocido'}`
      });
      setShowAlert(true);
      // Opcional: Revertir el avatar visualmente si falla (aunque con localStorage, el cambio persiste)
      // setCurrentAvatarUrl(currentUser.selectedAvatarUrl || availableAvatarUrls[0]);
    } finally {
      setLoadingAvatar(false); // Finalizar indicador de carga
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
  const mainColor = '#4CAF50'; // Color principal consistente
  const buttonGradient = 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'; // Gradiente para botones

  // --- Renderizado del Componente ---
  return (
    <Box sx={{
      padding: '24px',
      backgroundColor: '#121212',
      color: 'white',
      minHeight: 'calc(100vh - 64px)' // Asumiendo altura de Navbar de 64px
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
            {/* Cabecera con botón Editar/Guardar/Cancelar */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="500">
                Información Personal
              </Typography>
              {!editMode ? (
                <Tooltip title="Editar Nombre">
                  <IconButton onClick={() => setEditMode(true)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Box>
                  <Tooltip title="Cancelar">
                    <IconButton onClick={handleCancelEdit} sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }}>
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Guardar Nombre">
                    <IconButton onClick={handleSaveProfile} sx={{ color: mainColor }} disabled={loadingProfile}>
                      {loadingProfile ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

            {/* Avatar Principal y Nombre/Rol */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              {/* Contenedor para Avatar y Progress */}
              <Box sx={{ position: 'relative', mr: 2 }}>
                {/* *** INICIO CÓDIGO MODIFICADO *** */}
                <Avatar
                  src={currentAvatarUrl || ''}
                  alt={profileData.nombre || 'Avatar'}
                  sx={{
                    width: 120, height: 120, // Tamaño del círculo
                    bgcolor: '#1e1e1e', // Color de fondo si la imagen no carga o es transparente
                    fontWeight: 'bold',
                    fontSize: '48px',
                    color: 'white', // Color del texto (inicial) si no hay imagen
                    overflow: 'hidden', // Importante para que la imagen no se salga del círculo
                    '& img': { // Estilos aplicados a la etiqueta <img> dentro del Avatar
                      objectFit: 'cover', // Cambiado de 'contain' a 'cover' para llenar el espacio
                      transform: 'scale(2.3)', // Hacer zoom 1.5x a la imagen
                      transformOrigin: 'center', // Centrar el zoom
                      width: '100%', // Asegurar que la imagen intente llenar el contenedor
                      height: '100%' // Asegurar que la imagen intente llenar el contenedor
                    }
                  }}
                >
                  {/* Fallback a inicial SOLO si NO hay URL */}
                  {!currentAvatarUrl && profileData.nombre ? profileData.nombre.charAt(0).toUpperCase() : null}
                </Avatar>
                {/* *** FIN CÓDIGO MODIFICADO *** */}

                {/* Indicador de carga mientras se guarda el avatar */}
                {loadingAvatar && (
                  <CircularProgress
                    size={128} // Ajusta el tamaño para que sea ligeramente mayor que el avatar
                    thickness={2}
                    sx={{ color: mainColor, position: 'absolute', top: -4, left: -4, zIndex: 1 }} // Ajustar posición
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
                      {/* IconButton actúa como el área clickeable */}
                      <IconButton
                        onClick={() => handleAvatarSelect(url)}
                        disabled={loadingAvatar} // Deshabilitar mientras se guarda
                        sx={{
                          p: 0.25, // Pequeño padding alrededor del avatar
                          border: currentAvatarUrl === url ? `3px solid ${mainColor}` : '3px solid transparent',
                          borderRadius: '50%',
                          transition: 'border 0.2s ease-in-out',
                          '&:hover': { opacity: currentAvatarUrl === url ? 1 : 0.8 } // Efecto hover sutil
                        }}
                      >
                        <Avatar
                          src={url}
                          alt={`Avatar ${index + 1}`}
                          sx={{ width: 48, height: 48 }} // Tamaño consistente para las opciones
                        />
                        {/* Icono de Check para indicar selección */}
                        {currentAvatarUrl === url && (
                           <CheckCircleIcon sx={{
                               color: mainColor, // Usar color principal
                               position: 'absolute', bottom: -2, right: -2,
                               backgroundColor: '#1e1e1e', // Fondo igual al Paper para mejor contraste
                               borderRadius: '50%', fontSize: '18px',
                               border: '1px solid #121212' // Borde sutil si es necesario
                           }}/>
                        )}
                      </IconButton>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Campos de Texto para Nombre y Email */}
            {/* Corrección: TextField debe estar fuera del Box que se oculta */}
            <TextField
              fullWidth label="Nombre" variant="outlined" name="nombre"
              value={profileData.nombre} onChange={handleProfileChange} disabled={!editMode}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: mainColor },
                  '&.Mui-focused fieldset': { borderColor: mainColor },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: mainColor },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255, 255, 255, 0.5)' }
              }}
            />
            <TextField
              fullWidth label="Email" variant="outlined" name="email"
              value={profileData.email} disabled={true} // Email no editable
              sx={{
                 mb: editMode ? 2 : 0, // Añadir margen inferior solo en modo edición antes del botón
                 '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                 },
                 '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                 '& .MuiInputBase-input': { color: 'white' },
                 '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255, 255, 255, 0.5)' }
               }}
            />


             {/* Botón Guardar Cambios (visible solo en modo edición) */}
             {editMode && (
               <Button
                 variant="contained" fullWidth onClick={handleSaveProfile} disabled={loadingProfile}
                 sx={{
                   mt: 2, py: 1.2, backgroundImage: buttonGradient, color: 'white',
                   fontWeight: 'bold', '&:hover': { opacity: 0.9 }
                 }}
               >
                 {loadingProfile ? <CircularProgress size={24} color="inherit"/> : 'Guardar Nombre'}
               </Button>
             )}

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
        {/* Usar children function para poder pasar onClose al Alert */}
        <Alert
          onClose={() => setShowAlert(false)}
          severity={alertInfo.severity}
          variant="filled" // Usar filled para mejor visibilidad con colores custom
          sx={{
            width: '100%',
            // Usar colores específicos para fondo y texto para asegurar contraste
            bgcolor: alertInfo.severity === 'success' ? '#2e7d32' : '#d32f2f', // Colores estándar de MUI para success/error filled
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