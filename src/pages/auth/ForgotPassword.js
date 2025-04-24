import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, Typography, TextField, Button, 
  Link, Paper, CircularProgress, Alert, 
  useTheme, InputAdornment, styled // Import styled
} from '@mui/material';
// Importa el icono necesario
import EmailIcon from '@mui/icons-material/Email'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icono para éxito

import { useAuth } from '../../context/AuthContext'; // Asegúrate que la ruta sea correcta

// URL de la imagen de fondo SVG (la misma que en Login/Register)
const BACKGROUND_IMAGE_URL = 'https://pub-c37b7a23aa9c49239d088e3e0a3ba275.r2.dev/q.svg';

// --- Componente de Texto con Gradiente (igual que en Login/Register) ---
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

const ForgotPassword = () => {
  // --- Estados ---
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Estado para mostrar mensaje de éxito
  
  // --- Hooks ---
  const { forgotPassword } = useAuth(); // Función del contexto para olvido de contraseña
  const theme = useTheme();

  // --- Manejador del Envío ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor ingrese su correo electrónico');
      return;
    }
    
    try {
      setError('');
      setSuccess(false); // Resetear éxito
      setLoading(true);
      
      // Llama a la función del contexto
      await forgotPassword(email); 
      
      // Mostrar mensaje de éxito si no hay error
      setSuccess(true); 
    } catch (err) {
      console.error("Forgot Password error:", err);
      setError(err.message || 'Error al procesar la solicitud. Verifique el correo e intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // --- Renderizado ---
  return (
    // Contenedor principal con fondo
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Para manejar copyright abajo
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
      {/* Contenedor del formulario centrado y semi-transparente */}
      <Paper 
        elevation={8} 
        sx={{ 
          p: { xs: 3, sm: 5 }, 
          maxWidth: '480px', // Ancho similar a Login
          width: '100%', 
          backgroundColor: 'rgba(30, 30, 30, 0.85)', 
          backdropFilter: 'blur(5px)', 
          borderRadius: theme.shape.borderRadius * 1.5, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', 
          mb: 4, // Margen inferior para separar del copyright
        }}
      >
        {/* Título con gradiente */}
        <GradientText component="h1">
          FactTech
        </GradientText>

        {/* Subtítulo */}
         <Typography variant="h6" align="center" sx={{ mb: 2, color: theme.palette.text.secondary }}>
           Recuperar Contraseña
        </Typography>
        
        {/* Alerta de error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%', backgroundColor: 'rgba(30, 30, 30, 0.85)' }}>
            {error}
          </Alert>
        )}
        
        {/* Mensaje de éxito */}
        {success && (
          <Alert 
            severity="success" 
            icon={<CheckCircleIcon fontSize="inherit" />} // Icono de éxito
            sx={{ 
                mb: 3, // Más margen inferior si es éxito
                width: '100%', 
                // Estilos para alerta de éxito en tema oscuro
                backgroundColor: 'rgba(46, 125, 50, 0.2)', // Fondo verde suave 
                color: '#a5d6a7', // Texto verde claro
                border: '1px solid #a5d6a7', // Borde verde claro
                '& .MuiAlert-icon': { // Color del icono
                    color: '#a5d6a7',
                }
            }}
          >
            Se ha enviado un correo a <strong>{email}</strong> con instrucciones para restablecer su contraseña. Por favor, revise su bandeja de entrada (y spam).
          </Alert>
        )}
        
        {/* Muestra el formulario solo si no se ha enviado el correo (success === false) */}
        {!success ? (
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, textAlign: 'center' }}>
              Ingrese su correo electrónico registrado.
            </Typography>
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
              disabled={loading} // Deshabilitar si está cargando
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
            />
            {/* Botón de Enviar Instrucciones */}
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
                '&:hover': { opacity: 0.9 },
                '&.Mui-disabled': {
                  background: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled,
                  cursor: 'not-allowed',
                  pointerEvents: 'auto',
                }
              }} 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Instrucciones'}
            </Button>
            
          </Box>
        ) : null /* No mostrar nada más si success es true, el botón de volver está abajo */}

        {/* Enlace/Botón para volver al inicio de sesión */}
        <Box sx={{ mt: success ? 1 : 3, textAlign: 'center' }}> 
            {/* Si es éxito, muestra un botón más prominente */}
            {success ? (
                 <Button
                    component={RouterLink}
                    to="/auth/login"
                    variant="outlined" // Botón delineado
                    sx={{ 
                        borderColor: theme.palette.text.secondary, 
                        color: theme.palette.text.secondary,
                        mt: 2 // Margen superior
                    }}
                 >
                    Volver al inicio de sesión
                 </Button>
            ) : (
                 <Link component={RouterLink} to="/auth/login" variant="body2">
                    Volver al inicio de sesión
                 </Link>
            )}
        </Box>

      </Paper>

      {/* Copyright al final de la página */}
      <Typography 
         variant="body2" 
         align="center" 
         sx={{ 
            width: '100%', 
            color: theme.palette.text.secondary, 
            mt: 'auto', 
            pt: 2, 
         }}
      >
        &copy; {new Date().getFullYear()} FactTech. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default ForgotPassword;