// src/pages/dashboard/components/WelcomeHeaderIntegrated/LiveClock.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';
import { useAuth } from '../../../../context/AuthContext'; // Ajusta la ruta según tu estructura

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  const { currentUser } = useAuth();
  const userTimezone = currentUser?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Actualizar el tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Formatear fecha en español
  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return time.toLocaleDateString('es-ES', options);
  };
  
  // Formatear hora con segundos
  const formatTime = () => {
    return time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  // Obtener formato corto de zona horaria (GMT+xx)
  const formatTimezone = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: userTimezone,
      timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(time);
    const timeZonePart = parts.find(part => part.type === 'timeZoneName');
    return timeZonePart ? timeZonePart.value : 'GMT';
  };

  return (
    <Tooltip title={`Zona horaria: ${userTimezone}`} placement="bottom" arrow>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-end',
          position: 'relative',
          cursor: 'default'
        }}
      >
        {/* Tiempo con efecto de pulso en los dos puntos */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 0.5,
          background: 'linear-gradient(90deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.2))',
          borderRadius: '8px',
          padding: '4px 10px',
          boxShadow: '0 2px 10px rgba(79, 172, 254, 0.15)'
        }}>
          <AccessTimeIcon sx={{ fontSize: 16, mr: 1, color: 'rgba(79, 172, 254, 0.8)' }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: 1,
              '& .separator': {
                animation: 'pulse 1s infinite',
                opacity: 0.7,
                mx: 0.2,
                display: 'inline-block',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.3 }
                }
              }
            }}
          >
            {formatTime().split(':').map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="separator">:</span>}
                {part}
              </React.Fragment>
            ))}
          </Typography>
          <Box sx={{ 
            ml: 1, 
            px: 1, 
            py: 0.2, 
            borderRadius: '4px', 
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <PublicIcon sx={{ fontSize: 12, mr: 0.5, color: 'rgba(79, 172, 254, 0.7)' }} />
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.7rem', 
                color: 'rgba(255, 255, 255, 0.7)' 
              }}
            >
              {formatTimezone()}
            </Typography>
          </Box>
        </Box>
        
        {/* Fecha */}
        <Typography 
          variant="caption" 
          sx={{ 
            fontSize: '0.8rem', 
            color: 'rgba(255, 255, 255, 0.6)',
            fontStyle: 'italic'
          }}
        >
          {formatDate()}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default LiveClock;