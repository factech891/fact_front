// src/hooks/useInvoices.js
import { useState, useEffect } from 'react';
import { fetchInvoices, saveInvoice as apiSaveInvoice, deleteInvoice as apiDeleteInvoice, updateInvoiceStatus } from '../services/InvoicesApi';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllInvoices = async () => {
    try {
      const data = await fetchInvoices();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const saveInvoice = async (invoice) => {
    try {
      const savedInvoice = await apiSaveInvoice(invoice);
      await fetchAllInvoices();
      return savedInvoice;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await apiDeleteInvoice(id);
      await fetchAllInvoices();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const changeInvoiceStatus = async (id, newStatus) => {
    try {
      await updateInvoiceStatus(id, newStatus);
      await fetchAllInvoices();
    } catch (error) {
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