// src/pages/auth/Register.js - con corrección en botón Siguiente y logs
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button,
  Link, Paper, Grid, CircularProgress, Alert, Stepper, Step, StepLabel
} from '@mui/material';
import { useAuth } from '../../context/AuthContext'; // Asegúrate que la ruta sea correcta

// Pasos del registro
const steps = ['Información de la Empresa', 'Información del Usuario'];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(''); // Mantenemos esto por si acaso

  // Datos de la empresa
  const [companyData, setCompanyData] = useState({
    name: '',
    rif: '',
    address: '',
    city: '',
    state: '',
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

  // Quitamos useAuth por ahora si handleSubmit usa fetch directo
  // const { register } = useAuth();
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
    console.log("Validando paso:", activeStep); // Log para depuración
    setError(''); // Limpiar error al validar
    if (activeStep === 0) {
      // Validar datos de la empresa
      const { name, rif, email } = companyData;
      console.log("Datos empresa para validar:", { name, rif, email }); // Log para depuración
      if (!name || !rif || !email) {
        setError('Por favor complete Nombre, RIF y Correo Electrónico de la Empresa');
        console.log("Validación paso 0: FALLÓ"); // Log para depuración
        return false;
      }
    } else if (activeStep === 1) {
      // Validar datos del usuario
      const { firstName, lastName, email, password, confirmPassword } = userData;
      console.log("Datos usuario para validar:", { firstName, lastName, email, password_length: password.length, confirmPassword_length: confirmPassword.length }); // Log para depuración
      if (!firstName || !lastName || !email || !password) {
        setError('Por favor complete Nombre, Apellido, Correo Electrónico y Contraseña del usuario');
        console.log("Validación paso 1: FALLÓ (campos obligatorios)"); // Log para depuración
        return false;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        console.log("Validación paso 1: FALLÓ (contraseñas no coinciden)"); // Log para depuración
        return false;
      }
    }
    console.log(`Validación paso ${activeStep}: OK`); // Log para depuración
    return true;
  };

  const handleNext = () => {
    console.log("Intentando ir al siguiente paso..."); // Log para depuración
    if (validateStep()) {
      console.log("Validación OK, avanzando al siguiente paso."); // Log para depuración
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      console.log("Validación falló, no se avanza."); // Log para depuración
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError(''); // Limpiar error al retroceder
  };

  // handleSubmit sigue usando fetch directo como lo tenías para depurar
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir envío normal del formulario

    setDebugInfo("Iniciando proceso de registro...");

    // Validar el último paso antes de enviar
    if (!validateStep()) {
      setDebugInfo(prevInfo => prevInfo + "\nError en validación final");
      return;
    }

    try {
      setError('');
      setLoading(true);

      const formattedData = {
        company: {
          nombre: companyData.name,
          rif: companyData.rif,
          direccion: companyData.address || '',
          ciudad: companyData.city || '',
          estado: companyData.state || '',
          telefono: companyData.phone || '',
          email: companyData.email
        },
        user: {
          nombre: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          password: userData.password
        }
      };

      setDebugInfo(prevInfo => prevInfo + "\nDatos a enviar: " + JSON.stringify(formattedData, null, 2));

      try {
        setDebugInfo(prevInfo => prevInfo + "\nEnviando petición POST al servidor...");

        const response = await fetch('http://localhost:5002/api/auth/register', {
          method: 'POST', // Asegurarse que es POST
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedData)
        });

        setDebugInfo(prevInfo => prevInfo + `\nEstado de respuesta: ${response.status} ${response.statusText}`);

        // Intentar leer como texto primero para ver errores no-JSON
        const responseText = await response.text();
        setDebugInfo(prevInfo => prevInfo + "\nRespuesta (texto): " + responseText);

        // Intentar parsear como JSON sólo si la respuesta fue OK (o como lo maneje tu API)
        if (!response.ok) {
             // Lanzar error con el texto si no fue OK
             throw new Error(responseText || `Error ${response.status}`);
        }

        const data = JSON.parse(responseText); // Parsear el texto si la respuesta fue OK
        setDebugInfo(prevInfo => prevInfo + "\nRespuesta (JSON parseado): " + JSON.stringify(data, null, 2));

        // Asumiendo que tu backend devuelve { success: true, token: '...', ... }
        if (data.success) {
          localStorage.setItem('token', data.token);
          setDebugInfo(prevInfo => prevInfo + "\nRegistro exitoso, redirigiendo...");
          // Quizás necesites actualizar el estado de AuthContext aquí si lo vuelves a usar
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          // Si success es false pero la respuesta fue 2xx, usar el mensaje del backend
          throw new Error(data.message || 'Error en el registro devuelto por el backend');
        }
      } catch (fetchError) {
        // Captura errores de red o errores lanzados arriba
        setDebugInfo(prevInfo => prevInfo + "\nError en fetch/procesamiento: " + fetchError.message);
        // Mostrar el error al usuario
        setError(fetchError.message || 'Error de comunicación con el servidor');
        // No re-lanzar si ya lo estamos mostrando en setError
      }

    } catch (error) {
      // Este catch es por si algo más falla fuera del try/catch interno del fetch
      setDebugInfo(prevInfo => prevInfo + "\nError final inesperado: " + error.message);
      setError(error.message || 'Error inesperado al registrar la cuenta');
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
          {debugInfo && (
            <Alert severity="info" sx={{ mb: 2, whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
              {debugInfo}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Usamos onSubmit solo para el último paso, handleNext se llama con onClick */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {activeStep === 0 ? (
              // Formulario de datos de la empresa
              <Grid container spacing={2}>
                {/* Campos de la empresa... sin cambios */}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="city"
                    label="Ciudad"
                    name="city"
                    value={companyData.city}
                    onChange={handleCompanyChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="state"
                    label="Estado/Provincia"
                    name="state"
                    value={companyData.state}
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
                 {/* Campos del usuario... sin cambios */}
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
                type="button" // Asegurar que no envíe el form
              >
                Atrás
              </Button>
              <Button
                // El tipo es 'submit' solo en el último paso
                type={activeStep === steps.length - 1 ? 'submit' : 'button'}
                variant="contained"
                disabled={loading}
                // onClick se usa solo para el botón 'Siguiente'
                onClick={activeStep === steps.length - 1 ? undefined : handleNext}
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
