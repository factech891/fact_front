// src/hooks/useInvoices.js
import { useState, useEffect } from 'react';
import { fetchInvoices, saveInvoice as apiSaveInvoice, deleteInvoice as apiDeleteInvoice, updateInvoiceStatus } from '../services/InvoicesApi';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllInvoices = async () => {
    try {
      setError(null); // Limpiar errores anteriores
      const data = await fetchInvoices();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error en fetchAllInvoices:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const saveInvoice = async (invoice) => {
    try {
      setError(null); // Limpiar errores anteriores
      const savedInvoice = await apiSaveInvoice(invoice);
      await fetchAllInvoices();
      return savedInvoice;
    } catch (error) {
      console.error('Error en saveInvoice:', error);
      setError(error.message);
      throw error;
    }
  };

  const deleteInvoice = async (id) => {
    try {
      setError(null); // Limpiar errores anteriores
      await apiDeleteInvoice(id);
      await fetchAllInvoices();
      return { success: true, message: "Factura eliminada correctamente" };
    } catch (error) {
      console.error('Error en deleteInvoice:', error);
      // Establecer el mensaje de error y propagarlo para que la UI pueda reaccionar
      setError(error.message);
      throw error;
    }
  };

  const changeInvoiceStatus = async (id, newStatus) => {
    try {
      setError(null); // Limpiar errores anteriores
      await updateInvoiceStatus(id, newStatus);
      await fetchAllInvoices();
      return { success: true };
    } catch (error) {
      console.error('Error en changeInvoiceStatus:', error);
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  return { 
    invoices, 
    loading, 
    error, 
    saveInvoice, 
    deleteInvoice, 
    changeInvoiceStatus,
    refreshInvoices: fetchAllInvoices
  };
};