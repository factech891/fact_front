// src/pages/dashboard/Dashboard.js
import { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { 
  TrendingUp, Group, Receipt, Inventory
} from '@mui/icons-material';

// Componentes
import SummaryCard from './components/SummaryCard';
import TimeRangeSelector from './components/TimeRangeSelector';
import SalesChart from './components/SalesChart';
import ProductDistribution from './components/ProductDistribution';

// Constantes
import { 
  MOCK_SALES_DATA, 
  MOCK_PRODUCT_DATA 
} from './constants/dashboardConstants';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('6M');

  // Props para las tarjetas de resumen
  const summaryCards = [
    {
      title: "Ventas Totales",
      value: "$23,000",
      icon: TrendingUp,
      trend: 2.5,
      color: "primary",
      onClick: () => console.log('Ver detalles de ventas')
    },
    {
      title: "Clientes",
      value: "85",
      icon: Group,
      trend: -0.8,
      color: "info",
      onClick: () => console.log('Ver detalles de clientes')
    },
    {
      title: "Facturas",
      value: "132",
      icon: Receipt,
      trend: 1.2,
      color: "warning",
      onClick: () => console.log('Ver detalles de facturas')
    },
    {
      title: "Productos",
      value: "45",
      icon: Inventory,
      trend: 3.1,
      color: "success",
      onClick: () => console.log('Ver detalles de productos')
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header y Selector de Tiempo */}
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
        <TimeRangeSelector 
          value={timeRange} 
          onChange={setTimeRange} 
        />
      </Box>

      {/* Tarjetas de Resumen */}
      <Grid container spacing={3}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <SummaryCard {...card} />
          </Grid>
        ))}

        {/* Gráficos */}
        <Grid item xs={12} md={8}>
          <SalesChart data={MOCK_SALES_DATA} />
        </Grid>

        <Grid item xs={12} md={4}>
          <ProductDistribution data={MOCK_PRODUCT_DATA} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;