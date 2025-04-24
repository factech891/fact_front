import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button,
  Link, Paper, Grid, CircularProgress, Alert, Stepper, Step, StepLabel,
  useTheme, InputAdornment, styled // Import styled
} from '@mui/material';
// Importa los iconos necesarios
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person'; // Icono para nombres
import BusinessIcon from '@mui/icons-material/Business'; // Icono para empresa
import BadgeIcon from '@mui/icons-material/Badge'; // Icono para RIF/ID
import PhoneIcon from '@mui/icons-material/Phone'; // Icono para teléfono
import HomeIcon from '@mui/icons-material/Home'; // Icono para dirección/ciudad/estado

import { useAuth } from '../../context/AuthContext'; // Asegúrate que la ruta sea correcta

// URL de la imagen de fondo SVG (la misma que en Login)
const BACKGROUND_IMAGE_URL = 'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/q.svg';

// --- Componente de Texto con Gradiente (igual que en Login) ---
const GradientText = styled(Typography)(({ theme }) => ({ 
  fontWeight: 700,
  fontSize: '2.5rem', 
  background: 'linear-gradient(135deg, #4338ca 0%, #38bdf8 100%)', 
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text', 
  color: 'transparent',
  WebkitTextFillColor: 'transparent', 
  display: 'inline-block',
  marginBottom: theme.spacing(3), 
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)', 
}));

// Pasos del registro
const steps = ['Información de la Empresa', 'Información del Usuario'];

const Register = () => {
  // --- Estados ---
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); 
  const [companyData, setCompanyData] = useState({ name: '', rif: '', address: '', city: '', state: '', phone: '', email: '' }); // Initialize state
  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }); // Initialize state

  // --- Hooks ---
  const { register } = useAuth(); 
  const navigate = useNavigate();
  const theme = useTheme(); // Hook para acceder al tema

  // --- Handlers (Implementaciones básicas - reemplaza con tu lógica real) ---
  const handleCompanyChange = (e) => {
      const { name, value } = e.target;
      setCompanyData(prev => ({ ...prev, [name]: value }));
  };
  const handleUserChange = (e) => {
      const { name, value } = e.target;
      setUserData(prev => ({ ...prev, [name]: value }));
  };
  const validateStep = () => { 
      // Añade tu lógica de validación aquí
      console.log("Validating step:", activeStep);
      // Ejemplo simple:
      if (activeStep === 0 && (!companyData.name || !companyData.rif || !companyData.email)) {
          setError("Nombre, RIF y Email de empresa son requeridos.");
          return false;
      }
      if (activeStep === 1 && (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.confirmPassword)) {
          setError("Todos los campos de usuario son requeridos.");
          return false;
      }
       if (activeStep === 1 && userData.password !== userData.confirmPassword) {
          setError("Las contraseñas no coinciden.");
          return false;
      }
      setError(''); // Clear error if validation passes
      return true; 
  };
  const handleNext = () => { 
      if (validateStep()) {
          setActiveStep((prev) => prev + 1); 
      }
  };
  const handleBack = () => { 
      setActiveStep((prev) => prev - 1); 
      setError(''); // Clear error on going back
  };
  const handleSubmit = async (e) => { 
      e.preventDefault();
      if (!validateStep()) return;

      setLoading(true);
      setError('');
      try {
          const registrationData = { company: companyData, user: userData };
          console.log("Submitting registration:", registrationData); // Log para debug
          await register(registrationData); // Llama a la función del contexto
          navigate('/dashboard', { replace: true });
      } catch (err) {
          console.error("Registration failed:", err);
          setError(err.message || 'Error en el registro.');
      } finally {
          setLoading(false);
      }
  };

  // --- Renderizado ---
  return (
    // Contenedor principal con fondo
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Cambiado a columna para manejar el copyright abajo
        alignItems: 'center', // Centra horizontalmente el Paper y el Copyright
        justifyContent: 'center', // Centra verticalmente si el contenido es corto
        minHeight: '100vh', 
        backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        py: 4, // Ajustamos padding vertical general
        px: 2, 
      }}
    >
      {/* Contenedor del formulario centrado y semi-transparente */}
      <Paper 
        elevation={8} 
        sx={{ 
          p: { xs: 3, sm: 4 }, 
          maxWidth: '700px', 
          width: '100%', 
          backgroundColor: 'rgba(30, 30, 30, 0.85)', 
          backdropFilter: 'blur(5px)', 
          borderRadius: theme.shape.borderRadius * 1.5, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', 
          // Aumentamos margen inferior para dar espacio al copyright
          mb: 4, // Margen inferior aumentado
        }}
      >
        {/* Título con gradiente */}
        <GradientText component="h1">
          FactTech
        </GradientText>
        
        {/* Subtítulo opcional */}
        <Typography variant="h6" align="center" sx={{ mb: 3, color: theme.palette.text.secondary }}>
           Registro de Nueva Cuenta
        </Typography>

        {/* Alerta de error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%', backgroundColor: 'rgba(30, 30, 30, 0.85)' }}>
            {error}
          </Alert>
        )}

        {/* Stepper (Indicador de pasos) */}
        <Stepper activeStep={activeStep} sx={{ mb: 4, width: '100%' }}>
          {steps.map((label, index) => ( // Added index for key/logic
            <Step key={label}>
              <StepLabel 
                 StepIconProps={{
                    // Corrected logic for active/completed color
                    style: { color: activeStep === index ? theme.palette.primary.main : (activeStep > index ? theme.palette.success.main : theme.palette.text.disabled) } 
                 }}
                 sx={{ 
                    '& .MuiStepLabel-label': { 
                        color: activeStep >= index ? theme.palette.text.primary : theme.palette.text.secondary,
                        '&.Mui-active': { fontWeight: 'bold' },
                        '&.Mui-completed': { fontWeight: 'normal'}
                    } 
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Formulario */}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
          {activeStep === 0 ? (
            // --- PASO 1: DATOS EMPRESA ---
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField required fullWidth id="name" label="Nombre de la Empresa" name="name" value={companyData.name} onChange={handleCompanyChange} InputProps={{ startAdornment: (<InputAdornment position="start"><BusinessIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>), }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth id="rif" label="RIF / Identificación Fiscal" name="rif" value={companyData.rif} onChange={handleCompanyChange} InputProps={{ startAdornment: (<InputAdornment position="start"><BadgeIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>), }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth id="email-company" label="Correo Electrónico de la Empresa" name="email" type="email" value={companyData.email} onChange={handleCompanyChange} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>), }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth id="address" label="Dirección" name="address" value={companyData.address} onChange={handleCompanyChange} InputProps={{ startAdornment: (<InputAdornment position="start"><HomeIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>), }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth id="city" label="Ciudad" name="city" value={companyData.city} onChange={handleCompanyChange} InputProps={{ startAdornment: (<InputAdornment position="start"><HomeIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>), }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth id="state" label="Estado/Provincia" name="state" value={companyData.state} onChange={handleCompanyChange} InputProps={{ startAdornment: (<InputAdornment position="start"><HomeIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>), }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth id="phone" label="Teléfono" name="phone" value={companyData.phone} onChange={handleCompanyChange} InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>), }} />
              </Grid>
            </Grid>
          ) : (
            // --- PASO 2: DATOS USUARIO ---
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth id="firstName" label="Nombre" name="firstName" value={userData.firstName} onChange={handleUserChange} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>), }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth id="lastName" label="Apellido" name="lastName" value={userData.lastName} onChange={handleUserChange} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>), }} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth id="email-user" label="Correo Electrónico del Usuario" name="email" type="email" value={userData.email} onChange={handleUserChange} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>), }} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth id="password" label="Contraseña" name="password" type="password" value={userData.password} onChange={handleUserChange} InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>), }} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth id="confirmPassword" label="Confirmar Contraseña" name="confirmPassword" type="password" value={userData.confirmPassword} onChange={handleUserChange} InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>), }} />
              </Grid>
            </Grid>
          )}

          {/* Botones de navegación del Stepper */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button 
              disabled={activeStep === 0 || loading} 
              onClick={handleBack} 
              variant="outlined" 
              type="button"
              sx={{ borderColor: theme.palette.text.secondary, color: theme.palette.text.secondary }}
            >
              Atrás
            </Button>
            <Button
              type={activeStep === steps.length - 1 ? 'submit' : 'button'}
              variant="contained"
              disabled={loading}
              onClick={activeStep === steps.length - 1 ? undefined : handleNext}
              sx={{
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                color: theme.palette.primary.contrastText,
                transition: 'opacity 0.3s ease',
                '&:hover': { opacity: 0.9 },
                '&.Mui-disabled': {
                  background: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled,
                  cursor: 'not-allowed',
                  pointerEvents: 'auto',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> :
                (activeStep === steps.length - 1 ? 'Registrar Cuenta' : 'Siguiente')}
            </Button>
          </Box>
        </Box>

        {/* Enlace para ir a Login */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Link component={RouterLink} to="/auth/login" variant="body2">
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </Box>
      </Paper>

      {/* Copyright al final de la página - Ahora posicionado normalmente */}
      <Typography 
         variant="body2" 
         align="center" 
         sx={{ 
            // Quitamos position absolute y related styles
            // position: 'absolute', 
            // bottom: theme.spacing(2), 
            // left: 0, 
            // right: 0, 
            width: '100%', // Ocupa el ancho para centrarse bien
            color: theme.palette.text.secondary, 
            mt: 'auto', // Empuja hacia abajo si hay espacio extra
            pt: 2, // Padding top para separar del contenido si está cerca
         }}
      >
        &copy; {new Date().getFullYear()} FactTech. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default Register;