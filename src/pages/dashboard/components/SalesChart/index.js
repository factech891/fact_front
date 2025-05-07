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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
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
  Legend,
  ResponsiveContainer,
  BarChart
} from 'recharts';

// Colores principales
const USD_COLOR = "#FFFFFF"; // Blanco para USD
// Para VES usaremos un degradado definido en defs
const VES_GRADIENT_ID = "vesBarGradient";
const USD_LINE_COLOR = "#FFF59D"; // Amarillo para líneas USD
const VES_LINE_COLOR = "#00f2fe"; // Azul más claro del degradado para las líneas

const SalesChart = ({
  title = "Facturación Mensual (USD y VES)",
  data = [],
  isLoading = false,
  error = null
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [seriesVisibility, setSeriesVisibility] = useState({
    facturacionUSD: true,
    metasUSD: true,
    facturacionVES: true,
    metasVES: true
  });

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

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: alpha(cardBackgroundColor, 0.95),
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
            color: '#e0e0e0',
            fontSize: '0.875rem'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.2, pb: 0.8, borderBottom: '1px solid rgba(255, 255, 255, 0.25)', color: '#fff' }}>
            {payload[0]?.payload?.periodo || label}
          </Typography>

          {/* Mostrar total si tenemos ambos tipos de facturación */}
          {seriesVisibility.facturacionUSD && seriesVisibility.facturacionVES && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 0.8, py: 0.2, borderBottom: '1px dashed rgba(255, 255, 255, 0.15)', pb: 1 }}>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>
                Total Facturación:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff' }}>
                {payload.find(p => p.dataKey === 'facturacionUSD')?.value &&
                 payload.find(p => p.dataKey === 'facturacionVES')?.value ?
                  `$${(payload.find(p => p.dataKey === 'facturacionUSD').value +
                      payload.find(p => p.dataKey === 'facturacionVES').value / 35).toFixed(2)}` : ''}
              </Typography>
            </Box>
          )}

          {/* Mostrar el porcentaje de cumplimiento de metas si ambas están visibles */}
          {seriesVisibility.facturacionUSD && seriesVisibility.metasUSD && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 0.8, py: 0.2, borderBottom: '1px dashed rgba(255, 255, 255, 0.15)', pb: 1 }}>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>
                Cumplimiento Meta USD:
              </Typography>
              <Typography variant="body2" sx={{
                fontWeight: 700,
                color: payload.find(p => p.dataKey === 'facturacionUSD')?.value >= payload.find(p => p.dataKey === 'metasUSD')?.value ? '#4caf50' : '#ff9800'
              }}>
                {payload.find(p => p.dataKey === 'facturacionUSD')?.value &&
                 payload.find(p => p.dataKey === 'metasUSD')?.value ?
                  `${Math.round((payload.find(p => p.dataKey === 'facturacionUSD').value /
                      payload.find(p => p.dataKey === 'metasUSD').value) * 100)}%` : ''}
              </Typography>
            </Box>
          )}

          {seriesVisibility.facturacionVES && seriesVisibility.metasVES && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 0.8, py: 0.2, borderBottom: '1px dashed rgba(255, 255, 255, 0.15)', pb: 1 }}>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>
                Cumplimiento Meta VES:
              </Typography>
              <Typography variant="body2" sx={{
                fontWeight: 700,
                color: payload.find(p => p.dataKey === 'facturacionVES')?.value >= payload.find(p => p.dataKey === 'metasVES')?.value ? '#4caf50' : '#ff9800'
              }}>
                {payload.find(p => p.dataKey === 'facturacionVES')?.value &&
                 payload.find(p => p.dataKey === 'metasVES')?.value ?
                  `${Math.round((payload.find(p => p.dataKey === 'facturacionVES').value /
                      payload.find(p => p.dataKey === 'metasVES').value) * 100)}%` : ''}
              </Typography>
            </Box>
          )}

          {/* Mostrar cada serie individual */}
          {payload.map((entry, index) => {
            if (!entry.dataKey || !seriesVisibility[entry.dataKey]) return null;

            let seriesColor;
            if (entry.dataKey === "metasUSD") seriesColor = USD_LINE_COLOR;
            else if (entry.dataKey === "metasVES") seriesColor = VES_LINE_COLOR;
            else if (entry.dataKey === "facturacionUSD") seriesColor = USD_COLOR;
            else if (entry.dataKey === "facturacionVES") seriesColor = "#4facfe"; // Color principal del gradiente

            return (
              <Box key={`item-${index}`} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 0.8, py: 0.2 }}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Box component="span" sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: seriesColor,
                      mr: 1.2,
                      border: `1px solid ${entry.dataKey === "facturacionUSD" ? 'rgba(150, 150, 150, 0.7)' : alpha(seriesColor, 0.7)}`,
                      background: entry.dataKey === "facturacionVES" ? 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' : seriesColor
                    }} />
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.9), fontWeight: 500, mr: 1.5 }}>
                      {entry.dataKey === "facturacionUSD" ? "Facturación (USD)" :
                       entry.dataKey === "facturacionVES" ? "Facturación (VES)" :
                       entry.dataKey === "metasUSD" ? "Meta (USD)" :
                       entry.dataKey === "metasVES" ? "Meta (VES)" : entry.name}:
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
                  {entry.dataKey.includes('VES')
                    ? `${entry.value.toLocaleString('es-VE', { minimumFractionDigits: 0, maximumFractionDigits: 0})} VES`
                    : `${entry.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                  }
                </Typography>
              </Box>
            );
          })}
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
            <Tooltip title="Muestra facturación mensual en USD y VES. Las barras indican facturación real y las líneas muestran las metas establecidas.">
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
              data={data}
              margin={{ top: 10, right: 25, left: 5, bottom: 10 }}
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

              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: alpha(cardBackgroundColor, 0.4) }}/>

              {/* Líneas de metas mensuales */}
              {seriesVisibility.metasUSD && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="metasUSD"
                  stroke={USD_LINE_COLOR}
                  strokeWidth={2.5}
                  name="Meta (USD)"
                  dot={{ fill: cardBackgroundColor, stroke: USD_LINE_COLOR, strokeWidth: 2, r: 4.5 }}
                  activeDot={{ r: 6, fill: USD_LINE_COLOR, stroke: cardBackgroundColor, strokeWidth: 2 }}
                  animationDuration={600}
                />
              )}

              {seriesVisibility.metasVES && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="metasVES"
                  stroke={VES_LINE_COLOR}
                  strokeWidth={2.5}
                  name="Meta (VES)"
                  dot={{ fill: cardBackgroundColor, stroke: VES_LINE_COLOR, strokeWidth: 2, r: 4.5 }}
                  activeDot={{ r: 6, fill: VES_LINE_COLOR, stroke: cardBackgroundColor, strokeWidth: 2 }}
                  animationDuration={600}
                />
              )}

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
            label="Meta (USD)"
            icon={<ShowChartIcon sx={{ fontSize: '1rem', opacity: seriesVisibility.metasUSD ? 1 : 0.6 }}/>}
            clickable
            onClick={() => toggleSeries('metasUSD')}
            sx={{
              backgroundColor: seriesVisibility.metasUSD ? alpha(USD_LINE_COLOR, 0.75) : 'rgba(255, 255, 255, 0.08)',
              color: seriesVisibility.metasUSD ? '#333333' : 'rgba(255, 255, 255, 0.5)',
              border: `1.5px solid ${seriesVisibility.metasUSD ? alpha(USD_LINE_COLOR, 0.9) : 'rgba(255, 255, 255, 0.2)'}`,
              '& .MuiChip-icon': {
                color: seriesVisibility.metasUSD ? '#333333' : 'rgba(255, 255, 255, 0.5)',
              },
              '&:hover': {
                backgroundColor: seriesVisibility.metasUSD ? alpha(USD_LINE_COLOR, 0.85) : 'rgba(255, 255, 255, 0.12)',
                borderColor: seriesVisibility.metasUSD ? alpha(USD_LINE_COLOR, 1) : 'rgba(255, 255, 255, 0.3)',
              },
              transition: 'all 0.2s ease-in-out',
              fontWeight: seriesVisibility.metasUSD ? 600 : 500,
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
            label="Meta (VES)"
            icon={<ShowChartIcon sx={{ fontSize: '1rem', opacity: seriesVisibility.metasVES ? 1 : 0.6 }}/>}
            clickable
            onClick={() => toggleSeries('metasVES')}
            sx={{
              backgroundColor: seriesVisibility.metasVES ? alpha(VES_LINE_COLOR, 0.75) : 'rgba(255, 255, 255, 0.08)',
              color: seriesVisibility.metasVES ? '#333333' : 'rgba(255, 255, 255, 0.5)',
              border: `1.5px solid ${seriesVisibility.metasVES ? alpha(VES_LINE_COLOR, 0.9) : 'rgba(255, 255, 255, 0.2)'}`,
              '& .MuiChip-icon': {
                color: seriesVisibility.metasVES ? '#333333' : 'rgba(255, 255, 255, 0.5)',
              },
              '&:hover': {
                backgroundColor: seriesVisibility.metasVES ? alpha(VES_LINE_COLOR, 0.85) : 'rgba(255, 255, 255, 0.12)',
                borderColor: seriesVisibility.metasVES ? alpha(VES_LINE_COLOR, 1) : 'rgba(255, 255, 255, 0.3)',
              },
              transition: 'all 0.2s ease-in-out',
              fontWeight: seriesVisibility.metasVES ? 600 : 500,
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