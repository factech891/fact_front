import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent,
  IconButton,
  Tabs,
  Tab,
  Button,
  CircularProgress
} from '@mui/material';

// Importamos los iconos necesarios
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Importamos los componentes personalizados
import USDSummaryCard from './components/USDSummaryCard';
import VESSummaryCard from './components/VESSummaryCard';
import AnnualBillingChart from './components/AnnualBillingChart';
import DateRangeSelector from './components/DateRangeSelector';
import SummaryCard from './components/SummaryCard';
import SalesChart from './components/SalesChart';
import CurrencyDistribution from './components/CurrencyDistribution';

// Importamos nuestro hook personalizado
import { useDashboard } from '../../hooks/useDashboard';

// Componente principal del Dashboard
const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  
  // Estado para la tasa de cambio seleccionada
  const [selectedRate, setSelectedRate] = useState(35.68);
  
  // Estado para el rango de fechas
  const [timeRange, setTimeRange] = useState(() => {
    const now = new Date();
    return {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1), // Primer día del mes actual
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0) // Último día del mes actual
    };
  });
  
  // Utilizamos el hook personalizado pasando la tasa de cambio seleccionada
  const { 
    loading, 
    kpis, 
    facturasPorMes, 
    facturasPorTipo,
    facturasPorAnio,
    facturasRecientes, 
    clientesRecientes 
  } = useDashboard(timeRange, selectedRate);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handler para actualizar el rango de fechas
  const handleDateRangeChange = (newRange) => {
    setTimeRange(newRange);
  };
  
  // Handler para actualizar la tasa de cambio
  const handleRateChange = (newRate) => {
    setSelectedRate(newRate);
  };
  
  // Handlers para navegación a crear facturas/clientes
  const handleNewInvoice = () => {
    navigate('/invoices?action=new');
  };
  
  const handleNewClient = () => {
    navigate('/clients?action=new');
  };

  if (loading) {
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
      {/* Selector de rango de fechas */}
      <DateRangeSelector onChange={handleDateRangeChange} />
      
      {/* Tarjetas de KPIs - USANDO COMPONENTES REUTILIZABLES */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* KPI 1: USD - Con referencia en VES */}
        <Grid item xs={12} md={6} lg={3}>
          <USDSummaryCard 
            title="💵 Ingresos USD"
            value={totalUSD}
            growth={kpis.cambioIngresos}
            exchangeRate={selectedRate}
          />
        </Grid>
        
        {/* KPI 2: VES - Con referencia en USD */}
        <Grid item xs={12} md={6} lg={3}>
          <VESSummaryCard
            title="💰 Ingresos VES"
            value={totalVES}
            growth={kpis.cambioIngresos}
            onRateChange={handleRateChange}
            currentRate={selectedRate}
          />
        </Grid>

        {/* KPI 3: Facturas */}
        <Grid item xs={12} md={6} lg={3}>
          <SummaryCard 
            title="📊 Facturas"
            value={kpis.totalFacturas || 0}
            growth={kpis.cambioFacturas}
            icon="receipt"
            avatarColor="#FFA726"
          />
        </Grid>
        
        {/* KPI 4: Clientes */}
        <Grid item xs={12} md={6} lg={3}>
          <SummaryCard 
            title="👥 Clientes"
            value={totalClientes}
            growth={kpis.cambioClientes}
            icon="people"
            avatarColor="#4477CE"
          />
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
          <AnnualBillingChart data={facturasPorAnio} />
        </Grid>
      </Grid>

      {/* Pestañas de Facturas/Clientes */}
      <Card 
        sx={{ 
          borderRadius: 2, 
          bgcolor: '#1E1E1E',
          border: '1px solid #333',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ 
              '& .MuiTab-root': { color: '#888' },
              '& .Mui-selected': { color: 'white' },
              '& .MuiTabs-indicator': { backgroundColor: '#4477CE' }
            }}
          >
            <Tab label="FACTURAS RECIENTES" />
            <Tab label="CLIENTES RECIENTES" />
          </Tabs>
        </Box>
        
        {/* Contenido de Facturas Recientes */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="white">Facturas Recientes</Typography>
              <Button 
                startIcon={<AddIcon />} 
                variant="contained" 
                onClick={handleNewInvoice}
                sx={{ 
                  borderRadius: 2,
                  bgcolor: '#4477CE',
                  '&:hover': { bgcolor: '#3366BB' }
                }}
              >
                NUEVA FACTURA
              </Button>
            </Box>
            
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 700, width: '100%' }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
                  bgcolor: '#2A2A2A',
                  borderRadius: 1,
                  p: 2,
                  fontWeight: 'bold'
                }}>
                  <Typography variant="subtitle2" color="#CCC">Nº Factura</Typography>
                  <Typography variant="subtitle2" color="#CCC">Cliente</Typography>
                  <Typography variant="subtitle2" color="#CCC">Fecha</Typography>
                  <Typography variant="subtitle2" color="#CCC">Total</Typography>
                  <Typography variant="subtitle2" color="#CCC">Moneda</Typography>
                  <Typography variant="subtitle2" color="#CCC">Estado</Typography>
                </Box>
                
                {facturasRecientes.length > 0 ? (
                  facturasRecientes.map((factura) => (
                    <Box key={factura.id} sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
                      p: 2,
                      borderBottom: '1px solid #333'
                    }}>
                      <Typography variant="body2" color="white">{factura.id}</Typography>
                      <Typography variant="body2" color="white">{factura.cliente}</Typography>
                      <Typography variant="body2" color="white">{factura.fecha}</Typography>
                      <Typography variant="body2" color="white">{factura.total.toLocaleString()}</Typography>
                      <Typography variant="body2" color="white">{factura.moneda}</Typography>
                      <Typography 
                        variant="body2" 
                        color="white"
                        sx={{ textWrap: 'nowrap' }}
                      >
                        {factura.estado}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="white">No hay facturas disponibles</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
        
        {/* Contenido de Clientes Recientes */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="white">Clientes Recientes</Typography>
              <Button 
                startIcon={<AddIcon />} 
                variant="contained" 
                onClick={handleNewClient}
                sx={{ 
                  borderRadius: 2,
                  bgcolor: '#4477CE',
                  '&:hover': { bgcolor: '#3366BB' }
                }}
              >
                NUEVO CLIENTE
              </Button>
            </Box>
            
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 800, width: '100%' }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 2fr 2fr 1fr',
                  bgcolor: '#2A2A2A',
                  borderRadius: 1,
                  p: 2,
                  fontWeight: 'bold'
                }}>
                  <Typography variant="subtitle2" color="#CCC">Nombre</Typography>
                  <Typography variant="subtitle2" color="#CCC">Correo</Typography>
                  <Typography variant="subtitle2" color="#CCC">Documento</Typography>
                  <Typography variant="subtitle2" color="#CCC" align="right">Facturas</Typography>
                </Box>
                
                {clientesRecientes.length > 0 ? (
                  clientesRecientes.map((cliente) => (
                    <Box key={cliente.id} sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '2fr 2fr 2fr 1fr',
                      p: 2,
                      borderBottom: '1px solid #333'
                    }}>
                      <Typography variant="body2" color="white">{cliente.nombre}</Typography>
                      <Typography 
                        variant="body2" 
                        color="white"
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {cliente.email ? `📧 ${cliente.email}` : ''}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="white"
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {cliente.documento ? `📝 ${cliente.documento}` : ''}
                      </Typography>
                      <Typography variant="body2" color="white" align="right">{cliente.facturas}</Typography>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="white">No hay clientes disponibles</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default Dashboard;