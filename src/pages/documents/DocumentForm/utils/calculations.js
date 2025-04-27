import React from 'react';
// Añade esta función al archivo
export const calculateTotals = (items, taxRate = 0.16) => {
    if (!items || items.length === 0) {
      return { subtotal: 0, taxAmount: 0, total: 0 };
    }
  
    // Calcular subtotal sumando todos los items
    const subtotal = items.reduce((sum, item) => {
      return sum + ((item.quantity || 1) * (item.price || 0));
    }, 0);
  
    // Calcular monto de impuestos teniendo en cuenta items exentos
    const taxableAmount = items.reduce((sum, item) => {
      if (item.taxExempt) {
        return sum;
      }
      return sum + ((item.quantity || 1) * (item.price || 0));
    }, 0);
  
    const taxAmount = taxableAmount * taxRate;
  
    // Calcular total
    const total = subtotal + taxAmount;
  
    return {
      subtotal,
      taxAmount,
      total
    };
  };