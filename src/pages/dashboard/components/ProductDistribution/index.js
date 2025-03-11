import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { COLORS, EXAMPLE_DATA } from './config';

const ProductDistribution = ({ data = EXAMPLE_DATA }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-name">{`${payload[0].name}`}</p>
          <p className="tooltip-value">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="product-distribution-container">
      <div className="chart-wrapper" style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke={activeIndex === index ? '#fff' : 'none'}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="distribution-details">
        <div className="detail-header">
          <div className="header-product">Producto</div>
          <div className="header-percentage">Porcentaje</div>
        </div>
        {data.map((item, index) => (
          <div 
            key={index} 
            className={`detail-row ${activeIndex === index ? 'active' : ''}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="detail-product">
              <div className="color-indicator" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              {item.name}
            </div>
            <div className="detail-percentage">{`${item.value}%`}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDistribution;