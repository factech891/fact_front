// src/pages/auth/VerifyEmailNotice.js
import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Alert, CircularProgress, Link as MuiLink } from '@mui/material'; // Renamed Link to MuiLink to avoid conflict
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useTheme } from '@mui/material';
// import styled from '@emotion/styled'; // GradientText is removed

// Usar la misma URL de fondo que en Login
const BACKGROUND_IMAGE_URL = 'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/q.svg';
const LOGO_URL = '/favicon.svg'; // Definir la URL del logo

// GradientText component was removed as the logo will be displayed on the left panel.
// Container import was removed as it was not used.

const VerifyEmailNotice = () => {
  // --- Estados ---
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // --- Hooks ---
  const { requestEmailVerification } = useAuth();
  const theme = useTheme();
  
  // Obtener el email de localStorage
  const email = localStorage.getItem('pendingVerificationEmail') || '';

  // --- Manejador para reenviar verificación ---
  const handleResendVerification = async () => {
    if (!email) {
      setError('No se encontró la dirección de correo electrónico para reenviar la verificación.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Asegurarse de que requestEmailVerification es una función antes de llamarla
      if (typeof requestEmailVerification === 'function') {
        await requestEmailVerification(email);
      } else {
        console.error('requestEmailVerification function is not available on useAuth');
        throw new Error('Servicio de solicitud de verificación no disponible en este momento.');
      }
      setSuccess(true);
    } catch (err) {
      console.error('Error resending verification email:', err);
      setError(err.message || 'Error al enviar el correo de verificación. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px' }}> {/* MaxWidth como en Login */}
        <Paper
          elevation={8}
          sx={{
            width: '100%',
            borderRadius: theme.shape.borderRadius * 1.5,
            overflow: 'hidden', // Para los bordes redondeados
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' } // Columna en móvil, fila en desktop
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

          {/* Lado derecho: Contenido del aviso de verificación */}
          <Box
            sx={{
              flex: { xs: '1', md: '0.5' },
              backgroundColor: 'rgba(30, 30, 30, 0.85)',
              backdropFilter: 'blur(5px)',
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center', // Centrar contenido
            }}
          >
            {/* Icono principal */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: success ? theme.palette.success.main : theme.palette.primary.main, // Color del tema
              width: 80,
              height: 80,
              borderRadius: '50%',
              mb: 3
            }}>
              {success ? 
                <MarkEmailReadIcon sx={{ fontSize: 40, color: theme.palette.common.white }} /> : 
                <EmailIcon sx={{ fontSize: 40, color: theme.palette.common.white }} />
              }
            </Box>
            
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: theme.palette.common.white, fontWeight: 'bold' }}>
              Verifica tu Correo Electrónico
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 1, textAlign: 'center', color: theme.palette.text.secondary }}>
              Hemos enviado un enlace de verificación a: 
            </Typography>
            <Typography component="p" sx={{ fontWeight: 'bold', display: 'block', mt: 0, mb: 2, textAlign: 'center', color: theme.palette.primary.light, wordBreak: 'break-all' }}>
                {email || 'tu correo electrónico'}
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: theme.palette.text.secondary }}>
              Por favor, revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el enlace para activar tu cuenta.
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  mb: 2, 
                  backgroundColor: 'transparent',
                  color: theme.palette.error.light,
                  border: `1px solid ${theme.palette.error.main}`
                }}
              >
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  width: '100%', 
                  mb: 2,
                  backgroundColor: 'rgba(46, 125, 50, 0.2)', 
                  color: '#a5d6a7', 
                  border: '1px solid #a5d6a7',
                  '& .MuiAlert-icon': { 
                      color: '#a5d6a7',
                  }
                }}
              >
                Se ha enviado un nuevo correo de verificación a {email}.
              </Alert>
            )}
            
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleResendVerification}
              disabled={loading || !email} // Deshabilitar si no hay email también
              sx={{
                py: 1.5,
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                color: theme.palette.primary.contrastText,
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  opacity: 0.9,
                },
                '&.Mui-disabled': {
                  background: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled,
                  cursor: 'not-allowed',
                  pointerEvents: 'auto',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reenviar Correo de Verificación'}
            </Button>
            
            <MuiLink component={RouterLink} to="/auth/login" variant="body2" sx={{ mt: 3, color: theme.palette.text.secondary, '&:hover': {color: theme.palette.primary.light} }}>
              Volver a Iniciar Sesión
            </MuiLink>
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

export default VerifyEmailNotice;