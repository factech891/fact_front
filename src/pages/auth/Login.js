// src/pages/auth/Login.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Typography, TextField, Button,
  Link, Grid, CircularProgress, Alert,
  InputAdornment, useMediaQuery, useTheme
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../../context/AuthContext';

// Colores inspirados en la imagen nueva
const LEFT_PANEL_BACKGROUND = '#0A0318'; // Azul muy oscuro / casi negro (ajustado a más oscuro)
// Ahora usamos un degradado en lugar de un color sólido para el panel derecho
const RIGHT_PANEL_GRADIENT = 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)';
const TEXT_ON_DARK_BACKGROUND = '#FFFFFF'; // Blanco para texto sobre fondo oscuro
const ACCENT_COLOR = '#40E0D0'; // Color turquesa para acentos

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Constantes de Roles
  const PLATFORM_ADMIN_ROLE = 'platform_admin';
  const FACTURADOR_ROLE = 'facturador';

  // Destino fallback
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // console.log("[Login useEffect] Verificando estado inicial de authLoading:", authLoading);
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

      if (loggedInUserData?.user?.role === PLATFORM_ADMIN_ROLE) {
        navigate('/platform-admin', { replace: true });
      } else if (loggedInUserData?.user?.role === FACTURADOR_ROLE) {
        navigate('/invoices', { replace: true });
      } else {
        navigate(from, { replace: true });
      }

    } catch (err) {
      console.error('Error de login:', err);
      
      if (err.response?.data?.needsVerification || err.needsVerification) {
        setNeedsVerification(true);
        localStorage.setItem('pendingVerificationEmail', email);
        setError('Por favor, verifica tu correo electrónico antes de iniciar sesión.');
      } 
      else if (err.response?.data?.companyInactive || err.companyInactive) {
        setError('La empresa asociada a su cuenta está desactivada o su suscripción ha finalizado.');
      } 
      else {
        setError(err.message || 'Correo electrónico o contraseña incorrectos.');
      }
      
      setLoading(false);
    }
  };

  const handleResendVerification = () => {
    localStorage.setItem('pendingVerificationEmail', email);
    navigate('/auth/verify-email-notice');
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: LEFT_PANEL_BACKGROUND }}>
        <CircularProgress sx={{ color: TEXT_ON_DARK_BACKGROUND }} />
      </Box>
    );
  }

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
          padding: { xs: 3, md: 6 },
          height: { xs: '220px', md: '100%' },
          position: 'relative',
        }}
      >
        {/* Contenedor para centrar el logo y texto */}
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
              mb: { xs: 1, md: 3 },
              width: { xs: '100px', md: '220px' },
              height: { xs: '100px', md: '220px' },
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
                      height: { xs: '4px', md: '6px' },
                      backgroundColor: ACCENT_COLOR,
                      my: { xs: 0.3, md: 0.5 },
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
              fontSize: { xs: '2rem', md: '4.5rem' },
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
            fontSize: '0.7rem',
            position: 'absolute',
            bottom: { xs: '5px', md: '20px' },
            left: 0,
            right: 0,
            display: { xs: 'none', sm: 'block' } // Oculto en móvil
          }}
        >
          &copy; {new Date().getFullYear()} FactTech. Todos los derechos reservados.
        </Typography>
      </Box>

      {/* Lado derecho: Formulario de login con fondo celeste */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', md: '0.5' },
          background: RIGHT_PANEL_GRADIENT,
          p: { xs: 2.5, md: 5 },
          paddingTop: { xs: 4, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { xs: 'flex-start', md: 'center' },
          alignItems: 'center',
          overflowY: 'auto',
          height: { xs: 'calc(100vh - 220px)', md: '100%' },
          borderTopLeftRadius: { xs: '24px', md: 0 },
          borderTopRightRadius: { xs: '24px', md: 0 },
          marginTop: { xs: '-24px', md: 0 },
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Contenedor interno para el formulario para limitar su ancho */}
        <Box sx={{ width: '100%', maxWidth: '450px' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: 1, 
              color: '#00334e', 
              fontWeight: 'bold', 
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}
          >
            Iniciar Sesión
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: { xs: 2, md: 3 }, 
              color: '#00334e', 
              textAlign: 'center',
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Bienvenido de nuevo. Ingresa tus credenciales.
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
                fontSize: { xs: '0.8rem', md: '0.875rem' },
                '& .MuiAlert-icon': {
                  color: '#b71c1c',
                }
              }}
              action={
                needsVerification ? (
                  <Button
                    sx={{ color: '#b71c1c' }}
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

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            {/* Campo de correo electrónico */}
            <TextField
              margin="normal"
              fullWidth
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              label=""
              variant="outlined"
              InputLabelProps={{ shrink: true, sx: { display: 'none' } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& > input": {
                    color: "black !important",
                    WebkitTextFillColor: "black !important"
                  }
                },
                mb: { xs: 2, md: 1 }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#00334e' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  height: { xs: '50px', md: '56px' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00334e',
                    borderWidth: '2px',
                  },
                  '&::before': {
                    content: '"Correo Electrónico"',
                    position: 'absolute',
                    top: { xs: '-20px', md: '-25px' },
                    left: '0',
                    color: '#00334e',
                    fontWeight: 500,
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                  }
                }
              }}
            />

            {/* Campo de contraseña */}
            <TextField
              margin="normal"
              fullWidth
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              label=""
              variant="outlined"
              InputLabelProps={{ shrink: true, sx: { display: 'none' } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& > input": {
                    color: "black !important",
                    WebkitTextFillColor: "black !important"
                  }
                },
                mt: { xs: 0, md: 2 }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#00334e' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  height: { xs: '50px', md: '56px' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00334e',
                    borderWidth: '2px',
                  },
                  '&::before': {
                    content: '"Contraseña"',
                    position: 'absolute',
                    top: { xs: '-20px', md: '-25px' },
                    left: '0',
                    color: '#00334e',
                    fontWeight: 500,
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                  }
                }
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                py: { xs: 1.2, md: 1.5 },
                backgroundColor: '#0288d1',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                fontSize: { xs: '0.9rem', md: '1rem' },
                '&:hover': {
                  backgroundColor: '#0277bd',
                  boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(0,0,0,0.12)',
                  color: 'rgba(0,0,0,0.26)',
                }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
            </Button>

            <Grid container spacing={2} sx={{ mt: { xs: 0, md: 1 } }}>
              <Grid item xs={12} sm={6} sx={{ 
                textAlign: { xs: 'center', sm: 'left' },
                mb: { xs: 1, sm: 0 }
              }}>
                <Link 
                  component={RouterLink} 
                  to="/auth/forgot-password" 
                  variant="body2" 
                  sx={{ 
                    color: '#00334e', 
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                    '&:hover': { color: '#002233', textDecoration: 'underline' } 
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ 
                textAlign: { xs: 'center', sm: 'right' }
              }}>
                <Link 
                  component={RouterLink} 
                  to="/auth/register" 
                  variant="body2" 
                  sx={{ 
                    color: '#00334e', 
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                    '&:hover': { color: '#002233', textDecoration: 'underline' } 
                  }}
                >
                  ¿No tienes una cuenta? Regístrate
                </Link>
              </Grid>
            </Grid>
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

export default Login;