// src/hooks/useInvoices.js
import { useState, useEffect } from 'react';
import { invoicesApi } from '../services/api';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    try {
      const data = await invoicesApi.getAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const saveInvoice = async (invoice) => {
    try {
      const savedInvoice = invoice._id 
        ? await invoicesApi.update(invoice._id, invoice)
        : await invoicesApi.create(invoice);
      await fetchInvoices();
      return savedInvoice;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await invoicesApi.delete(id);
      await fetchInvoices();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return { invoices, loading, error, saveInvoice, deleteInvoice };
};