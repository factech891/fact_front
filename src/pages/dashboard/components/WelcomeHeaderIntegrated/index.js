// src/pages/dashboard/components/WelcomeHeaderIntegrated/index.js
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Button,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BusinessIcon from '@mui/icons-material/Business'; 
import PersonPinIcon from '@mui/icons-material/PersonPin'; 
import { TIME_RANGES } from '../../constants/dashboardConstants'; 
import CustomDateRangePicker from '../CustomDateRangePicker'; 
import WavesBackground from '../../../../components/WavesBackground'; // Importar el nuevo componente

const WelcomeHeaderIntegrated = ({ 
  userName, 
  companyName,
  userRole,
  currentDateTime,
  selectedRange,
  customDateRange,
  onRangeChange,
  onCustomRangeChange
}) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleRangeSelect = (rangeValue) => {
    if (rangeValue === 'custom') {
      setOpenDatePicker(true); 
    } else {
      onRangeChange(rangeValue); 
    }
    handleMenuClose();
  };
  
  const handleCustomDateSelect = (range) => {
    onCustomRangeChange(range); 
    setOpenDatePicker(false); 
  };

  const selectedRangeLabel = (() => {
    if (selectedRange === 'custom' && customDateRange && customDateRange.startDate && customDateRange.endDate) {
      const formatDateShort = (date) => {
        if (!date) return '';
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return 'Fecha inválida';
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
      };
      const startDate = formatDateShort(customDateRange.startDate);
      const endDate = formatDateShort(customDateRange.endDate);
      return `${startDate} - ${endDate}`;
    }
    return TIME_RANGES.find(r => r.value === selectedRange)?.label || 'Este mes';
  })();

  const showCompanyInfo = companyName && companyName !== 'Nombre de Empresa no disponible';
  const showRoleInfo = userRole && userRole !== 'Rol no disponible';

  return (
    <>
      <Paper 
        elevation={0}
        sx={{
          mb: 3, 
          borderRadius: '12px', 
          background: '#1E1E1E', 
          color: 'white',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)', 
          p: { xs: 2, sm: 2.5, md: 3 },
          overflow: 'hidden' // Importante para contener el canvas
        }}
      >
        {/* Componente de fondo con ondas */}
        <WavesBackground color="rgba(79, 172, 254, 0.08)" />
        
        {/* Grid principal para dividir en dos columnas */}
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            
          {/* Columna Izquierda: Saludo e Información */}
          <Grid item xs={12} md={6} lg={7} sx={{ position: 'relative', zIndex: 1 }}> 
            <Typography 
              variant="h5" 
              component="h1"
              fontWeight="700" 
              sx={{ 
                fontSize: { xs: '1.7rem', sm: '2rem', md: '2.3rem' }, 
                lineHeight: 1.25,
                mb: 1, 
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                WebkitBackgroundClip: 'text', 
                backgroundClip: 'text',
                color: 'transparent', 
                display: 'inline-block', 
              }}
            >
              ¡Hola, {userName || 'Usuario'}!
            </Typography>
            
            {(showCompanyInfo || showRoleInfo) && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}> 
                {showCompanyInfo && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <BusinessIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }} />
                    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      {companyName}
                    </Typography>
                  </Box>
                )}
                {showRoleInfo && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                     <PersonPinIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }} />
                     <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                       {userRole}
                     </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Grid> {/* Cierre del Grid item izquierdo */}

          {/* Columna Derecha: Fecha y Selector */}
          <Grid item xs={12} md={6} lg={5} sx={{ 
             display: 'flex', 
             justifyContent: { xs: 'flex-start', md: 'flex-end' }, 
             alignItems: 'center', 
             gap: 2,
             position: 'relative',
             zIndex: 1 
          }}>
              {/* Fecha y Hora */}
              {currentDateTime && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: 'rgba(255,255,255,0.6)', 
                    whiteSpace: 'nowrap' 
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 16, mr: 0.75 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                    {currentDateTime}
                  </Typography>
                </Box> // Cierre del Box de Fecha/Hora
              )}
              
              {/* Selector de Período */}
              <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}> 
                <Typography 
                  variant="caption" 
                  color="rgba(255,255,255,0.6)" 
                  sx={{ fontSize: '0.8rem', mr: 1, display: {xs: 'none', sm: 'inline'} }}
                >
                  Período:
                </Typography>
                <Button
                  id="time-range-button-integrated"
                  aria-controls={openMenu ? 'time-range-menu-integrated' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? 'true' : undefined}
                  onClick={handleMenuClick}
                  startIcon={<CalendarTodayIcon sx={{fontSize: '1rem'}} />}
                  endIcon={<ArrowDropDownIcon />}
                  variant="outlined" 
                  size="small"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    borderColor: 'rgba(255,255,255,0.23)', 
                    bgcolor: 'rgba(255,255,255,0.08)', 
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      bgcolor: 'rgba(255,255,255,0.12)'
                    },
                    textTransform: 'none',
                    fontSize: '0.8rem', 
                    padding: '4px 10px', 
                    height: '36px',
                    borderRadius: '8px', 
                    whiteSpace: 'nowrap' 
                  }}
                >
                  {selectedRangeLabel}
                </Button>
                <Menu
                  id="time-range-menu-integrated"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                  MenuListProps={{ 'aria-labelledby': 'time-range-button-integrated' }}
                  PaperProps={{
                    sx: {
                      bgcolor: '#1E1E1E', 
                      color: 'white',
                      border: '1px solid #384153', 
                      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.35)', 
                      borderRadius: '8px',
                      marginTop: '8px', 
                      '& .MuiMenuItem-root': {
                        fontSize: '0.875rem', 
                        py: 1, 
                        px: 2, 
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)'},
                        '&.Mui-selected': { 
                          bgcolor: 'primary.dark', 
                          '&:hover': { bgcolor: 'primary.main' }, 
                          fontWeight: 500
                        },
                      },
                      '& .MuiDivider-root': { borderColor: 'rgba(255,255,255,0.12)', my: 0.5 },
                      '& .section-title': { 
                        px: 2, pt: 1, pb: 0.5, color: 'rgba(255,255,255,0.5)', display: 'block',
                        fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em'
                      }
                    }
                  }}
                >
                  {/* Opciones del menú (sin cambios) */}
                  <Typography variant="caption" className="section-title">
                    Específicos
                  </Typography>
                  {TIME_RANGES.slice(0, 6).map((range) => (
                    <MenuItem key={range.value} onClick={() => handleRangeSelect(range.value)} selected={selectedRange === range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                  <Divider />
                  <Typography variant="caption" className="section-title">
                    Relativos
                  </Typography>
                  {TIME_RANGES.slice(6, 11).map((range) => (
                    <MenuItem key={range.value} onClick={() => handleRangeSelect(range.value)} selected={selectedRange === range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem onClick={() => handleRangeSelect('custom')} selected={selectedRange === 'custom'}>
                    Personalizado
                  </MenuItem>
                </Menu> 
              </Box> {/* Cierre del Box del Selector */}
          </Grid> {/* Cierre del Grid item derecho */}
        </Grid> {/* Cierre del Grid container principal */}
      </Paper>
      
      <CustomDateRangePicker
        open={openDatePicker}
        onClose={() => setOpenDatePicker(false)}
        onSelectRange={handleCustomDateSelect} 
        initialRange={customDateRange}
      />
    </>
  );
};

export default WelcomeHeaderIntegrated;