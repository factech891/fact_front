// src/pages/auth/VerifyEmailNotice.js
import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Container, Alert, CircularProgress, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useTheme } from '@mui/material';
import styled from '@emotion/styled';

// Usar la misma URL de fondo que en Login
const BACKGROUND_IMAGE_URL = 'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/q.svg';

// Mismo componente de texto gradiente que en Login
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

const VerifyEmailNotice = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { requestEmailVerification } = useAuth();
  const theme = useTheme();
  
  // Obtener el email de localStorage
  const email = localStorage.getItem('pendingVerificationEmail') || '';

  const handleResendVerification = async () => {
    if (!email) {
      setError('No se encontró la dirección de correo electrónico');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (requestEmailVerification) {
        await requestEmailVerification(email);
      } else {
        throw new Error('Servicio de verificación no disponible');
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al enviar el correo de verificación');
    } finally {
      setLoading(false);
    }
  };

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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '450px' }}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 5 },
            width: '100%',
            backgroundColor: 'rgba(30, 30, 30, 0.85)',
            backdropFilter: 'blur(5px)',
            borderRadius: theme.shape.borderRadius * 1.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <GradientText component="h1">
            FactTech
          </GradientText>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: success ? 'success.main' : 'primary.main',
            width: 80,
            height: 80,
            borderRadius: '50%',
            mb: 3
          }}>
            {success ? 
              <MarkEmailReadIcon sx={{ fontSize: 40, color: 'white' }} /> : 
              <EmailIcon sx={{ fontSize: 40, color: 'white' }} />
            }
          </Box>
          
          <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
            Verifica tu Correo Electrónico
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            Hemos enviado un enlace de verificación a: 
            <Box component="span" sx={{ fontWeight: 'bold', display: 'block', mt: 1 }}>
              {email || 'tu correo electrónico'}
            </Box>
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
            Por favor, revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
            Si no encuentras el correo, revisa tu carpeta de spam.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2, backgroundColor: 'rgba(30, 30, 30, 0.85)' }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Se ha enviado un nuevo correo de verificación.
            </Alert>
          )}
          
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleResendVerification}
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
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
          
          <Link component={RouterLink} to="/auth/login" variant="body2" sx={{ mt: 2 }}>
            Volver a Iniciar Sesión
          </Link>
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