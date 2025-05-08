import React, { useState } from 'react';
import { MONTHS, DAYS_OF_WEEK, EXAMPLE_INVOICES } from './config';

const InvoiceCalendar = ({ invoices = EXAMPLE_INVOICES, selectedMonth: propSelectedMonth, selectedYear: propSelectedYear }) => {
  const today = new Date();
  // Usar los valores proporcionados por props o los actuales como fallback
  const [selectedMonth, setSelectedMonth] = useState(propSelectedMonth !== undefined ? propSelectedMonth : today.getMonth());
  const [selectedYear, setSelectedYear] = useState(propSelectedYear !== undefined ? propSelectedYear : today.getFullYear());
  
  // Actualizar si las props cambian
  React.useEffect(() => {
    if (propSelectedMonth !== undefined) setSelectedMonth(propSelectedMonth);
    if (propSelectedYear !== undefined) setSelectedYear(propSelectedYear);
  }, [propSelectedMonth, propSelectedYear]);
  
  // Obtener el primer día del mes seleccionado
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  
  // Obtener el número de días en el mes seleccionado
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  
  // Generar los días del calendario
  const calendarDays = [];
  
  // Días en blanco para ajustar el comienzo del mes
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: null, invoices: [] });
  }
  
  // Días del mes con sus respectivas facturas
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate.getDate() === day && 
             invoiceDate.getMonth() === selectedMonth && 
             invoiceDate.getFullYear() === selectedYear;
    });
    
    calendarDays.push({ day, invoices: dayInvoices, dateString });
  }
  
  // Función para renderizar el indicador de facturas
  const renderInvoiceIndicator = (invoices) => {
    if (invoices.length === 0) return null;
    
    // Calcular totales por estado
    const statusCounts = invoices.reduce((counts, invoice) => {
      counts[invoice.status] = (counts[invoice.status] || 0) + 1;
      return counts;
    }, {});
    
    return (
      <div className="invoice-indicators">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div 
            key={status}
            className="invoice-indicator"
            title={`${count} factura(s) ${status.toLowerCase()}`}
            style={{ backgroundColor: status === 'Pagada' ? '#4CAF50' : status === 'Pendiente' ? '#FF9800' : '#F44336' }}
          >
            {count}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="invoice-calendar-container">
      <div className="calendar-header">
        {/* Eliminamos los botones de navegación y dejamos solo el título del mes */}
        <div className="current-month">
          {MONTHS[selectedMonth]} {selectedYear}
        </div>
      </div>
      
      <div className="calendar-grid">
        {/* Encabezados de los días de la semana */}
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
        
        {/* Días del calendario */}
        {calendarDays.map((dayData, index) => {
          const isToday = dayData.day === today.getDate() && 
                          selectedMonth === today.getMonth() && 
                          selectedYear === today.getFullYear();
                          
          return (
            <div 
              key={index} 
              className={`calendar-day ${!dayData.day ? 'empty-day' : ''} ${isToday ? 'today' : ''}`}
            >
              {dayData.day && (
                <>
                  <div className="day-number">{dayData.day}</div>
                  {renderInvoiceIndicator(dayData.invoices)}
                </>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-indicator" style={{ backgroundColor: '#4CAF50' }}></div>
          <div className="legend-label">Pagada</div>
        </div>
        <div className="legend-item">
          <div className="legend-indicator" style={{ backgroundColor: '#FF9800' }}></div>
          <div className="legend-label">Pendiente</div>
        </div>
        <div className="legend-item">
          <div className="legend-indicator" style={{ backgroundColor: '#F44336' }}></div>
          <div className="legend-label">Vencida</div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCalendar;