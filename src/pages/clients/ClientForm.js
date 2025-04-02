import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  IconButton,
  Typography,
  InputAdornment,
  Select,
  MenuItem,
  Paper,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon,
  Person as PersonIcon,
  ContactPhone as ContactPhoneIcon,
  LocationOn as LocationOnIcon,
  ReceiptLong as ReceiptLongIcon,
  Info as InfoIcon
} from '@mui/icons-material';

export const ClientForm = ({ open, onClose, client, onSave }) => {
  // Usamos un ref para evitar re-renders innecesarios
  const initialFormState = {
    // Datos básicos
    nombre: client?.nombre || '',
    tipoRif: client?.rif?.split('-')[0] || 'V',
    rif: client?.rif?.split('-')[1] || '',
    tipoPersona: client?.tipoPersona || 'natural',
    
    // Contacto
    email: client?.email || '',
    telefono: client?.telefono || '',
    telefonoAlt: client?.telefonoAlt || '',
    sitioWeb: client?.sitioWeb || '',
    
    // Ubicación
    direccion: client?.direccion || '',
    ciudad: client?.ciudad || '',
    estado: client?.estado || '',
    codigoPostal: client?.codigoPostal || '',
    
    // Comercial
    tipoCliente: client?.tipoCliente || 'regular',
    condicionesPago: client?.condicionesPago || 'contado',
    diasCredito: client?.diasCredito || 0,
    limiteCredito: client?.limiteCredito || 0,
    
    // Adicional
    sector: client?.sector || '',
    notas: client?.notas || ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  
  // Manejar la carga inicial de datos
  useEffect(() => {
    if (client) {
      const rifParts = (client.rif || '').split('-');
      
      setFormData({
        // Datos básicos
        nombre: client.nombre || '',
        tipoRif: rifParts[0] || 'V',
        rif: rifParts[1] || '',
        tipoPersona: client.tipoPersona || 'natural',
        
        // Contacto
        email: client.email || '',
        telefono: client.telefono || '',
        telefonoAlt: client.telefonoAlt || '',
        sitioWeb: client.sitioWeb || '',
        
        // Ubicación
        direccion: client.direccion || '',
        ciudad: client.ciudad || '',
        estado: client.estado || '',
        codigoPostal: client.codigoPostal || '',
        
        // Comercial
        tipoCliente: client.tipoCliente || 'regular',
        condicionesPago: client.condicionesPago || 'contado',
        diasCredito: client.diasCredito || 0,
        limiteCredito: client.limiteCredito || 0,
        
        // Adicional
        sector: client.sector || '',
        notas: client.notas || ''
      });
    }
  }, [client]);

  // Validación del formulario - Solo en el envío para evitar re-renders
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.rif.trim()) newErrors.rif = 'El RIF/Cédula es requerido';
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Actualización de campo simplificada - evita cierres (closures) múltiples
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para guardar
  const handleSave = () => {
    if (validateForm()) {
      setSaving(true);
      
      // Combinar tipo de RIF con número
      const rifCompleto = `${formData.tipoRif}-${formData.rif}`;
      
      // Preparar todos los campos para guardar
      const clientToSave = {
        // Si es edición, mantener el ID
        ...(client && { _id: client._id }),
        
        // Datos básicos
        nombre: formData.nombre,
        rif: rifCompleto,
        tipoPersona: formData.tipoPersona,
        tipoCliente: formData.tipoCliente,
        
        // Contacto
        email: formData.email,
        telefono: formData.telefono,
        telefonoAlt: formData.telefonoAlt,
        sitioWeb: formData.sitioWeb,
        
        // Ubicación
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        estado: formData.estado,
        codigoPostal: formData.codigoPostal,
        
        // Comercial
        condicionesPago: formData.condicionesPago,
        diasCredito: Number(formData.diasCredito) || 0,
        limiteCredito: Number(formData.limiteCredito) || 0,
        
        // Adicional
        sector: formData.sector,
        notas: formData.notas
      };
      
      console.log('Guardando cliente:', clientToSave);
      
      onSave(clientToSave)
        .then(() => {
          handleClose();
        })
        .catch(error => {
          console.error('Error en el formulario:', error);
          setErrors({ submit: error.message || 'Error al guardar el cliente' });
          setSaving(false);
        });
    }
  };

  // Función para resetear formulario
  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  // Función para cerrar formulario
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      disableEscapeKeyDown={saving}
      PaperProps={{ sx: { bgcolor: '#1e1e1e', backgroundImage: 'none' } }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {client ? 'Editar Cliente' : 'Nuevo Cliente'}
        <IconButton onClick={handleClose} sx={{ color: 'white' }} disabled={saving}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2, bgcolor: '#1e1e1e', color: 'white' }}>
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
            {errors.submit}
          </Alert>
        )}
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" color="primary.main">
                  Datos Básicos
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel sx={{ color: 'text.secondary' }}>Tipo de Persona</InputLabel>
                    <Select
                      name="tipoPersona"
                      value={formData.tipoPersona}
                      onChange={handleFieldChange}
                      label="Tipo de Persona"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }}
                    >
                      <MenuItem value="natural">Persona Natural</MenuItem>
                      <MenuItem value="juridica">Persona Jurídica</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="nombre"
                    label={formData.tipoPersona === 'juridica' ? "Nombre / Razón Social" : "Nombre Completo"}
                    fullWidth
                    required
                    value={formData.nombre}
                    onChange={handleFieldChange}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="RIF/Cédula"
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Select
                            name="tipoRif"
                            value={formData.tipoRif}
                            onChange={handleFieldChange}
                            variant="standard"
                            sx={{ 
                              minWidth: '60px',
                              color: 'white',
                              '&:before': { borderBottomColor: 'rgba(255, 255, 255, 0.2)' },
                              '&:after': { borderBottomColor: 'primary.main' }
                            }}
                            disableUnderline
                          >
                            <MenuItem value="V">V</MenuItem>
                            <MenuItem value="J">J</MenuItem>
                            <MenuItem value="E">E</MenuItem>
                            <MenuItem value="G">G</MenuItem>
                          </Select>
                          <Typography sx={{ mx: 1, color: 'rgba(255, 255, 255, 0.7)' }}>-</Typography>
                        </InputAdornment>
                      ),
                    }}
                    name="rif"
                    value={formData.rif}
                    onChange={handleFieldChange}
                    error={!!errors.rif}
                    helperText={errors.rif}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ color: 'text.secondary' }}>Tipo de Cliente</InputLabel>
                    <Select
                      name="tipoCliente"
                      value={formData.tipoCliente}
                      onChange={handleFieldChange}
                      label="Tipo de Cliente"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }}
                    >
                      <MenuItem value="regular">Regular</MenuItem>
                      <MenuItem value="mayorista">Mayorista</MenuItem>
                      <MenuItem value="premium">Premium</MenuItem>
                      <MenuItem value="ocasional">Ocasional</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* SECCIÓN 2: CONTACTO */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ContactPhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" color="primary.main">
                  Información de Contacto
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="sitioWeb"
                    label="Sitio Web"
                    fullWidth
                    value={formData.sitioWeb}
                    onChange={handleFieldChange}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="telefono"
                    label="Teléfono Principal"
                    fullWidth
                    value={formData.telefono}
                    onChange={handleFieldChange}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="telefonoAlt"
                    label="Teléfono Alternativo"
                    fullWidth
                    value={formData.telefonoAlt}
                    onChange={handleFieldChange}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* SECCIÓN 3: UBICACIÓN */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" color="primary.main">
                  Ubicación
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="direccion"
                    label="Dirección"
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.direccion}
                    onChange={handleFieldChange}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="ciudad"
                    label="Ciudad"
                    fullWidth
                    value={formData.ciudad}
                    onChange={handleFieldChange}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="estado"
                    label="Estado/Provincia"
                    fullWidth
                    value={formData.estado}
                    onChange={handleFieldChange}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="codigoPostal"
                    label="Código Postal"
                    fullWidth
                    value={formData.codigoPostal}
                    onChange={handleFieldChange}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* SECCIÓN 4: INFORMACIÓN COMERCIAL */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReceiptLongIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" color="primary.main">
                  Información Comercial
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ color: 'text.secondary' }}>Condiciones de Pago</InputLabel>
                    <Select
                      name="condicionesPago"
                      value={formData.condicionesPago}
                      onChange={handleFieldChange}
                      label="Condiciones de Pago"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }}
                    >
                      <MenuItem value="contado">Contado</MenuItem>
                      <MenuItem value="credito15">Crédito 15 días</MenuItem>
                      <MenuItem value="credito30">Crédito 30 días</MenuItem>
                      <MenuItem value="credito60">Crédito 60 días</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="diasCredito"
                    label="Días de Crédito"
                    fullWidth
                    type="number"
                    value={formData.diasCredito}
                    onChange={handleFieldChange}
                    error={!!errors.diasCredito}
                    helperText={errors.diasCredito}
                    disabled={!formData.condicionesPago.includes('credito')}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="limiteCredito"
                    label="Límite de Crédito"
                    fullWidth
                    type="number"
                    value={formData.limiteCredito}
                    onChange={handleFieldChange}
                    error={!!errors.limiteCredito}
                    helperText={errors.limiteCredito}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="sector"
                    label="Sector/Industria"
                    fullWidth
                    value={formData.sector}
                    onChange={handleFieldChange}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* SECCIÓN 5: NOTAS */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: 'rgba(45, 45, 45, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" color="primary.main">
                  Información Adicional
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="notas"
                    label="Notas Internas"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.notas}
                    onChange={handleFieldChange}
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }
                    }}
                    helperText="Información adicional y notas internas sobre este cliente"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#2a2a2a', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          variant="outlined"
          color="error"
          onClick={resetForm}
          startIcon={<ResetIcon />}
          disabled={saving}
          sx={{ borderColor: 'rgba(255, 77, 77, 0.5)', '&:hover': { borderColor: 'error.main', bgcolor: 'rgba(255, 77, 77, 0.1)' } }}
        >
          Limpiar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};