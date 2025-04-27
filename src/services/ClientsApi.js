import React from 'react';
// src/services/api.js
const API_BASE_URL = 'http://localhost:5002/api';

/**
 * Maneja la respuesta de la API y verifica si hubo errores
 * @param {Response} response - Respuesta del fetch
 * @returns {Promise} - Datos JSON o error
 */
async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Error desconocido');
    throw new Error(`Error: ${response.status} - ${errorText}`);
  }
  
  try {
    return await response.json();
  } catch (error) {
    // Si no hay JSON, retornamos un objeto vacío
    return {};
  }
}

/**
 * Cliente API base que usa fetch
 */
const api = {
  /**
   * Realiza una petición GET
   * @param {string} endpoint - Endpoint a llamar (sin la base URL)
   * @returns {Promise} - Respuesta de la API
   */
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return handleResponse(response);
  },
  
  /**
   * Realiza una petición POST
   * @param {string} endpoint - Endpoint a llamar (sin la base URL)
   * @param {Object} data - Datos a enviar
   * @returns {Promise} - Respuesta de la API
   */
  post: async (endpoint, data) => {
    console.log(`POST a ${endpoint} con datos:`, data);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  /**
   * Realiza una petición PUT
   * @param {string} endpoint - Endpoint a llamar (sin la base URL)
   * @param {Object} data - Datos a enviar
   * @returns {Promise} - Respuesta de la API
   */
  put: async (endpoint, data) => {
    console.log(`PUT a ${endpoint} con datos:`, data);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  /**
   * Realiza una petición DELETE
   * @param {string} endpoint - Endpoint a llamar (sin la base URL)
   * @returns {Promise} - Respuesta de la API
   */
  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
};

/**
 * Cliente API específico para clientes
 */
export const clientsApi = {
  getAll: async () => {
    return api.get('/clients');
  },
  
  getById: async (id) => {
    return api.get(`/clients/${id}`);
  },
  
  create: async (client) => {
    // Filtramos para enviar solo los campos básicos
    const { nombre, rif, direccion, telefono, email } = client;
    const filteredClient = { nombre, rif, direccion, telefono, email };
    
    console.log('Cliente filtrado para crear:', filteredClient);
    return api.post('/clients', filteredClient);
  },
  
  update: async (id, client) => {
    // Filtramos para enviar solo los campos básicos
    const { nombre, rif, direccion, telefono, email } = client;
    const filteredClient = { nombre, rif, direccion, telefono, email };
    
    console.log(`Cliente filtrado para actualizar (ID: ${id}):`, filteredClient);
    return api.put(`/clients/${id}`, filteredClient);
  },
  
  delete: async (id) => {
    return api.delete(`/clients/${id}`);
  }
};

// Exportar las funciones individuales para compatibilidad con código existente
export const fetchClients = clientsApi.getAll;
export const saveClient = async (client) => {
  // Manejar automáticamente si es creación o actualización
  // y resolver la diferencia entre id y _id
  const id = client.id || client._id;
  
  if (id) {
    return clientsApi.update(id, client);
  } else {
    return clientsApi.create(client);
  }
};
export const deleteClient = clientsApi.delete;

export default api;