// src/pages/auth/VerifyEmailNotice.js
import React, { useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress, Link, useMediaQuery, useTheme } from '@mui/material'; // Import useMediaQuery and useTheme
import { Link as RouterLink, useLocation } from 'react-router-dom'; // Import useLocation
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
  const theme = useTheme(); // Add useTheme
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Add useMediaQuery
  const location = useLocation(); // Use useLocation to get email from state if available

  // Obtener el email: primero del state (si viene de VerifyEmailConfirm error), luego de localStorage
  const email = location.state?.email || localStorage.getItem('pendingVerificationEmail') || '';


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
          padding: { xs: 3, md: 6 }, // Ajustar padding responsive
          height: { xs: '220px', md: '100%' }, // Altura fija en móvil, 100% en desktop
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
              mb: { xs: 1, md: 3 }, // Ajustar margin responsive
              width: { xs: '100px', md: '220px' }, // Ajustar tamaño responsive
              height: { xs: '100px', md: '220px' }, // Ajustar tamaño responsive
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
                      height: { xs: '4px', md: '6px' }, // Ajustar altura responsive
                      backgroundColor: ACCENT_COLOR,
                      my: { xs: 0.3, md: 0.5 }, // Ajustar margin responsive
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
              fontSize: { xs: '2rem', md: '4.5rem' }, // Ajustar tamaño responsive
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
            fontSize: '0.7rem', // Ajustar tamaño de fuente
            position: 'absolute',
            bottom: { xs: '5px', md: '20px' }, // Ajustar posición responsive
            left: 0,
            right: 0,
            display: { xs: 'none', sm: 'block' } // Oculto en móvil
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
          p: { xs: 2.5, md: 5 }, // Ajustar padding responsive
          paddingTop: { xs: 4, md: 5 }, // Ajustar padding top responsive
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { xs: 'flex-start', md: 'center' }, // Ajustar justificación responsive
          alignItems: 'center',
          overflowY: 'auto',
          height: { xs: 'calc(100vh - 220px)', md: '100%' }, // Altura calculada en móvil, 100% en desktop
          borderTopLeftRadius: { xs: '24px', md: 0 }, // Border radius responsive
          borderTopRightRadius: { xs: '24px', md: 0 }, // Border radius responsive
          marginTop: { xs: '-24px', md: 0 }, // Negative margin responsive
          position: 'relative',
          zIndex: 10,
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
            width: { xs: 60, md: 80 }, // Ajustar tamaño responsive
            height: { xs: 60, md: 80 }, // Ajustar tamaño responsive
            borderRadius: '50%',
            mb: 3,
            mx: 'auto' // Centrar horizontalmente
          }}>
            {success ?
              <MarkEmailReadIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'white' }} /> : // Ajustar tamaño responsive
              <EmailIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'white' }} /> // Ajustar tamaño responsive
            }
          </Box>

          <Typography
            variant="h5"
            sx={{
              mb: 2,
              textAlign: 'center',
              color: '#00334e',
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', md: '1.5rem' } // Ajustar tamaño de fuente responsive
            }}
          >
            Verifica tu Correo Electrónico
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 1,
              textAlign: 'center',
              color: '#00334e',
              fontSize: { xs: '0.875rem', md: '1rem' } // Ajustar tamaño de fuente responsive
            }}
          >
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
            borderRadius: '4px',
             fontSize: { xs: '0.875rem', md: '1rem' } // Ajustar tamaño de fuente responsive
          }}>
            {email || 'tu correo electrónico'}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 3,
              textAlign: 'center',
              color: '#00334e',
              fontSize: { xs: '0.8rem', md: '0.875rem' } // Ajustar tamaño de fuente responsive
             }}
          >
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
                 fontSize: { xs: '0.8rem', md: '0.875rem' }, // Ajustar tamaño de fuente responsive
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
                 fontSize: { xs: '0.8rem', md: '0.875rem' }, // Ajustar tamaño de fuente responsive
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
              py: { xs: 1.2, md: 1.5 }, // Ajustar padding responsive
              backgroundColor: '#0288d1',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
               fontSize: { xs: '0.9rem', md: '1rem' }, // Ajustar tamaño de fuente responsive
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
                fontSize: { xs: '0.8rem', md: '0.875rem' }, // Ajustar tamaño de fuente responsive
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

export default VerifyEmailNotice;