import React from 'react';
// Opciones de tipo de gráfico
export const CHART_OPTIONS = [
  { id: 'area', label: 'Área' },
  { id: 'line', label: 'Línea' },
  { id: 'doubleAxis', label: 'Doble Eje' }
];

// Colores del gráfico
export const CHART_COLORS = {
  primary: '#2196F3',
  secondary: '#FF9800',
  positive: '#2ecc71',
  negative: '#e74c3c'
};

// Colores para el gráfico de doble eje
export const DOUBLE_AXIS_COLORS = {
  USD: "#4a80ff",  // Azul para USD
  VES: "#ff9f40",  // Naranja para VES
  total: "url(#totalGradient)"  // Gradiente para el total
};

// Función para obtener color basado en valor
export const getColor = (value, threshold = 0) => {
  return value >= threshold ? CHART_COLORS.positive : CHART_COLORS.negative;
};

// Datos de ejemplo (puedes eliminar esto cuando conectes con datos reales)
export const SAMPLE_DATA = [
  { month: 'Ene', value: 4000, target: 4200 },
  { month: 'Feb', value: 3000, target: 4200 },
  { month: 'Mar', value: 5000, target: 4200 },
  { month: 'Abr', value: 4500, target: 4200 },
  { month: 'May', value: 6000, target: 4200 },
  { month: 'Jun', value: 5500, target: 4200 }
];

// Datos de ejemplo para el gráfico de doble eje
export const DOUBLE_AXIS_DATA = [
  { name: 'Ene', valoresMensualesUSD: 820, ingresosUSD: 800, valoresMensualesVES: 29000, ingresosVES: 28000, total: 1500 },
  { name: 'Feb', valoresMensualesUSD: 940, ingresosUSD: 950, valoresMensualesVES: 33500, ingresosVES: 33000, total: 1750 },
  { name: 'Mar', valoresMensualesUSD: 1150, ingresosUSD: 1100, valoresMensualesVES: 39000, ingresosVES: 37000, total: 2025 },
  { name: 'Abr', valoresMensualesUSD: 1020, ingresosUSD: 1050, valoresMensualesVES: 34500, ingresosVES: 35000, total: 1950 },
  { name: 'May', valoresMensualesUSD: 1250, ingresosUSD: 1200, valoresMensualesVES: 43500, ingresosVES: 42000, total: 2250 },
  { name: 'Jun', valoresMensualesUSD: 1350, ingresosUSD: 1300, valoresMensualesVES: 47500, ingresosVES: 46000, total: 2450 },
  { name: 'Jul', valoresMensualesUSD: 1350, ingresosUSD: 1350, valoresMensualesVES: 49275, ingresosVES: 49275, total: 2580 }
];

// Configuración para los ejes
export const AXIS_CONFIG = {
  yAxisPadding: 1.1,  // 10% de padding en el eje Y
  minValueMultiplier: 0.8  // Para calcular el valor mínimo
};

// Opciones para tooltips
export const TOOLTIP_CONFIG = {
  currencyFormat: true,
  labelPrefix: 'Mes: '
};

// Configuración específica para el gráfico de doble eje
export const DOUBLE_AXIS_CONFIG = {
  barSize: 25,
  barGap: 0,
  dotRadius: 5,
  activeDotRadius: 7,
  strokeWidth: 2,
  animationDuration: 1500,
  glowEffect: true,
  tooltipBackgroundColor: '#1E1E1E',
  tooltipBorderColor: 'rgba(255, 255, 255, 0.1)',
  switchLabelTotal: "Total",
  switchLabelByMoneda: "Por moneda"
};

// Gradientes para barras
export const GRADIENTS = {
  total: {
    id: 'totalGradient',
    startColor: '#6366F1',
    endColor: '#8B5CF6'
  },
  USD: {
    id: 'usdGradient',
    startColor: '#10B981',
    endColor: '#34D399'
  },
  VES: {
    id: 'vesGradient',
    startColor: '#3B82F6',
    endColor: '#60A5FA'
  }
};