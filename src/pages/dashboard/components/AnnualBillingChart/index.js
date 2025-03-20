// src/pages/dashboard/components/AnnualBillingChart/index.js
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  useTheme,
  IconButton,
  Tooltip,
  alpha,
  Collapse,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useSpring, animated } from 'react-spring';

// Componente animado para la tarjeta
const AnimatedCard = animated(Card);

// Función auxiliar para validar los datos
const validateData = (data) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter(item => 
    item && 
    typeof item === 'object' && 
    item.name !== undefined && 
    (item.USD !== undefined || item.VES !== undefined || item.total !== undefined)
  ).map(item => ({
    name: String(item.name || ''),
    USD: Number(item.USD || 0),
    VES: Number(item.VES || 0),
    total: Number(item.total || 0)
  }));
};

const AnnualBillingChart = ({ data = [] }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [showCombined, setShowCombined] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  
  // Animación de entrada para la tarjeta
  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 800 }
  });
  
  // Validar y preparar los datos
  const validatedData = validateData(data);
  
  // Handler para expandir/contraer el gráfico
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  // Si no hay datos válidos, mostrar mensaje
  if (validatedData.length === 0) {
    return (
      <AnimatedCard 
        style={cardAnimation}
        sx={{ 
          backgroundImage: 'linear-gradient(135deg, #15151f 0%, #1c1c28 100%)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          height: '100%',
          minHeight: expanded ? 400 : 100,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Typography variant="h6" color="white">
              Facturación Anual
            </Typography>
            <IconButton 
              onClick={handleExpandClick}
              sx={{ 
                color: 'white',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
          
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 300,
                mt: 2
              }}
            >
              <Typography variant="body1" color="#AAA">
                No hay datos disponibles para el período seleccionado
              </Typography>
            </Box>
          </Collapse>
        </CardContent>
      </AnimatedCard>
    );
  }
  
  // Formatear números
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-ES', {
      maximumFractionDigits: 0
    }).format(number);
  };
  
  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(30, 30, 36, 0.8)',
            backdropFilter: 'blur(8px)',
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            color: '#fff',
            minWidth: '180px'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', pb: 1 }}>
            {`${label}`}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={`item-${index}`} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="span"
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    mr: 1,
                    background: entry.name === 'total' ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' :
                      entry.name === 'USD' ? 'linear-gradient(135deg, #10B981, #34D399)' :
                        'linear-gradient(135deg, #3B82F6, #60A5FA)'
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {entry.name === 'total' ? 'Total' : entry.name}:
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, ml: 2 }}>
                {`${entry.value.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: entry.name === 'VES' ? 'VES' : 'USD',
                  maximumFractionDigits: 0
                })}`}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Leyenda personalizada
  const CustomLegend = (props) => {
    const { payload } = props;
    
    return (
      <ul style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: 0,
        margin: '10px 0 0 0',
        listStyle: 'none'
      }}>
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ 
            marginRight: 20, 
            display: 'flex', 
            alignItems: 'center',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            <span style={{ marginRight: 5, fontSize: '16px' }}>
              {entry.value === 'total' ? '💰' : 
               entry.value === 'USD' ? '💵' : 
               entry.value === 'VES' ? '💸' : ''}
            </span>
            <span>{entry.value === 'total' ? 'Total' : entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };
  
  // Handler para hover en las barras
  const handleBarMouseEnter = (data, index) => {
    setHoveredBar(index);
  };

  const handleBarMouseLeave = () => {
    setHoveredBar(null);
  };
  
  return (
    <AnimatedCard 
      style={cardAnimation}
      sx={{ 
        backgroundImage: '#1E1E1E',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        height: '100%',
        minHeight: expanded ? 400 : 100,
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
            {expanded && (
              <FormControlLabel
                control={
                  <Switch 
                    checked={showCombined}
                    onChange={() => setShowCombined(!showCombined)}
                    size="small"
                    sx={{ 
                      '& .MuiSwitch-track': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                      '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#6366F1' },
                      '& .MuiSwitch-thumb': { backgroundColor: '#fff' },
                      '& .Mui-checked .MuiSwitch-thumb': { backgroundColor: '#fff' }
                    }}
                  />
                }
                label={
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {showCombined ? "Total" : "Por moneda"}
                  </Typography>
                }
                sx={{ mr: 1 }}
              />
            )}
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
          <Box sx={{ width: '100%', height: 300, position: 'relative', mt: 3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={validatedData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barGap={8}
                onMouseMove={(e) => e}
              >
                <defs>
                  <linearGradient id="totalGradientAnnual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="usdGradientAnnual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                  <linearGradient id="vesGradientAnnual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#60A5FA" />
                  </linearGradient>
                  <filter id="glowAnnual" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                
                <XAxis 
                  dataKey="name"
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  tickLine={false}
                  dy={8}
                />
                
                <YAxis 
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  tickLine={false}
                  tickFormatter={(value) => new Intl.NumberFormat('es-ES', { 
                    notation: 'compact',
                    compactDisplay: 'short',
                    maximumFractionDigits: 1
                  }).format(value)}
                />
                
                <RechartsTooltip 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                
                <Legend 
                  content={<CustomLegend />}
                />
                
                <ReferenceLine 
                  y={0} 
                  stroke="rgba(255, 255, 255, 0.2)" 
                />
                
                {showCombined ? (
                  <Area 
                    type="monotone"
                    dataKey="total" 
                    name="total" 
                    stroke="#6366F1"
                    fillOpacity={1}
                    fill="url(#totalGradientAnnual)"
                    strokeWidth={2}
                    activeDot={{ 
                      r: 8, 
                      stroke: '#6366F1',
                      strokeWidth: 2,
                      fill: '#111'
                    }}
                    onMouseEnter={handleBarMouseEnter}
                    onMouseLeave={handleBarMouseLeave}
                    animationDuration={1500}
                    animationBegin={200}
                    animationEasing="ease-out"
                  />
                ) : (
                  <>
                    <Area 
                      type="monotone"
                      dataKey="USD" 
                      name="USD" 
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#usdGradientAnnual)"
                      strokeWidth={2}
                      activeDot={{ 
                        r: 8, 
                        stroke: '#10B981',
                        strokeWidth: 2,
                        fill: '#111'
                      }}
                      onMouseEnter={handleBarMouseEnter}
                      onMouseLeave={handleBarMouseLeave}
                      animationDuration={1500}
                      animationBegin={100}
                      animationEasing="ease-out"
                    />
                    <Area 
                      type="monotone"
                      dataKey="VES" 
                      name="VES" 
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#vesGradientAnnual)"
                      strokeWidth={2}
                      activeDot={{ 
                        r: 8, 
                        stroke: '#3B82F6',
                        strokeWidth: 2,
                        fill: '#111'
                      }}
                      onMouseEnter={handleBarMouseEnter}
                      onMouseLeave={handleBarMouseLeave}
                      animationDuration={1500}
                      animationBegin={300}
                      animationEasing="ease-out"
                    />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Collapse>
      </CardContent>
    </AnimatedCard>
  );
};

export default AnnualBillingChart;