// src/pages/auth/VerifyEmailConfirm.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Button } from '@mui/material';
// Removed 'Link as RouterLink' as it was not used
import { useParams, useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '@mui/material';

// Usar la misma URL de fondo que en Login
const BACKGROUND_IMAGE_URL = 'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/q.svg';
const LOGO_URL = '/favicon.svg'; // Definir la URL del logo

const VerifyEmailConfirm = () => {
  // --- Estados ---
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // --- Hooks ---
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          setError('Token de verificación no proporcionado.');
          setLoading(false);
          return;
        }

        // Asegurarse de que verifyEmail es una función antes de llamarla
        if (typeof verifyEmail === 'function') {
          await verifyEmail(token);
        } else {
          console.error('verifyEmail function is not available on useAuth');
          throw new Error('Servicio de verificación no disponible en este momento.');
        }
        
        setSuccess(true);
        
        // Limpiar el email de verificación pendiente del localStorage si existe
        if (localStorage.getItem('pendingVerificationEmail')) {
          localStorage.removeItem('pendingVerificationEmail');
        }
      } catch (err) {
        console.error('Error during email verification:', err);
        setError(err.message || 'Error al verificar el correo electrónico. El enlace puede haber expirado o ser inválido.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, verifyEmail]); // verifyEmail se incluye como dependencia

  // --- Manejador para redirigir al Login ---
  const handleLoginRedirect = () => {
    navigate('/auth/login');
  };

  // --- Manejador para solicitar nuevo enlace ---
  const handleRequestNewLink = () => {
    // Asumimos que la página para solicitar nuevo enlace ya guarda el email si es necesario
    // o que el usuario lo ingresará allí.
    navigate('/auth/verify-email-notice');
  };

  // --- Renderizado ---
  return (
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
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          {/* Lado izquierdo: Logo con fondo azul oscuro */}
          <Box
            sx={{
              flex: { xs: '1', md: '0.5' },
              backgroundColor: '#0B0B5E', // Azul oscuro
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              position: 'relative'
            }}
          >
            <Box
              component="img"
              src={LOGO_URL}
              alt="FactTech Logo"
              sx={{
                width: { xs: '200px', md: '280px' },
                height: 'auto',
                maxWidth: '100%',
                filter: 'drop-shadow(0 0 12px rgba(79, 172, 254, 0.4))'
              }}
            />
          </Box>

          {/* Lado derecho: Contenido de verificación */}
          <Box
            sx={{
              flex: { xs: '1', md: '0.5' },
              backgroundColor: 'rgba(30, 30, 30, 0.85)',
              backdropFilter: 'blur(5px)',
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center', // Centrar contenido verticalmente
            }}
          >
            {/* Ya no se necesita GradientText aquí, el logo está a la izquierda */}
            
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4, textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ color: theme.palette.primary.light }}/>
                <Typography variant="h6" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                  Verificando tu correo electrónico...
                </Typography>
              </Box>
            ) : success ? (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  backgroundColor: theme.palette.success.main, // Usar color del tema
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  mb: 3
                }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 40, color: theme.palette.common.white }} />
                </Box>
                
                <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: theme.palette.success.light }}>
                  ¡Correo verificado con éxito!
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: theme.palette.text.secondary }}>
                  Tu dirección de correo electrónico ha sido verificada correctamente.
                  Ahora puedes iniciar sesión en tu cuenta.
                </Typography>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handleLoginRedirect}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                    color: theme.palette.primary.contrastText,
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                      opacity: 0.9,
                    }
                  }}
                >
                  Ir a Iniciar Sesión
                </Button>
              </>
            ) : ( // Estado de Error
              <>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  backgroundColor: theme.palette.error.main, // Usar color del tema
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  mb: 3
                }}>
                  <ErrorOutlineIcon sx={{ fontSize: 40, color: theme.palette.common.white }} />
                </Box>
                
                <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: theme.palette.error.light }}>
                  Error de Verificación
                </Typography>
                
                <Alert 
                  severity="error" 
                  sx={{ 
                    width: '100%', 
                    mb: 2, 
                    backgroundColor: 'transparent', // Hacer transparente para que se vea el fondo del Paper
                    color: theme.palette.error.light, // Color del texto de la alerta
                    border: `1px solid ${theme.palette.error.main}`
                  }}
                >
                  {error || "No se pudo verificar el correo. El enlace puede ser inválido o haber expirado."}
                </Alert>
                
                <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: theme.palette.text.secondary }}>
                  Si el problema persiste, puedes solicitar un nuevo enlace de verificación o contactar a soporte.
                </Typography>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handleRequestNewLink}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', // Mismo gradiente para consistencia
                    color: theme.palette.primary.contrastText,
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                      opacity: 0.9,
                    }
                  }}
                >
                  Solicitar Nuevo Enlace
                </Button>
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={handleLoginRedirect}
                  sx={{ 
                    color: theme.palette.text.secondary,
                    borderColor: theme.palette.text.secondary,
                    '&:hover': {
                      borderColor: theme.palette.primary.light,
                      color: theme.palette.primary.light,
                      backgroundColor: 'rgba(79, 172, 254, 0.08)'
                    }
                  }}
                >
                  Volver a Iniciar Sesión
                </Button>
              </>
            )}
          </Box>
        </Paper>
      </Box>

      <Typography
        variant="body2"
        align="center"
        sx={{
          width: '100%',
          color: theme.palette.text.secondary,
          pt: 4,
          pb: 2,
        }}
      >
        &copy; {new Date().getFullYear()} FactTech. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default VerifyEmailConfirm;