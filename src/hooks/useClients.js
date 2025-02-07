// src/hooks/useClients.js
import { useState, useEffect } from 'react';
import { clientsApi } from '../services/api';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    try {
      const data = await clientsApi.getAll();
      setClients(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const saveClient = async (client) => {
    try {
      const savedClient = client._id 
        ? await clientsApi.update(client._id, client)
        : await clientsApi.create(client);
      await fetchClients();
      return savedClient;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/api/clients/${id}`, { 
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Solo intentar parsear JSON si hay contenido
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
      }

      // Refrescar la lista de clientes
      await fetchClients();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, loading, error, saveClient, deleteClient };
};