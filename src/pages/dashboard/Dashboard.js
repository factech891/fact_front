import React, { useState } from 'react';
import { 
  Grid, Card, CardContent, Typography, Box, 
  IconButton, Menu, MenuItem, Button 
} from '@mui/material';
import { 
  TrendingUp, Group, Receipt, Inventory,
  ArrowUpward, ArrowDownward, MoreVert,
  CalendarMonth, ShowChart, PieChart as PieChartIcon
} from '@mui/icons-material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, 
  Pie, Cell 
} from 'recharts';

const SummaryCard = ({ title, value, icon: Icon, trend, color = 'primary', onClick }) => (
  <Card 
    sx={{ 
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      }
    }}
    onClick={onClick}
  >
    <CardContent>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={8}>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {trend > 0 ? (
                <ArrowUpward color="success" fontSize="small" />
              ) : (
                <ArrowDownward color="error" fontSize="small" />
              )}
              <Typography 
                variant="body2"
                color={trend > 0 ? 'success.main' : 'error.main'}
                sx={{ ml: 0.5 }}
              >
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={4}>
          <Box 
            sx={{ 
              bgcolor: `${color}.lighter`,
              borderRadius: '50%',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 1
            }}
          >
            <Icon sx={{ 
              fontSize: 32, 
              color: `${color}.main`,
              filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))'
            }} />
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [timeRange, setTimeRange] = useState('6M');

  // Datos de ejemplo mejorados
  const salesData = [
    { mes: 'Ene', ventas: 4000, pedidos: 240, promedio: 167, meta: 4200 },
    { mes: 'Feb', ventas: 3000, pedidos: 198, promedio: 152, meta: 4200 },
    { mes: 'Mar', ventas: 5000, pedidos: 305, promedio: 164, meta: 4200 },
    { mes: 'Abr', ventas: 4600, pedidos: 275, promedio: 167, meta: 4200 },
    { mes: 'May', ventas: 6000, pedidos: 349, promedio: 172, meta: 4200 },
    { mes: 'Jun', ventas: 5400, pedidos: 310, promedio: 174, meta: 4200 }
  ];

  const pieData = [
    { name: 'Producto A', value: 400 },
    { name: 'Producto B', value: 300 },
    { name: 'Producto C', value: 300 },
    { name: 'Producto D', value: 200 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Panel de Control
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            startIcon={<CalendarMonth />}
            variant="outlined"
            onClick={handleMenuClick}
          >
            {timeRange}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { setTimeRange('1M'); handleMenuClose(); }}>1 Mes</MenuItem>
            <MenuItem onClick={() => { setTimeRange('3M'); handleMenuClose(); }}>3 Meses</MenuItem>
            <MenuItem onClick={() => { setTimeRange('6M'); handleMenuClose(); }}>6 Meses</MenuItem>
            <MenuItem onClick={() => { setTimeRange('1Y'); handleMenuClose(); }}>1 Año</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Ventas Totales"
            value="$23,000"
            icon={TrendingUp}
            trend={2.5}
            color="primary"
            onClick={() => console.log('Ver detalles de ventas')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Clientes"
            value="85"
            icon={Group}
            trend={-0.8}
            color="info"
            onClick={() => console.log('Ver detalles de clientes')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Facturas"
            value="132"
            icon={Receipt}
            trend={1.2}
            color="warning"
            onClick={() => console.log('Ver detalles de facturas')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Productos"
            value="45"
            icon={Inventory}
            trend={3.1}
            color="success"
            onClick={() => console.log('Ver detalles de productos')}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShowChart color="primary" />
                  <Typography variant="h6">
                    Tendencia de Ventas
                  </Typography>
                </Box>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <Box sx={{ height: 400, width: '100%' }}>
                <ResponsiveContainer>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis 
                      dataKey="mes" 
                      stroke="#666"
                      tick={{ fill: '#666' }}
                    />
                    <YAxis 
                      stroke="#666"
                      tick={{ fill: '#666' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="#2196F3" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Ventas"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="meta" 
                      stroke="#FF9800" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Meta"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 3 
              }}>
                <PieChartIcon color="primary" />
                <Typography variant="h6">
                  Distribución de Ventas
                </Typography>
              </Box>
              <Box sx={{ height: 400, width: '100%' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;