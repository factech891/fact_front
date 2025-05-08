// src/pages/dashboard/components/AnnualBillingChart/index.js
import React, { useState } from 'react';
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
  Collapse,
  // Switch, // Eliminado
  // FormControlLabel // Eliminado
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// Iconos para la leyenda
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // Ya no se usa para Total
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Para USD
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'; // Para VES (ejemplo)


import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend, // Aún necesario para pasar payload a RenderLegendButtons
  ResponsiveContainer,
  Defs,
  Stop,
  LinearGradient
} from 'recharts';
import { useSpring, animated } from 'react-spring';

// Componente animado para la tarjeta
const AnimatedCard = animated(Card);

// Tasa de cambio ilustrativa (puede venir de props o contexto si es dinámica)
const USD_TO_VES_RATE = 36.5;

// Colores
const USD_AREA_COLOR_STROKE = "#10B981";   // Verde
const VES_AREA_COLOR_STROKE = "#3B82F6";   // Azul

const cardBackgroundColor = '#1e1e1e';

// Función auxiliar para validar y asegurar estructura mínima de datos
const validateAndPrepareData = (inputData) => {
  if (!Array.isArray(inputData)) return [];

  return inputData.map(item => {
    const usdValue = Number(item?.USD || 0);
    const vesValue = Number(item?.VES || 0);
    return {
      name: String(item?.name || item?.year || item?.año || 'N/A'),
      USD: usdValue,
      VES: vesValue,
    };
  }).filter(item => item.name !== 'N/A');
};


