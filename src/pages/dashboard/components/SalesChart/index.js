import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  alpha,
  CircularProgress
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GridOnIcon from '@mui/icons-material/GridOn';
import GridOffIcon from '@mui/icons-material/GridOff';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';

// Colores principales
const USD_COLOR = "#FFFFFF"; // Blanco para USD
// Para VES usaremos un degradado definido en defs
const VES_GRADIENT_ID = "vesBarGradient";
const USD_LINE_COLOR = "#FFF59D"; // Amarillo para líneas USD
const VES_LINE_COLOR = "#00f2fe"; // Azul más claro del degradado para las líneas

const SalesChart = ({
  title = "Facturación Mensual",
  data = [],
  isLoading = false,
  error = null
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [seriesVisibility, setSeriesVisibility] = useState({
    facturacionUSD: true,
    lineaUSD: true,
    facturacionVES: true,
    lineaVES: true
  });
  
  // Preparar datos con líneas que siguen a las barras
  const prepareChartData = (inputData) => {
    if (!inputData || !Array.isArray(inputData) || inputData.length === 0) return [];
    
    return inputData.map(item => ({
      ...item,
      // Añadir propiedades para líneas que siguen valores de las barras
      lineaUSD: item.facturacionUSD || 0,
      lineaVES: item.facturacionVES || 0
    }));
  };
  
  // Preparar datos para el gráfico
  const chartData = prepareChartData(data);

  const cardBackgroundColor = '#1e1e1e';

  const toggleGrid = () => setShowGrid(!showGrid);

  const toggleSeries = (seriesName) => {
    setSeriesVisibility(prev => ({
      ...prev,
      [seriesName]: !prev[seriesName]
    }));
  };

  // Si está cargando, mostrar el indicador de carga
  if (isLoading) {
    return (
      <Card sx={{
        bgcolor: cardBackgroundColor,
        borderRadius: '12px',
        height: 500,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#4facfe', mb: 2 }} />
          <Typography color="white">Cargando datos...</Typography>
        </Box>
      </Card>
    );
  }

  // Si hay un error, mostrar mensaje de error
  if (error) {
    return (
      <Card sx={{
        bgcolor: cardBackgroundColor,
        borderRadius: '12px',
        height: 500,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography color="#FF5252" variant="h6" gutterBottom>Error al cargar datos</Typography>
          <Typography color="white" variant="body2">{error.message || 'Ocurrió un error al obtener los datos'}</Typography>
        </Box>
      </Card>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return (
      <Card sx={{
        bgcolor: cardBackgroundColor,
        borderRadius: '12px',
        height: 500,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography color="white">No hay datos disponibles</Typography>
        </Box>
      </Card>
    );
  }

  // Tooltip personalizado mejorado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Encontrar los valores de facturación
      const usdValue = payload.find(p => p.dataKey === 'lineaUSD' || p.dataKey === 'facturacionUSD')?.value || 0;
      const vesValue = payload.find(p => p.dataKey === 'lineaVES' || p.dataKey === 'facturacionVES')?.value || 0;
      
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(40, 40, 40, 0.9)',
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            minWidth: '150px',
            maxWidth: '250px'
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: 'white', 
              fontWeight: 600, 
              mb: 1.5, 
              pb: 0.5, 
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)' 
            }}
          >
            {payload[0]?.payload?.periodo || label}
          </Typography>
          
          {seriesVisibility.facturacionUSD && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#aaa', fontWeight: 500 }}>USD:</Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                ${usdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </Typography>
            </Box>
          )}
          
          {seriesVisibility.facturacionVES && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#aaa', fontWeight: 500 }}>VES:</Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                {vesValue.toLocaleString('es-VE', { maximumFractionDigits: 0 })} VES
              </Typography>
            </Box>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{
      bgcolor: cardBackgroundColor,
      borderRadius: '12px',
      height: '100%',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
      color: '#fff'
    }}>
      <CardContent sx={{ p: {xs: 2, md: 3} }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              fontSize: {xs: '1.05rem', md: '1.2rem'}
            }}
          >
            {title}
            <Tooltip title="Muestra facturación mensual en USD y VES. Las barras indican facturación real y las líneas muestran la tendencia.">
              <InfoIcon fontSize="small" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.65)', '&:hover': {color: '#fff'} }} />
            </Tooltip>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={showGrid ? "Ocultar guías" : "Mostrar guías"}>
              <IconButton
                onClick={toggleGrid}
                size="small"
                sx={{
                  mr: 0.5,
                  color: showGrid ? '#6366F1' : 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    color: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {showGrid ? <GridOnIcon fontSize="small" /> : <GridOffIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            <IconButton
              size="small"
              sx={{
                color: 'rgba(255, 255, 255, 0.65)',
                '&:hover': {
                  color: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ width: '100%', height: 330, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 25, left: 5, bottom: 10 }}
            >
              {/* Definir el gradiente para las barras VES */}
              <defs>
                <linearGradient id={VES_GRADIENT_ID} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4facfe" />
                  <stop offset="100%" stopColor="#00f2fe" />
                </linearGradient>
              </defs>

              {showGrid && (
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth={0.6}
                />
              )}

              <XAxis
                dataKey="name"
                tick={{ fill: 'rgba(255, 255, 255, 0.75)', fontSize: 11.5 }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.25)' }}
                tickLine={false}
                dy={10}
              />

              <YAxis
                yAxisId="left"
                tick={{ fill: 'rgba(255, 255, 255, 0.75)', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.25)' }}
                tickLine={false}
                tickFormatter={(value) => `$${value/1000}k`}
                label={{ value: 'USD', angle: -90, position: 'insideLeft', fill: alpha(USD_LINE_COLOR,0.9), fontSize:12, offset:-10, dy: 5}}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: 'rgba(255, 255, 255, 0.75)', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.25)' }}
                tickLine={false}
                tickFormatter={(value) => `${value/1000}k VES`}
                label={{ value: 'VES', angle: -90, position: 'insideRight', fill: alpha(VES_LINE_COLOR,0.9), fontSize:12, offset: -15, dy:5}}
              />

              <RechartsTooltip 
                content={<CustomTooltip />} 
                cursor={false} // Eliminar cursor para un aspecto más limpio
              />

              {/* BARRAS APILADAS */}
              {/* Primero dibujamos barras VES con gradiente */}
              {seriesVisibility.facturacionVES && (
                <Bar
                  yAxisId="right"
                  dataKey="facturacionVES"
                  stackId="stack" // Esto hace que se apile
                  fill={`url(#${VES_GRADIENT_ID})`} // Usar el gradiente definido
                  stroke="rgba(0, 242, 254, 0.6)"
                  strokeWidth={1}
                  name="Facturación (VES)"
                  radius={[0, 0, 0, 0]} // No redondeada abajo
                  barSize={32}
                  animationDuration={600}
                  fillOpacity={0.85}
                />
              )}

              {/* Luego USD encima */}
              {seriesVisibility.facturacionUSD && (
                <Bar
                  yAxisId="left"
                  dataKey="facturacionUSD"
                  stackId="stack" // Mismo stackId hace que se apile con el anterior
                  fill={USD_COLOR}
                  stroke="rgba(150, 150, 150, 0.7)" // Borde gris para el blanco
                  strokeWidth={1}
                  name="Facturación (USD)"
                  radius={[4, 4, 0, 0]} // Redondeada arriba (solo aplica a la barra superior)
                  barSize={32}
                  animationDuration={600}
                  fillOpacity={0.95}
                />
              )}
              
              {/* Líneas que siguen los valores de las barras - con puntos para interacción */}
              {seriesVisibility.lineaUSD && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="lineaUSD"
                  stroke={USD_LINE_COLOR}
                  strokeWidth={2.5}
                  dot={{ 
                    r: 5, 
                    fill: USD_LINE_COLOR,
                    stroke: '#222', 
                    strokeWidth: 1 
                  }}
                  activeDot={{ 
                    r: 7, 
                    fill: USD_LINE_COLOR,
                    stroke: '#fff', 
                    strokeWidth: 2 
                  }}
                  animationDuration={800}
                />
              )}
              
              {seriesVisibility.lineaVES && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="lineaVES"
                  stroke={VES_LINE_COLOR}
                  strokeWidth={2.5}
                  dot={{ 
                    r: 5, 
                    fill: VES_LINE_COLOR, 
                    stroke: '#222', 
                    strokeWidth: 1 
                  }}
                  activeDot={{ 
                    r: 7, 
                    fill: VES_LINE_COLOR,
                    stroke: '#fff', 
                    strokeWidth: 2 
                  }}
                  animationDuration={800}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        {/* Botones de filtro independientes */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 2.5,
            justifyContent: 'center',
            flexWrap: 'wrap',
            '& > *': { mb: 1 }
          }}
        >
          <Chip
            label="Facturación (USD)"
            icon={<BarChartIcon sx={{ fontSize: '1rem', opacity: seriesVisibility.facturacionUSD ? 1 : 0.6 }}/>}
            clickable
            onClick={() => toggleSeries('facturacionUSD')}
            sx={{
              backgroundColor: seriesVisibility.facturacionUSD ? alpha(USD_COLOR, 0.9) : 'rgba(255, 255, 255, 0.08)',
              color: seriesVisibility.facturacionUSD ? '#333' : 'rgba(255, 255, 255, 0.5)',
              border: `1.5px solid ${seriesVisibility.facturacionUSD ? 'rgba(150, 150, 150, 0.7)' : 'rgba(255, 255, 255, 0.2)'}`,
              '& .MuiChip-icon': {
                color: seriesVisibility.facturacionUSD ? '#333' : 'rgba(255, 255, 255, 0.5)',
              },
              '&:hover': {
                backgroundColor: seriesVisibility.facturacionUSD ? '#ffffff' : 'rgba(255, 255, 255, 0.12)',
                borderColor: seriesVisibility.facturacionUSD ? 'rgba(150, 150, 150, 0.9)' : 'rgba(255, 255, 255, 0.3)',
              },
              transition: 'all 0.2s ease-in-out',
              fontWeight: seriesVisibility.facturacionUSD ? 600 : 500,
              fontSize: '0.75rem',
              padding: '0px 10px',
              height: '30px',
            }}
            size="small"
          />
          <Chip
            label="Línea (USD)"
            icon={<ShowChartIcon sx={{ fontSize: '1rem', opacity: seriesVisibility.lineaUSD ? 1 : 0.6 }}/>}
            clickable
            onClick={() => toggleSeries('lineaUSD')}
            sx={{
              backgroundColor: seriesVisibility.lineaUSD ? alpha(USD_LINE_COLOR, 0.75) : 'rgba(255, 255, 255, 0.08)',
              color: seriesVisibility.lineaUSD ? '#333333' : 'rgba(255, 255, 255, 0.5)',
              border: `1.5px solid ${seriesVisibility.lineaUSD ? alpha(USD_LINE_COLOR, 0.9) : 'rgba(255, 255, 255, 0.2)'}`,
              '& .MuiChip-icon': {
                color: seriesVisibility.lineaUSD ? '#333333' : 'rgba(255, 255, 255, 0.5)',
              },
              '&:hover': {
                backgroundColor: seriesVisibility.lineaUSD ? alpha(USD_LINE_COLOR, 0.85) : 'rgba(255, 255, 255, 0.12)',
                borderColor: seriesVisibility.lineaUSD ? alpha(USD_LINE_COLOR, 1) : 'rgba(255, 255, 255, 0.3)',
              },
              transition: 'all 0.2s ease-in-out',
              fontWeight: seriesVisibility.lineaUSD ? 600 : 500,
              fontSize: '0.75rem',
              padding: '0px 10px',
              height: '30px',
            }}
            size="small"
          />
          <Chip
            label="Facturación (VES)"
            icon={<BarChartIcon sx={{ fontSize: '1rem', opacity: seriesVisibility.facturacionVES ? 1 : 0.6 }}/>}
            clickable
            onClick={() => toggleSeries('facturacionVES')}
            sx={{
              background: seriesVisibility.facturacionVES
                ? 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
                : 'rgba(255, 255, 255, 0.08)',
              color: seriesVisibility.facturacionVES ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
              border: `1.5px solid ${seriesVisibility.facturacionVES ? '#00f2fe' : 'rgba(255, 255, 255, 0.2)'}`,
              '& .MuiChip-icon': {
                color: seriesVisibility.facturacionVES ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
              },
              '&:hover': {
                background: seriesVisibility.facturacionVES
                  ? 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
                  : 'rgba(255, 255, 255, 0.12)',
                borderColor: seriesVisibility.facturacionVES ? '#00f2fe' : 'rgba(255, 255, 255, 0.3)',
                filter: seriesVisibility.facturacionVES ? 'brightness(1.1)' : 'none',
              },
              transition: 'all 0.2s ease-in-out',
              fontWeight: seriesVisibility.facturacionVES ? 600 : 500,
              fontSize: '0.75rem',
              padding: '0px 10px',
              height: '30px',
            }}
            size="small"
          />
          <Chip
            label="Línea (VES)"
            icon={<ShowChartIcon sx={{ fontSize: '1rem', opacity: seriesVisibility.lineaVES ? 1 : 0.6 }}/>}
            clickable
            onClick={() => toggleSeries('lineaVES')}
            sx={{
              backgroundColor: seriesVisibility.lineaVES ? alpha(VES_LINE_COLOR, 0.75) : 'rgba(255, 255, 255, 0.08)',
              color: seriesVisibility.lineaVES ? '#333333' : 'rgba(255, 255, 255, 0.5)',
              border: `1.5px solid ${seriesVisibility.lineaVES ? alpha(VES_LINE_COLOR, 0.9) : 'rgba(255, 255, 255, 0.2)'}`,
              '& .MuiChip-icon': {
                color: seriesVisibility.lineaVES ? '#333333' : 'rgba(255, 255, 255, 0.5)',
              },
              '&:hover': {
                backgroundColor: seriesVisibility.lineaVES ? alpha(VES_LINE_COLOR, 0.85) : 'rgba(255, 255, 255, 0.12)',
                borderColor: seriesVisibility.lineaVES ? alpha(VES_LINE_COLOR, 1) : 'rgba(255, 255, 255, 0.3)',
              },
              transition: 'all 0.2s ease-in-out',
              fontWeight: seriesVisibility.lineaVES ? 600 : 500,
              fontSize: '0.75rem',
              padding: '0px 10px',
              height: '30px',
            }}
            size="small"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SalesChart;