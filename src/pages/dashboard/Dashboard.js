// src/pages/dashboard/Dashboard.js (Props Corregidas para KPICards)
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Importamos los componentes personalizados
import SalesChart from './components/SalesChart';
import DailyBillingChart from './components/DailyBillingChart';
import AnnualBillingChart from './components/AnnualBillingChart';
import LatestTransactions from './components/LatestTransactions';
import KPICards from './components/KPICards'; // Asegúrate que la ruta sea correcta
import TimeRangeSelector from './components/TimeRangeSelector';

// Importamos nuestro hook personalizado
import { useDashboard } from '../../hooks/useDashboard'; // Asegúrate que la ruta sea correcta

// Importamos el servicio para la tasa de cambio
import exchangeRateApi from '../../services/exchangeRateApi'; // Asegúrate que la ruta sea correcta

// Importar constantes para las opciones de tiempo
import { TIME_RANGES } from './constants/dashboardConstants'; // Asegúrate que la ruta sea correcta

// Importar el contexto de autenticación para obtener el token
import AuthContext from '../../context/AuthContext'; // Ajusta la ruta si es necesario

// Componente principal del Dashboard
const Dashboard = () => {
  const { token } = useContext(AuthContext);

  // Estados locales del Dashboard
  const [selectedRate, setSelectedRate] = useState(null); // Inicializar a null hasta que se cargue
  const [isLoadingRate, setIsLoadingRate] = useState(true); // Estado específico para carga de tasa
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  const [selectedRange, setSelectedRange] = useState('thisMonth');
  const [customDateRange, setCustomDateRange] = useState(null);
  const [dashboardData, setDashboardData] = useState({ facturacionDiaria: [] });
  const [dataLoadingError, setDataLoadingError] = useState(null);

  // Hook useDashboard para obtener datos procesados
  const {
    loading: dashboardHookLoading, // Renombrado para claridad
    error: dashboardHookError,     // Capturar error del hook
    kpis,
    facturasPorMes,
    facturasPorDia,
    facturasPorTipo,
    facturasPorAnio = [],
    facturasRecientes,
    clientesRecientes,
    exchangeRate: rateFromHook // Tasa usada en los cálculos del hook
  } = useDashboard(selectedRange, customDateRange);

  // --- DEBUG --- Log para ver qué devuelve el hook useDashboard
  console.log('DEBUG Dashboard: Datos del hook useDashboard:', { dashboardHookLoading, dashboardHookError, kpis, rateFromHook });

  // Cargar datos específicos del dashboard (ej: facturación diaria)
  const fetchDashboardData = async (authToken) => {
    setDataLoadingError(null);
    try {
      const response = await fetch('http://localhost:5002/api/invoices/dashboard-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || `Error: ${response.status}`);
      if (responseData.success === false) throw new Error(responseData.message || 'Error API');
      return responseData;
    } catch (error) {
      console.error('Error fetchDashboardData:', error);
      setDataLoadingError(error.message || 'Error cargando datos específicos.');
      return { facturacionDiaria: [] };
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      if (token) {
        const data = await fetchDashboardData(token);
        console.log('Datos recibidos del endpoint dashboard-data:', data);
        setDashboardData(data || { facturacionDiaria: [] });
      } else {
        console.warn('Dashboard: Token no disponible para fetchDashboardData.');
        // setDataLoadingError('No autenticado.'); // Opcional: mostrar error si no hay token
      }
    };
    loadDashboardData();
  }, [token]);

  // Sincronizar selectedRate con la tasa del hook cuando se cargue
  useEffect(() => {
    if (rateFromHook !== null && !dashboardHookLoading) {
      setSelectedRate(rateFromHook);
      setIsLoadingRate(false); // Marcar como cargada la tasa local
    }
  }, [rateFromHook, dashboardHookLoading]);


  // Handler para actualizar la tasa de cambio (llamado desde KPICards)
  const handleRateChange = (newRate) => {
    // Actualizar la tasa en el estado local para reflejar en el selector
    setSelectedRate(newRate);
    // Aquí NO llamamos a exchangeRateApi.setManualRate directamente,
    // KPICards > CompactExchangeRateSelector ya se encarga de eso.
    // Solo necesitamos actualizar el estado para que el resto de la UI lo use.
    setNotification({
        open: true,
        message: `Tasa actualizada localmente: ${newRate.toFixed(2)} VES/USD`,
        type: 'info' // O 'success' si prefieres
    });
    setTimeout(() => setNotification(prev => ({ ...prev, open: false })), 3000);
  };

  // Manejador para el cambio de rango de tiempo
  const handleRangeChange = (newRange) => {
    console.log(`Dashboard: Cambiando rango a: ${newRange}`);
    setSelectedRange(newRange);
    if (newRange !== 'custom') {
      const rangeLabel = TIME_RANGES.find(r => r.value === newRange)?.label || 'Personalizado';
      setNotification({ open: true, message: `Período cambiado: ${rangeLabel}`, type: 'info' });
      setTimeout(() => setNotification(prev => ({ ...prev, open: false })), 2000);
    }
  };

  // Manejador para el cambio de rango personalizado
  const handleCustomRangeChange = (range) => {
    console.log("Dashboard: Rango personalizado:", range);
    setCustomDateRange(range);
    const startDate = range.startDate.toLocaleDateString('es-ES');
    const endDate = range.endDate.toLocaleDateString('es-ES');
    setNotification({ open: true, message: `Período: ${startDate} al ${endDate}`, type: 'info' });
    setTimeout(() => setNotification(prev => ({ ...prev, open: false })), 3000);
  };

  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification({ open: false, message: '', type: 'info' });
  };

  // Estado de carga general (solo del hook principal por ahora)
  const combinedLoading = dashboardHookLoading || isLoadingRate;

  // Mostrar error si falló la carga de datos del hook o la específica del dashboard
  if (dashboardHookError || dataLoadingError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error al cargar datos del Dashboard: {dashboardHookError || dataLoadingError}
        </Alert>
      </Box>
    );
  }

  // Mostrar indicador de carga si alguna parte está cargando
  if (combinedLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} sx={{ color: '#4477CE' }} />
        <Typography sx={{ ml: 2 }}>Cargando datos del dashboard...</Typography>
      </Box>
    );
  }

  // --- Extracción de datos de KPIs ---
  // Usar valores por defecto (0) si kpis es undefined o null
  const safeKpis = kpis || {};
  const totalUSD = safeKpis.totalPorMoneda?.find(m => m.moneda === 'USD')?.total || 0;
  const totalVES = safeKpis.totalPorMoneda?.find(m => m.moneda === 'VES')?.total || 0;
  const totalFacturas = safeKpis.totalFacturas || 0;
  const totalClientes = safeKpis.totalClientes || 0;
  const cambioIngresos = safeKpis.cambioIngresos || 0;
  const cambioFacturas = safeKpis.cambioFacturas || 0;
  const cambioClientes = safeKpis.cambioClientes || 0;

  // --- DEBUG --- Log para ver los valores que se pasarán a KPICards
  console.log('DEBUG Dashboard: Props para KPICards:', { totalUSD, totalVES, totalFacturas, totalClientes, cambioIngresos, cambioFacturas, cambioClientes, selectedRate });


  return (
    <Box sx={{ p: 3 }}>
      {/* Notificación */}
      {notification.open && (
        <Box
          sx={{
            position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, mt: 1, maxWidth: '80%', display: 'flex', alignItems: 'center',
            bgcolor: notification.type === 'success' ? '#43a047' : notification.type === 'error' ? '#e53935' : '#1e88e5',
            color: 'white', px: 2, py: 1, borderRadius: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          <Typography variant="body2">{notification.message}</Typography>
          <IconButton size="small" onClick={handleCloseNotification} sx={{ ml: 1, color: 'white' }}>
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

      {/* --- Tarjetas KPI - CORREGIDO --- */}
      <KPICards
        // Pasar los valores extraídos del objeto kpis
        totalUSD={totalUSD}
        totalVES={totalVES}
        totalFacturas={totalFacturas}
        totalClientes={totalClientes}
        cambioIngresos={cambioIngresos}
        cambioFacturas={cambioFacturas}
        cambioClientes={cambioClientes}
        // Pasar la tasa de cambio del estado local y el handler
        exchangeRate={selectedRate} // Usar la tasa del estado local
        onRateChange={handleRateChange} // Pasar el handler para actualizar estado local
        // Pasar otros KPIs si los necesitas (ej: ventasAyerUSD, etc.)
        // ventasAyerUSD={safeKpis.ventasAyerUSD || 0}
        // ventasMesPasadoUSD={safeKpis.ventasMesPasadoUSD || 0}
      />

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Facturación Diaria */}
        <Grid item xs={12}>
          <DailyBillingChart
            data={dashboardData?.facturacionDiaria || []}
            title="Facturación Diaria"
            exchangeRate={selectedRate} // Usar tasa del estado local
          />
        </Grid>

        {/* Gráfico de Facturación Mensual */}
        <Grid item xs={12}>
          <SalesChart data={facturasPorMes || []} />
        </Grid>
      </Grid>

      {/* Facturación Anual */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <AnnualBillingChart data={Array.isArray(facturasPorAnio) ? facturasPorAnio : []} />
        </Grid>
      </Grid>

      {/* Transacciones Recientes */}
      <LatestTransactions
        invoices={facturasRecientes || []}
        clients={clientesRecientes || []}
      />
    </Box>
  );
};

export default Dashboard;
