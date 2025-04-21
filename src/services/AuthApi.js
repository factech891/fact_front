// src/services/AuthApi.js (actualizado según controlador de autenticación)
import { API_BASE_URL, handleResponse } from './api';

export const authApi = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },
  
  register: async (userData) => {
    // Adaptar el formato de datos para que coincida con lo que espera el backend
    const formattedData = {
      company: {
        nombre: userData.company.name,
        rif: userData.company.rif,
        direccion: userData.company.address || '',
        ciudad: userData.company.city || '',
        estado: userData.company.state || '',
        telefono: userData.company.phone || '',
        email: userData.company.email
      },
      user: {
        nombre: `${userData.user.firstName} ${userData.user.lastName}`,
        email: userData.user.email,
        password: userData.user.password
        // El rol admin se asigna por defecto en el backend
      }
    };
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData)
    });
    return handleResponse(response);
  },
  
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },
  
  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    return handleResponse(response);
  },
  
  getMe: async (token) => {
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },
  
  changePassword: async (currentPassword, newPassword, token) => {
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return handleResponse(response);
  }
};