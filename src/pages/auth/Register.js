// src/pages/auth/Register.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button,
  Link, Grid, CircularProgress, Alert, Stepper, Step, StepLabel,
  useTheme, InputAdornment, FormControl, Select, MenuItem, useMediaQuery
} from '@mui/material';
// Importa los iconos necesarios
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { useAuth } from '../../context/AuthContext';
import { detectBrowserTimezone, commonTimezones } from '../../utils/dateUtils';

// Colores inspirados en la imagen nueva - IGUALES QUE EN LOGIN
const LEFT_PANEL_BACKGROUND = '#0A0318'; // Azul muy oscuro / casi negro (ajustado a más oscuro)
// Ahora usamos un degradado en lugar de un color sólido para el panel derecho
const RIGHT_PANEL_GRADIENT = 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)';
// Color turquesa para acentos
const ACCENT_COLOR = '#40E0D0';

// Pasos del registro
const steps = ['Información de la Empresa', 'Información del Usuario'];

const Register = () => {
  // --- Estados ---
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyData, setCompanyData] = useState({
    name: '',
    rif: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    timezone: detectBrowserTimezone()
  });
  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });

  // --- Hooks ---
  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // --- Handlers ---
  const handleCompanyChange = (e) => {
      const { name, value } = e.target;
      setCompanyData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUserChange = (e) => {
      const { name, value } = e.target;
      setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateStep = () => {
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
      setError('');
      return true;
  };
  
  const handleNext = () => {
      if (validateStep()) {
          setActiveStep((prev) => prev + 1);
      }
  };
  
  const handleBack = () => {
      setActiveStep((prev) => prev - 1);
      setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError('');
    try {
        const registrationData = { company: companyData, user: userData };
        console.log("Submitting registration:", registrationData);
        await register(registrationData);
        
        localStorage.setItem('pendingVerificationEmail', userData.email);
        navigate('/auth/verify-email-notice', { replace: true });
    } catch (err) {
        console.error("Registration failed:", err);
        setError(err.message || 'Error en el registro.');
    } finally {
        setLoading(false);
    }
  };

  // Función helper para crear los campos de texto con la etiqueta sobre el campo
  const renderTextField = (id, label, name, value, onChange, icon, required = false, type = "text", fullWidth = true, xs = 12, sm = undefined) => {
    return (
      <Grid item xs={xs} sm={sm}>
        <Box sx={{ position: 'relative', mb: 1 }}>
          <Typography 
            sx={{ 
              position: 'absolute',
              top: '-8px',
              left: '0',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: '#00334e',
              zIndex: 1
            }}
          >
            {label} {required && <span style={{ color: 'red' }}>*</span>}
          </Typography>
          <TextField 
            fullWidth={fullWidth}
            id={id}
            name={name}
            type={type}
            placeholder={`Ingresa ${label.toLowerCase()}`}
            value={value}
            onChange={onChange}
            required={false}
            variant="outlined"
            label=""
            size="small"
            margin="dense"
            InputLabelProps={{
              shrink: true,
              sx: { display: 'none' }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& > input": {
                  color: "black !important",
                  WebkitTextFillColor: "black !important"
                }
              }
            }}
            InputProps={{
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                mt: 1,
                height: '36px',
                fontSize: '0.9rem',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00334e',
                  borderWidth: '2px',
                },
              },
              startAdornment: icon && (
                <InputAdornment position="start">
                  {icon}
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: LEFT_PANEL_BACKGROUND,
      }}
    >
      {/* Lado izquierdo: Logo con fondo oscuro */}
      <Box
        sx={{
          flex: { xs: 'none', md: '0.5' },
          backgroundColor: LEFT_PANEL_BACKGROUND,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 3, md: 6 },
          height: { xs: '220px', md: '100%' },
          position: 'relative',
        }}
      >
        {/* Contenedor para centrar el logo y texto */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <Box
            sx={{
              mb: { xs: 1, md: 3 },
              width: { xs: '100px', md: '220px' },
              height: { xs: '100px', md: '220px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Logo más parecido al de la referencia */}
            <Box
              component="div"
              sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="div"
                sx={{
                  width: '85%',
                  height: '100%',
                  border: `4px solid ${ACCENT_COLOR}`,
                  borderRadius: '5px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Líneas que simulan texto dentro del documento */}
                {[...Array(5)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: '70%',
                      height: { xs: '4px', md: '6px' },
                      backgroundColor: ACCENT_COLOR,
                      my: { xs: 0.3, md: 0.5 },
                      borderRadius: '2px',
                    }}
                  />
                ))}
              </Box>
              {/* Corchete izquierdo */}
              <Box
                component="div"
                sx={{
                  width: '15px',
                  height: '60%',
                  borderLeft: `4px solid ${ACCENT_COLOR}`,
                  borderTop: `4px solid ${ACCENT_COLOR}`,
                  borderBottom: `4px solid ${ACCENT_COLOR}`,
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                  position: 'absolute',
                  left: '0',
                }}
              />
              {/* Corchete derecho */}
              <Box
                component="div"
                sx={{
                  width: '15px',
                  height: '60%',
                  borderRight: `4px solid ${ACCENT_COLOR}`,
                  borderTop: `4px solid ${ACCENT_COLOR}`,
                  borderBottom: `4px solid ${ACCENT_COLOR}`,
                  borderTopRightRadius: '8px',
                  borderBottomRightRadius: '8px',
                  position: 'absolute',
                  right: '0',
                }}
              />
            </Box>
          </Box>
          
          <Typography
            component="h1"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '4.5rem' },
              letterSpacing: '0.03em',
              lineHeight: 1.1,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              color: ACCENT_COLOR,
            }}
          >
            FactTech
          </Typography>
        </Box>
        
        {/* Copyright - invisible en móvil, visible en escritorio */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.7rem',
            position: 'absolute',
            bottom: { xs: '5px', md: '20px' },
            left: 0,
            right: 0,
            display: { xs: 'none', sm: 'block' } // Oculto en móvil
          }}
        >
          &copy; {new Date().getFullYear()} FactTech. Todos los derechos reservados.
        </Typography>
      </Box>

      {/* Lado derecho: Formulario de registro */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', md: '0.5' },
          background: RIGHT_PANEL_GRADIENT,
          p: { xs: 2.5, md: 5 },
          paddingTop: { xs: 4, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { xs: 'flex-start', md: 'center' },
          alignItems: 'center',
          overflowY: 'auto',
          height: { xs: 'calc(100vh - 220px)', md: '100%' },
          borderTopLeftRadius: { xs: '24px', md: 0 },
          borderTopRightRadius: { xs: '24px', md: 0 },
          marginTop: { xs: '-24px', md: 0 },
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Contenedor interno para el formulario */}
        <Box sx={{ 
          width: '100%', 
          maxWidth: '450px',
        }}>
          <Typography 
            variant="h5" 
            align="center" 
            sx={{ 
              mb: 1, 
              color: '#00334e', 
              fontWeight: 'bold', 
              fontSize: { xs: '1.3rem', sm: '1.5rem' } 
            }}
          >
            Registro de Nueva Cuenta
          </Typography>

          {/* Alerta de error */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2, 
                width: '100%', 
                backgroundColor: 'rgba(255, 205, 210, 0.9)',
                color: '#b71c1c',
                border: '1px solid #ef9a9a',
                fontSize: { xs: '0.8rem', md: '0.875rem' },
                '& .MuiAlert-icon': {
                  color: '#b71c1c',
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Stepper (Indicador de pasos) */}
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 3,
              width: '100%',
              '& .MuiStepIcon-root': {
                color: '#00334e',
              },
              '& .MuiStepIcon-root.Mui-active': {
                color: '#0288d1',
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: '#00695c',
              },
              '& .MuiStepLabel-label': {
                color: '#00334e',
                fontWeight: 500,
                fontSize: { xs: '0.8rem', md: '0.9rem' }
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            {activeStep === 0 ? (
              // --- PASO 1: DATOS EMPRESA ---
              <Grid container spacing={2}>
                {renderTextField("name", "Nombre de la Empresa", "name", companyData.name, handleCompanyChange, <BusinessIcon sx={{ color: '#00334e' }} />, true)}
                {renderTextField("rif", "RIF / Identificación Fiscal", "rif", companyData.rif, handleCompanyChange, <BadgeIcon sx={{ color: '#00334e' }} />, true, "text", true, 12, 6)}
                {renderTextField("email-company", "Email de la Empresa", "email", companyData.email, handleCompanyChange, <EmailIcon sx={{ color: '#00334e' }} />, true, "email", true, 12, 6)}
                {renderTextField("address", "Dirección", "address", companyData.address, handleCompanyChange, <HomeIcon sx={{ color: '#00334e' }} />)}
                {renderTextField("city", "Ciudad", "city", companyData.city, handleCompanyChange, <HomeIcon sx={{ color: '#00334e' }} />, false, "text", true, 12, 6)}
                {renderTextField("state", "Estado/Provincia", "state", companyData.state, handleCompanyChange, <HomeIcon sx={{ color: '#00334e' }} />, false, "text", true, 12, 6)}
                {renderTextField("phone", "Teléfono", "phone", companyData.phone, handleCompanyChange, <PhoneIcon sx={{ color: '#00334e' }} />)}
                
                <Grid item xs={12}>
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Typography 
                      sx={{ 
                        position: 'absolute',
                        top: '-8px',
                        left: '0',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: '#00334e',
                        mb: 1,
                        zIndex: 1
                      }}
                    >
                      Zona Horaria
                    </Typography>
                    <FormControl 
                      fullWidth
                      sx={{
                        mt: 2 
                      }}
                    >
                      <Select
                        id="timezone"
                        name="timezone"
                        value={companyData.timezone}
                        onChange={handleCompanyChange}
                        displayEmpty
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '8px',
                          height: '53px',
                          color: 'black !important', // Garantiza que el texto sea negro y visible
                          '& .MuiSelect-select': {
                            color: 'black !important', // Garantiza que el texto seleccionado sea negro
                            fontWeight: 'medium',
                            padding: '0 14px'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00334e',
                            borderWidth: '2px',
                          },
                        }}
                        startAdornment={<AccessTimeIcon sx={{ mr: 1, color: '#00334e' }} />}
                        // Renderiza el valor seleccionado con formato personalizado
                        renderValue={(selected) => {
                          const selectedOption = commonTimezones.find(tz => tz.value === selected);
                          return (
                            <Typography 
                              component="span" 
                              sx={{ 
                                color: 'black !important',
                                WebkitTextFillColor: 'black !important', // Forzar color de texto en Safari/iOS
                                fontWeight: 'normal',
                                display: 'block',
                                width: '100%'
                              }}
                            >
                              {selectedOption ? selectedOption.label : ''}
                            </Typography>
                          );
                        }}
                      >
                        {commonTimezones.map((tz) => (
                          <MenuItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </MenuItem>
                        ))}
                        {commonTimezones.map((tz) => (
                          <MenuItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              // --- PASO 2: DATOS USUARIO ---
              <Grid container spacing={2}>
                {renderTextField("firstName", "Nombre", "firstName", userData.firstName, handleUserChange, <PersonIcon sx={{ color: '#00334e' }} />, true, "text", true, 12, 6)}
                {renderTextField("lastName", "Apellido", "lastName", userData.lastName, handleUserChange, <PersonIcon sx={{ color: '#00334e' }} />, true, "text", true, 12, 6)}
                {renderTextField("email-user", "Email del Usuario", "email", userData.email, handleUserChange, <EmailIcon sx={{ color: '#00334e' }} />, true, "email")}
                {renderTextField("password", "Contraseña", "password", userData.password, handleUserChange, <LockIcon sx={{ color: '#00334e' }} />, true, "password")}
                {renderTextField("confirmPassword", "Confirmar Contraseña", "confirmPassword", userData.confirmPassword, handleUserChange, <LockIcon sx={{ color: '#00334e' }} />, true, "password")}
              </Grid>
            )}

            {/* Botones de navegación del Stepper */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 1 }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                variant="outlined"
                type="button"
                sx={{ 
                  borderColor: '#00334e', 
                  color: '#00334e',
                  '&:hover': {
                    borderColor: '#002233',
                    backgroundColor: 'rgba(0, 51, 78, 0.04)',
                  },
                  py: 0.5,
                  minHeight: '32px'
                }}
              >
                Atrás
              </Button>
              <Button
                type={activeStep === steps.length - 1 ? 'submit' : 'button'}
                variant="contained"
                disabled={loading}
                onClick={activeStep === steps.length - 1 ? undefined : handleNext}
                sx={{
                  backgroundColor: '#0288d1',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: '#0277bd',
                    boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(0,0,0,0.12)',
                    color: 'rgba(0,0,0,0.26)',
                  },
                  py: 0.5,
                  minHeight: '32px'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> :
                  (activeStep === steps.length - 1 ? 'Registrar Cuenta' : 'Siguiente')}
              </Button>
            </Box>
          </Box>

          {/* Enlace para ir a Login */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link 
              component={RouterLink} 
              to="/auth/login" 
              variant="body2"
              sx={{ 
                color: '#00334e', 
                fontWeight: 500,
                fontSize: '0.85rem',
                textDecoration: 'none',
                '&:hover': { 
                  color: '#002233', 
                  textDecoration: 'underline' 
                } 
              }}
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </Box>
        </Box>

        {/* Copyright para móvil al final del formulario */}
        {isMobile && (
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: 'rgba(0,51,78,0.6)',
              fontSize: '0.65rem',
              mt: 'auto',
              pt: 2,
              width: '100%'
            }}
          >
            &copy; {new Date().getFullYear()} FactTech. Todos los derechos reservados.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Register;