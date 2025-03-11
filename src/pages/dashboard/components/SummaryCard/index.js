import React from 'react';
import { TrendingUp, TrendingDown, Users, FileText, Package, BarChart2 } from 'lucide-react';

const SummaryCard = ({ title, value, growth, icon }) => {
  // Determinar si el crecimiento es positivo o negativo
  const isPositive = growth >= 0;
  
  // Seleccionar el icono basado en el parámetro icon
  const renderIcon = () => {
    switch (icon) {
      case 'chart-line':
        return <BarChart2 size={24} />;
      case 'users':
        return <Users size={24} />;
      case 'file-invoice':
        return <FileText size={24} />;
      case 'box':
        return <Package size={24} />;
      default:
        return <BarChart2 size={24} />;
    }
  };

  return (
    <div className="summary-card">
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          <div className="card-icon">{renderIcon()}</div>
        </div>
        
        <div className="card-value">{value}</div>
        
        <div className={`card-growth ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="growth-value">{`${Math.abs(growth).toFixed(1)}%`}</span>
        </div>
      </div>
      
      <div className="card-progress">
        <div 
          className={`progress-bar ${isPositive ? 'positive' : 'negative'}`}
          style={{ width: `${Math.min(Math.abs(growth) * 5, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SummaryCard;