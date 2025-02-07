// src/hooks/useClients.js
import { useState, useEffect } from 'react';
import { clientsApi } from '../services/api';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    try {
      console.log('1. Intentando obtener clientes...');
      const data = await clientsApi.getAll();
      console.log('2. Datos de clientes recibidos:', data);

      if (!Array.isArray(data)) {
        console.error('Los datos de clientes no son un array:', data);
        setClients([]);
        return;
      }

      const processedClients = data.map(client => ({
        ...client,
        id: client._id // Asegurarnos que cada cliente tenga un id para el grid
      }));

      console.log('3. Clientes procesados:', processedClients);
      setClients(processedClients);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveClient = async (client) => {
    try {
      console.log('4. Intentando guardar cliente:', client);
      const savedClient = client._id 
        ? await clientsApi.update(client._id, client)
        : await clientsApi.create(client);
      
      console.log('5. Cliente guardado:', savedClient);
      await fetchClients();
      return savedClient;
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      setError(error.message);
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      console.log('6. Intentando eliminar cliente:', id);
      await clientsApi.delete(id);
      await fetchClients();
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    console.log('useEffect en useClients - Llamando a fetchClients');
    fetchClients();
  }, []);

  return { clients, loading, error, saveClient, deleteClient };
};