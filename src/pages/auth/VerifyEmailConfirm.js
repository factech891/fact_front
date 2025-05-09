// src/pages/auth/VerifyEmailConfirm.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Button, Link } from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAuth } from '../../context/AuthContext';
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

const VerifyEmailConfirm = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
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

        if (verifyEmail) {
          await verifyEmail(token);
        } else {
          throw new Error('Servicio de verificación no disponible');
        }
        
        setSuccess(true);
        
        if (localStorage.getItem('pendingVerificationEmail')) {
          localStorage.removeItem('pendingVerificationEmail');
        }
      } catch (err) {
        setError(err.message || 'Error al verificar el correo electrónico. El enlace puede haber expirado o ser inválido.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, verifyEmail]);

  const handleLoginRedirect = () => {
    navigate('/auth/login');
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
          
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Verificando tu correo electrónico...
              </Typography>
            </Box>
          ) : success ? (
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: 'success.main',
                width: 80,
                height: 80,
                borderRadius: '50%',
                mb: 3
              }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              
              <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                ¡Correo verificado con éxito!
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
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
          ) : (
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: 'error.main',
                width: 80,
                height: 80,
                borderRadius: '50%',
                mb: 3
              }}>
                <ErrorOutlineIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              
              <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                Error de verificación
              </Typography>
              
              <Alert severity="error" sx={{ width: '100%', mb: 3, backgroundColor: 'rgba(30, 30, 30, 0.85)' }}>
                {error}
              </Alert>
              
              <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
                El enlace de verificación puede haber expirado o ser inválido.
                Puedes solicitar un nuevo enlace de verificación.
              </Typography>
              
              <Button 
                variant="contained" 
                fullWidth 
                onClick={() => navigate('/auth/verify-email-notice')}
                sx={{
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                  color: theme.palette.primary.contrastText,
                  transition: 'opacity 0.3s ease',
                  '&:hover': {
                    opacity: 0.9,
                  }
                }}
              >
                Solicitar nuevo enlace
              </Button>
              
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={handleLoginRedirect}
                sx={{ mb: 2 }}
              >
                Volver a Iniciar Sesión
              </Button>
            </>
          )}
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