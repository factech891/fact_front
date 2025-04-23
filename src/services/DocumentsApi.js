// src/services/DocumentsApi.js (Corregido para incluir token)

// Importar las funciones necesarias desde api.js
// Asegúrate que la ruta a api.js sea correcta
import { API_BASE_URL, handleResponse, getAuthHeaders } from './api';

/**
 * Obtiene la lista de documentos desde el backend.
 * @returns {Promise<Array>} Lista de documentos.
 */
export const getDocuments = async () => {
  try {
    // Usar getAuthHeaders para incluir el token
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'GET', // Especificar método es buena práctica
      headers: getAuthHeaders()
    });
    // Usar handleResponse para manejo de errores y JSON
    return handleResponse(response);
  } catch (error) {
    console.error('Error al obtener los documentos:', error);
    // Re-lanzar el error para que el hook lo capture
    throw error;
  }
};

/**
 * Obtiene documentos pendientes para el dashboard.
 * @param {number} limit - Límite de documentos a obtener.
 * @returns {Promise<Array>} Lista de documentos pendientes.
 */
export const getPendingDocuments = async (limit = 5) => {
  try {
    // Usar getAuthHeaders para incluir el token
    const response = await fetch(`${API_BASE_URL}/documents/pending?limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error al obtener documentos pendientes:', error);
    throw error;
  }
};

/**
 * Obtiene un documento por su ID.
 * @param {string} id - ID del documento a obtener.
 * @returns {Promise<Object>} El documento obtenido.
 */
export const getDocument = async (id) => {
  try {
    // Usar getAuthHeaders para incluir el token
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error al obtener documento ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo documento.
 * @param {Object} documentData - Datos del documento a crear.
 * @returns {Promise<Object>} El documento creado.
 */
export const createDocument = async (documentData) => {
  try {
    // Usar getAuthHeaders para incluir el token y Content-Type
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: getAuthHeaders(), // Ya incluye Content-Type: application/json
      body: JSON.stringify(documentData),
    });
    // Usar handleResponse que ya maneja errores y JSON
    return handleResponse(response);
  } catch (error) {
    console.error('Error al crear documento:', error);
    throw error;
  }
};

/**
 * Actualiza un documento existente.
 * @param {string} id - ID del documento a actualizar.
 * @param {Object} documentData - Nuevos datos del documento.
 * @returns {Promise<Object>} El documento actualizado.
 */
export const updateDocument = async (id, documentData) => {
  try {
    // Usar getAuthHeaders para incluir el token y Content-Type
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(), // Ya incluye Content-Type: application/json
      body: JSON.stringify(documentData),
    });
    // Usar handleResponse que ya maneja errores y JSON
    return handleResponse(response);
  } catch (error) {
    console.error(`Error al actualizar documento ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un documento.
 * @param {string} id - ID del documento a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const deleteDocument = async (id) => {
  try {
    // Usar getAuthHeaders para incluir el token
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders() // Solo necesita Authorization
    });
    // Usar handleResponse que ya maneja errores y respuestas 204
    return handleResponse(response);
  } catch (error) {
    console.error(`Error al eliminar documento ${id}:`, error);
    throw error;
  }
};

/**
 * Convierte un documento a factura.
 * @param {string} id - ID del documento a convertir.
 * @param {Object} invoiceData - Datos adicionales para la factura.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const convertToInvoice = async (id, invoiceData = {}) => {
  try {
    // Usar getAuthHeaders para incluir el token y Content-Type
    const response = await fetch(`${API_BASE_URL}/documents/${id}/convert-to-invoice`, {
      method: 'POST',
      headers: getAuthHeaders(), // Ya incluye Content-Type: application/json
      body: JSON.stringify(invoiceData),
    });
    // Usar handleResponse que ya maneja errores y JSON
    return handleResponse(response);
  } catch (error) {
    console.error(`Error al convertir documento ${id} a factura:`, error);
    throw error;
  }
};