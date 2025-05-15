// src/pages/auth/Login.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Typography, TextField, Button,
  Link, Paper, Grid, CircularProgress, Alert,
  useTheme, InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../../context/AuthContext';

const BACKGROUND_IMAGE_URL = 'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/q.svg';

const Login = () => {
  // Estados
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);

  // Hooks
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Constantes de Roles
  const PLATFORM_ADMIN_ROLE = 'platform_admin';
  const FACTURADOR_ROLE = 'facturador';

  // Destino fallback
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
      console.log("[Login useEffect] Verificando estado inicial de authLoading:", authLoading);
  }, [authLoading]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor complete todos los campos.');
      return;
    }
    try {
      setError('');
      setNeedsVerification(false);
      setLoading(true);

      const loggedInUserData = await login(email, password);
      console.log('[Login handleSubmit] Login API call successful. User data received:', loggedInUserData);

      if (loggedInUserData?.user?.role === PLATFORM_ADMIN_ROLE) {
        console.log('[Login handleSubmit] Redirigiendo a /platform-admin');
        navigate('/platform-admin', { replace: true });
      } else if (loggedInUserData?.user?.role === FACTURADOR_ROLE) {
        console.log('[Login handleSubmit] Redirigiendo a /invoices');
        navigate('/invoices', { replace: true });
      } else {
        console.log(`[Login handleSubmit] Redirigiendo a ${from} (u otro rol)`);
        navigate(from, { replace: true });
      }

    } catch (err) {
      console.error('Error de login:', err);
      
      // Detectar si es un error de verificación de correo
      if (err.response?.data?.needsVerification || err.needsVerification) {
        setNeedsVerification(true);
        localStorage.setItem('pendingVerificationEmail', email);
        setError('Por favor, verifica tu correo electrónico antes de iniciar sesión.');
      } 
      // Detectar si es un error de compañía inactiva
      else if (err.response?.data?.companyInactive || err.companyInactive) {
        setError('La empresa asociada a su cuenta está desactivada o su suscripción ha finalizado.');
      } 
      else {
        setError(err.message || 'Correo electrónico o contraseña incorrectos.');
      }
      
      setLoading(false);
    }
  };

  // --- Manejador para el botón de reenviar verificación ---
  const handleResendVerification = () => {
    localStorage.setItem('pendingVerificationEmail', email);
    navigate('/auth/verify-email-notice');
  };

  if (authLoading) {
      console.log('[Login Render] Esperando carga inicial de auth...');
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></div>;
  }

  console.log('[Login Render] Mostrando formulario de login.');
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
            overflow: 'hidden', // Importante para mantener los colores dentro de los bordes redondeados
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' } // Columna en móvil, fila en desktop
          }}
        >
          {/* Lado izquierdo: Logo con fondo azul oscuro */}
          <Box
            sx={{
              flex: { xs: '1', md: '0.5' },
              backgroundColor: '#0B0B5E', // Azul oscuro como en tu imagen
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
              src="/favicon.svg"  // Usando el SVG de la carpeta public
              alt="FactTech Logo"
              sx={{
                width: { xs: '240px', md: '320px' },
                height: 'auto',
                maxWidth: '100%',
                filter: 'drop-shadow(0 0 12px rgba(79, 172, 254, 0.4))'
              }}
            />
          </Box>

          {/* Lado derecho: Formulario de login */}
          <Box
            sx={{
              flex: { xs: '1', md: '0.5' },
              backgroundColor: 'rgba(30, 30, 30, 0.85)',
              backdropFilter: 'blur(5px)',
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2, width: '100%', backgroundColor: 'rgba(30, 30, 30, 0.85)' }}
                action={
                  needsVerification ? (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleResendVerification}
                    >
                      Verificar
                    </Button>
                  ) : null
                }
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
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
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
              />
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
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
              </Button>

              <Grid container spacing={1} justifyContent="space-between">
                <Grid item>
                  <Link component={RouterLink} to="/auth/forgot-password" variant="body2">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/auth/register" variant="body2">
                    ¿No tienes una cuenta? Regístrate
                  </Link>
                </Grid>
              </Grid>
            </Box>
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

export default Login;