import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const SalesChart = ({ data = [], title = "Facturación Mensual" }) => {
  const [showCombined, setShowCombined] = useState(true);

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
          <p className="label" style={{ color: '#CCC', marginBottom: '8px' }}>{`Mes: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ 
              color: entry.color,
              margin: '2px 0'
            }}>
              {`${entry.name === 'total' ? 'Total' : entry.name}: ${entry.value.toLocaleString('es-ES', {
                style: 'currency',
                currency: entry.name === 'VES' ? 'VES' : 'USD'
              })}`}
            </p>
          ))}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="#CCC" sx={{ display: 'flex', alignItems: 'center' }}>
            {title}
            <Tooltip title="Muestra la facturación mensual. Puede ver los montos separados por moneda o el total consolidado.">
              <InfoIcon fontSize="small" sx={{ ml: 1, color: '#AAA', cursor: 'pointer' }} />
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
                    '& .MuiSwitch-track': { backgroundColor: '#555' },
                    '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#3f51b5' }
                  }}
                />
              }
              label={
                <Typography variant="caption" color="#AAA">
                  {showCombined ? "Total" : "Por moneda"}
                </Typography>
              }
              sx={{ mr: 1 }}
            />
            <IconButton size="small" sx={{ color: '#AAA' }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
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
              <Legend wrapperStyle={{ color: '#AAA' }} />
              
              {showCombined ? (
                <Bar dataKey="total" name="Total" fill="#4285F4" barSize={30} />
              ) : (
                <>
                  <Bar dataKey="USD" name="USD" fill="#4CAF50" barSize={15} />
                  <Bar dataKey="VES" name="VES" fill="#4285F4" barSize={15} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesChart;