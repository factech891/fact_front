// src/pages/users/UserForm.js
import React, { useState, useEffect, useMemo } from 'react'; // Añadir useMemo aquí
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Typography,
  FormHelperText,
  Grid,
  IconButton,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// Quitado useUsers ya que las funciones vienen por props

const UserForm = ({ open, onClose, user, onSave, isSubmitting }) => { // Recibir isSubmitting
  // CORRECCIÓN: Usar useMemo para memorizar initialState
  const initialState = useMemo(() => ({
    name: '',
    email: '',
    password: '',
    role: 'facturador',
    active: true
  }), []); // Array de dependencias vacío para que nunca cambie

  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  // const [saving, setSaving] = useState(false); // Usaremos isSubmitting de props
  const [submitError, setSubmitError] = useState(null);

  // Estilo para botones de acción principal (sin cambios)
  const actionButtonStyle = {
    borderRadius: '50px', color: 'white', fontWeight: 600, padding: '8px 22px', textTransform: 'none',
    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)', transition: 'all 0.2s ease-in-out', border: 'none',
    backgroundColor: 'transparent', fontSize: '14px',
    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)', backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', backgroundColor: 'transparent' },
    '&:active': { transform: 'translateY(0)', boxShadow: '0 2px 10px rgba(79, 172, 254, 0.4)' },
    '&.Mui-disabled': { backgroundImage: 'linear-gradient(to right, #919191 0%, #b7b7b7 100%)', color: 'rgba(255, 255, 255, 0.6)', cursor: 'not-allowed' }
  };

  // Estilo para el botón cancelar (sin cambios)
  const cancelButtonStyle = {
    borderRadius: '50px', padding: '8px 22px', textTransform: 'none', border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white', fontSize: '14px', fontWeight: 600, backgroundColor: 'transparent',
    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.5)' },
    '&.Mui-disabled': { borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.3)', cursor: 'not-allowed' }
  };

  // Cargar datos del usuario en modo edición o resetear
  useEffect(() => {
    if (open) {
      setSubmitError(null); // Limpiar error de envío anterior
      if (user) {
        setFormData({
          // Usar 'nombre' si existe, si no 'name'
          name: user.nombre || user.name || '',
          email: user.email || '',
           // Asegurarse que el rol exista en las nuevas opciones, si no, poner uno por defecto
          role: ['manager', 'facturador', 'visor'].includes(user.role) ? user.role : 'facturador',
          active: user.active !== undefined ? user.active : true,
          password: '' // Siempre limpiar campo de contraseña al abrir
        });
      } else {
        setFormData(initialState); // Resetear para nuevo usuario
      }
      setFormErrors({}); // Limpiar errores de validación
    }
  }, [user, open, initialState]); // Mantener initialState como dependencia es seguro ahora

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value; // Manejar Switch

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Limpiar error específico al cambiar el campo
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    // Limpiar error general de submit al empezar a corregir
    if (submitError) {
        setSubmitError(null);
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const errors = {};
    setSubmitError(null); // Limpiar error de submit previo

    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Formato de email inválido';
    }

    // La contraseña solo es obligatoria al crear (user es null)
    if (!user && !formData.password) {
      errors.password = 'La contraseña es obligatoria para nuevos usuarios';
    } else if (formData.password && formData.password.length < 6) {
      // Validar longitud si se ingresó contraseña (nueva o cambio)
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar que el rol sea uno de los permitidos
    if (!['manager', 'facturador', 'visor'].includes(formData.role)) {
        errors.role = 'Selecciona un rol válido';
    }


    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Devuelve true si no hay errores
  };

  // Envío del formulario
  const handleSave = async () => {
    if (!validateForm()) {
      return; // Detener si la validación falla
    }

    // setSaving(true); // Usar isSubmitting de props
    setSubmitError(null); // Limpiar error antes de intentar

    // Crear el objeto de datos a enviar
    // Usar 'nombre' consistentemente si la API lo espera
    const userData = {
        nombre: formData.name, // Enviar como 'nombre'
        email: formData.email,
        role: formData.role,
        active: formData.active,
    };

    // Añadir _id si estamos editando
    if (user?._id) {
      userData._id = user._id;
    }

    // Añadir contraseña solo si se proporcionó (nueva o cambio)
    if (formData.password) {
      userData.password = formData.password;
    }

    try {
      await onSave(userData); // Llamar a la función onSave pasada por props
      // El cierre del modal y el fetchUsers se manejan en UserManagement
      // handleClose(); // No cerrar aquí, se cierra en UserManagement si onSave tiene éxito
    } catch (error) {
      console.error('Error saving user from form:', error);
      // El error ya se muestra en UserManagement, pero podemos poner uno genérico aquí si falla la propagación
      setSubmitError(error?.message || 'Error al guardar. Verifica los datos e intenta de nuevo.');
    } finally {
      // setSaving(false); // Controlado por UserManagement
    }
  };

  // Resetear formulario (solo campos, no cierra)
  const resetForm = () => {
    if (isSubmitting) return; // No permitir si está enviando
    setFormData(user ? { // Si es edición, resetear a los valores originales del usuario
        name: user.nombre || user.name || '',
        email: user.email || '',
        role: ['manager', 'facturador', 'visor'].includes(user.role) ? user.role : 'facturador',
        active: user.active !== undefined ? user.active : true,
        password: ''
    } : initialState); // Si es creación, resetear a initial state
    setFormErrors({});
    setSubmitError(null);
  };

  // Cerrar diálogo (controlado por UserManagement)
  const handleClose = () => {
    if (isSubmitting) return; // No permitir cerrar si está enviando
    onClose();
  };

  // Estilos para inputs (sin cambios)
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&.Mui-focused fieldset': { borderColor: '#4facfe' },
      '& input, & textarea': { color: 'white' },
      '&.Mui-disabled': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } // Estilo para deshabilitado
    },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)', '&.Mui-focused': { color: '#4facfe' }, '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.3)' } },
    '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)', '&.Mui-error': { color: '#f44336' } }
  };
  const selectStyles = {
    ...inputStyles,
    '& .MuiSelect-select': { color: 'white' },
    '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' },
    '&.Mui-disabled .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.3)' }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm" // Reducido un poco el ancho
      fullWidth
      disableEscapeKeyDown={isSubmitting} // Usar isSubmitting
      PaperProps={{ sx: { bgcolor: '#1e1e1e', backgroundImage: 'none', border: '1px solid rgba(255, 255, 255, 0.1)' } }}
    >
      <DialogTitle sx={{ backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, px: 2 }}>
        {user ? 'Editar Usuario' : 'Crear Usuario'}
        <IconButton onClick={handleClose} sx={{ color: 'white' }} disabled={isSubmitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#1e1e1e', color: 'white' }}>
        {/* Mostrar error de submit general si existe */}
        {submitError && (
          <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#f44336' }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}> {/* Nombre ocupa todo el ancho */}
              <TextField
                fullWidth
                label="Nombre"
                name="name" // Mantener name aquí para el estado, se convierte a 'nombre' al guardar
                value={formData.name}
                onChange={handleChange}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                required
                disabled={isSubmitting}
                sx={inputStyles}
                autoFocus // Enfocar el primer campo al abrir
              />
            </Grid>

            <Grid item xs={12}> {/* Email ocupa todo el ancho */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                required
                disabled={isSubmitting}
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}> {/* Rol a la izquierda */}
              <FormControl fullWidth error={Boolean(formErrors.role)} sx={selectStyles}>
                <InputLabel id="role-select-label">Rol</InputLabel>
                <Select
                  labelId="role-select-label"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Rol"
                  disabled={isSubmitting}
                  MenuProps={{ // Estilo del menú desplegable
                      PaperProps: {
                          sx: {
                              bgcolor: '#2a2a2a',
                              color: 'white',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              '& .MuiMenuItem-root': {
                                  '&:hover': {
                                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                  },
                                  '&.Mui-selected': { // Estilo del item seleccionado
                                      backgroundColor: 'rgba(79, 172, 254, 0.15)',
                                      '&:hover': {
                                           backgroundColor: 'rgba(79, 172, 254, 0.25)',
                                      }
                                  }
                              }
                          }
                      }
                  }}
                >
                  {/* *** CAMBIO: Nuevos roles *** */}
                  <MenuItem value="manager">Gerente</MenuItem>
                  <MenuItem value="facturador">Facturador</MenuItem>
                  <MenuItem value="visor">Visor</MenuItem>
                </Select>
                {formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}> {/* Contraseña a la derecha */}
              <TextField
                fullWidth
                label={user ? 'Nueva Contraseña' : 'Contraseña'}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(formErrors.password)}
                helperText={user ? formErrors.password || 'Dejar en blanco para no cambiar' : formErrors.password}
                required={!user} // Obligatorio solo al crear
                disabled={isSubmitting}
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}> {/* Switch de estado */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Switch
                  checked={formData.active}
                  onChange={handleChange}
                  name="active"
                  disabled={isSubmitting}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#4facfe', '&:hover': { backgroundColor: 'rgba(79, 172, 254, 0.08)' } },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4facfe' },
                    '&.Mui-disabled': { opacity: 0.5 }
                  }}
                />
                <Typography sx={{ opacity: isSubmitting ? 0.5 : 1 }}>
                  Usuario {formData.active ? 'Activo' : 'Inactivo'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#2a2a2a', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {/* Botón Limpiar */}
        <Button
          variant="outlined"
          onClick={resetForm}
          disabled={isSubmitting}
          sx={cancelButtonStyle}
        >
          Limpiar
        </Button>
        {/* Botón Guardar/Crear */}
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSubmitting}
          sx={actionButtonStyle}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null} // Ícono de carga
        >
          {isSubmitting ? (user ? 'GUARDANDO...' : 'CREANDO...') : (user ? 'GUARDAR CAMBIOS' : 'CREAR USUARIO')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;