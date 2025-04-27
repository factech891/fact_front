import React from 'react';
// src/pages/dashboard/constants/dashboardConstants.js

export const CHART_COLORS = {
  primary: '#0088FE',
  success: '#00C49F',
  warning: '#FFBB28',
  error: '#FF8042',
  purple: '#8884d8'
};

// Rangos de tiempo combinados (corto y largo plazo)
export const TIME_RANGES = [
  // Rangos específicos (corto plazo)
  { value: 'today', label: 'Hoy' },
  { value: 'yesterday', label: 'Ayer' },
  { value: 'thisWeek', label: 'Esta semana' },
  { value: 'lastWeek', label: 'Semana anterior' },
  { value: 'thisMonth', label: 'Este mes' },
  { value: 'lastMonth', label: 'Mes anterior' },
  
  // Rangos relativos (más largos)
  { value: '1M', label: 'Últimos 30 días' },
  { value: '3M', label: 'Últimos 3 meses' },
  { value: '6M', label: 'Últimos 6 meses' },
  { value: '1Y', label: 'Último año' },
  { value: 'thisYear', label: 'Este año' },
  
  // Personalizado
  { value: 'custom', label: 'Personalizado' }
];

// Datos de ejemplo (luego se reemplazarán con datos reales)
export const MOCK_SALES_DATA = [
  { mes: 'Ene', ventas: 4000, pedidos: 240, promedio: 167, meta: 4200 },
  { mes: 'Feb', ventas: 3000, pedidos: 198, promedio: 152, meta: 4200 },
  { mes: 'Mar', ventas: 5000, pedidos: 305, promedio: 164, meta: 4200 },
  { mes: 'Abr', ventas: 4600, pedidos: 275, promedio: 167, meta: 4200 },
  { mes: 'May', ventas: 6000, pedidos: 349, promedio: 172, meta: 4200 },
  { mes: 'Jun', ventas: 5400, pedidos: 310, promedio: 174, meta: 4200 }
];

export const MOCK_PRODUCT_DATA = [
  { name: 'Producto A', value: 400 },
  { name: 'Producto B', value: 300 },
  { name: 'Producto C', value: 300 },
  { name: 'Producto D', value: 200 }
];

export const CHART_STYLES = {
  tooltip: {
    contentStyle: {
      backgroundColor: '#fff',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }
  },
  grid: {
    stroke: '#f5f5f5'
  }
};