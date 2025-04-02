// src/hooks/useClients.js
import { useState, useEffect } from 'react';
import { clientsApi } from '../services/api';

/**
 * Hook para gestionar clientes
 * @returns {Object} Métodos y estado para gestionar clientes
 */
function useClients() {
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
      setError(null);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setError(error.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const saveClient = async (client) => {
    try {
      console.log('4. Cliente a guardar:', client);
      
      // Asegurarse de que los campos necesarios estén presentes
      if (!client.nombre) throw new Error('El nombre es requerido');
      if (!client.rif) throw new Error('El RIF/Cédula es requerido');
      if (!client.email) throw new Error('El email es requerido');
      
      // Limpiar campos numéricos para asegurar que sean números
      if (client.diasCredito !== undefined) {
        client.diasCredito = Number(client.diasCredito) || 0;
      }
      
      if (client.limiteCredito !== undefined) {
        client.limiteCredito = Number(client.limiteCredito) || 0;
      }
      
      // Si tiene ID, actualizar; si no, crear
      let savedClient;
      if (client._id || client.id) {
        const id = client._id || client.id;
        savedClient = await clientsApi.update(id, client);
      } else {
        savedClient = await clientsApi.create(client);
      }
      
      console.log('5. Cliente guardado:', savedClient);
      await fetchClients(); // Refrescar la lista
      return savedClient;
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      await clientsApi.delete(id);
      await fetchClients(); // Refrescar la lista
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    }
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    console.log('useEffect en useClients - Llamando a fetchClients');
    fetchClients();
  }, []);

  return { clients, loading, error, saveClient, deleteClient, fetchClients };
}

// Exportación nombrada
export { useClients };

// Exportación por defecto
export default useClients;