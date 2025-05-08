// src/pages/dashboard/Dashboard.js
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

// Componentes
import SalesChart from './components/SalesChart';
import DailyBillingChart from './components/DailyBillingChart';
import AnnualBillingChart from './components/AnnualBillingChart';
import LatestTransactions from './components/LatestTransactions';
import KPICards from './components/KPICards';
import WelcomeHeaderIntegrated from './components/WelcomeHeaderIntegrated';

// Hooks y servicios
import { useDashboard } from '../../hooks/useDashboard';
import { useCompany } from '../../hooks/useCompany';
import { TIME_RANGES } from './constants/dashboardConstants';
import AuthContext from '../../context/AuthContext';

// Componente principal del Dashboard
const Dashboard = () => {
  // Obtener datos de autenticación - CORREGIDO: Obtenemos currentUser, token del contexto
  const { currentUser, token } = useContext(AuthContext);
  const { company } = useCompany(); // Utilizamos el hook useCompany para obtener datos de la empresa

  // Estados locales del Dashboard
  const [selectedRate, setSelectedRate] = useState(null);
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  const [selectedRange, setSelectedRange] = useState('thisMonth');
  const [customDateRange, setCustomDateRange] = useState(null);
  const [dashboardData, setDashboardData] = useState({ facturacionDiaria: [] });
  const [dataLoadingError, setDataLoadingError] = useState(null);
  const [datosGraficoVentas, setDatosGraficoVentas] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(''); // Para la fecha actual

  // Hook useDashboard para obtener datos procesados
  const {
    loading: dashboardHookLoading,
    error: dashboardHookError,
    kpis,
    facturasPorMesHistorico,
    facturasPorAnio = [],
    facturasRecientes,
    clientesRecientes,
    exchangeRate: rateFromHook,
    timeRange
  } = useDashboard(selectedRange, customDateRange);

  // Actualizar la fecha y hora actual
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      setCurrentDateTime(now.toLocaleDateString('es-ES', options));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Cargar datos específicos del dashboard
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
      }
    };
    loadDashboardData();
  }, [token]);

  // Sincronizar selectedRate con la tasa del hook cuando se cargue
  useEffect(() => {
    if (rateFromHook !== null && !dashboardHookLoading) {
      setSelectedRate(rateFromHook);
      setIsLoadingRate(false);
    }
  }, [rateFromHook, dashboardHookLoading]);

  // Transformar datos para el gráfico de ventas
  useEffect(() => {
    if (!dashboardHookLoading && facturasPorMesHistorico && facturasPorMesHistorico.length > 0) {
      console.log("Datos originales:", facturasPorMesHistorico);
      
      const datosTransformados = facturasPorMesHistorico.map(item => {
        // Crear un objeto con los datos para facturación
        const datosMes = {
          name: item.mes || item.month || item.nombre || '', 
          periodo: item.periodo || item.period || item.mes || '',
          
          // Intentar todas las posibles propiedades para montos USD
          facturacionUSD: 
            item.facturacionUSD || 
            item.montoUSD || 
            item.usd || 
            item.totalUSD || 
            item.USD || 
            item.facturas?.usd || 
            item.monto?.usd || 
            (item.montos?.USD) || 
            0,
          
          // Intentar todas las posibles propiedades para montos VES
          facturacionVES: 
            item.facturacionVES || 
            item.montoVES || 
            item.ves || 
            item.totalVES || 
            item.VES || 
            item.facturas?.ves || 
            item.monto?.ves || 
            (item.montos?.VES) || 
            0,
          
          // Intentar todas las posibles propiedades para metas USD
          metasUSD: 
            item.metasUSD || 
            item.metaUSD || 
            item.objetivoUSD || 
            item.targetUSD || 
            (item.metas?.USD) || 
            (item.meta?.USD) || 
            1200, // Valor predeterminado para pruebas
          
          // Intentar todas las posibles propiedades para metas VES
          metasVES: 
            item.metasVES || 
            item.metaVES || 
            item.objetivoVES || 
            item.targetVES || 
            (item.metas?.VES) || 
            (item.meta?.VES) || 
            42000, // Valor predeterminado para pruebas
        };
        
        return datosMes;
      });
      
      console.log("Datos finales transformados:", datosTransformados);
      setDatosGraficoVentas(datosTransformados);
    } else if (!dashboardHookLoading) {
      // Si no hay datos o ya terminó de cargar pero no hay datos
      console.log("No hay datos de facturas por mes histórico, usando datos de demostración");
      const datosDemostración = [
        { name: 'Ene', periodo: 'Enero 2023', facturacionUSD: 800, facturacionVES: 28000, metasUSD: 820, metasVES: 29000 },
        { name: 'Feb', periodo: 'Febrero 2023', facturacionUSD: 950, facturacionVES: 33000, metasUSD: 940, metasVES: 33500 },
        { name: 'Mar', periodo: 'Marzo 2023', facturacionUSD: 1100, facturacionVES: 37000, metasUSD: 1150, metasVES: 39000 }
      ];
      setDatosGraficoVentas(datosDemostración);
    }
  }, [facturasPorMesHistorico, dashboardHookLoading]);

  // Manejador para actualizar la tasa de cambio
  const handleRateChange = (newRate) => {
    setSelectedRate(newRate);
    setNotification({
        open: true,
        message: `Tasa actualizada localmente: ${newRate.toFixed(2)} VES/USD`,
        type: 'info'
    });
    setTimeout(() => setNotification(prev => ({ ...prev, open: false })), 3000);
  };

  // Manejador para cambiar el rango de tiempo
  const handleRangeChange = (newRange) => {
    console.log(`Dashboard: Cambiando rango a: ${newRange}`);
    setSelectedRange(newRange);

    const now = new Date();
    let calendarDate = null;

    if (newRange === 'lastMonth') {
      calendarDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    } else if (newRange === 'thisMonth') {
      calendarDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (calendarDate) {
      const startDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
      const endDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0, 23, 59, 59);
      setCustomDateRange({ startDate, endDate });
    }

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
    setSelectedRange('custom'); // Asegurar que se actualice el rango seleccionado
    const startDate = range.startDate.toLocaleDateString('es-ES');
    const endDate = range.endDate.toLocaleDateString('es-ES');
    setNotification({ open: true, message: `Período: ${startDate} al ${endDate}`, type: 'info' });
    setTimeout(() => setNotification(prev => ({ ...prev, open: false })), 3000);
  };

  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification({ open: false, message: '', type: 'info' });
  };

  // Función auxiliar para mostrar el rol en formato legible
  const getUserRoleDisplay = (role) => { 
    if (!role) return null;
    const roleMap = { 
      'admin': 'Administrador', 
      'user': 'Usuario',
      'facturador': 'Facturador',
      'platform_admin': 'Administrador de Plataforma'
    };
    return roleMap[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Estado de carga general
  const combinedLoading = dashboardHookLoading || isLoadingRate;

  // Mostrar error si falló la carga de datos
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

  // Extracción de datos de KPIs
  const safeKpis = kpis || {};
  const totalUSD = safeKpis.totalPorMoneda?.find(m => m.moneda === 'USD')?.total || 0;
  const totalVES = safeKpis.totalPorMoneda?.find(m => m.moneda === 'VES')?.total || 0;
  const totalFacturas = safeKpis.totalFacturas || 0;
  const totalClientes = safeKpis.totalClientes || 0; // Valor para clientes activos
  const cambioIngresos = safeKpis.cambioIngresos || 0;
  const cambioFacturas = safeKpis.cambioFacturas || 0;
  const cambioClientes = safeKpis.cambioClientes || 0;

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

      {/* WelcomeHeaderIntegrated - Este componente ahora incluye la selección de rango de tiempo */}
      <WelcomeHeaderIntegrated
        userName={currentUser?.name || currentUser?.nombre || currentUser?.username || 'Usuario'} 
        companyName={company?.name} // Usamos el nombre de la empresa del hook useCompany
        userRole={currentUser?.role ? getUserRoleDisplay(currentUser.role) : undefined}
        currentDateTime={currentDateTime}
        selectedRange={selectedRange}
        customDateRange={customDateRange}
        onRangeChange={handleRangeChange}
        onCustomRangeChange={handleCustomRangeChange}
      />

      {/* Tarjetas KPI */}
      <KPICards
        totalUSD={totalUSD}
        totalVES={totalVES}
        totalFacturas={totalFacturas}
        totalClientes={totalClientes} // Pasamos el valor de clientes activos
        cambioIngresos={cambioIngresos}
        cambioFacturas={cambioFacturas}
        cambioClientes={cambioClientes}
        exchangeRate={selectedRate}
        onRateChange={handleRateChange}
      />

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Facturación Diaria */}
        <Grid item xs={12}>
          <DailyBillingChart
            data={dashboardData?.facturacionDiaria || []}
            title="Facturación Diaria"
            exchangeRate={selectedRate}
            timeRange={timeRange}
          />
        </Grid>

        {/* Gráfico de Facturación Mensual */}
        <Grid item xs={12}>
          <SalesChart 
            title="Facturación Mensual vs Metas"
            data={datosGraficoVentas}
            isLoading={dashboardHookLoading}
            error={dashboardHookError}
          />
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