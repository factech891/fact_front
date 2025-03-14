// src/pages/dashboard/components/KPICards/index.js
import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Avatar 
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import InfoIcon from '@mui/icons-material/Info';
import ExchangeRateSelector from '../ExchangeRateSelector';

const KPICards = ({ 
  totalUSD, 
  totalVES, 
  totalFacturas, 
  totalClientes, 
  cambioIngresos, 
  cambioFacturas, 
  cambioClientes, 
  exchangeRate, 
  onRateChange 
}) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* KPI 1: USD */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={{ 
          borderRadius: 2, 
          bgcolor: '#1E1E1E',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #333',
          position: 'relative',
          overflow: 'visible'
        }}>
          <CardContent sx={{ py: 1.5, px: 2, position: 'relative' }}>
            <Box sx={{ 
              position: 'absolute',
              top: '-10px',
              right: '10px',
              zIndex: 1
            }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#4CAF50',
                  width: 32,
                  height: 32,
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: 18 }} />
              </Avatar>
            </Box>
            
            <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.85rem' }}>
              💵 Ingresos USD
            </Typography>
            
            <Typography 
              variant="h4" 
              color="white" 
              sx={{ 
                mt: 1, 
                mb: 0.5, 
                fontWeight: 'bold',
                fontSize: '1.8rem'
              }}
            >
              {new Intl.NumberFormat('es-ES').format(Math.round(totalUSD))}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="#AAA"
              sx={{ fontSize: '0.75rem' }}
            >
              Equivale a: {new Intl.NumberFormat('es-ES').format(Math.round(totalUSD * exchangeRate))} VES
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: cambioIngresos >= 0 ? '#4CAF50' : '#F44336', 
                display: 'flex',
                alignItems: 'center',
                mt: 1
              }}
            >
              {cambioIngresos >= 0 ? '↑' : '↓'} {Math.abs(cambioIngresos)}% este mes
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mt: 1
            }}>
              <InfoIcon sx={{ fontSize: 14, color: '#AAA', mr: 0.5 }} />
              <Typography variant="caption" color="#AAA">
                Tasa: {exchangeRate.toFixed(2)} VES/USD
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* KPI 2: VES */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={{ 
          borderRadius: 2, 
          bgcolor: '#1E1E1E',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #333',
          position: 'relative',
          overflow: 'visible'
        }}>
          <CardContent sx={{ py: 1.5, px: 2, position: 'relative' }}>
            <Box sx={{ 
              position: 'absolute',
              top: '-10px',
              right: '10px',
              zIndex: 1
            }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#4477CE',
                  width: 32,
                  height: 32,
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: 18 }} />
              </Avatar>
            </Box>
            
            <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.85rem' }}>
              💰 Ingresos VES
            </Typography>
            
            <Typography 
              variant="h4" 
              color="white" 
              sx={{ 
                mt: 1, 
                mb: 0.5, 
                fontWeight: 'bold',
                fontSize: '1.8rem'
              }}
            >
              {new Intl.NumberFormat('es-ES').format(Math.round(totalVES))}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: cambioIngresos >= 0 ? '#4CAF50' : '#F44336', 
                display: 'flex',
                alignItems: 'center',
                mt: 0.5,
                mb: 1
              }}
            >
              {cambioIngresos >= 0 ? '↑' : '↓'} {Math.abs(cambioIngresos)}% este mes
            </Typography>
            
            {/* Selector de tasa de cambio */}
            <ExchangeRateSelector 
              onRateChange={onRateChange}
              totalVES={totalVES}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* KPI 3: Facturas */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={{ 
          borderRadius: 2, 
          bgcolor: '#1E1E1E',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #333',
          position: 'relative',
          overflow: 'visible'
        }}>
          <CardContent sx={{ py: 1.5, px: 2, position: 'relative' }}>
            <Box sx={{ 
              position: 'absolute',
              top: '-10px',
              right: '10px',
              zIndex: 1
            }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#FFA726',
                  width: 32,
                  height: 32,
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              >
                <ReceiptIcon sx={{ fontSize: 18 }} />
              </Avatar>
            </Box>
            
            <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.85rem' }}>
              📊 Facturas
            </Typography>
            
            <Typography 
              variant="h4" 
              color="white" 
              sx={{ 
                mt: 1, 
                mb: 0.5, 
                fontWeight: 'bold',
                fontSize: '1.8rem'
              }}
            >
              {totalFacturas}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: cambioFacturas >= 0 ? '#4CAF50' : '#F44336', 
                display: 'flex',
                alignItems: 'center',
                mt: 1
              }}
            >
              {cambioFacturas >= 0 ? '↑' : '↓'} {Math.abs(cambioFacturas)}% este mes
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      {/* KPI 4: Clientes */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={{ 
          borderRadius: 2, 
          bgcolor: '#1E1E1E',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #333',
          position: 'relative',
          overflow: 'visible'
        }}>
          <CardContent sx={{ py: 1.5, px: 2, position: 'relative' }}>
            <Box sx={{ 
              position: 'absolute',
              top: '-10px',
              right: '10px',
              zIndex: 1
            }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#4477CE',
                  width: 32,
                  height: 32,
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              >
                <PeopleIcon sx={{ fontSize: 18 }} />
              </Avatar>
            </Box>
            
            <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.85rem' }}>
              👥 Clientes
            </Typography>
            
            <Typography 
              variant="h4" 
              color="white" 
              sx={{ 
                mt: 1, 
                mb: 0.5, 
                fontWeight: 'bold',
                fontSize: '1.8rem'
              }}
            >
              {totalClientes}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: cambioClientes >= 0 ? '#4CAF50' : '#F44336', 
                display: 'flex',
                alignItems: 'center',
                mt: 1
              }}
            >
              {cambioClientes >= 0 ? '↑' : '↓'} {Math.abs(cambioClientes)}% este mes
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default KPICards;