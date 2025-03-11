import React, { useState } from 'react';
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
  Chip
} from '@mui/material';

// Importamos los iconos necesarios
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Importamos los componentes de gráficos desde recharts
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Datos de ejemplo para los gráficos
const facturasPorMes = [
  { name: 'Ene', total: 4000 },
  { name: 'Feb', total: 3000 },
  { name: 'Mar', total: 5000 },
  { name: 'Abr', total: 4500 },
  { name: 'May', total: 6000 },
  { name: 'Jun', total: 5500 },
];

const facturasPorTipo = [
  { name: 'Exportación', value: 45 },
  { name: 'Importación', value: 35 },
  { name: 'Nacional', value: 20 },
];

const clientesRecientes = [
  { id: 1, nombre: 'Global Logistics Inc.', pais: 'USA', facturas: 12 },
  { id: 2, nombre: 'Transportes Marítimos S.A.', pais: 'España', facturas: 8 },
  { id: 3, nombre: 'Carga Express', pais: 'México', facturas: 5 },
  { id: 4, nombre: 'Pacific Shipping Ltd.', pais: 'China', facturas: 15 },
];

const facturasRecientes = [
  { id: 'INV-0012', cliente: 'Global Logistics Inc.', fecha: '10/03/2025', total: 5430, estado: 'Pagada' },
  { id: 'INV-0013', cliente: 'Transportes Marítimos S.A.', fecha: '08/03/2025', total: 2150, estado: 'Pendiente' },
  { id: 'INV-0014', cliente: 'Carga Express', fecha: '05/03/2025', total: 3670, estado: 'Pagada' },
  { id: 'INV-0015', cliente: 'Pacific Shipping Ltd.', fecha: '03/03/2025', total: 7890, estado: 'Vencida' },
];

// Colores para gráficos y KPIs
const COLORS = ['#4477CE', '#66BB6A', '#FFA726', '#EF5350'];
const PIE_COLORS = ['#4477CE', '#66BB6A', '#FFA726'];

// Componente principal del Dashboard
const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Función para formatear valores monetarios
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Tarjetas de KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* KPI 1: Ingresos */}
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
                    bgcolor: '#4477CE',
                    width: 50,
                    height: 50,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <AttachMoneyIcon />
                </Avatar>
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '2.5rem',
                  mb: 1
                }}
              >
                $23,450
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#4cd964', 
                mt: 2 
              }}>
                <TrendingUpIcon fontSize="small" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  +5.2% este mes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* KPI 2: Operaciones */}
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
                  <LocalShippingIcon />
                </Avatar>
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '2.5rem',
                  mb: 1
                }}
              >
                132
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#4cd964', 
                mt: 2 
              }}>
                <TrendingUpIcon fontSize="small" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  +3.1% este mes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* KPI 3: Clientes */}
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
                    bgcolor: '#4477CE',
                    width: 50,
                    height: 50,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <PeopleIcon />
                </Avatar>
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '2.5rem',
                  mb: 1
                }}
              >
                85
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#ff3b30', 
                mt: 2 
              }}>
                <TrendingDownIcon fontSize="small" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  -0.8% este mes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 4: Facturas */}
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
                    bgcolor: '#66BB6A',
                    width: 50,
                    height: 50,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <ReceiptIcon />
                </Avatar>
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '2.5rem',
                  mb: 1
                }}
              >
                114
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#4cd964', 
                mt: 2 
              }}>
                <TrendingDownIcon fontSize="small" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  -2.5% este mes
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
                    <Tooltip 
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

        {/* Gráfico de Distribución por Tipo - CORREGIDO */}
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
                <Typography variant="h6" color="white">Distribución por Tipo</Typography>
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
                      <Tooltip 
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
                
                {facturasRecientes.map((factura) => (
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
                    <Chip 
                      label={factura.estado} 
                      size="small"
                      sx={{ 
                        width: 'fit-content',
                        bgcolor: 
                          factura.estado === 'Pagada' ? '#66BB6A' : 
                          factura.estado === 'Pendiente' ? '#FFA726' : 
                          '#EF5350',
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Box>
                ))}
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
              <Box sx={{ minWidth: 600, width: '100%' }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '3fr 1fr 1fr',
                  bgcolor: '#2A2A2A',
                  borderRadius: 1,
                  p: 2,
                  fontWeight: 'bold'
                }}>
                  <Typography variant="subtitle2" color="#CCC">Nombre</Typography>
                  <Typography variant="subtitle2" color="#CCC">País</Typography>
                  <Typography variant="subtitle2" color="#CCC">Facturas</Typography>
                </Box>
                
                {clientesRecientes.map((cliente) => (
                  <Box key={cliente.id} sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '3fr 1fr 1fr',
                    p: 2,
                    borderBottom: '1px solid #333'
                  }}>
                    <Typography variant="body2" color="white">{cliente.nombre}</Typography>
                    <Typography variant="body2" color="white">{cliente.pais}</Typography>
                    <Typography variant="body2" color="white">{cliente.facturas}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default Dashboard;