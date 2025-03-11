import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { KPI_DATA } from './config';

const AdvancedKPIs = ({ timeRange }) => {
  // Filtrar datos según el rango de tiempo seleccionado
  const filteredData = KPI_DATA[timeRange] || KPI_DATA.monthly;
  
  return (
    <div className="advanced-kpis-container">
      <div className="kpi-cards">
        <div className="kpi-card">
          <div className="kpi-title">Facturación Promedio</div>
          <div className="kpi-value">${filteredData.averageInvoice.toLocaleString()}</div>
          <div className={`kpi-change ${filteredData.averageInvoiceChange >= 0 ? 'positive' : 'negative'}`}>
            {filteredData.averageInvoiceChange >= 0 ? '+' : ''}{filteredData.averageInvoiceChange}%
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-title">Tasa de Conversión</div>
          <div className="kpi-value">{filteredData.conversionRate}%</div>
          <div className={`kpi-change ${filteredData.conversionRateChange >= 0 ? 'positive' : 'negative'}`}>
            {filteredData.conversionRateChange >= 0 ? '+' : ''}{filteredData.conversionRateChange}%
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-title">Días Promedio de Pago</div>
          <div className="kpi-value">{filteredData.averagePaymentDays} días</div>
          <div className={`kpi-change ${filteredData.averagePaymentDaysChange <= 0 ? 'positive' : 'negative'}`}>
            {filteredData.averagePaymentDaysChange >= 0 ? '+' : ''}{filteredData.averagePaymentDaysChange}%
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-title">Margen de Beneficio</div>
          <div className="kpi-value">{filteredData.profitMargin}%</div>
          <div className={`kpi-change ${filteredData.profitMarginChange >= 0 ? 'positive' : 'negative'}`}>
            {filteredData.profitMarginChange >= 0 ? '+' : ''}{filteredData.profitMarginChange}%
          </div>
        </div>
      </div>
      
      <div className="kpi-chart-container">
        <h3>Comparativa de Ingresos vs Gastos</h3>
        <div className="kpi-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData.revenueExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="ingresos" fill="#4CAF50" name="Ingresos" />
              <Bar dataKey="gastos" fill="#F44336" name="Gastos" />
              <Bar dataKey="beneficio" fill="#2196F3" name="Beneficio" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdvancedKPIs;