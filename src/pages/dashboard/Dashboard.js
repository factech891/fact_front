// src/pages/dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Importamos los componentes personalizados
import SalesChart from './components/SalesChart';
import CurrencyDistribution from './components/CurrencyDistribution';
import AnnualBillingChart from './components/AnnualBillingChart';
import LatestTransactions from './components/LatestTransactions';
import KPICards from './components/KPICards';
import TimeRangeSelector from './components/TimeRangeSelector';

// Importamos nuestro hook personalizado
import { useDashboard } from '../../hooks/useDashboard';

// Importamos el servicio para la tasa de cambio
import exchangeRateApi from '../../services/exchangeRateApi';

// Importar constantes para las opciones de tiempo
import { TIME_RANGES } from './constants/dashboardConstants';

// Componente principal del Dashboard
const Dashboard = () => {
  // Estado para la tasa de cambio seleccionada
  const [selectedRate, setSelectedRate] = useState(66);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  
  // Estado para el rango de tiempo seleccionado (por defecto este mes)
  const [selectedRange, setSelectedRange] = useState('thisMonth');
  
  // Estado para el rango de fechas personalizado
  const [customDateRange, setCustomDateRange] = useState(null);
  
  // Cargar la tasa de cambio al iniciar el componente
  useEffect(() => {
    const loadExchangeRate = async () => {
      try {
        setIsLoading(true);
        const { rate, mode, source } = await exchangeRateApi.getCurrentRate();
        
        console.log(`Tasa cargada: ${rate} (modo: ${mode}, fuente: ${source})`);
        setSelectedRate(rate);
        
        // Mostrar notificación si proviene de API
        if (source === 'api') {
          setNotification({
            open: true,
            message: `Tasa actualizada: ${rate.toFixed(2)} VES/USD`,
            type: 'success'
          });
          
          // Auto-cerrar la notificación después de 3 segundos
          setTimeout(() => {
            setNotification(prev => ({ ...prev, open: false }));
          }, 3000);
        }
      } catch (error) {
        console.error('Error al cargar la tasa de cambio:', error);
        setNotification({
          open: true,
          message: 'Error al cargar la tasa de cambio',
          type: 'error'
        });
        
        // Auto-cerrar la notificación después de 3 segundos
        setTimeout(() => {
          setNotification(prev => ({ ...prev, open: false }));
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExchangeRate();
    
    // Suscribirse a cambios en la tasa
    const handleRateChange = (newRate) => {
      console.log("Evento de cambio de tasa recibido en Dashboard:", newRate);
      setSelectedRate(newRate);
    };
    
    // Registrar el listener
    exchangeRateApi.subscribeToRateChanges(handleRateChange);
    
    // Limpiar al desmontar
    return () => {
      exchangeRateApi.unsubscribeFromRateChanges(handleRateChange);
    };
  }, []);
  
  // Utilizamos el hook personalizado pasando el rango seleccionado
  const { 
    loading: dashboardLoading, 
    kpis, 
    facturasPorMes, 
    facturasPorTipo,
    facturasPorAnio = [], // Definir un valor predeterminado
    facturasRecientes, 
    clientesRecientes 
  } = useDashboard(selectedRange, customDateRange);
  
  // Handler para actualizar la tasa de cambio - MODIFICADO para evitar bucles
  const handleRateChange = (newRate) => {
    // Evitar actualizaciones redundantes
    if (Math.abs(newRate - selectedRate) < 0.01) {
      console.log("Ignorando actualización redundante");
      return;
    }
    
    console.log("Actualizando tasa en Dashboard:", newRate);
    setSelectedRate(newRate);
    
    // Forzar actualización en localStorage, solo si realmente hay cambio
    exchangeRateApi.setManualRate(newRate);
    
    setNotification({
      open: true,
      message: `Tasa actualizada: ${newRate.toFixed(2)} VES/USD`,
      type: 'success'
    });
    
    // Auto-cerrar la notificación después de 3 segundos
    setTimeout(() => {
      setNotification(prev => ({ ...prev, open: false }));
    }, 3000);
  };
  
  // Manejador para el cambio de rango de tiempo
  const handleRangeChange = (newRange) => {
    console.log(`Cambiando rango a: ${newRange}`);
    setSelectedRange(newRange);
    
    // No mostrar notificación para el rango personalizado, ya que mostrará el diálogo
    if (newRange !== 'custom') {
      // Buscar etiqueta para mostrar en notificación
      const rangeLabel = (() => {
        const found = TIME_RANGES.find(r => r.value === newRange);
        return found ? found.label : 'Personalizado';
      })();
      
      // Mostrar notificación de cambio de rango
      setNotification({
        open: true,
        message: `Período cambiado: ${rangeLabel}`,
        type: 'info'
      });
      
      // Auto-cerrar la notificación después de 2 segundos
      setTimeout(() => {
        setNotification(prev => ({ ...prev, open: false }));
      }, 2000);
    }
  };
  
  // Manejador para el cambio de rango personalizado
  const handleCustomRangeChange = (range) => {
    console.log("Rango personalizado:", range);
    setCustomDateRange(range);
    
    // Mostrar notificación con las fechas seleccionadas
    const startDate = range.startDate.toLocaleDateString('es-ES');
    const endDate = range.endDate.toLocaleDateString('es-ES');
    
    setNotification({
      open: true,
      message: `Período personalizado: ${startDate} al ${endDate}`,
      type: 'info'
    });
    
    // Auto-cerrar la notificación después de 3 segundos
    setTimeout(() => {
      setNotification(prev => ({ ...prev, open: false }));
    }, 3000);
  };
  
  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification({ open: false, message: '', type: 'info' });
  };

  if (dashboardLoading || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} sx={{ color: '#4477CE' }} />
      </Box>
    );
  }

  // Obtener totales por moneda
  const totalUSD = kpis.totalPorMoneda.find(m => m.moneda === 'USD')?.total || 0;
  const totalVES = kpis.totalPorMoneda.find(m => m.moneda === 'VES')?.total || 0;
  const totalClientes = kpis.totalClientes || 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Notificación - Auto-cierre implementado */}
      {notification.open && (
        <Box 
          sx={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            mt: 1,
            maxWidth: '80%',
            display: 'flex',
            alignItems: 'center',
            bgcolor: notification.type === 'success' ? '#43a047' : 
                     notification.type === 'error' ? '#e53935' : '#1e88e5',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 1,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          <Typography variant="body2">{notification.message}</Typography>
          <IconButton 
            size="small" 
            onClick={handleCloseNotification}
            sx={{ ml: 1, color: 'white' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      
      {/* Selector de Período */}
      <TimeRangeSelector 
        selectedRange={selectedRange} 
        customDateRange={customDateRange}
        onRangeChange={handleRangeChange}
        onCustomRangeChange={handleCustomRangeChange}
      />
      
      {/* Tarjetas KPI - Ahora con nuevas propiedades */}
      <KPICards 
        totalUSD={totalUSD}
        totalVES={totalVES}
        totalFacturas={kpis.totalFacturas || 0}
        totalClientes={totalClientes}
        cambioIngresos={kpis.cambioIngresos}
        cambioFacturas={kpis.cambioFacturas}
        cambioClientes={kpis.cambioClientes}
        exchangeRate={selectedRate}
        onRateChange={handleRateChange}
        ventasAyerUSD={kpis.ventasAyerUSD}
        ventasMesPasadoUSD={kpis.ventasMesPasadoUSD}
      />

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Facturación Mensual */}
        <Grid item xs={12} lg={8}>
          <SalesChart data={facturasPorMes} />
        </Grid>

        {/* Gráfico de Distribución por Moneda */}
        <Grid item xs={12} lg={4}>
          <CurrencyDistribution data={facturasPorTipo} title="Distribución por Moneda" />
        </Grid>
      </Grid>

      {/* Facturación Anual - Con validación para evitar errores */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <AnnualBillingChart data={Array.isArray(facturasPorAnio) ? facturasPorAnio : []} />
        </Grid>
      </Grid>

      {/* Componente de Transacciones Recientes */}
      <LatestTransactions 
        invoices={facturasRecientes} 
        clients={clientesRecientes} 
      />
    </Box>
  );
};

export default Dashboard;