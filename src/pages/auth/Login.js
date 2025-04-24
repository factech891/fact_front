import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Typography, TextField, Button, 
  Link, Paper, Grid, CircularProgress, Alert, 
  useTheme, InputAdornment, styled // Import styled
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../../context/AuthContext'; 

// URL de la imagen de fondo SVG
const BACKGROUND_IMAGE_URL = 'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/q.svg';

// --- Componente de Texto con Gradiente (basado en el Footer) ---
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
  // --- Estados del Componente ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // --- Hooks ---
  const { login } = useAuth(); 
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const theme = useTheme(); 

  // Determinar a dónde redirigir después del login
  const from = location.state?.from?.pathname || '/dashboard'; 
  
  // --- Manejador del Envío del Formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!email || !password) {
      setError('Por favor complete todos los campos.');
      return;
    }
    
    try {
      setError(''); 
      setLoading(true); 
      
      await login(email, password); 
      
      navigate(from, { replace: true }); 

    } catch (err) { 
      console.error('Error de login:', err);
      setError(err.message || 'Correo electrónico o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false); 
    }
  };
  
  // --- Renderizado del Componente ---
  return (
    // Contenedor principal que ocupa toda la pantalla
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Mantenemos columna
        alignItems: 'center', // Centra horizontalmente el Paper y el Copyright
        justifyContent: 'center', // Asegura centrado vertical del contenido principal
        minHeight: '100vh', 
        backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        py: 4, // Padding vertical general
        px: 2, 
      }}
    >
      {/* Contenedor del formulario centrado y semi-transparente */}
      {/* Añadimos un Box intermedio para ayudar al centrado si es necesario */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '450px' }}> 
          <Paper 
            elevation={8} 
            sx={{ 
              p: { xs: 3, sm: 5 }, // Padding interno
              width: '100%', // Ocupa el ancho del Box padre
              backgroundColor: 'rgba(30, 30, 30, 0.85)', 
              backdropFilter: 'blur(5px)', 
              borderRadius: theme.shape.borderRadius * 1.5, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', 
              // Quitamos margen inferior aquí, se maneja fuera
              // mb: 4, 
            }}
          >
            {/* Título con gradiente */}
            <GradientText component="h1"> 
              FactTech
            </GradientText>
                
            {/* Muestra alerta de error si existe */}
            {error && (
              <Alert severity="error" sx={{ mb: 2, width: '100%', backgroundColor: 'rgba(30, 30, 30, 0.85)' }}>
                {error}
              </Alert>
            )}
                
            {/* Formulario */}
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
              {/* Botón de Iniciar Sesión con fondo degradado (azul-cyan) */}
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
                  
              {/* Enlaces a Recuperar Contraseña y Registro */}
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

      {/* Copyright al final de la página */}
      <Typography 
         variant="body2" 
         align="center" 
         sx={{ 
            width: '100%', 
            color: theme.palette.text.secondary, 
            // Quitamos mt: 'auto' para que no empuje todo hacia arriba
            // mt: 'auto', 
            pt: 4, // Aumentamos padding top para separar más del formulario
            pb: 2, // Añadimos padding bottom
         }}
      >
        &copy; {new Date().getFullYear()} FactTech. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default Login;