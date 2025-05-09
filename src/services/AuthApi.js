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
      
      if (!response.ok) {
        const errorBody = await response.json();
        let errorMessage = errorBody.message || errorBody.error || 'Error de autenticación';
        
        if (response.status === 401) { // Unauthorized
            if (errorBody.needsVerification) {
                // El mensaje de error específico ya lo maneja el AuthContext al interpretar needsVerification.
                // Aquí lanzamos el error con la propiedad para que AuthContext lo detecte.
                const error = new Error(errorBody.message || 'Email no verificado');
                // @ts-ignore // Suprimir advertencia si 'error' no tiene 'needsVerification' por defecto
                error.needsVerification = true; 
                throw error;
            }
        }
        throw new Error(errorMessage);
      }
      
      return handleResponse(response); // Asumimos que handleResponse puede parsear JSON y lanzar error si la respuesta no es success
    } catch (error) {
      // Propagar el error para que sea manejado por el AuthContext o el llamador
      throw error;
    }
  },
  
  register: async (userData) => {
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
      // Sugerencia de refactor: Considerar si esta validación debe estar aquí o ser manejada por el llamador.
      // Por consistencia, podría estar en el componente/hook que llama a getMe.
      // Lanzar un error directamente es una opción válida para indicar un prerrequisito no cumplido.
      throw new Error('No hay token de autenticación para getMe');
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
      throw new Error('No hay token de autenticación para changePassword');
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
  
  updateProfile: async (profileData, token) => {
    if (!token) {
      throw new Error('No hay token de autenticación para updateProfile');
    }
    
    const response = await fetch(`${API_BASE_URL}/users/profile`, { // Asumiendo que este endpoint existe en el backend
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  /**
   * Solicitar un nuevo correo de verificación.
   * @param {string} email El correo electrónico del usuario.
   * @returns {Promise<any>} La respuesta del servidor.
   */
  requestEmailVerification: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },

  /**
   * Verificar correo electrónico con token.
   * @param {string} token El token de verificación.
   * @returns {Promise<any>} La respuesta del servidor.
   */
  verifyEmail: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
      // No se envía body en una petición GET típica para verificación de token en URL.
    });
    return handleResponse(response);
  }
};