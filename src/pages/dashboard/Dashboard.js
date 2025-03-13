import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  Button,
  Chip,
  CircularProgress,
  Tooltip
} from '@mui/material';

// Importamos los iconos necesarios
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';

// Importamos los componentes de gráficos desde recharts
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Importamos nuestro hook personalizado
import { useDashboard } from '../../hooks/useDashboard';

// Importamos componentes personalizados
import VESSummaryCard from './components/VESSummaryCard';
import AnnualBillingChart from './components/AnnualBillingChart';
import DateRangeSelector from './components/DateRangeSelector';

// Colores para gráficos y KPIs
const COLORS = ['#4477CE', '#66BB6A', '#FFA726', '#EF5350'];
const PIE_COLORS = ['#4477CE', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#26C6DA', '#EC407A'];

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
  
  // Utilizamos el hook personalizado
  const { 
    loading, 
    kpis, 
    facturasPorMes, 
    facturasPorTipo,
    facturasPorAnio,
    facturasRecientes, 
    clientesRecientes 
  } = useDashboard(timeRange);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handler para actualizar el rango de fechas
  const handleDateRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  // Función para formatear valores monetarios
  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Selector de rango de fechas */}
      <DateRangeSelector onChange={handleDateRangeChange} />
      
      {/* Tarjetas de KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* KPI 1: USD */}
        <Grid item xs={12} md={6} lg={3}>
          <Card 
            sx={{ 
              bgcolor: '#1E1E1E', 
              borderRadius: 2,
              border: '1px solid #333',
              height: '100%',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Box sx={{ 
                position: 'absolute',
                top: '-15px',
                right: '15px',
                zIndex: 1
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#66BB6A', // Verde para USD
                    width: 50,
                    height: 50,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <AttachMoneyIcon />
                </Avatar>
              </Box>
              
              <Typography variant="h6" color="#CCC" sx={{ mb: 1 }}>
                💵 Ingresos USD
              </Typography>
              
              {/* Total USD */}
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '2.5rem',
                  mb: 1
                }}
              >
                {formatCurrency(totalUSD, 'USD')}
              </Typography>
              
              {/* Indicador de cambio */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: kpis.cambioIngresos >= 0 ? '#4cd964' : '#ff3b30', 
                mt: 2 
              }}>
                {kpis.cambioIngresos >= 0 ? 
                  <TrendingUpIcon fontSize="small" /> : 
                  <TrendingDownIcon fontSize="small" />
                }
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {kpis.cambioIngresos >= 0 ? '+' : ''}{kpis.cambioIngresos}% este mes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* KPI 2: VES - REEMPLAZADO POR COMPONENTE ESPECIALIZADO */}
        <Grid item xs={12} md={6} lg={3}>
          <VESSummaryCard
            title="Ingresos VES"
            value={totalVES}
            growth={kpis.cambioIngresos}
            onRateChange={(rate) => setSelectedRate(rate)}
          />
        </Grid>
        
        {/* KPI 3: Operaciones */}
        <Grid item xs={12} md={6} lg={3}>
          <Card 
            sx={{ 
              bgcolor: '#1E1E1E', 
              borderRadius: 2,
              border: '1px solid #333',
              height: '100%',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Box sx={{ 
                position: 'absolute',
                top: '-15px',
                right: '15px',
                zIndex: 1
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#FFA726',
                    width: 50,
                    height: 50,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <ReceiptIcon />
                </Avatar>
              </Box>
              
              <Typography variant="h6" color="#CCC" sx={{ mb: 1 }}>
                📊 Facturas
              </Typography>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '2.5rem',
                  mb: 1
                }}
              >
                {kpis.totalFacturas || 0}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: kpis.cambioFacturas >= 0 ? '#4cd964' : '#ff3b30', 
                mt: 2 
              }}>
                {kpis.cambioFacturas >= 0 ? 
                  <TrendingUpIcon fontSize="small" /> : 
                  <TrendingDownIcon fontSize="small" />
                }
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {kpis.cambioFacturas >= 0 ? '+' : ''}{kpis.cambioFacturas}% este mes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 4: Clientes */}
        <Grid item xs={12} md={6} lg={3}>
          <Card 
            sx={{ 
              bgcolor: '#1E1E1E', 
              borderRadius: 2,
              border: '1px solid #333',
              height: '100%',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Box sx={{ 
                position: 'absolute',
                top: '-15px',
                right: '15px',
                zIndex: 1
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#EF5350',
                    width: 50,
                    height: 50,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <PeopleIcon />
                </Avatar>
              </Box>
              
              <Typography variant="h6" color="#CCC" sx={{ mb: 1 }}>
                👥 Clientes
              </Typography>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '2.5rem',
                  mb: 1
                }}
              >
                {kpis.totalClientes || 0}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: kpis.cambioClientes >= 0 ? '#4cd964' : '#ff3b30', 
                mt: 2 
              }}>
                {kpis.cambioClientes >= 0 ? 
                  <TrendingUpIcon fontSize="small" /> : 
                  <TrendingDownIcon fontSize="small" />
                }
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {kpis.cambioClientes >= 0 ? '+' : ''}{kpis.cambioClientes}% este mes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Facturación Mensual */}
        <Grid item xs={12} lg={8}>
          <Card 
            sx={{ 
              borderRadius: 2, 
              bgcolor: '#1E1E1E',
              border: '1px solid #333',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" color="white">Facturación Mensual</Typography>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={facturasPorMes}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <RechartsTooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Total']}
                      labelFormatter={(label) => `Mes: ${label}`}
                      contentStyle={{ backgroundColor: '#2d2d2d', border: 'none', borderRadius: '8px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#4477CE" 
                      strokeWidth={3}
                      dot={{ r: 6, fill: '#4477CE', strokeWidth: 0 }}
                      activeDot={{ r: 8, fill: '#4477CE', strokeWidth: 0 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Distribución por Moneda */}
        <Grid item xs={12} lg={4}>
          <Card 
            sx={{ 
              borderRadius: 2, 
              bgcolor: '#1E1E1E',
              border: '1px solid #333',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" color="white">Distribución por Moneda</Typography>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Box sx={{ 
                height: 280, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {/* Gráfico de pastel centrado */}
                <Box sx={{ height: 200, width: '100%', maxWidth: 300, mx: 'auto' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={facturasPorTipo}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {facturasPorTipo.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [`${value}%`, 'Porcentaje']}
                        contentStyle={{ backgroundColor: '#2d2d2d', border: 'none', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                
                {/* Leyenda con mejor alineación */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  width: '100%', 
                  gap: 1, 
                  mt: 2,
                  flexWrap: 'wrap'
                }}>
                  {facturasPorTipo.map((entry, index) => (
                    <Chip 
                      key={index}
                      label={`${entry.name} ${entry.value}%`}
                      sx={{ 
                        bgcolor: PIE_COLORS[index % PIE_COLORS.length],
                        color: 'white',
                        fontWeight: 'bold',
                        my: 0.5
                      }} 
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
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
            <Tab label="Facturas Recientes" />
            <Tab label="Clientes Recientes" />
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
                Nueva Factura
              </Button>
            </Box>
            
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 700, width: '100%' }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
                  bgcolor: '#2A2A2A',
                  borderRadius: 1,
                  p: 2,
                  fontWeight: 'bold'
                }}>
                  <Typography variant="subtitle2" color="#CCC">Nº Factura</Typography>
                  <Typography variant="subtitle2" color="#CCC">Cliente</Typography>
                  <Typography variant="subtitle2" color="#CCC">Fecha</Typography>
                  <Typography variant="subtitle2" color="#CCC">Total</Typography>
                  <Typography variant="subtitle2" color="#CCC">Estado</Typography>
                </Box>
                
                {facturasRecientes.length > 0 ? (
                  facturasRecientes.map((factura) => (
                    <Box key={factura.id} sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
                      p: 2,
                      borderBottom: '1px solid #333'
                    }}>
                      <Typography variant="body2" color="white">{factura.id}</Typography>
                      <Typography variant="body2" color="white">{factura.cliente}</Typography>
                      <Typography variant="body2" color="white">{factura.fecha}</Typography>
                      <Typography variant="body2" color="white">${factura.total.toLocaleString()}</Typography>
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
        
        {/* Contenido de Clientes Recientes - MEJORADO CON COLUMNAS SEPARADAS */}
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
                Nuevo Cliente
              </Button>
            </Box>
            
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 800, width: '100%' }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 2fr 2fr 1fr', // 4 columnas ahora
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
                      gridTemplateColumns: '2fr 2fr 2fr 1fr', // 4 columnas ahora
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