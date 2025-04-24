// src/services/UsersApi.js
import { API_BASE_URL, getAuthHeaders, handleResponse } from './api';

// Crear un usersApi para mantener consistencia con otros servicios
export const usersApi = {
  // Obtener todos los usuarios
  getUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Obtener un usuario por su ID
  getUserById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo usuario
  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Actualizar un usuario existente
  updateUser: async (id, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un usuario
  deleteUser: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  },

  // Cambiar contraseña de usuario
  changePassword: async (id, passwordData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/change-password`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error changing password for user with ID ${id}:`, error);
      throw error;
    }
  },

  // Asignar rol a usuario
  assignRole: async (id, roleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/roles`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roleData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error assigning role to user with ID ${id}:`, error);
      throw error;
    }
  },

  // Activar/desactivar usuario (método específico)
  toggleUserActive: async (id, active) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active })
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error toggling user status with ID ${id}:`, error);
      throw error;
    }
  },

  // Método para restablecer contraseña (admin)
  resetUserPassword: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/reset-password`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error resetting password for user with ID ${id}:`, error);
      throw error;
    }
  },

  // Método para actualizar perfil (usuario actual)
  updateProfile: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

// Para mantener compatibilidad con las funciones que hemos creado antes
export const getUsersApi = usersApi.getUsers;
export const getUserByIdApi = usersApi.getUserById;
export const createUserApi = usersApi.createUser;
export const updateUserApi = usersApi.updateUser;
export const deleteUserApi = usersApi.deleteUser;
export const changePasswordApi = usersApi.changePassword;
export const assignRoleApi = usersApi.assignRole;
export const toggleUserActiveApi = usersApi.toggleUserActive;
export const resetUserPasswordApi = usersApi.resetUserPassword;
export const updateProfileApi = usersApi.updateProfile;