import React, { useState } from 'react';
import { MONTHS, YEARS, EXAMPLE_DATA } from './config';

const SalesHeatmap = ({ data = EXAMPLE_DATA }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Filtrar datos para el año seleccionado
  const yearData = data.filter(item => item.year === selectedYear);
  
  // Obtener el valor máximo para el cálculo de la intensidad del color
  const maxValue = Math.max(...data.map(item => item.value));
  
  // Función para calcular el color basado en el valor
  const getHeatColor = (value) => {
    const intensity = Math.max(0, Math.min(255, Math.floor(255 - (value / maxValue) * 255)));
    return `rgb(${intensity}, ${intensity}, 255)`;
  };
  
  // Función para determinar el color del texto basado en la intensidad del fondo
  const getTextColor = (value) => {
    return value > maxValue * 0.7 ? '#FFFFFF' : '#333333';
  };
  
  return (
    <div className="sales-heatmap-container">
      <div className="heatmap-controls">
        <div className="year-selector">
          {YEARS.map(year => (
            <button
              key={year}
              className={`year-button ${selectedYear === year ? 'active' : ''}`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
      
      <div className="heatmap-grid">
        {MONTHS.map(month => {
          const monthData = yearData.find(item => item.month === month);
          const value = monthData ? monthData.value : 0;
          const backgroundColor = getHeatColor(value);
          const textColor = getTextColor(value);
          
          return (
            <div 
              key={month} 
              className="heatmap-cell"
              style={{ backgroundColor }}
            >
              <div className="cell-month" style={{ color: textColor }}>{month}</div>
              <div className="cell-value" style={{ color: textColor }}>
                ${value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="heatmap-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: getHeatColor(0) }}></div>
          <div className="legend-label">Bajo</div>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: getHeatColor(maxValue / 2) }}></div>
          <div className="legend-label">Medio</div>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: getHeatColor(maxValue) }}></div>
          <div className="legend-label">Alto</div>
        </div>
      </div>
    </div>
  );
};

export default SalesHeatmap;