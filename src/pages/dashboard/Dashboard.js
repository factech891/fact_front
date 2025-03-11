import React, { useState, useEffect } from 'react';
import { 
  CHART_COLORS, 
  TIME_RANGES, 
  MOCK_SALES_DATA, 
  MOCK_PRODUCT_DATA
} from './constants/dashboardConstants';
import './Dashboard.css'; 

// Importa tus componentes existentes si los tienes
// import SalesChart from './components/SalesChart';
// import DistributionChart from './components/DistributionChart';
// import TransactionsTable from './components/TransactionsTable';
// import OperationsCalendar from './components/OperationsCalendar';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState(TIME_RANGES[0].value);
  const [loading, setLoading] = useState(false);
  
  // Datos para el dashboard (podrías cargarlos de una API)
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      ingresos: { valor: 23000, crecimiento: 2.5 },
      operaciones: { valor: 132, crecimiento: 1.2 },
      clientes: { valor: 85, crecimiento: -0.8 },
      documentos: { valor: 114, crecimiento: 3.1 }
    },
    operationsData: MOCK_SALES_DATA.map(item => ({
      mes: item.mes,
      operaciones: item.pedidos,
      ingresos: item.ventas,
      promedio: item.promedio,
      meta: item.meta
    })),
    serviceTypeData: [
      { name: 'Transporte', value: 45 },
      { name: 'Gestión', value: 25 },
      { name: 'Documentación', value: 20 },
      { name: 'Otros', value: 10 }
    ],
    transactions: [
      { id: 1, cliente: 'Global Imports Inc.', monto: 1250, fecha: '2025-03-10', estado: 'Completado' },
      { id: 2, cliente: 'TransOcean Ltd.', monto: 3400, fecha: '2025-03-09', estado: 'En proceso' },
      { id: 3, cliente: 'Cargo Express S.A.', monto: 860, fecha: '2025-03-08', estado: 'Completado' },
      { id: 4, cliente: 'AirFreight Solutions', monto: 1700, fecha: '2025-03-07', estado: 'Con retraso' }
    ]
  });

  // Función para cambiar el rango de tiempo
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // Aquí podrías cargar nuevos datos según el rango seleccionado
  };

  // Función para formatear números a moneda
  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  // Clases para los indicadores de crecimiento
  const getGrowthClass = (value) => {
    return value >= 0 ? 'positive' : 'negative';
  };

  // Clases para los estados de operación
  const getStatusClass = (status) => {
    switch(status) {
      case 'Completado': return 'status-success';
      case 'En proceso': return 'status-info';
      case 'Con retraso': return 'status-danger';
      case 'Programado': return 'status-warning';
      default: return '';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Cabecera */}
      <div className="dashboard-header">
        <h1>Sistema de Facturación</h1>
        <div className="time-range-selector">
          {TIME_RANGES.map(range => (
            <button
              key={range.value}
              className={`range-button ${timeRange === range.value ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange(range.value)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="kpi-grid">
        {/* KPI - Ingresos */}
        <div className="kpi-card">
          <div className="kpi-header">
            <h3>Ingresos</h3>
            <div className="kpi-icon">💰</div>
          </div>
          <div className="kpi-value">{formatCurrency(dashboardData.kpis.ingresos.valor)}</div>
          <div className={`kpi-growth ${getGrowthClass(dashboardData.kpis.ingresos.crecimiento)}`}>
            {dashboardData.kpis.ingresos.crecimiento >= 0 ? '↑' : '↓'} {Math.abs(dashboardData.kpis.ingresos.crecimiento)}%
          </div>
        </div>

        {/* KPI - Operaciones */}
        <div className="kpi-card">
          <div className="kpi-header">
            <h3>Operaciones</h3>
            <div className="kpi-icon">📦</div>
          </div>
          <div className="kpi-value">{dashboardData.kpis.operaciones.valor}</div>
          <div className={`kpi-growth ${getGrowthClass(dashboardData.kpis.operaciones.crecimiento)}`}>
            {dashboardData.kpis.operaciones.crecimiento >= 0 ? '↑' : '↓'} {Math.abs(dashboardData.kpis.operaciones.crecimiento)}%
          </div>
        </div>

        {/* KPI - Clientes */}
        <div className="kpi-card">
          <div className="kpi-header">
            <h3>Clientes</h3>
            <div className="kpi-icon">👥</div>
          </div>
          <div className="kpi-value">{dashboardData.kpis.clientes.valor}</div>
          <div className={`kpi-growth ${getGrowthClass(dashboardData.kpis.clientes.crecimiento)}`}>
            {dashboardData.kpis.clientes.crecimiento >= 0 ? '↑' : '↓'} {Math.abs(dashboardData.kpis.clientes.crecimiento)}%
          </div>
        </div>

        {/* KPI - Documentos */}
        <div className="kpi-card">
          <div className="kpi-header">
            <h3>Documentos</h3>
            <div className="kpi-icon">📄</div>
          </div>
          <div className="kpi-value">{dashboardData.kpis.documentos.valor}</div>
          <div className={`kpi-growth ${getGrowthClass(dashboardData.kpis.documentos.crecimiento)}`}>
            {dashboardData.kpis.documentos.crecimiento >= 0 ? '↑' : '↓'} {Math.abs(dashboardData.kpis.documentos.crecimiento)}%
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-row">
        {/* Gráfico de Tendencia de Operaciones */}
        <div className="chart-card sales-chart">
          <h2>Tendencia de Operaciones</h2>
          <div className="chart-container">
            {/* Aquí insertarías tu componente SalesChart adaptado */}
            {/* <SalesChart data={dashboardData.operationsData} /> */}
            <div className="placeholder-chart">
              {/* Puedes quitar esto cuando integres tu gráfico real */}
              <div className="placeholder-text">Gráfico de operaciones por mes</div>
            </div>
          </div>
          <div className="chart-insights">
            <div className="insight-item">
              <div className="insight-label">Meta mensual</div>
              <div className="insight-value">{formatCurrency(4200)}</div>
            </div>
            <div className="insight-item">
              <div className="insight-label">Último mes</div>
              <div className="insight-value">{formatCurrency(5400)}</div>
              <div className="insight-status positive">✓ Meta alcanzada</div>
            </div>
            <div className="insight-item">
              <div className="insight-label">Mejor mes</div>
              <div className="insight-value">{formatCurrency(6000)}</div>
            </div>
          </div>
        </div>

        {/* Gráfico de Distribución por Tipo de Servicio */}
        <div className="chart-card product-chart">
          <h2>Distribución por Servicio</h2>
          <div className="chart-container">
            {/* Aquí insertarías tu componente DistributionChart */}
            {/* <DistributionChart data={dashboardData.serviceTypeData} /> */}
            <div className="placeholder-chart">
              {/* Puedes quitar esto cuando integres tu gráfico real */}
              <div className="placeholder-text">Distribución por tipo de servicio</div>
            </div>
          </div>
          <div className="chart-legend">
            {dashboardData.serviceTypeData.map((item, index) => (
              <div key={index} className="legend-item">
                <span 
                  className="color-dot"
                  style={{ backgroundColor: Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length] }}
                ></span>
                <span>{item.name}</span>
                <span>{Math.round((item.value / dashboardData.serviceTypeData.reduce((acc, curr) => acc + curr.value, 0)) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Widgets inferiores */}
      <div className="widgets-row">
        {/* Últimas Operaciones */}
        <div className="widget-card transactions-widget">
          <h2>Últimas Operaciones</h2>
          <div className="transactions-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.cliente}</td>
                    <td>{formatCurrency(transaction.monto)}</td>
                    <td>{new Date(transaction.fecha).toLocaleDateString('es-ES')}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(transaction.estado)}`}>
                        {transaction.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendario de Operaciones */}
        <div className="widget-card calendar-widget">
          <h2>Calendario de Operaciones</h2>
          <div className="calendar-container">
            {/* Aquí insertarías tu componente OperationsCalendar */}
            {/* <OperationsCalendar /> */}
            
            {/* Placeholder para el ejemplo */}
            <div className="calendar-header">
              <button className="calendar-nav-btn">←</button>
              <div className="month-title">Marzo 2025</div>
              <button className="calendar-nav-btn">→</button>
            </div>
            
            <div className="calendar-days-header">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
                <div key={index}>{day}</div>
              ))}
            </div>
            
            <div className="calendar-grid">
              {/* Placeholder para el calendario */}
              <div className="placeholder-calendar">
                <div className="placeholder-text">Calendario de operaciones programadas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Widget adicional para información financiera (útil para subcontratistas) */}
      <div className="additional-widget">
        <div className="widget-card financial-summary">
          <h2>Resumen Financiero</h2>
          <div className="financial-summary-content">
            <div className="financial-metric">
              <div className="metric-label">Facturación Total</div>
              <div className="metric-value">{formatCurrency(28500)}</div>
            </div>
            <div className="financial-metric">
              <div className="metric-label">Pagos Pendientes</div>
              <div className="metric-value">{formatCurrency(5100)}</div>
            </div>
            <div className="financial-metric">
              <div className="metric-label">Margen</div>
              <div className="metric-value">24.7%</div>
            </div>
            <div className="financial-metric">
              <div className="metric-label">Comisiones</div>
              <div className="metric-value">{formatCurrency(3400)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;