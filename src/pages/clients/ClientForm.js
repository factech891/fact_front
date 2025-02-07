// src/pages/clients/ClientForm.js
import { useEffect, useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Box
} from '@mui/material';

export const ClientForm = ({ open, onClose, client, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rif: '',
    direccion: '',
    telefono: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (client) {
      setFormData({
        nombre: client.nombre || '',
        email: client.email || '',
        rif: client.rif || '',
        direccion: client.direccion || '',
        telefono: client.telefono || ''
      });
    }
  }, [client]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.rif.trim()) newErrors.rif = 'El RIF es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...client,
        ...formData
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      email: '',
      rif: '',
      direccion: '',
      telefono: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        {client ? 'Editar Cliente' : 'Nuevo Cliente'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                fullWidth
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({...prev, nombre: e.target.value}))}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="RIF"
                fullWidth
                value={formData.rif}
                onChange={(e) => setFormData(prev => ({...prev, rif: e.target.value}))}
                error={!!errors.rif}
                helperText={errors.rif}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                fullWidth
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({...prev, telefono: e.target.value}))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección"
                fullWidth
                multiline
                rows={2}
                value={formData.direccion}
                onChange={(e) => setFormData(prev => ({...prev, direccion: e.target.value}))}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};