// src/pages/dashboard/components/CustomDateRangePicker/index.js
import React, { useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField
} from '@mui/material';

const CustomDateRangePicker = ({ open, onClose, onSelectRange }) => {
  // Usar directamente la fecha local del navegador
  const today = new Date();
  const defaultStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Formatear fechas para input
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Estado para las fechas seleccionadas
  const [startDate, setStartDate] = useState(formatDate(defaultStartDate));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [error, setError] = useState('');

  // Gestionar cambios en los inputs
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setError('');
  };
  
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setError('');
  };

  // Validar antes de confirmar
  const handleConfirm = () => {
    // Verificar que ambas fechas estén seleccionadas
    if (!startDate || !endDate) {
      setError('Ambas fechas deben estar seleccionadas');
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Verificar que son fechas válidas
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError('Por favor, selecciona fechas válidas');
      return;
    }
    
    // Verificar que fecha inicio <= fecha fin
    if (start > end) {
      setError('La fecha de inicio debe ser anterior o igual a la fecha de fin');
      return;
    }
    
    // Configurar las horas correctamente en zona horaria local
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    // Enviar rango seleccionado
    onSelectRange({
      startDate: start,
      endDate: end
    });
    
    // Cerrar diálogo
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: '#1E1E1E',
          color: 'white',
          minWidth: '320px'
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #333' }}>
        Seleccionar rango de fechas
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Fecha de inicio
          </Typography>
          <TextField
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#666' },
                '&.Mui-focused fieldset': { borderColor: '#4477CE' }
              },
              '& .MuiInputBase-input': {
                color: 'white'
              },
              '& .MuiInputLabel-root': {
                color: '#AAA'
              }
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Fecha de fin
          </Typography>
          <TextField
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#666' },
                '&.Mui-focused fieldset': { borderColor: '#4477CE' }
              },
              '& .MuiInputBase-input': {
                color: 'white'
              },
              '& .MuiInputLabel-root': {
                color: '#AAA'
              }
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        {error && (
          <Typography 
            variant="caption" 
            color="error" 
            sx={{ display: 'block', mt: 1 }}
          >
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: '#AAA',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm}
          variant="contained"
          sx={{ 
            bgcolor: '#4477CE',
            '&:hover': { bgcolor: '#5588DF' }
          }}
        >
          Aplicar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDateRangePicker;