import React from 'react';
// src/pages/dashboard/components/DashboardConfig/index.js
import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Settings, Dashboard, InsertChart, 
  History, CalendarToday, PieChart
} from '@mui/icons-material';

const DashboardConfig = ({ config, onConfigChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleWidget = (widgetId) => {
    onConfigChange({
      ...config,
      [widgetId]: !config[widgetId]
    });
  };

  const widgets = [
    { id: 'summaryCards', label: 'Tarjetas Resumen', icon: Dashboard },
    { id: 'advancedKPIs', label: 'Métricas Avanzadas', icon: InsertChart },
    { id: 'salesChart', label: 'Gráfico de Ventas', icon: InsertChart },
    { id: 'productDistribution', label: 'Distribución de Servicios', icon: PieChart },
    { id: 'latestTransactions', label: 'Últimas Transacciones', icon: History },
    { id: 'invoiceCalendar', label: 'Calendario de Facturas', icon: CalendarToday }
  ];

  return (
    <>
      <Tooltip title="Configurar dashboard">
        <IconButton onClick={handleClick} size="small">
          <Settings />
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ maxHeight: '80vh' }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Mostrar/Ocultar Widgets
        </Typography>
        
        <Divider />
        
        {widgets.map(widget => (
          <MenuItem key={widget.id} onClick={() => toggleWidget(widget.id)}>
            <ListItemIcon>
              <widget.icon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{widget.label}</ListItemText>
            <Switch
              edge="end"
              checked={config[widget.id]}
              onChange={() => toggleWidget(widget.id)}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DashboardConfig;