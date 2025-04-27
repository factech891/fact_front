// src/services/AlertsApi.js
import { API_BASE_URL, handleResponse, getAuthHeaders } from './api';

export const alertsApi = {
  // Obtener todas las notificaciones
  getAll: async (params = {}) => {
    // Construir query params si hay filtros
    const queryParams = new URLSearchParams();
    if (params.read !== undefined) queryParams.append('read', params.read);
    if (params.type) queryParams.append('type', params.type);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${API_BASE_URL}/notifications${queryString}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  // Marcar una notificación como leída
  markAsRead: async (notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  // Marcar todas las notificaciones como leídas
  markAllAsRead: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  // Eliminar una notificación
  delete: async (notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  // Verificar manualmente productos con stock bajo (solo admin)
  checkLowStock: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/check-low-stock`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};