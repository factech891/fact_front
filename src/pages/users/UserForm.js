// src/pages/users/UserForm.js (versión modal/diálogo)
import React, { useState, useEffect } from 'react';
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
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useUsers } from '../../hooks/useUsers';

const UserForm = ({ open, onClose, user, onSave }) => {
  // Estado inicial del formulario
  const initialState = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    active: true
  };
  
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // Estilo para botones de acción principal (gradiente azul)
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
  
  // Estilo para el botón cancelar
  const cancelButtonStyle = {
    borderRadius: '50px',
    padding: '8px 22px',
    textTransform: 'none',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.5)',
    }
  };
  
  // Cargar datos del usuario en modo edición
  useEffect(() => {
    if (open) {
      setSubmitError(null);
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          role: user.role || 'user',
          active: user.active !== undefined ? user.active : true,
          // No incluir password en modo edición
        });
      } else {
        setFormData(initialState);
      }
      setFormErrors({});
    }
  }, [user, open]);
  
  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    // Para el switch de active, usamos checked
    const newValue = name === 'active' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    
    // Limpiar errores al cambiar un campo
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Validación del formulario
  const validateForm = () => {
    const errors = {};
    setSubmitError(null);
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!user && !formData.password) {
      errors.password = 'La contraseña es obligatoria para nuevos usuarios';
    } else if (!user && formData.password && formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Envío del formulario
  const handleSave = async () => {
    if (validateForm()) {
      setSaving(true);
      setSubmitError(null);

      const userData = { ...formData };
      
      // Si estamos editando y no se cambió la contraseña, eliminarla del objeto
      if (user && !formData.password) {
        delete userData.password;
      }

      if (user?._id) {
        userData._id = user._id;
      }

      try {
        await onSave(userData);
        handleClose();
      } catch (error) {
        console.error('Error saving user:', error);
        setSubmitError(error?.message || 'Error al guardar. Intente de nuevo.');
      } finally {
        setSaving(false);
      }
    }
  };
  
  // Resetear formulario
  const resetForm = () => {
    setFormData(initialState);
    setFormErrors({});
    setSubmitError(null);
  };
  
  // Cerrar diálogo
  const handleClose = () => {
    if (saving) return;
    onClose();
  };
  
  // Estilos para campos de texto oscuros
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4facfe',
      },
      '& input, & textarea': { color: 'white' }
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-focused': {
        color: '#4facfe',
      }
    },
    '& .MuiFormHelperText-root': {
      color: 'rgba(255, 255, 255, 0.5)',
      '&.Mui-error': {
        color: '#f44336',
      }
    }
  };
  
  // Estilo específico para Select
  const selectStyles = {
    ...inputStyles,
    '& .MuiSelect-select': { color: 'white' },
    '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' },
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={saving}
      PaperProps={{ 
        sx: { 
          bgcolor: '#1e1e1e', 
          backgroundImage: 'none', 
          border: '1px solid rgba(255, 255, 255, 0.1)' 
        } 
      }}
    >
      <DialogTitle
        sx={{ 
          backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          py: 1.5, 
          px: 2 
        }}
      >
        {user ? 'Editar Usuario' : 'Crear Usuario'}
        <IconButton onClick={handleClose} sx={{ color: 'white' }} disabled={saving}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#1e1e1e', color: 'white' }}>
        {submitError && (
          <Box sx={{ mb: 2, mt: 1, color: '#f44336' }}>
            {submitError}
          </Box>
        )}

        <Box sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                required
                disabled={saving}
                sx={inputStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
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
                disabled={saving}
                sx={inputStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(formErrors.role)} sx={selectStyles}>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Rol"
                  disabled={saving}
                >
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="manager">Gerente</MenuItem>
                  <MenuItem value="user">Usuario</MenuItem>
                </Select>
                {formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={user ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleChange}
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
                required={!user}
                disabled={saving}
                sx={inputStyles}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Switch
                  checked={formData.active}
                  onChange={handleChange}
                  name="active"
                  disabled={saving}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4facfe',
                      '&:hover': {
                        backgroundColor: 'rgba(79, 172, 254, 0.08)',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4facfe',
                    },
                  }}
                />
                <Typography>
                  Usuario {formData.active ? 'Activo' : 'Inactivo'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        bgcolor: '#2a2a2a', 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
      }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={resetForm}
          disabled={saving}
          sx={cancelButtonStyle}
        >
          Limpiar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={actionButtonStyle}
        >
          {saving ? (user ? 'GUARDANDO...' : 'CREANDO...') : (user ? 'GUARDAR CAMBIOS' : 'CREAR')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;