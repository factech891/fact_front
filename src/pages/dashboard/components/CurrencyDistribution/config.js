// Colores para el gráfico de distribución por moneda
export const COLORS = ['#4285F4', '#4CAF50', '#FFA726', '#F44336', '#AB47BC', '#26C6DA'];

// Estilos para los tooltips
export const TOOLTIP_STYLE = {
  backgroundColor: '#242424',
  padding: '10px',
  border: '1px solid #444',
  borderRadius: '4px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
};

// Datos de ejemplo para la distribución por moneda
export const EXAMPLE_DATA = [
  { name: '💵 USD', value: 43, raw: 3750.25 },
  { name: '💰 VES', value: 57, raw: 149801.35 }
];

// Símbolos de moneda
export const CURRENCY_SYMBOLS = {
  'USD': '$',
  'VES': 'Bs.',
  'EUR': '€',
  'BTC': '₿'
};

// Formato para valores monetarios
export const formatCurrency = (value, currency = 'USD') => {
  const formatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  return formatter.format(value);
};