// src/pages/auth/ForgotPassword.js
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, Box, Typography, TextField, Button, 
  Link, Paper, CircularProgress, Alert 
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { forgotPassword } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor ingrese su correo electrónico');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      await forgotPassword(email);
      
      // Mostrar mensaje de éxito
      setSuccess(true);
    } catch (error) {
      setError(error.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src="/img/logo.png" alt="FactTech Logo" style={{ height: 60, marginBottom: 16 }} />
            <Typography component="h1" variant="h5">
              Recuperar Contraseña
            </Typography>
          </Box>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Se ha enviado un correo con instrucciones para restablecer su contraseña
            </Alert>
          )}
          
          {!success ? (
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Ingrese su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.
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
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Enviar Instrucciones'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/auth/login" variant="body2">
                  Volver al inicio de sesión
                </Link>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                component={RouterLink}
                to="/auth/login"
                variant="outlined"
                sx={{ mt: 2 }}
              >
                Volver al inicio de sesión
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;