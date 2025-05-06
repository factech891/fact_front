import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
  Grid,
  Paper,
  Chip,
  Fade,
  Badge,
  Popover
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Componente DailyBillingChart optimizado para trabajar con useDashboard
const DailyBillingChart = ({
  data = [],
  title = "Facturación Diaria",
  exchangeRate = 40, // Tasa de cambio por defecto
  timeRange = null, // Nueva prop para recibir el período seleccionado
}) => {
  // Inicializar al mes actual
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendarData, setCalendarData] = useState([]);

  // Estado para el popover
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverDay, setPopoverDay] = useState(null);

  // AÑADIR ESTE NUEVO useEffect después de las declaraciones de estado
  useEffect(() => {
    // Sincronizar con el período seleccionado desde el Dashboard
    if (timeRange && timeRange.startDate) {
      const date = new Date(timeRange.startDate);
      // Solo actualizar si realmente es un mes/año diferente
      if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) {
        setCurrentMonth(date.getMonth());
        setCurrentYear(date.getFullYear());
      }
    }
  }, [timeRange, currentMonth, currentYear]); // Observar cambios en timeRange

  // Procesar datos para el calendario
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Agrupar facturas por día exacto
    const diasMap = {};

    data.forEach(item => {
      if (!item.name) return;

      // La clave es directamente el nombre (ej: "20 mar")
      const dateKey = item.name;

      // Extraer día del nombre (formato: "20 mar")
      const dateParts = dateKey.split(' ');
      if (dateParts.length < 2) return;

      const day = parseInt(dateParts[0], 10);
      const monthAbbr = dateParts[1].toLowerCase();

      // Mapear abreviatura de mes a número (0-11)
      const monthMap = {
        'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
      };

      const month = monthMap[monthAbbr];

      // Solo procesar si el mes/año coincide con el seleccionado
      // CORRECCIÓN: El año también debe coincidir con currentYear si la data de 'item' incluyera el año.
      // Dado que 'item.name' es "20 mar", asumimos que la data ya está pre-filtrada por año o es para el año actual.
      // Para una sincronización completa con timeRange, el `data` que llega debería ser del `currentYear` que `timeRange` indica.
      if (month === currentMonth) { // Podríamos añadir && (item.year === currentYear) si el item lo tuviera
        if (!diasMap[day]) {
          diasMap[day] = {
            day,
            total: 0,
            USD: 0,
            VES: 0,
            facturas: 0,
            invoiceList: []
          };
        }

        // Actualizar totales
        diasMap[day].USD += item.USD || 0;
        diasMap[day].VES += item.VES || 0;

        // Calcular total en USD (convertir VES a USD usando la tasa de cambio)
        const vesInUsd = (item.VES || 0) / exchangeRate;
        diasMap[day].total = diasMap[day].USD + vesInUsd;

        // IMPORTANTE: Incrementar contador de facturas
        diasMap[day].facturas = (item.facturas || 1);

        // Información de la factura para detalles (si necesitas guardar detalles adicionales)
        diasMap[day].invoiceList.push({
          id: item.id || `Factura-${diasMap[day].invoiceList.length + 1}`,
          USD: item.USD || 0,
          VES: item.VES || 0,
          total: (item.USD || 0) + ((item.VES || 0) / exchangeRate) // Total en USD
        });
      }
    });

    // Crear datos del calendario
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const adjustedFirstDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    const days = [];

    // Días vacíos antes del primer día del mes
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push({
        value: null,
        isEmpty: true
      });
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const hasData = diasMap[day] !== undefined;

      days.push({
        value: day,
        isEmpty: false,
        hasData,
        ...(hasData ? diasMap[day] : { total: 0, USD: 0, VES: 0, facturas: 0, invoiceList: [] })
      });
    }

    // Completar la última semana
    const remainingCells = 7 - (days.length % 7 || 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        days.push({
          value: null,
          isEmpty: true
        });
      }
    }

    setCalendarData(days);
  }, [data, currentMonth, currentYear, exchangeRate]);

  // Nombre de los meses
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Nombres abreviados de los días
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Navegar al mes anterior
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    handlePopoverClose();
  };

  // Navegar al mes siguiente
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    handlePopoverClose();
  };

  // Manejar clic en un día (abrir popover)
  const handleDayClick = (event, day) => {
    if (day.hasData) {
      setAnchorEl(event.currentTarget);
      setPopoverDay(day);
    }
  };

  // Cerrar popover
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverDay(null);
  };

  // Verificar si el popover está abierto
  const open = Boolean(anchorEl);

  // Formatear valor monetario
  const formatCurrency = (value, currency = 'USD') => {
    if (typeof value !== 'number') return '0.00';
    return value.toLocaleString('es-ES', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    });
  };

  // Determinar el color para el día basado en la comparación con el día anterior
  const getDayColor = (day, index) => {
    if (!day.hasData) return {
      bg: '#333',
      border: 'none',
      isUp: null
    };

    // Buscar el día anterior con datos
    let prevDay = null;
    let i = index - 1;

    while (i >= 0) {
      if (calendarData[i].hasData) {
        prevDay = calendarData[i];
        break;
      }
      i--;
    }

    // Si no hay día anterior, usar color neutro
    if (!prevDay) {
      return {
        bg: '#2E7D32',
        border: 'none',
        isUp: null
      };
    }

    // Comparar con el día anterior
    const isUp = day.total >= prevDay.total;

    if (isUp) {
      return {
        bg: '#2E7D32',
        border: 'none',
        isUp: true
      };
    } else {
      return {
        bg: '#C62828',
        border: 'none',
        isUp: false
      };
    }
  };

  // Encontrar el día con el valor máximo
  const maxDayValue = Math.max(...calendarData.filter(day => day.hasData).map(day => day.total), 0);

  return (
    <Card
      sx={{
        bgcolor: '#1E1E1E',
        borderRadius: 2,
        border: '1px solid #333',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" color="white">
              {title}
            </Typography>
            <Tooltip title="Muestra la facturación diaria en el calendario. Los días con facturas se destacan y muestran el número de facturas.">
              <InfoIcon fontSize="small" sx={{ ml: 1, color: '#AAA', cursor: 'pointer' }} />
            </Tooltip>
          </Box>

          <IconButton size="small" sx={{ color: '#AAA' }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Control de navegación del mes */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <IconButton
            size="small"
            sx={{
              color: '#AAA',
              bgcolor: 'rgba(255,255,255,0.05)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
            onClick={goToPrevMonth}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h6"
            color="white"
            sx={{
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}
          >
            {monthNames[currentMonth]} {currentYear}
          </Typography>

          <IconButton
            size="small"
            sx={{
              color: '#AAA',
              bgcolor: 'rgba(255,255,255,0.05)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
            onClick={goToNextMonth}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>

        {/* Calendario optimizado */}
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={1}>
            {/* Días de la semana */}
            {weekDays.map((day, index) => (
              <Grid item xs={12/7} key={`weekday-${index}`}>
                <Typography
                  variant="caption"
                  align="center"
                  sx={{
                    display: 'block',
                    fontWeight: 'medium',
                    color: '#AAA'
                  }}
                >
                  {day}
                </Typography>
              </Grid>
            ))}

            {/* Celdas del calendario */}
            {calendarData.map((day, index) => {
              const { bg, isUp } = day.hasData ? getDayColor(day, index) : { bg: '#333', isUp: null };
              const hasMultipleInvoices = day.facturas > 1;

              return (
                <Grid item xs={12/7} key={`day-${index}`}>
                  {day.isEmpty ? (
                    <Box
                      sx={{
                        height: 60,
                        bgcolor: 'transparent'
                      }}
                    />
                  ) : (
                    <Paper
                      elevation={day.hasData ? 3 : 0}
                      sx={{
                        p: day.hasData ? 1 : 0.5,
                        height: 60,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: 1,
                        cursor: day.hasData ? 'pointer' : 'default',
                        position: 'relative',
                        bgcolor: day.hasData ? bg : '#333',
                        opacity: day.hasData ? 1 : 0.6,
                        boxShadow: day.hasData ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                        overflow: 'visible',
                        transition: 'all 0.15s ease-in-out',
                        '&:hover': day.hasData ? {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                          opacity: 0.95
                        } : {}
                      }}
                      onClick={(e) => day.hasData && handleDayClick(e, day)}
                    >
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: day.hasData ? 1 : 0
                      }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'bold',
                            color: day.hasData ? 'white' : '#777'
                          }}
                        >
                          {day.value}
                        </Typography>

                        {day.hasData && day.total > maxDayValue * 0.7 && (
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              bgcolor: '#FFD700',
                              ml: 0.5
                            }}
                          />
                        )}
                      </Box>

                      {day.hasData && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Badge
                              badgeContent={day.facturas}
                              color="primary"
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                              sx={{
                                '& .MuiBadge-badge': {
                                  fontSize: '0.65rem',
                                  height: 16,
                                  minWidth: 16,
                                  padding: '0 4px',
                                  bgcolor: '#1976D2', // Azul más estándar
                                  fontWeight: 'bold'
                                }
                              }}
                            >
                              <AssignmentIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }} />
                            </Badge>
                          </Box>
                        </>
                      )}
                    </Paper>
                  )}
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Popover con detalles del día */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          slotProps={{
            paper: {
              sx: {
                bgcolor: 'rgba(37, 37, 37, 0.96)',
                color: 'white',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                maxWidth: 320,
                width: '100%'
              }
            }
          }}
        >
          {popoverDay && (
            <Box sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                color="white"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  pb: 1
                }}
              >
                Detalles del día {popoverDay.value} de {monthNames[currentMonth]}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#AAA" sx={{ display: 'block', mb: 0.5 }}>
                    USD:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#4CAF50',
                      fontWeight: 'bold'
                    }}
                  >
                    {formatCurrency(popoverDay.USD, 'USD')}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="#AAA" sx={{ display: 'block', mb: 0.5 }}>
                    VES:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#2196F3',
                      fontWeight: 'bold'
                    }}
                  >
                    {formatCurrency(popoverDay.VES, 'VES')}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="#AAA" sx={{ display: 'block', mb: 0.5 }}>
                    Facturas:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {popoverDay.facturas}
                    </Typography>

                    <Chip
                      label={popoverDay.facturas === 1 ? "factura" : "facturas"}
                      size="small"
                      sx={{
                        ml: 1,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: '#AAA',
                        height: 20
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="#AAA" sx={{ display: 'block', mb: 0.5 }}>
                    Total:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {formatCurrency(popoverDay.total, 'USD')}
                  </Typography>
                </Grid>

                {/* IMPORTANTE: He eliminado completamente la sección que mostraba la lista de facturas */}
              </Grid>
            </Box>
          )}
        </Popover>

        {/* Leyenda */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          mt: 2,
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '2px',
                bgcolor: '#2E7D32',
                mr: 1
              }}
            />
            <Typography variant="caption" color="#AAA">Aumento vs día anterior</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '2px',
                bgcolor: '#C62828',
                mr: 1
              }}
            />
            <Typography variant="caption" color="#AAA">Disminución vs día anterior</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: '#FFD700',
                mr: 1
              }}
            />
            <Typography variant="caption" color="#AAA">Mayor facturación del mes</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              badgeContent="2+"
              color="primary"
              sx={{
                mr: 1,
                '& .MuiBadge-badge': {
                  bgcolor: '#1976D2',
                  fontSize: '0.65rem',
                  height: 16,
                  minWidth: 16,
                  padding: '0 4px'
                }
              }}
            >
              <AssignmentIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }} />
            </Badge>
            <Typography variant="caption" color="#AAA">Múltiples facturas</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DailyBillingChart;