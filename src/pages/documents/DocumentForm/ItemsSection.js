// src/pages/documents/DocumentForm/ItemsSection.js
import React from 'react';
// Importar el ItemsSection original de facturas
import InvoiceItemsSection from '../../invoices/InvoiceForm/ItemsSection';

const ItemsSection = ({ 
  formData, 
  selectedProducts, 
  products, 
  errors, 
  onProductSelect, 
  onItemChange 
}) => {
  // Adaptador para transformar la selección de productos a formato de items
  const handleProductSelectWrapper = (_, selectedProds) => {
    onProductSelect(selectedProds);
  };
  
  // Adaptador para manejar cambios en los items individuales
  const handleItemChangeWrapper = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Actualizar subtotal del item si cambia cantidad o precio
    if (field === 'quantity' || field === 'price') {
      const quantity = field === 'quantity' ? value : updatedItems[index].quantity || 1;
      const price = field === 'price' ? value : updatedItems[index].price || 0;
      updatedItems[index].subtotal = quantity * price;
    }
    
    onItemChange(updatedItems);
  };

  return (
    <InvoiceItemsSection
      items={formData.items}
      selectedProducts={selectedProducts}
      products={products}
      moneda={formData.currency}
      errors={errors}
      onProductSelect={handleProductSelectWrapper}
      onItemChange={handleItemChangeWrapper}
    />
  );
};

export default ItemsSection;