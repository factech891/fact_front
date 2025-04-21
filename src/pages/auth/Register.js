// src/pages/auth/Register.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, TextField, Button, 
  Link, Paper, Grid, CircularProgress, Alert, Stepper, Step, StepLabel 
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

// Pasos del registro
const steps = ['Información de la Empresa', 'Información del Usuario'];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Datos de la empresa
  const [companyData, setCompanyData] = useState({
    name: '',
    rif: '',
    address: '',
    phone: '',
    email: ''
  });
  
  // Datos del usuario administrador
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateStep = () => {
    if (activeStep === 0) {
      // Validar datos de la empresa
      const { name, rif, email } = companyData;
      if (!name || !rif || !email) {
        setError('Por favor complete los campos obligatorios');
        return false;
      }
    } else if (activeStep === 1) {
      // Validar datos del usuario
      const { firstName, lastName, email, password, confirmPassword } = userData;
      if (!firstName || !lastName || !email || !password) {
        setError('Por favor complete los campos obligatorios');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
      }
    }
    return true;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      setError('');
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Combinar los datos para el registro
      const registrationData = {
        company: companyData,
        user: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          role: 'admin' // El primer usuario siempre es admin
        }
      };
      
      await register(registrationData);
      
      // Redireccionar al dashboard después del registro exitoso
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Error al registrar la cuenta');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src="/img/logo.png" alt="FactTech Logo" style={{ height: 60, marginBottom: 16 }} />
            <Typography component="h1" variant="h5">
              Registro de Empresa
            </Typography>
          </Box>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box component="form" onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext} noValidate>
            {activeStep === 0 ? (
              // Formulario de datos de la empresa
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Nombre de la Empresa"
                    name="name"
                    value={companyData.name}
                    onChange={handleCompanyChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="rif"
                    label="RIF / Identificación Fiscal"
                    name="rif"
                    value={companyData.rif}
                    onChange={handleCompanyChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Correo Electrónico de la Empresa"
                    name="email"
                    type="email"
                    value={companyData.email}
                    onChange={handleCompanyChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="address"
                    label="Dirección"
                    name="address"
                    value={companyData.address}
                    onChange={handleCompanyChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="phone"
                    label="Teléfono"
                    name="phone"
                    value={companyData.phone}
                    onChange={handleCompanyChange}
                  />
                </Grid>
              </Grid>
            ) : (
              // Formulario de datos del usuario administrador
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="Nombre"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleUserChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Apellido"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleUserChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleUserChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="password"
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={userData.password}
                    onChange={handleUserChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    type="password"
                    value={userData.confirmPassword}
                    onChange={handleUserChange}
                  />
                </Grid>
              </Grid>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Atrás
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 
                  (activeStep === steps.length - 1 ? 'Registrar' : 'Siguiente')}
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/auth/login" variant="body2">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;