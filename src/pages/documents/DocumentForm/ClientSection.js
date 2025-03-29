// src/pages/documents/DocumentForm/ClientSection.js
import React from 'react';
// Importar el ClientSection original de facturas
import InvoiceClientSection from '../../invoices/InvoiceForm/ClientSection';

const ClientSection = ({ formData, clients, errors, onFieldChange }) => {
  // Este componente actúa como adaptador entre el formulario de documentos
  // y el componente ClientSection del módulo de facturas
  
  const handleClientChange = (client) => {
    onFieldChange('client', client);
  };
  
  const handleMonedaChange = (moneda) => {
    onFieldChange('currency', moneda);
  };
  
  const handleCondicionesChange = (condiciones) => {
    onFieldChange('paymentTerms', condiciones);
    // Si cambia a contado, resetear días de crédito
    if (condiciones === 'Contado') {
      onFieldChange('creditDays', 0);
    }
  };
  
  const handleDiasCreditoChange = (dias) => {
    onFieldChange('creditDays', dias);
  };

  return (
    <InvoiceClientSection
      client={formData.client}
      moneda={formData.currency}
      condicionesPago={formData.paymentTerms || 'Contado'}
      diasCredito={formData.creditDays || 0}
      clients={clients}
      errors={errors}
      onClientChange={handleClientChange}
      onMonedaChange={handleMonedaChange}
      onCondicionesChange={handleCondicionesChange}
      onDiasCreditoChange={handleDiasCreditoChange}
    />
  );
};

export default ClientSection;