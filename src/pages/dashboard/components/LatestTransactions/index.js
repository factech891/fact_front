import React, { useState } from 'react';
import { EXAMPLE_TRANSACTIONS, STATUS_COLORS } from './config';

const LatestTransactions = ({ transactions = EXAMPLE_TRANSACTIONS }) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  // Función para ordenar las transacciones
  const sortedTransactions = [...transactions].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortBy === 'client') {
      comparison = a.client.localeCompare(b.client);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Función para cambiar el orden
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  // Renderizar icono de ordenamiento
  const renderSortIcon = (column) => {
    if (sortBy !== column) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="latest-transactions-container">
      <table className="transactions-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('client')}>
              Cliente {renderSortIcon('client')}
            </th>
            <th onClick={() => handleSort('amount')}>
              Monto {renderSortIcon('amount')}
            </th>
            <th onClick={() => handleSort('date')}>
              Fecha {renderSortIcon('date')}
            </th>
            <th onClick={() => handleSort('status')}>
              Estado {renderSortIcon('status')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction, index) => (
            <tr key={transaction.id || index}>
              <td className="client-column">{transaction.client}</td>
              <td className="amount-column">${transaction.amount.toLocaleString()}</td>
              <td className="date-column">{formatDate(transaction.date)}</td>
              <td className="status-column">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: STATUS_COLORS[transaction.status] || '#999' }}
                >
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {transactions.length === 0 && (
        <div className="no-transactions">
          No hay transacciones recientes disponibles.
        </div>
      )}
    </div>
  );
};

export default LatestTransactions;