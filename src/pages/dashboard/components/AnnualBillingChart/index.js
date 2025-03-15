// src/pages/dashboard/components/AnnualBillingChart/index.js
import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  useTheme
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { CHART_COLORS } from '../../constants/dashboardConstants';

// Función auxiliar para validar los datos
const validateData = (data) => {
  if (!data || !Array.isArray(data)) return [];
  
  // Filtrar datos inválidos y asegurarse de que cada elemento tiene las propiedades necesarias
  return data.filter(item => 
    item && 
    typeof item === 'object' && 
    item.name !== undefined && 
    (item.USD !== undefined || item.VES !== undefined || item.total !== undefined)
  ).map(item => ({
    name: String(item.name || ''), // Convertir a string de forma segura
    USD: Number(item.USD || 0),    // Convertir a número de forma segura
    VES: Number(item.VES || 0),    // Convertir a número de forma segura
    total: Number(item.total || 0) // Convertir a número de forma segura
  }));
};

const AnnualBillingChart = ({ data = [] }) => {
  const theme = useTheme();
  
  // Validar y preparar los datos
  const validatedData = validateData(data);
  
  // Si no hay datos válidos, mostrar mensaje
  if (validatedData.length === 0) {
    return (
      <Card sx={{ 
        bgcolor: '#1E1E1E',
        borderRadius: 2,
        border: '1px solid #333',
        height: '100%',
        minHeight: 400
      }}>
        <CardContent>
          <Typography variant="h6" color="white" sx={{ mb: 2 }}>
            Facturación Anual
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 300 
            }}
          >
            <Typography variant="body1" color="#AAA">
              No hay datos disponibles para el período seleccionado
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  // Formatear números para tooltip
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-ES', {
      maximumFractionDigits: 0
    }).format(number);
  };
  
  // Configuración del tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box 
          sx={{ 
            bgcolor: '#2C2C2C', 
            p: 1.5, 
            border: '1px solid #444',
            borderRadius: 1
          }}
        >
          <Typography 
            variant="subtitle2" 
            color="white"
            sx={{ mb: 1 }}
          >
            Año: {label}
          </Typography>
          
          {payload.map((entry, index) => (
            <Box 
              key={`tooltip-${index}`} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 0.5 
              }}
            >
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  mr: 1, 
                  bgcolor: entry.color 
                }} 
              />
              <Typography 
                variant="caption" 
                color="white"
              >
                {entry.name}: {entry.value === 0 ? '0' : formatNumber(entry.value)}
                {entry.name === 'VES' ? ' VES' : entry.name === 'USD' ? ' USD' : ''}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };
  
  return (
    <Card sx={{ 
      bgcolor: '#1E1E1E',
      borderRadius: 2,
      border: '1px solid #333',
      height: '100%',
      minHeight: 400
    }}>
      <CardContent>
        <Typography variant="h6" color="white" sx={{ mb: 2 }}>
          Facturación Anual
        </Typography>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={validatedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barGap={0}
            barCategoryGap="20%"
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="#333"
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#AAA' }}
              axisLine={{ stroke: '#444' }}
              tickLine={{ stroke: '#444' }}
            />
            <YAxis 
              tick={{ fill: '#AAA' }}
              axisLine={{ stroke: '#444' }}
              tickLine={{ stroke: '#444' }}
              tickFormatter={(value) => value === 0 ? '0' : formatNumber(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: 15,
                color: '#FFF'
              }}
              formatter={(value) => (
                <span style={{ color: '#CCC' }}>{value}</span>
              )}
            />
            <Bar 
              dataKey="USD" 
              name="USD" 
              fill={CHART_COLORS.primary}
              radius={[3, 3, 0, 0]}
            />
            <Bar 
              dataKey="VES" 
              name="VES" 
              fill={CHART_COLORS.success}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnnualBillingChart;