// src/pages/dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent,
  IconButton,
  CircularProgress,
  Avatar
} from '@mui/material';

// Importamos los iconos necesarios
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

// Importamos los componentes personalizados
import SalesChart from './components/SalesChart';
import CurrencyDistribution from './components/CurrencyDistribution';
import ExchangeRateSelector from './components/ExchangeRateSelector';
import AnnualBillingChart from './components/AnnualBillingChart';
import LatestTransactions from './components/LatestTransactions';

// Importamos nuestro hook personalizado
import { useDashboard } from '../../hooks/useDashboard';

// Importamos el servicio para la tasa de cambio
import exchangeRateApi from '../../services/exchangeRateApi';

// Componente principal del Dashboard
const Dashboard = () => {
  // Estado para la tasa de cambio seleccionada
  const [selectedRate, setSelectedRate] = useState(66);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  
  // Estado para el rango de fechas (fijo, sin selector visible)
  const [timeRange] = useState(() => {
    const now = new Date();
    return {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1), // Primer día del mes actual
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0) // Último día del mes actual
    };
  });
  
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
  }, []);
  
  // Utilizamos el hook personalizado pasando la tasa de cambio seleccionada
  const { 
    loading: dashboardLoading, 
    kpis, 
    facturasPorMes, 
    facturasPorTipo,
    facturasPorAnio,
    facturasRecientes, 
    clientesRecientes 
  } = useDashboard(timeRange, selectedRate);
  
  // Handler para actualizar la tasa de cambio
  const handleRateChange = (newRate) => {
    setSelectedRate(newRate);
    
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
            bgcolor: notification.type === 'success' ? '#43a047' : '#e53935',
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
      
      {/* Tarjetas de KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* KPI 1: USD */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ 
            borderRadius: 2, 
            bgcolor: '#1E1E1E',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #333',
            position: 'relative',
            overflow: 'visible'
          }}>
            <CardContent sx={{ py: 1.5, px: 2, position: 'relative' }}>
              <Box sx={{ 
                position: 'absolute',
                top: '-10px',
                right: '10px',
                zIndex: 1
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#4CAF50',
                    width: 32,
                    height: 32,
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Box>
              
              <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.85rem' }}>
                💵 Ingresos USD
              </Typography>
              
              <Typography 
                variant="h4" 
                color="white" 
                sx={{ 
                  mt: 1, 
                  mb: 0.5, 
                  fontWeight: 'bold',
                  fontSize: '1.8rem'
                }}
              >
                {new Intl.NumberFormat('es-ES').format(Math.round(totalUSD))}
              </Typography>
              
              <Typography 
                variant="body2" 
                color="#AAA"
                sx={{ fontSize: '0.75rem' }}
              >
                Equivale a: {new Intl.NumberFormat('es-ES').format(Math.round(totalUSD * selectedRate))} VES
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: kpis.cambioIngresos >= 0 ? '#4CAF50' : '#F44336', 
                  display: 'flex',
                  alignItems: 'center',
                  mt: 1
                }}
              >
                {kpis.cambioIngresos >= 0 ? '↑' : '↓'} {Math.abs(kpis.cambioIngresos)}% este mes
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mt: 1
              }}>
                <InfoIcon sx={{ fontSize: 14, color: '#AAA', mr: 0.5 }} />
                <Typography variant="caption" color="#AAA">
                  Tasa: {selectedRate.toFixed(2)} VES/USD
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* KPI 2: VES */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ 
            borderRadius: 2, 
            bgcolor: '#1E1E1E',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #333',
            position: 'relative',
            overflow: 'visible'
          }}>
            <CardContent sx={{ py: 1.5, px: 2, position: 'relative' }}>
              <Box sx={{ 
                position: 'absolute',
                top: '-10px',
                right: '10px',
                zIndex: 1
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#4477CE',
                    width: 32,
                    height: 32,
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Box>
              
              <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.85rem' }}>
                💰 Ingresos VES
              </Typography>
              
              <Typography 
                variant="h4" 
                color="white" 
                sx={{ 
                  mt: 1, 
                  mb: 0.5, 
                  fontWeight: 'bold',
                  fontSize: '1.8rem'
                }}
              >
                {new Intl.NumberFormat('es-ES').format(Math.round(totalVES))}
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: kpis.cambioIngresos >= 0 ? '#4CAF50' : '#F44336', 
                  display: 'flex',
                  alignItems: 'center',
                  mt: 0.5,
                  mb: 1
                }}
              >
                {kpis.cambioIngresos >= 0 ? '↑' : '↓'} {Math.abs(kpis.cambioIngresos)}% este mes
              </Typography>
              
              {/* Aquí insertamos el selector de tasa de cambio */}
              <ExchangeRateSelector 
                onRateChange={handleRateChange}
                totalVES={totalVES}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 3: Facturas */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ 
            borderRadius: 2, 
            bgcolor: '#1E1E1E',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #333',
            position: 'relative',
            overflow: 'visible'
          }}>
            <CardContent sx={{ py: 1.5, px: 2, position: 'relative' }}>
              <Box sx={{ 
                position: 'absolute',
                top: '-10px',
                right: '10px',
                zIndex: 1
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#FFA726',
                    width: 32,
                    height: 32,
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <ReceiptIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Box>
              
              <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.85rem' }}>
                📊 Facturas
              </Typography>
              
              <Typography 
                variant="h4" 
                color="white" 
                sx={{ 
                  mt: 1, 
                  mb: 0.5, 
                  fontWeight: 'bold',
                  fontSize: '1.8rem'
                }}
              >
                {kpis.totalFacturas || 0}
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: kpis.cambioFacturas >= 0 ? '#4CAF50' : '#F44336', 
                  display: 'flex',
                  alignItems: 'center',
                  mt: 1
                }}
              >
                {kpis.cambioFacturas >= 0 ? '↑' : '↓'} {Math.abs(kpis.cambioFacturas)}% este mes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* KPI 4: Clientes */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ 
            borderRadius: 2, 
            bgcolor: '#1E1E1E',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #333',
            position: 'relative',
            overflow: 'visible'
          }}>
            <CardContent sx={{ py: 1.5, px: 2, position: 'relative' }}>
              <Box sx={{ 
                position: 'absolute',
                top: '-10px',
                right: '10px',
                zIndex: 1
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#4477CE',
                    width: 32,
                    height: 32,
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Box>
              
              <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.85rem' }}>
                👥 Clientes
              </Typography>
              
              <Typography 
                variant="h4" 
                color="white" 
                sx={{ 
                  mt: 1, 
                  mb: 0.5, 
                  fontWeight: 'bold',
                  fontSize: '1.8rem'
                }}
              >
                {totalClientes}
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: kpis.cambioClientes >= 0 ? '#4CAF50' : '#F44336', 
                  display: 'flex',
                  alignItems: 'center',
                  mt: 1
                }}
              >
                {kpis.cambioClientes >= 0 ? '↑' : '↓'} {Math.abs(kpis.cambioClientes)}% este mes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

      {/* Facturación Anual */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <AnnualBillingChart data={facturasPorAnio || []} />
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