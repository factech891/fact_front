import React from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Componente que usa exactamente el mismo Card y estilos que SalesChart
const DailyBillingChart = ({ 
  data = [], 
  title = "Facturación Diaria",
}) => {
  // Verificar si hay datos disponibles
  const hasData = data && data.length > 0;

  // Customizar tooltip para mostrar valores por moneda
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: '#242424',
          padding: '10px',
          border: '1px solid #444',
          borderRadius: '4px'
        }}>
          <p className="label" style={{ color: '#CCC', marginBottom: '8px' }}>{`Fecha: ${label}`}</p>
          {payload.map((entry, index) => {
            // Solo mostrar si hay valor
            if (entry.value <= 0) return null;
            
            return (
              <p key={`item-${index}`} style={{ 
                color: entry.color,
                margin: '2px 0'
              }}>
                {`${entry.name === 'total' ? 'Total' : entry.name}: ${entry.value.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: entry.name === 'VES' ? 'VES' : 'USD'
                })}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
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
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2 
        }}>
          <Typography variant="h6" color="white" sx={{ display: 'flex', alignItems: 'center' }}>
            {title}
            <Tooltip title="Muestra los montos facturados por día, separados por moneda.">
              <InfoIcon fontSize="small" sx={{ ml: 1, color: '#AAA', cursor: 'pointer' }} />
            </Tooltip>
          </Typography>
          
          <IconButton size="small" sx={{ color: '#AAA' }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {hasData ? (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="name"
                  tick={{ fill: '#AAA' }}
                  axisLine={{ stroke: '#444' }}
                />
                <YAxis 
                  tick={{ fill: '#AAA' }}
                  axisLine={{ stroke: '#444' }}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="USD" name="USD" fill="#4CAF50" barSize={30} />
                <Bar dataKey="VES" name="VES" fill="#2196F3" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '300px',
              color: '#AAA'
            }}
          >
            No hay datos disponibles para el período seleccionado
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyBillingChart;