import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import { useCompany } from '../../../hooks/useCompany';

const CompanyForm = () => {
  const { company, loading, error: apiError, saveCompany } = useCompany();
  const [formData, setFormData] = useState({
    nombre: '',
    rif: '',
    direccion: '',
    ciudad: '',
    estado: '',
    telefono: '',
    email: ''
  });
  const [saveStatus, setSaveStatus] = useState({ success: false, message: '' });

  useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveCompany(formData);
      setSaveStatus({
        success: true,
        message: 'Información de la empresa actualizada exitosamente'
      });
    } catch (err) {
      setSaveStatus({
        success: false,
        message: 'Error al actualizar la información de la empresa'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Información General
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre de la Empresa"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="RIF"
              name="rif"
              value={formData.rif}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Dirección
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Contacto
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </Grid>

          {(apiError || saveStatus.message) && (
            <Grid item xs={12}>
              <Alert severity={saveStatus.success ? "success" : "error"}>
                {apiError || saveStatus.message}
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Button
                variant="outlined"
                color="error"
                onClick={async () => {
                  if (window.confirm('¿Estás seguro de que quieres eliminar toda la información de la empresa? Esta acción no se puede deshacer.')) {
                    try {
                      const response = await fetch('http://localhost:5002/api/company', {
                        method: 'DELETE'
                      });
                      
                      if (response.ok) {
                        setFormData({
                          nombre: '',
                          rif: '',
                          direccion: '',
                          ciudad: '',
                          estado: '',
                          telefono: '',
                          email: ''
                        });
                        setSaveStatus({
                          success: true,
                          message: 'Información de la empresa eliminada exitosamente'
                        });
                      } else {
                        throw new Error('Error al eliminar la información');
                      }
                    } catch (error) {
                      setSaveStatus({
                        success: false,
                        message: 'Error al eliminar la información de la empresa'
                      });
                    }
                  }
                }}
              >
                Eliminar Información
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CompanyForm;