const AnnualBillingChart = ({ data = [] }) => { // Recibe 'data' como prop
  const [expanded, setExpanded] = useState(false); // Empezar CERRADO por defecto
  // const [showCombined, setShowCombined] = useState(true); // Eliminado

  // Validar y preparar los datos recibidos
  const chartData = validateAndPrepareData(data);
  console.log(`AnnualBillingChart: Using data from props. Validated data length: ${chartData.length}.`);


  const [seriesVisibility, setSeriesVisibility] = useState({
    // total: true, // Eliminado
    USD: true,
    VES: true
  });

  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 800 }
  });

  const validatedData = chartData; // Usar los datos validados

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const toggleSeriesVisibility = (seriesKey) => {
     console.log("Toggling visibility for:", seriesKey);
     setSeriesVisibility(prev => {
        const newState = { ...prev, [seriesKey]: !prev[seriesKey] };
        console.log("New seriesVisibility state:", newState);
        return newState;
     });
  };

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
            Año: {label}
          </Typography>
          {payload.map((entry, index) => {
             // Mostrar solo si la serie está activa (USD o VES)
            if (!entry.dataKey || !seriesVisibility[entry.dataKey]) return null;

            const currency = entry.dataKey === 'VES' ? 'VES' : 'USD';
            const dotColor = entry.stroke || entry.color;

            return (
              <Box key={`item-${index}`} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 0.8, py: 0.2 }}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Box component="span" sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: dotColor, mr: 1.2, border: `1px solid ${alpha(dotColor, 0.7)}` }} />
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.9), fontWeight: 500, mr: 1.5 }}>
                      {entry.name}: {/* Muestra "USD" o "VES" */}
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
                  {currency === 'VES'
                    // CAMBIO AQUÍ: Usar 'VES' en lugar de 'Bs.S'
                    ? `${entry.value.toLocaleString('es-VE', { minimumFractionDigits: 0, maximumFractionDigits: 0})} VES`
                    : `${entry.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0})}`
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

  // --- Componente para los botones de leyenda (independiente) ---
  const RenderLegendButtons = () => {
    // Define qué botones mostrar (siempre USD y VES)
    const legendItemsConfig = [
          { dataKey: 'USD', name: 'USD', color: USD_AREA_COLOR_STROKE, icon: <AttachMoneyIcon sx={{ fontSize: '1rem' }}/> },
          { dataKey: 'VES', name: 'VES', color: VES_AREA_COLOR_STROKE, icon: <AccountBalanceWalletIcon sx={{ fontSize: '1rem' }}/> }
        ];

    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mt: 2.5,
          mb: 1,
          justifyContent: 'center',
          flexWrap: 'wrap',
          '& > *': { mb: 1 }
        }}
      >
        {legendItemsConfig.map((item) => {
          const { dataKey, name, color, icon } = item;
          const isActive = seriesVisibility[dataKey];

          // Estilos para inactivo (muy visibles)
          const inactiveChipBackgroundColor = 'rgba(180, 180, 180, 0.15)';
          const inactiveChipBorderColor = 'rgba(200, 200, 200, 0.4)';
          const inactiveChipTextColor = 'rgba(220, 220, 220, 0.8)';

          // Estilos para activo
          const activeChipBackgroundColor = alpha(color, 0.8);
          const activeChipBorderColor = alpha(color, 1);
          const activeChipTextColor = '#ffffff';

          const currentChipBackgroundColor = isActive ? activeChipBackgroundColor : inactiveChipBackgroundColor;
          const currentChipBorderColor = isActive ? activeChipBorderColor : inactiveChipBorderColor;
          const currentChipTextColor = isActive ? activeChipTextColor : inactiveChipTextColor;

          return (
            <Chip
              key={`legend-btn-${dataKey}`}
              label={name}
              icon={icon}
              clickable
              onClick={() => toggleSeriesVisibility(dataKey)}
              sx={{
                backgroundColor: currentChipBackgroundColor,
                color: currentChipTextColor,
                border: `1.5px solid ${currentChipBorderColor}`,
                opacity: 1, // Siempre opaco
                '& .MuiChip-icon': {
                    color: currentChipTextColor,
                },
                '&:hover': {
                  backgroundColor: isActive ? alpha(color, 0.95) : alpha(inactiveChipBackgroundColor, 0.5),
                  borderColor: isActive ? alpha(color, 1) : alpha(inactiveChipBorderColor, 0.8),
                  color: '#ffffff',
                   '& .MuiChip-icon': {
                       color: '#ffffff',
                   }
                },
                transition: 'all 0.2s ease-in-out',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.75rem',
                padding: '0px 10px',
                height: '30px',
              }}
              size="small"
            />
          );
        })}
      </Stack>
    );
  };


  // Mostrar mensaje si NO hay datos VALIDADOS y está expandido
  if (validatedData.length === 0 && expanded) {
     // ... (código para "No hay datos" - sin cambios) ...
      return (
      <AnimatedCard
        style={cardAnimation}
        sx={{
          bgcolor: cardBackgroundColor,
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          minHeight: expanded ? 400 : 100, // Ajustar altura mínima
          position: 'relative',
          overflow: 'hidden',
          transition: 'min-height 0.3s ease'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1.5, fontSize: '1.4rem', color: 'rgba(255, 255, 255, 0.7)' }} />
                <Typography variant="h6" sx={{ color: 'white', fontSize: '1.25rem', fontWeight: 500 }}>
                  Facturación Anual
                  <Tooltip title="Análisis de facturación anual por tipo de moneda">
                    <InfoIcon fontSize="small" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer' }} />
                  </Tooltip>
                </Typography>
              </Box>
              <IconButton onClick={handleExpandClick} sx={{ color: 'rgba(255, 255, 255, 0.6)', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', '&:hover': { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                <ExpandMoreIcon />
              </IconButton>
          </Box>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, mt: 2 }}>
              <Typography variant="body1" color="#AAA">
                No hay datos disponibles para mostrar el gráfico anual.
              </Typography>
            </Box>
          </Collapse>
        </CardContent>
      </AnimatedCard>
    );
  }

  // Renderizar el gráfico si hay datos
  return (
    <AnimatedCard
      style={cardAnimation}
      sx={{
        bgcolor: cardBackgroundColor,
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        minHeight: expanded ? 500 : 100, // Altura mínima ajustada
        position: 'relative',
        overflow: 'hidden',
        transition: 'min-height 0.3s ease'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon
              sx={{
                mr: 1.5,
                fontSize: '1.4rem',
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 500
              }}
            >
              Facturación Anual
              <Tooltip title="Análisis de facturación anual por tipo de moneda">
                <InfoIcon fontSize="small" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer' }} />
              </Tooltip>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Switch y FormControlLabel eliminados */}
            <IconButton
              onClick={handleExpandClick}
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
                '&:hover': {
                  color: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box>
            <Box sx={{ width: '100%', height: 380, position: 'relative', mt: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={validatedData} // Usar los datos validados (de props)
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    {/* Degradados para USD y VES */}
                    <linearGradient id="usdGradientAnnual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={USD_AREA_COLOR_STROKE} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={USD_AREA_COLOR_STROKE} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="vesGradientAnnual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={VES_AREA_COLOR_STROKE} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={VES_AREA_COLOR_STROKE} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="3 3" />

                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                    tickLine={false}
                    dy={8}
                    interval={validatedData.length > 10 ? Math.floor(validatedData.length / 8) : 0}
                  />

                  {/* Eje Y izquierdo para USD */}
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                    tickLine={false}
                    tickFormatter={(value) => `$${value/1000}k`}
                  />

                  {/* Eje Y derecho para VES */}
                  <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                      axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                      tickLine={false}
                      // CAMBIO AQUÍ: Usar 'VES' en lugar de 'k VES'
                      tickFormatter={(value) => `${value/1000}k VES`}
                    />

                  <RechartsTooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: alpha(cardBackgroundColor, 0.3) }}
                  />

                  {/* <Legend /> ELIMINADO */}

                  {/* Renderizar áreas solo si están visibles */}
                  {seriesVisibility.USD && (
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="USD"
                      name="USD" // Nombre para leyenda y tooltip
                      stroke={USD_AREA_COLOR_STROKE}
                      fillOpacity={1}
                      fill="url(#usdGradientAnnual)"
                      strokeWidth={2.5}
                      activeDot={{ r: 7, stroke: USD_AREA_COLOR_STROKE, strokeWidth: 2, fill: cardBackgroundColor }}
                      animationDuration={700}
                    />
                  )}
                  {seriesVisibility.VES && (
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="VES"
                      name="VES" // Nombre para leyenda y tooltip
                      stroke={VES_AREA_COLOR_STROKE}
                      fillOpacity={1}
                      fill="url(#vesGradientAnnual)"
                      strokeWidth={2.5}
                      activeDot={{ r: 7, stroke: VES_AREA_COLOR_STROKE, strokeWidth: 2, fill: cardBackgroundColor }}
                      animationDuration={700}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </Box>

            {/* Botones de Leyenda Independientes */}
            <RenderLegendButtons />

          </Box>
        </Collapse>
      </CardContent>
    </AnimatedCard>
  );
};

export default AnnualBillingChart;