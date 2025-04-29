// src/pages/auth/Login.js (con redirección explícita en handleSubmit)
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Typography, TextField, Button,
  Link, Paper, Grid, CircularProgress, Alert,
  useTheme, InputAdornment, styled
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../../context/AuthContext';

// ... (GradientText y BACKGROUND_IMAGE_URL sin cambios) ...
const BACKGROUND_IMAGE_URL = 'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/q.svg';

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


const Login = () => {
  // Estados
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hooks
  // Quitamos currentUser de aquí, nos basaremos en el resultado de login()
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Constantes de Roles
  const PLATFORM_ADMIN_ROLE = 'platform_admin';
  const FACTURADOR_ROLE = 'facturador';

  // Destino fallback
  const from = location.state?.from?.pathname || '/';

  // --- Efecto MÍNIMO: Solo para mostrar carga inicial ---
  // Ya no maneja redirección, solo evita mostrar el form mientras auth carga
  useEffect(() => {
      console.log("[Login useEffect] Verificando estado inicial de authLoading:", authLoading);
      // No hacemos nada más aquí, la redirección se hará en handleSubmit
  }, [authLoading]);


  // --- Manejador del Envío del Formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor complete todos los campos.');
      return;
    }
    try {
      setError('');
      setLoading(true); // Iniciar carga del formulario

      // Llamar a login y esperar los datos del usuario logueado
      const loggedInUserData = await login(email, password);
      console.log('[Login handleSubmit] Login API call successful. User data received:', loggedInUserData);

      // --- REDIRECCIÓN EXPLÍCITA BASADA EN EL RESULTADO DE LOGIN ---
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
      // ---------------------------------------------------------

      // Nota: No ponemos setLoading(false) aquí porque la navegación desmontará el componente.

    } catch (err) {
      console.error('Error de login:', err);
      setError(err.message || 'Correo electrónico o contraseña incorrectos. Por favor, inténtalo de nuevo.');
      setLoading(false); // Detener carga SOLO en caso de error
    }
  };

  // --- Renderizado Condicional ---
  // Mostrar carga solo si la autenticación inicial está en progreso
  if (authLoading) {
      console.log('[Login Render] Esperando carga inicial de auth...');
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></div>;
  }

  // Si la carga inicial de auth terminó, mostrar el formulario
  console.log('[Login Render] Mostrando formulario de login.');
  return (
    // --- JSX del formulario (sin cambios) ---
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

            {error && (
              <Alert severity="error" sx={{ mb: 2, width: '100%', backgroundColor: 'rgba(30, 30, 30, 0.85)' }}>
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
                disabled={loading} // Usar el loading del formulario
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
                disabled={loading} // Usar el loading del formulario
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
                disabled={loading} // Usar el loading del formulario
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