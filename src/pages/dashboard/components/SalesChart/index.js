import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CHART_OPTIONS, getColor } from './config';

const SalesChart = ({ data }) => {
  const [chartType, setChartType] = useState('area');
  
  // Calcular valores para mejorar la visualización
  const maxValue = Math.max(...data.map(item => item.value), ...data.map(item => item.target));
  const minValue = Math.min(...data.map(item => item.value)) * 0.8;
  
  return (
    <div className="sales-chart-container">
      <div className="chart-controls">
        <div className="chart-type-selector">
          {CHART_OPTIONS.map(option => (
            <button 
              key={option.id}
              className={`chart-type-button ${chartType === option.id ? 'active' : ''}`}
              onClick={() => setChartType(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="chart-wrapper" style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2196F3" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[minValue, maxValue * 1.1]} />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="value" 
                name="Ventas" 
                stroke="#2196F3" 
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                name="Meta" 
                stroke="#FF9800" 
                strokeDasharray="5 5" 
                dot={false}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[minValue, maxValue * 1.1]} />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Ventas" 
                stroke="#2196F3" 
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                name="Meta" 
                stroke="#FF9800" 
                strokeDasharray="5 5" 
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="chart-insights">
        <div className="insight-card">
          <div className="insight-title">Meta mensual</div>
          <div className="insight-value">${data[0].target.toLocaleString()}</div>
        </div>
        <div className="insight-card">
          <div className="insight-title">Último mes</div>
          <div className="insight-value">${data[data.length-1].value.toLocaleString()}</div>
          <div className={`insight-trend ${data[data.length-1].value >= data[data.length-1].target ? 'positive' : 'negative'}`}>
            {data[data.length-1].value >= data[data.length-1].target ? '✓ Meta alcanzada' : '✗ Por debajo de meta'}
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-title">Mejor mes</div>
          <div className="insight-value">${Math.max(...data.map(item => item.value)).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;