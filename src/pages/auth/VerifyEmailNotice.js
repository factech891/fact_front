// src/pages/auth/VerifyEmailNotice.js
import React, { useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

// Colores inspirados en la imagen nueva - IGUALES QUE EN LOGIN
const LEFT_PANEL_BACKGROUND = '#0A0318'; // Azul muy oscuro / casi negro (ajustado a más oscuro)
// Ahora usamos un degradado en lugar de un color sólido para el panel derecho
const RIGHT_PANEL_GRADIENT = 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)';
// const TEXT_ON_DARK_BACKGROUND = '#FFFFFF'; // No usado, pero lo mantenemos comentado por si acaso
const ACCENT_COLOR = '#40E0D0'; // Color turquesa para acentos

const VerifyEmailNotice = () => {
  // --- Estados ---
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // --- Hooks ---
  const { requestEmailVerification } = useAuth();
  
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

      {/* Lado derecho: Contenido del aviso de verificación */}
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
        {/* Contenedor interno para el contenido */}
        <Box sx={{ width: '100%', maxWidth: '450px' }}>
          {/* Icono principal */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: success ? '#2e7d32' : '#0288d1', // Verde de éxito o azul normal
            width: 80,
            height: 80,
            borderRadius: '50%',
            mb: 3,
            mx: 'auto' // Centrar horizontalmente
          }}>
            {success ? 
              <MarkEmailReadIcon sx={{ fontSize: 40, color: 'white' }} /> : 
              <EmailIcon sx={{ fontSize: 40, color: 'white' }} />
            }
          </Box>
          
          <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: '#00334e', fontWeight: 'bold' }}>
            Verifica tu Correo Electrónico
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 1, textAlign: 'center', color: '#00334e' }}>
            Hemos enviado un enlace de verificación a: 
          </Typography>
          <Typography component="p" sx={{ 
            fontWeight: 'bold', 
            display: 'block', 
            mt: 0, 
            mb: 2, 
            textAlign: 'center', 
            color: '#00334e', 
            wordBreak: 'break-all',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '8px 12px',
            borderRadius: '4px' 
          }}>
            {email || 'tu correo electrónico'}
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: '#00334e' }}>
            Por favor, revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el enlace para activar tu cuenta.
          </Typography>
          
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
          
          {success && (
            <Alert 
              severity="success" 
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
              Se ha enviado un nuevo correo de verificación a {email}.
            </Alert>
          )}
          
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleResendVerification}
            disabled={loading || !email}
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
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Reenviar Correo de Verificación'}
          </Button>
          
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
              Volver a Iniciar Sesión
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyEmailNotice;