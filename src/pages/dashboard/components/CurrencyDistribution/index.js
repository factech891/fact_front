import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { COLORS, TOOLTIP_STYLE, EXAMPLE_DATA, formatCurrency } from './config';

const CurrencyDistribution = ({ data = EXAMPLE_DATA, title = "Distribución por Moneda" }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Verificar si hay datos
  const hasData = data && data.length > 0;
  
  // Manejar entrada/salida del mouse
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Personalizar el tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, raw } = payload[0].payload;
      
      // Determinar la moneda basada en el nombre
      let currency = 'USD';
      if (name.includes('VES')) {
        currency = 'VES';
      } else if (name.includes('EUR')) {
        currency = 'EUR';
      } else if (name.includes('BTC')) {
        currency = 'BTC';
      }
      
      const formattedValue = formatCurrency(raw || 0, currency);
      
      return (
        <div style={TOOLTIP_STYLE}>
          <p style={{ color: '#FFF', margin: '0', fontWeight: 'bold' }}>{name}</p>
          <p style={{ color: '#AAA', margin: '5px 0' }}>{`${value}% del total`}</p>
          <p style={{ color: '#FFF', margin: '0' }}>{formattedValue}</p>
        </div>
      );
    }
    return null;
  };

  // Renderizar etiqueta personalizada en el gráfico
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card
      sx={{
        bgcolor: '#1E1E1E',
        borderRadius: 2,
        border: '1px solid #333',
        height: '100%'
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="#CCC" sx={{ display: 'flex', alignItems: 'center' }}>
            {title}
            <Tooltip title="Muestra la distribución de facturación por tipo de moneda">
              <InfoIcon fontSize="small" sx={{ ml: 1, color: '#AAA', cursor: 'pointer' }} />
            </Tooltip>
          </Typography>
          
          <IconButton size="small" sx={{ color: '#AAA' }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {hasData ? (
          <>
            <Box sx={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={4}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke={activeIndex === index ? '#fff' : 'none'}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              gap: 1,
              mt: 2
            }}>
              {data.map((item, index) => (
                <Chip
                  key={index}
                  label={`${item.name} ${item.value}%`}
                  sx={{ 
                    backgroundColor: COLORS[index % COLORS.length],
                    color: 'white',
                    fontWeight: 'medium',
                    '&:hover': {
                      backgroundColor: COLORS[index % COLORS.length],
                      filter: 'brightness(1.1)'
                    }
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                />
              ))}
            </Box>
          </>
        ) : (
          <Box sx={{ 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <Typography color="#AAA">
              No hay datos disponibles
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrencyDistribution;