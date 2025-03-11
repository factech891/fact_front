// Colores para los diferentes estados de transacciones
export const STATUS_COLORS = {
    'Pagada': '#4CAF50',
    'Pendiente': '#FF9800',
    'Vencida': '#F44336',
    'Cancelada': '#9E9E9E',
    'Parcial': '#2196F3'
  };
  
  // Datos de ejemplo para las transacciones
  export const EXAMPLE_TRANSACTIONS = [
    { id: 1, client: 'Empresa ABC', amount: 1250, date: '2025-03-10', status: 'Pagada' },
    { id: 2, client: 'Corporación XYZ', amount: 3400, date: '2025-03-09', status: 'Pendiente' },
    { id: 3, client: 'Distribuidora 123', amount: 860, date: '2025-03-08', status: 'Pagada' },
    { id: 4, client: 'Servicios Técnicos', amount: 1700, date: '2025-03-07', status: 'Vencida' },
    { id: 5, client: 'Consultora Legal', amount: 2300, date: '2025-03-06', status: 'Pagada' },
    { id: 6, client: 'Transportes Rápidos', amount: 980, date: '2025-03-05', status: 'Cancelada' },
    { id: 7, client: 'Desarrollos Web', amount: 1450, date: '2025-03-04', status: 'Pendiente' },
    { id: 8, client: 'Marketing Digital', amount: 3200, date: '2025-03-03', status: 'Parcial' }
  ];
  
  // Configuración de la tabla
  export const TABLE_CONFIG = {
    pageSize: 5,
    sortOptions: [
      { key: 'date', label: 'Fecha' },
      { key: 'amount', label: 'Monto' },
      { key: 'client', label: 'Cliente' },
      { key: 'status', label: 'Estado' }
    ]
  };