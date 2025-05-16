// src/pages/auth/ForgotPassword.js
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, TextField, Button,
  CircularProgress, Alert, useTheme, Link,
  InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useAuth } from '../../context/AuthContext';

// Colores inspirados en la imagen nueva - IGUALES QUE EN LOGIN
const LEFT_PANEL_BACKGROUND = '#0A0318'; // Azul muy oscuro / casi negro (ajustado a más oscuro)
// Ahora usamos un degradado en lugar de un color sólido para el panel derecho
const RIGHT_PANEL_GRADIENT = 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)';
// const TEXT_ON_DARK_BACKGROUND = '#FFFFFF'; // No usado, pero lo mantenemos comentado por si acaso
const ACCENT_COLOR = '#40E0D0'; // Color turquesa para acentos

const ForgotPassword = () => {
  // --- Estados ---
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Estado para mostrar mensaje de éxito

  // --- Hooks ---
  const { forgotPassword } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme();

  // --- Manejador del Envío ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Por favor ingrese su correo electrónico');
      return;
    }

    try {
      setError('');
      setSuccess(false);
      setLoading(true);

      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      console.error("Forgot Password error:", err);
      setError(err.message || 'Error al procesar la solicitud. Verifique el correo e intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // --- Renderizado ---
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        height: '100vh', // Exactamente como en Login
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
          padding: { xs: 4, sm: 5, md: 6 },
          height: { xs: '100%', md: '100%' },
          minHeight: { xs: '320px', sm: '350px' },
          position: 'relative',
        }}
      >
        {/* Contenedor para centrar el logo y texto - IGUAL QUE LOGIN */}
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
              mb: 3,
              width: { xs: '140px', sm: '180px', md: '220px' },
              height: { xs: '140px', sm: '180px', md: '220px' },
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
                      height: '6px',
                      backgroundColor: ACCENT_COLOR,
                      my: 0.5,
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
              fontSize: { xs: '3rem', sm: '3.8rem', md: '4.5rem' },
              letterSpacing: '0.03em',
              lineHeight: 1.1,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              color: ACCENT_COLOR,
            }}
          >
            FactTech
          </Typography>
        </Box>
        
        {/* Copyright integrado en el panel izquierdo - ahora absoluto al fondo */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.75rem',
            position: 'absolute',
            bottom: '20px',
            left: 0,
            right: 0,
          }}
        >
          &copy; {new Date().getFullYear()} FactTech. Todos los derechos reservados.
        </Typography>
      </Box>

      {/* Lado derecho: Formulario - COPIADO EXACTAMENTE DEL LOGIN */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', md: '0.5' },
          background: RIGHT_PANEL_GRADIENT,
          p: { xs: 3, sm: 4, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflowY: 'auto',
          height: '100%',
        }}
      >
        {/* Contenedor interno para el formulario para limitar su ancho */}
        <Box sx={{ width: '100%', maxWidth: '450px' }}>
          <Typography variant="h4" component="h2" sx={{ mb: 1, color: '#00334e', fontWeight: 'bold', textAlign: 'center' }}>
            Recuperar Contraseña
          </Typography>
          <Typography variant="body1" sx={{ mb: { xs: 2, md: 3 }, color: '#00334e', textAlign: 'center' }}>
            Ingresa tu correo electrónico para recibir instrucciones.
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
                '& .MuiAlert-icon': {
                  color: '#b71c1c',
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Mensaje de éxito */}
          {success && (
            <Alert
              severity="success"
              icon={<CheckCircleIcon fontSize="inherit" />}
              sx={{
                mb: 2,
                width: '100%',
                backgroundColor: 'rgba(200, 250, 215, 0.9)',
                color: '#1b5e20',
                border: '1px solid #a5d6a7',
                '& .MuiAlert-icon': {
                  color: '#1b5e20',
                }
              }}
            >
              Se ha enviado un correo a <strong>{email}</strong> con instrucciones para restablecer su contraseña. Por favor, revise su bandeja de entrada.
            </Alert>
          )}

          {/* Formulario o botón regreso según estado */}
          {!success ? (
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              {/* Campo de correo electrónico */}
              <TextField
                margin="normal"
                fullWidth
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                label=""
                variant="outlined"
                InputLabelProps={{ shrink: true, sx: { display: 'none' } }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'black !important',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& > input': {
                      color: 'black !important',
                      WebkitTextFillColor: 'black !important'
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#00334e' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00334e',
                      borderWidth: '2px',
                    },
                    '&::before': {
                      content: '"Correo Electrónico"',
                      position: 'absolute',
                      top: '-25px',
                      left: '0',
                      color: '#00334e',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                    }
                  }
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
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
                  }
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Instrucciones'}
              </Button>
            </Box>
          ) : (
            <Button
              component={RouterLink}
              to="/auth/login"
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                backgroundColor: '#0288d1',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: '#0277bd',
                  boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
                }
              }}
            >
              Volver a Iniciar Sesión
            </Button>
          )}

          {/* Enlaces abajo */}
          {!success && (
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Link component={RouterLink} to="/auth/login" variant="body2" sx={{ color: '#00334e', '&:hover': { color: '#002233', textDecoration: 'underline' } }}>
                Volver a Iniciar Sesión
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;