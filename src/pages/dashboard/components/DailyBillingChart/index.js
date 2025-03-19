import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  IconButton, 
  Tooltip, 
  Typography,
  Grid,
  Paper
} from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TodayIcon from '@mui/icons-material/Today';

// Componente DailyBillingChart con calendario y velas simples
const DailyBillingChart = ({ 
  data = [], 
  title = "Facturación Diaria",
}) => {
  // Inicializar al mes actual
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendarData, setCalendarData] = useState([]);
  const [showBarChart, setShowBarChart] = useState(false);
  
  // Procesar datos para el calendario y las barras
  useEffect(() => {
    console.log("Datos recibidos en DailyBillingChart:", data);
    
    if (!data || data.length === 0) return;
    
    // Crear un mapa para agrupar facturas por día
    const dailyData = {};
    
    data.forEach(item => {
      // Extraer día y mes de name (formato: "13 mar")
      const dateParts = item.name.split(' ');
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
      if (month === currentMonth && !isNaN(day)) {
        const dateKey = `${day}`;
        
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = {
            day,
            total: 0,
            USD: 0,
            VES: 0,
            facturas: 0
          };
        }
        
        dailyData[dateKey].total += item.total || 0;
        dailyData[dateKey].USD += item.USD || 0;
        dailyData[dateKey].VES += item.VES || 0;
        dailyData[dateKey].facturas += 1;
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
      const hasData = dailyData[day] !== undefined;
      
      days.push({
        value: day,
        isEmpty: false,
        hasData,
        ...(hasData ? dailyData[day] : { total: 0, USD: 0, VES: 0, facturas: 0 })
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
  }, [data, currentMonth, currentYear]);
  
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
    setSelectedDay(null);
  };
  
  // Navegar al mes siguiente
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };
  
  // Seleccionar un día para ver detalles
  const handleDayClick = (day) => {
    if (day.hasData) {
      setSelectedDay(day);
    }
  };
  
  // Alternar entre calendario y gráfico de barras
  const toggleView = () => {
    setShowBarChart(!showBarChart);
  };
  
  // Formatear valor monetario
  const formatCurrency = (value, currency = 'USD') => {
    if (typeof value !== 'number') return '0.00';
    return value.toLocaleString('es-ES', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    });
  };
  
  // Generar datos para el gráfico de barras
  const getBarChartData = () => {
    return calendarData
      .filter(day => day.hasData)
      .map(day => ({
        day: day.value,
        value: day.total,
        USD: day.USD,
        VES: day.VES,
        facturas: day.facturas,
        formattedDay: `${day.value} ${monthNames[currentMonth].substring(0, 3)}`
      }))
      .sort((a, b) => a.day - b.day);
  };
  
  // Componente de barra personalizado para mostrar velas
  const CustomBar = ({ bar }) => {
    if (!bar || !bar.data) return null;
    
    const { x, y, width, height, data } = bar;
    
    // Calcular colores basados en valor comparativo con el día anterior
    let color = '#4CAF50'; // Verde por defecto
    const barChartData = getBarChartData();
    const currentIndex = barChartData.findIndex(item => item.day === data.day);
    
    // Si hay un día anterior para comparar
    if (currentIndex > 0) {
      const previousValue = barChartData[currentIndex - 1].value;
      // Rojo si el valor actual es menor que el anterior
      if (data.value < previousValue) {
        color = '#FF5252';
      }
    }
    
    // Ancho ajustado para simular vela
    const candleWidth = width * 0.6;
    const xPos = x + (width - candleWidth) / 2;
    
    return (
      <g>
        {/* Línea vertical */}
        <line
          x1={x + width / 2}
          y1={y - 10}
          x2={x + width / 2}
          y2={y + height + 5}
          stroke={color}
          strokeWidth={1}
        />
        
        {/* Cuerpo de la vela */}
        <rect
          x={xPos}
          y={y}
          width={candleWidth}
          height={height}
          fill={color}
          rx={2}
        />
        
        {/* Etiqueta con el valor */}
        <text
          x={x + width / 2}
          y={y - 15}
          textAnchor="middle"
          fill="#CCC"
          fontSize={10}
        >
          {data.value.toFixed(0)}
        </text>
      </g>
    );
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
            <Tooltip title="Muestra la facturación diaria en el calendario. Los días con facturas se destacan y muestran el monto total.">
              <InfoIcon fontSize="small" sx={{ ml: 1, color: '#AAA', cursor: 'pointer' }} />
            </Tooltip>
          </Typography>
          
          <Box>
            <IconButton 
              size="small" 
              sx={{ color: '#AAA', mr: 1 }}
              onClick={toggleView}
            >
              <TodayIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: '#AAA' }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
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
            sx={{ color: '#AAA' }}
            onClick={goToPrevMonth}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Typography variant="subtitle1" color="white">
            {monthNames[currentMonth]} {currentYear}
          </Typography>
          
          <IconButton 
            size="small" 
            sx={{ color: '#AAA' }}
            onClick={goToNextMonth}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
        
        {showBarChart ? (
          // Gráfico de barras con velas
          <Box sx={{ height: 300 }}>
            <ResponsiveBar
              data={getBarChartData()}
              keys={['value']}
              indexBy="formattedDay"
              margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={'#4CAF50'}
              borderRadius={4}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Día',
                legendPosition: 'middle',
                legendOffset: 32,
                tickValues: getBarChartData().map(d => d.formattedDay),
                renderTick: (tick) => {
                  return (
                    <g transform={`translate(${tick.x},${tick.y})`}>
                      <line stroke="#555" y2="6" />
                      <text
                        textAnchor="middle"
                        dominantBaseline="text-before-edge"
                        style={{ fill: '#CCC', fontSize: 10 }}
                        y={10}
                      >
                        {tick.value}
                      </text>
                    </g>
                  );
                }
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Monto',
                legendPosition: 'middle',
                legendOffset: -40,
                format: value => `$${value.toFixed(0)}`,
                tickValues: 5,
                renderTick: (tick) => {
                  return (
                    <g transform={`translate(${tick.x},${tick.y})`}>
                      <line stroke="#555" x2="-6" />
                      <text
                        textAnchor="end"
                        dominantBaseline="middle"
                        style={{ fill: '#CCC', fontSize: 10 }}
                        x={-10}
                      >
                        {`$${tick.value.toFixed(0)}`}
                      </text>
                    </g>
                  );
                }
              }}
              enableGridX={false}
              enableGridY={true}
              gridYValues={5}
              theme={{
                axis: {
                  domain: {
                    line: {
                      stroke: '#444'
                    }
                  },
                  ticks: {
                    line: {
                      stroke: '#444'
                    }
                  },
                  grid: {
                    line: {
                      stroke: '#333',
                      strokeDasharray: '3 3'
                    }
                  }
                }
              }}
              barComponent={CustomBar}
              tooltip={({ data }) => (
                <div
                  style={{
                    padding: 12,
                    background: '#242424',
                    border: '1px solid #444',
                    borderRadius: 4,
                    color: '#CCC'
                  }}
                >
                  <strong>Día {data.formattedDay}</strong>
                  <div style={{ marginTop: 5 }}>
                    <div>Total: {formatCurrency(data.value, 'USD')}</div>
                    <div>USD: {formatCurrency(data.USD, 'USD')}</div>
                    <div>VES: {formatCurrency(data.VES, 'VES')}</div>
                    <div>Facturas: {data.facturas}</div>
                  </div>
                </div>
              )}
              animate={true}
              role="application"
              ariaLabel="Facturación diaria"
            />
          </Box>
        ) : (
          // Calendario con días destacados
          <Grid container spacing={1}>
            {/* Días de la semana */}
            {weekDays.map((day, index) => (
              <Grid item xs={12/7} key={`weekday-${index}`}>
                <Typography 
                  variant="caption" 
                  align="center" 
                  sx={{ 
                    display: 'block', 
                    fontWeight: 'bold',
                    color: '#AAA',
                    mb: 1
                  }}
                >
                  {day}
                </Typography>
              </Grid>
            ))}
            
            {/* Celdas del calendario */}
            {calendarData.map((day, index) => (
              <Grid item xs={12/7} key={`day-${index}`}>
                {day.isEmpty ? (
                  <Box 
                    sx={{ 
                      height: 50, 
                      bgcolor: 'transparent' 
                    }}
                  />
                ) : (
                  <Paper
                    elevation={day.hasData ? 3 : 0}
                    sx={{
                      p: 1,
                      height: 50,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderRadius: 1,
                      cursor: day.hasData ? 'pointer' : 'default',
                      position: 'relative',
                      bgcolor: day.hasData ? (
                        // Si hay un día anterior para comparar, colorear según la comparación
                        index > 0 && calendarData[index-1].hasData ?
                          (day.total >= calendarData[index-1].total ? '#2E7D32' : '#C62828') :
                          '#2E7D32'
                      ) : '#333',
                      opacity: day.hasData ? 1 : 0.6,
                      border: selectedDay?.value === day.value ? '2px solid #FFF' : 'none',
                      '&:hover': {
                        bgcolor: day.hasData ? (
                          index > 0 && calendarData[index-1].hasData ?
                            (day.total >= calendarData[index-1].total ? '#388E3C' : '#D32F2F') :
                            '#388E3C'
                        ) : '#333',
                        boxShadow: day.hasData ? '0 0 8px rgba(255,255,255,0.3)' : 'none'
                      }
                    }}
                    onClick={() => handleDayClick(day)}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: day.hasData ? 'white' : '#777'
                      }}
                    >
                      {day.value}
                    </Typography>
                    {day.hasData && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          color: 'white'
                        }}
                      >
                        ${day.total.toFixed(0)}
                      </Typography>
                    )}
                    {day.hasData && day.facturas > 1 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: '#FFC107',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: '8px', 
                            color: 'black',
                            lineHeight: 1
                          }}
                        >
                          {day.facturas}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                )}
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Detalles del día seleccionado */}
        {selectedDay && !showBarChart && (
          <Box sx={{ mt: 2 }}>
            <Paper
              sx={{
                p: 2,
                bgcolor: '#333',
                borderRadius: 2,
                border: '1px solid #444'
              }}
            >
              <Typography variant="subtitle1" color="white" gutterBottom>
                Detalles del día {selectedDay.value} de {monthNames[currentMonth]}
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#AAA">USD:</Typography>
                  <Typography variant="body1" color="#4CAF50">
                    {formatCurrency(selectedDay.USD, 'USD')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#AAA">VES:</Typography>
                  <Typography variant="body1" color="#2196F3">
                    {formatCurrency(selectedDay.VES, 'VES')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#AAA">Facturas:</Typography>
                  <Typography variant="body1" color="white">
                    {selectedDay.facturas}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#AAA">Total:</Typography>
                  <Typography variant="body1" color="white">
                    {formatCurrency(selectedDay.total, 'USD')}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
        
        {/* Leyenda */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: '#4CAF50', mr: 1 }}></Box>
            <Typography variant="caption" color="#AAA">Aumento vs día anterior</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: '#FF5252', mr: 1 }}></Box>
            <Typography variant="caption" color="#AAA">Disminución vs día anterior</Typography>
          </Box>
        </Box>
        
        {/* Información de depuración condicional */}
        {data.length === 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#333', borderRadius: 2 }}>
            <Typography variant="caption" color="#FFC107">
              No hay datos disponibles. Asegúrate de que:
            </Typography>
            <ul style={{ margin: '8px 0', paddingLeft: 20, color: '#AAA', fontSize: '12px' }}>
              <li>El hook useDashboard.js contiene la función facturasPorDia actualizada</li>
              <li>Dashboard.js está pasando facturasPorDia a este componente</li>
              <li>El rango de fechas seleccionado contiene facturas</li>
            </ul>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyBillingChart;