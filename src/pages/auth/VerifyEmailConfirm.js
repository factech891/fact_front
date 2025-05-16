// src/pages/auth/VerifyEmailConfirm.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAuth } from '../../context/AuthContext';

// Colores inspirados en la imagen nueva - IGUALES QUE EN LOGIN
const LEFT_PANEL_BACKGROUND = '#0A0318'; // Azul muy oscuro / casi negro (ajustado a más oscuro)
// Ahora usamos un degradado en lugar de un color sólido para el panel derecho
const RIGHT_PANEL_GRADIENT = 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)';
// const TEXT_ON_DARK_BACKGROUND = '#FFFFFF'; // No usado, pero lo mantenemos comentado por si acaso
const ACCENT_COLOR = '#40E0D0'; // Color turquesa para acentos

const VerifyEmailConfirm = () => {
  // --- Estados ---
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // --- Hooks ---
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

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
    navigate('/auth/verify-email-notice');
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

      {/* Lado derecho: Contenido de verificación */}
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
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4, textAlign: 'center' }}>
              <CircularProgress size={60} sx={{ color: '#00334e' }}/>
              <Typography variant="h6" sx={{ mt: 2, color: '#00334e' }}>
                Verificando tu correo electrónico...
              </Typography>
            </Box>
          ) : success ? (
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: '#2e7d32', // Verde de éxito
                width: 80,
                height: 80,
                borderRadius: '50%',
                mb: 3,
                mx: 'auto' // Centrar horizontalmente
              }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
                            
              <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: '#00334e', fontWeight: 'bold' }}>
                ¡Correo verificado con éxito!
              </Typography>
                            
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#00334e' }}>
                Tu dirección de correo electrónico ha sido verificada correctamente.
                Ahora puedes iniciar sesión en tu cuenta.
              </Typography>
                            
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleLoginRedirect}
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
                Ir a Iniciar Sesión
              </Button>
            </>
          ) : ( // Estado de Error
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: '#d32f2f', // Rojo de error
                width: 80,
                height: 80,
                borderRadius: '50%',
                mb: 3,
                mx: 'auto' // Centrar horizontalmente
              }}>
                <ErrorOutlineIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
                            
              <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: '#00334e', fontWeight: 'bold' }}>
                Error de Verificación
              </Typography>
                            
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  mb: 2, 
                  backgroundColor: 'rgba(255, 205, 210, 0.9)',
                  color: '#b71c1c',
                  border: '1px solid #ef9a9a',
                  '& .MuiAlert-icon': {
                    color: '#b71c1c',
                  }
                }}
              >
                {error || "No se pudo verificar el correo. El enlace puede ser inválido o haber expirado."}
              </Alert>
                            
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#00334e' }}>
                Si el problema persiste, puedes solicitar un nuevo enlace de verificación o contactar a soporte.
              </Typography>
                            
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleRequestNewLink}
                sx={{
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
                Solicitar Nuevo Enlace
              </Button>
                            
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={handleLoginRedirect}
                sx={{ 
                  borderColor: '#00334e', 
                  color: '#00334e',
                  '&:hover': {
                    borderColor: '#002233',
                    backgroundColor: 'rgba(0, 51, 78, 0.04)',
                  }
                }}
              >
                Volver a Iniciar Sesión
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyEmailConfirm;