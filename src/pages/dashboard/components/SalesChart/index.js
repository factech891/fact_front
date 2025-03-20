import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  alpha
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LabelList, Cell } from 'recharts';
import { useSpring, animated } from 'react-spring';

// Componente animado para la tarjeta
const AnimatedCard = animated(Card);

const SalesChart = ({ data = [], title = "Facturación Mensual" }) => {
  const [showCombined, setShowCombined] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Animación de entrada para la tarjeta
  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 800 },
    onRest: () => setAnimationComplete(true)
  });

  // Colores modernos con degradados
  const barColors = {
    total: 'url(#totalGradient)',
    USD: 'url(#usdGradient)',
    VES: 'url(#vesGradient)'
  };

  // Customizar tooltip con efecto glassmorphism
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: '#1E1E1E',
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

  // Handler para hover en las barras
  const handleBarMouseEnter = (data, index) => {
    setHoveredBar(index);
  };

  const handleBarMouseLeave = () => {
    setHoveredBar(null);
  };

  // Personalizamos la leyenda para usar emojis
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

  return (
    <AnimatedCard
      style={cardAnimation}
      sx={{
        bgcolor: '#1e1e1e',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        height: '100%',
        overflow: 'hidden',
        backdropFilter: 'blur(8px)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.2), rgba(255,255,255,0))'
        }
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              color: '#fff',
              display: 'flex', 
              alignItems: 'center' 
            }}
          >
            {title}
            <Tooltip title="Muestra la facturación mensual. Puede ver los montos separados por moneda o el total consolidado.">
              <InfoIcon fontSize="small" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer' }} />
            </Tooltip>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ width: '100%', height: 300, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              barGap={8}
              onMouseMove={(e) => e}
            >
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="usdGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
                <linearGradient id="vesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
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
              
              {showCombined ? (
                <Bar 
                  dataKey="total" 
                  name="total" 
                  radius={[6, 6, 0, 0]}
                  onMouseEnter={handleBarMouseEnter}
                  onMouseLeave={handleBarMouseLeave}
                  animationDuration={1500}
                  animationBegin={200}
                  animationEasing="ease-out"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={barColors.total}
                      filter={hoveredBar === index ? 'url(#glow)' : 'none'}
                      style={{
                        transition: 'all 0.3s ease',
                        transform: hoveredBar === index ? 'scaleY(1.03)' : 'scaleY(1)',
                        transformOrigin: 'bottom'
                      }}
                    />
                  ))}
                  <LabelList 
                    dataKey="total" 
                    position="top" 
                    fill="rgba(255, 255, 255, 0.7)"
                    fontSize={11}
                    formatter={(value) => new Intl.NumberFormat('es-ES', { 
                      notation: 'compact',
                      compactDisplay: 'short',
                      maximumFractionDigits: 1
                    }).format(value)}
                    style={{ fontWeight: 500 }}
                  />
                </Bar>
              ) : (
                <>
                  <Bar 
                    dataKey="USD" 
                    name="USD" 
                    radius={[6, 6, 0, 0]}
                    barSize={25}
                    onMouseEnter={handleBarMouseEnter}
                    onMouseLeave={handleBarMouseLeave}
                    animationDuration={1500}
                    animationBegin={100}
                    animationEasing="ease-out"
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-usd-${index}`} 
                        fill={barColors.USD}
                        filter={hoveredBar === index ? 'url(#glow)' : 'none'}
                        style={{
                          transition: 'all 0.3s ease',
                          transform: hoveredBar === index ? 'scaleY(1.03)' : 'scaleY(1)',
                          transformOrigin: 'bottom'
                        }}
                      />
                    ))}
                  </Bar>
                  <Bar 
                    dataKey="VES" 
                    name="VES" 
                    radius={[6, 6, 0, 0]}
                    barSize={25}
                    onMouseEnter={handleBarMouseEnter}
                    onMouseLeave={handleBarMouseLeave}
                    animationDuration={1500}
                    animationBegin={300}
                    animationEasing="ease-out"
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-ves-${index}`} 
                        fill={barColors.VES}
                        filter={hoveredBar === index ? 'url(#glow)' : 'none'}
                        style={{
                          transition: 'all 0.3s ease',
                          transform: hoveredBar === index ? 'scaleY(1.03)' : 'scaleY(1)',
                          transformOrigin: 'bottom'
                        }}
                      />
                    ))}
                  </Bar>
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </AnimatedCard>
  );
};

export default SalesChart;