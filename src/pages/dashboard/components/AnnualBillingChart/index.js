import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Tabs, 
  Tab,
  Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const COLORS = ['#4477CE', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC'];

const AnnualBillingChart = ({ data = [] }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return (
      <Card 
        sx={{ 
          borderRadius: 2, 
          bgcolor: '#1E1E1E',
          border: '1px solid #333',
          height: '100%'
        }}
      >
        <CardContent>
          <Typography variant="h6" color="white" align="center">
            No hay datos de facturación anual disponibles
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  // Ordenar datos por año
  const sortedData = [...data].sort((a, b) => a.anio - b.anio);
  
  // Preparar datos según la pestaña seleccionada
  const renderData = () => {
    // Vista por años (total)
    if (selectedTab === 0) {
      return sortedData.map(item => ({
        name: item.anio.toString(),
        total: item.total,
        facturas: item.facturas
      }));
    } 
    // Vista detallada del año seleccionado
    else {
      const selectedYear = sortedData[selectedTab - 1];
      return selectedYear.porMes.map((total, index) => ({
        name: MONTHS[index],
        total: total,
        facturas: 0 // No tenemos este detalle, pero podríamos agregarlo
      }));
    }
  };
  
  const chartData = renderData();
  
  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <Card 
      sx={{ 
        borderRadius: 2, 
        bgcolor: '#1E1E1E',
        border: '1px solid #333',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" color="white">Facturación Anual</Typography>
            <Tooltip title="Útil para declaraciones de impuestos">
              <IconButton size="small" sx={{ color: '#AAA', ml: 1 }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <IconButton size="small" sx={{ color: 'white' }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{ 
            mb: 2,
            '& .MuiTab-root': { color: '#888', minWidth: 50 },
            '& .Mui-selected': { color: 'white' },
            '& .MuiTabs-indicator': { backgroundColor: '#4477CE' }
          }}
        >
          <Tab label="Resumen" />
          {sortedData.map(item => (
            <Tab 
              key={item.anio} 
              label={item.anio} 
              sx={{ fontSize: '0.85rem', py: 1 }}
            />
          ))}
        </Tabs>
        
        <Box sx={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <RechartsTooltip 
                formatter={(value, name) => {
                  if (name === 'total') return [formatCurrency(value), 'Total'];
                  return [value, 'Facturas'];
                }}
                labelFormatter={(label) => selectedTab === 0 ? `Año: ${label}` : `Mes: ${label}`}
                contentStyle={{ backgroundColor: '#2d2d2d', border: 'none', borderRadius: '8px' }}
              />
              <Legend />
              <Bar 
                dataKey="total" 
                fill="#4477CE" 
                name="Total" 
                radius={[4, 4, 0, 0]} 
              />
              {selectedTab === 0 && (
                <Bar 
                  dataKey="facturas" 
                  fill="#66BB6A" 
                  name="Facturas" 
                  radius={[4, 4, 0, 0]} 
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnnualBillingChart;