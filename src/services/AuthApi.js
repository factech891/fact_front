// src/services/AuthApi.js (actualizado con mejores mensajes de error)
import { API_BASE_URL, handleResponse } from './api';

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      // Si la respuesta no es exitosa, manejar los errores específicos de login
      if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage = errorBody.message || errorBody.error || 'Error de autenticación';
        
        // Manejar mensajes específicos
        if (errorMessage === 'Usuario no existe') {
          throw new Error('Usuario no existe');
        } else if (errorMessage === 'Contraseña incorrecta') {
          throw new Error('Contraseña incorrecta');
        } else if (errorMessage.includes('Email o contraseña incorrectos')) {
           // Si el backend aún usa el mensaje genérico, intentar determinar el problema
           // Posible conflicto: La lógica original del código base ya incluía el manejo de 'no existe' e 'incorrecta',
           // este bloque adicional para 'Email o contraseña incorrectos' podría ser redundante si el backend
           // ya envía los mensajes específicos ('Usuario no existe', 'Contraseña incorrecta').
           // Se mantiene la lógica agregada pero se señala como posible redundancia o lógica cuestionable.
           if (!credentials.email) { // Esta comprobación puede no ser fiable aquí.
             throw new Error('Usuario no existe');
           } else {
             throw new Error('Contraseña incorrecta');
           }
        }
         
        // Si no coincide con los errores específicos, lanzar el mensaje recibido.
        throw new Error(errorMessage);
      }
      
      return handleResponse(response);
    } catch (error) {
      // Si ya tenemos un mensaje estandarizado, propagarlo
      throw error;
    }
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
  },
  
  // Nuevo método para actualizar el perfil
  updateProfile: async (profileData, token) => {
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  }
};