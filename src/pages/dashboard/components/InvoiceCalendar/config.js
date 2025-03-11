// Nombres de los meses
export const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  // Días de la semana (empezando por domingo)
  export const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  // Facturas de ejemplo para el calendario
  export const EXAMPLE_INVOICES = [
    // Facturas de marzo 2025
    { id: 101, client: 'Empresa ABC', amount: 1500, date: '2025-03-05', status: 'Pagada' },
    { id: 102, client: 'Corporación XYZ', amount: 2300, date: '2025-03-10', status: 'Pendiente' },
    { id: 103, client: 'Distribuidora 123', amount: 950, date: '2025-03-15', status: 'Vencida' },
    { id: 104, client: 'Servicios Técnicos', amount: 1700, date: '2025-03-15', status: 'Pagada' },
    { id: 105, client: 'Marketing Digital', amount: 3200, date: '2025-03-20', status: 'Pagada' },
    { id: 106, client: 'Consultora Legal', amount: 2800, date: '2025-03-25', status: 'Pendiente' },
    { id: 107, client: 'Transportes Rápidos', amount: 1100, date: '2025-03-28', status: 'Pendiente' },
    
    // Facturas de febrero 2025
    { id: 91, client: 'Empresa ABC', amount: 1300, date: '2025-02-10', status: 'Pagada' },
    { id: 92, client: 'Distribuidora 123', amount: 870, date: '2025-02-15', status: 'Pagada' },
    { id: 93, client: 'Servicios Técnicos', amount: 1600, date: '2025-02-20', status: 'Pagada' },
    
    // Facturas de abril 2025
    { id: 111, client: 'Empresa ABC', amount: 1650, date: '2025-04-05', status: 'Pendiente' },
    { id: 112, client: 'Corporación XYZ', amount: 2500, date: '2025-04-12', status: 'Pendiente' },
    { id: 113, client: 'Servicios Técnicos', amount: 1900, date: '2025-04-18', status: 'Pendiente' }
  ];
  
  // Colores para los estados de facturas
  export const INVOICE_STATUS_COLORS = {
    'Pagada': '#4CAF50',
    'Pendiente': '#FF9800',
    'Vencida': '#F44336'
  };