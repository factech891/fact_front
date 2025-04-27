import React from 'react';
// src/hooks/useClients.js - Solución sin jwt-decode
import { useState, useEffect } from 'react';
import { clientsApi } from '../services/api';

function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    try {
      console.log('1. Intentando obtener clientes...');
      setLoading(true);
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

  // Función para obtener companyId usando la API existente
  const getCompanyId = async () => {
    try {
      // Puedes usar el endpoint auth/me que ya existe (vimos en el código del backend)
      const response = await fetch('http://localhost:5002/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('No se pudo obtener información del usuario');
      }
      
      const data = await response.json();
      
      if (!data.success || !data.company || !data.company.id) {
        throw new Error('No se encontró información de la empresa');
      }
      
      console.log('CompanyId obtenido:', data.company.id);
      return data.company.id;
    } catch (error) {
      console.error('Error al obtener companyId:', error);
      throw error;
    }
  };

  const saveClient = async (client) => {
    try {
      console.log('4. Cliente a guardar:', client);
      
      // Asegurarse de que los campos necesarios estén presentes
      if (!client.nombre) throw new Error('El nombre es requerido');
      if (!client.rif) throw new Error('El RIF/Cédula es requerido');
      if (!client.email) throw new Error('El email es requerido');
      if (!client.telefono) throw new Error('El teléfono es requerido');
      if (!client.direccion) throw new Error('La dirección es requerida');
      
      // Obtener el companyId a través de la API
      const companyId = await getCompanyId();
      
      // Preparar el objeto cliente incluyendo el companyId
      const clientToSave = {
        ...client,
        companyId,
        
        // Asegurar que campos numéricos sean números
        diasCredito: Number(client.diasCredito || 0),
        limiteCredito: Number(client.limiteCredito || 0),
        
        // Garantizar que tipoPersona y tipoCliente estén presentes
        tipoPersona: client.tipoPersona || 'natural',
        tipoCliente: client.tipoCliente || 'regular'
      };
      
      console.log('5. Cliente preparado para guardar con companyId:', clientToSave);
      
      // Determinar si es una creación o actualización
      let savedClient;
      if (client._id) {
        console.log(`7. Actualizando cliente con ID: ${client._id}`);
        savedClient = await clientsApi.update(client._id, clientToSave);
      } else {
        console.log('7. Creando nuevo cliente');
        savedClient = await clientsApi.create(clientToSave);
      }
      
      console.log('8. Cliente guardado con éxito:', savedClient);
      return savedClient;
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      console.log(`Eliminando cliente con ID: ${id}`);
      await clientsApi.delete(id);
      return { success: true };
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