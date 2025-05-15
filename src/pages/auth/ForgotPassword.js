// src/pages/auth/ForgotPassword.js
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // useNavigate was removed as it's not used
import {
  Box, Typography, TextField, Button,
  Paper, CircularProgress, Alert, // Removed Link and Grid as they were not used
  useTheme, InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icono para éxito

import { useAuth } from '../../context/AuthContext'; // Asegúrate que la ruta sea correcta

// URL de la imagen de fondo SVG (la misma que en Login/Register)
const BACKGROUND_IMAGE_URL = 'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/q.svg';
const LOGO_URL = '/favicon.svg'; // Definir la URL del logo

const ForgotPassword = () => {
  // --- Estados ---
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Estado para mostrar mensaje de éxito

  // --- Hooks ---
  const { forgotPassword } = useAuth(); // Función del contexto para olvido de contraseña
  const theme = useTheme();
  // const navigate = useNavigate(); // Removed as it was not used

  // --- Manejador del Envío ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Por favor ingrese su correo electrónico');
      return;
    }

    try {
      setError('');
      setSuccess(false); // Resetear éxito
      setLoading(true);

      // Llama a la función del contexto
      await forgotPassword(email);

      // Mostrar mensaje de éxito si no hay error
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
    // Contenedor principal con fondo
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        py: 4,
        px: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px' }}>
        <Paper
          elevation={8}
          sx={{
            width: '100%',
            borderRadius: theme.shape.borderRadius * 1.5,
            overflow: 'hidden', // Importante para mantener los colores dentro de los bordes redondeados
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' } // Columna en móvil, fila en desktop
          }}
        >
          {/* Lado izquierdo: Logo con fondo azul oscuro */}
          <Box
            sx={{
              flex: { xs: '1', md: '0.5' }, // Ocupa la mitad del espacio en desktop
              backgroundColor: '#0B0B5E', // Azul oscuro
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              position: 'relative'
            }}
          >
            {/* Logo SVG */}
            <Box
              component="img"
              src={LOGO_URL}
              alt="FactTech Logo"
              sx={{
                width: { xs: '200px', md: '280px' }, // Ajustar tamaño del logo si es necesario
                height: 'auto',
                maxWidth: '100%',
                filter: 'drop-shadow(0 0 12px rgba(79, 172, 254, 0.4))' // Sombra similar al login
              }}
            />
          </Box>

          {/* Lado derecho: Formulario de olvido de contraseña */}
          <Box
            sx={{
              flex: { xs: '1', md: '0.5' }, // Ocupa la otra mitad del espacio en desktop
              backgroundColor: 'rgba(30, 30, 30, 0.85)',
              backdropFilter: 'blur(5px)',
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // Centrar contenido del formulario
            }}
          >
            <Typography variant="h5" component="h1" align="center" sx={{ mb: 2, color: theme.palette.common.white, fontWeight: 'bold' }}>
              Recuperar Contraseña
            </Typography>

            {/* Alerta de error */}
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2, width: '100%', backgroundColor: 'rgba(30, 30, 30, 0.85)', color: theme.palette.error.light }}
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
                  mb: 3,
                  width: '100%',
                  backgroundColor: 'rgba(46, 125, 50, 0.2)',
                  color: '#a5d6a7',
                  border: '1px solid #a5d6a7',
                  '& .MuiAlert-icon': {
                    color: '#a5d6a7',
                  }
                }}
              >
                Se ha enviado un correo a <strong>{email}</strong> con instrucciones para restablecer su contraseña. Por favor, revise su bandeja de entrada (y spam).
              </Alert>
            )}

            {/* Muestra el formulario solo si no se ha enviado el correo (success === false) */}
            {!success ? (
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, textAlign: 'center' }}>
                  Ingrese su correo electrónico registrado para enviarle las instrucciones de recuperación.
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    // Estilos para el input en tema oscuro
                    '& label.Mui-focused': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiInput-underline:after': {
                      borderBottomColor: theme.palette.primary.main,
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: theme.palette.grey[700],
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.light,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '& input': {
                        color: theme.palette.common.white, // Color del texto dentro del input
                      },
                    },
                    '& .MuiInputLabel-root': {
                       color: theme.palette.text.secondary, // Color de la etiqueta
                    },
                  }}
                />
                {/* Botón de Enviar Instrucciones */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
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
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Instrucciones'}
                </Button>
              </Box>
            ) : null}

            {/* Enlace/Botón para volver al inicio de sesión */}
            <Box sx={{ mt: success ? 1 : 2, textAlign: 'center', width: '100%' }}>
              <Button
                component={RouterLink}
                to="/auth/login"
                variant={success ? "outlined" : "text"} // Delineado si es éxito, texto si no
                sx={{
                  color: success ? theme.palette.text.secondary : theme.palette.primary.light, // Ajustar color
                  borderColor: success ? theme.palette.text.secondary : 'transparent',
                  mt: success ? 2 : 1, // Margen superior
                  py: success ? 1 : 0.5,
                  px: success ? 2 : 1,
                  '&:hover': {
                    backgroundColor: success ? 'rgba(128, 128, 128, 0.1)' : 'rgba(79, 172, 254, 0.1)',
                    borderColor: success ? theme.palette.text.primary : 'transparent',
                  }
                }}
              >
                Volver al inicio de sesión
              </Button>
            </Box>

          </Box>
        </Paper>
      </Box>

      {/* Copyright al final de la página */}
      <Typography
        variant="body2"
        align="center"
        sx={{
          width: '100%',
          color: theme.palette.text.secondary, // Color del texto de copyright
          pt: 4,
          pb: 2, // Padding inferior
        }}
      >
        &copy; {new Date().getFullYear()} FactTech. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default ForgotPassword;