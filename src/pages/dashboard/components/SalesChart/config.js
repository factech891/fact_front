// Opciones de tipo de gráfico
export const CHART_OPTIONS = [
  { id: 'area', label: 'Área' },
  { id: 'line', label: 'Línea' }
];

// Colores del gráfico
export const CHART_COLORS = {
  primary: '#2196F3',
  secondary: '#FF9800',
  positive: '#2ecc71',
  negative: '#e74c3c'
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