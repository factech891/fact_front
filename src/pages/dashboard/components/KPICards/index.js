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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
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
  onRateChange,
  ventasAyerUSD,
  ventasMesPasadoUSD
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
          <CardContent sx={{ 
            py: 1.5, 
            px: 2, 
            position: 'relative',
            height: '100%',
            pb: '12px !important', // Importante para anular el padding-bottom por defecto
            display: 'flex',
            flexDirection: 'column'
          }}>
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
            
            <Box sx={{ mb: 0.5 }}>
              <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.8rem' }}>
                💵 Ingresos USD
              </Typography>
            </Box>
            
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', mb: 0.5 }}>
              <Typography 
                variant="h4" 
                color="white" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1.7rem',
                  lineHeight: 1.2
                }}
              >
                {new Intl.NumberFormat('es-ES').format(Math.round(totalUSD))}
              </Typography>
              
              <Typography 
                variant="body2" 
                color="#AAA"
                sx={{ fontSize: '0.7rem' }}
              >
                ≈ {new Intl.NumberFormat('es-ES').format(Math.round(totalUSD * exchangeRate))} VES
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 'auto' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: cambioIngresos >= 0 ? '#4CAF50' : '#F44336', 
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.75rem'
                }}
              >
                {cambioIngresos >= 0 ? 
                  <TrendingUpIcon sx={{ fontSize: 14, mr: 0.3 }} /> : 
                  <TrendingDownIcon sx={{ fontSize: 14, mr: 0.3 }} />
                }
                {cambioIngresos >= 0 ? '+' : ''}{Math.abs(cambioIngresos)}% este mes
              </Typography>
              
              {/* Comparación con ayer */}
              {ventasAyerUSD !== undefined && (
                <Box sx={{ mt: 0.5 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: totalUSD > ventasAyerUSD ? '#4CAF50' : '#F44336', 
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {totalUSD > ventasAyerUSD ? 
                      <TrendingUpIcon sx={{ fontSize: 12, mr: 0.3 }} /> : 
                      <TrendingDownIcon sx={{ fontSize: 12, mr: 0.3 }} />
                    }
                    vs Ayer: {Math.abs(totalUSD - ventasAyerUSD).toFixed(0)} USD
                    ({Math.abs((totalUSD / Math.max(ventasAyerUSD, 1) - 1) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
              )}
              
              {/* Comparación con mes anterior */}
              {ventasMesPasadoUSD !== undefined && (
                <Box sx={{ mt: 0.5 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: totalUSD > ventasMesPasadoUSD ? '#4CAF50' : '#F44336', 
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {totalUSD > ventasMesPasadoUSD ? 
                      <TrendingUpIcon sx={{ fontSize: 12, mr: 0.3 }} /> : 
                      <TrendingDownIcon sx={{ fontSize: 12, mr: 0.3 }} />
                    }
                    vs Mes anterior: {Math.abs(totalUSD - ventasMesPasadoUSD).toFixed(0)} USD
                    ({Math.abs((totalUSD / Math.max(ventasMesPasadoUSD, 1) - 1) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mt: 0.5
              }}>
                <InfoIcon sx={{ fontSize: 12, color: '#AAA', mr: 0.5 }} />
                <Typography variant="caption" color="#AAA" sx={{ fontSize: '0.7rem' }}>
                  Tasa: {exchangeRate.toFixed(2)} VES/USD
                </Typography>
              </Box>
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
          <CardContent sx={{ 
            py: 1.5, 
            px: 2, 
            position: 'relative',
            height: '100%',
            pb: '12px !important',
            display: 'flex',
            flexDirection: 'column'
          }}>
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
            
            <Box sx={{ mb: 0.5 }}>
              <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.8rem' }}>
                💰 Ingresos VES
              </Typography>
            </Box>
            
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', mb: 0.5 }}>
              <Typography 
                variant="h4" 
                color="white" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1.7rem',
                  lineHeight: 1.2
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
                  fontSize: '0.75rem'
                }}
              >
                {cambioIngresos >= 0 ? 
                  <TrendingUpIcon sx={{ fontSize: 14, mr: 0.3 }} /> : 
                  <TrendingDownIcon sx={{ fontSize: 14, mr: 0.3 }} />
                }
                {cambioIngresos >= 0 ? '+' : ''}{Math.abs(cambioIngresos)}% este mes
              </Typography>
            </Box>
            
            {/* Exchange Rate Selector */}
            <Box sx={{ mt: 'auto' }}>
              <ExchangeRateSelector 
                onRateChange={onRateChange}
                totalVES={totalVES}
                initialRate={exchangeRate} // Añadido para sincronización
              />
            </Box>
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
          <CardContent sx={{ 
            py: 1.5, 
            px: 2, 
            position: 'relative',
            height: '100%',
            pb: '12px !important',
            display: 'flex',
            flexDirection: 'column'
          }}>
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
            
            <Box sx={{ mb: 0.5 }}>
              <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.8rem' }}>
                📊 Facturas
              </Typography>
            </Box>
            
            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center'
            }}>
              <Typography 
                variant="h4" 
                color="white" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1.7rem',
                  lineHeight: 1.2
                }}
              >
                {totalFacturas}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 'auto' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: cambioFacturas >= 0 ? '#4CAF50' : '#F44336', 
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.75rem'
                }}
              >
                {cambioFacturas >= 0 ? 
                  <TrendingUpIcon sx={{ fontSize: 14, mr: 0.3 }} /> : 
                  <TrendingDownIcon sx={{ fontSize: 14, mr: 0.3 }} />
                }
                {cambioFacturas >= 0 ? '+' : ''}{Math.abs(cambioFacturas)}% este mes
              </Typography>
            </Box>
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
          <CardContent sx={{ 
            py: 1.5, 
            px: 2, 
            position: 'relative',
            height: '100%',
            pb: '12px !important',
            display: 'flex',
            flexDirection: 'column'
          }}>
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
            
            <Box sx={{ mb: 0.5 }}>
              <Typography variant="subtitle2" color="#CCC" sx={{ fontSize: '0.8rem' }}>
                👥 Clientes
              </Typography>
            </Box>
            
            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center'
            }}>
              <Typography 
                variant="h4" 
                color="white" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1.7rem',
                  lineHeight: 1.2
                }}
              >
                {totalClientes}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 'auto' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: cambioClientes >= 0 ? '#4CAF50' : '#F44336', 
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.75rem'
                }}
              >
                {cambioClientes >= 0 ? 
                  <TrendingUpIcon sx={{ fontSize: 14, mr: 0.3 }} /> : 
                  <TrendingDownIcon sx={{ fontSize: 14, mr: 0.3 }} />
                }
                {cambioClientes >= 0 ? '+' : ''}{Math.abs(cambioClientes)}% este mes
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default KPICards;