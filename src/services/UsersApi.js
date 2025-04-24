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
      console.error('Error al obtener usuarios');
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
      console.error(`Error al obtener usuario con ID ${id}`);
      throw error;
    }
  },

  // Crear un nuevo usuario
  createUser: async (userData) => {
    try {
      // Asegurarse de que estamos usando 'nombre' en lugar de 'name'
      const userDataToSend = { ...userData };
      if (userDataToSend.name && !userDataToSend.nombre) {
        userDataToSend.nombre = userDataToSend.name;
        delete userDataToSend.name;
      }
      
      // Nunca loguear información sensible
      const { password, ...safeUserData } = userDataToSend;
      console.log('Creando nuevo usuario...'); // Sin datos sensibles

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDataToSend)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error al crear usuario');
      throw error;
    }
  },

  // Actualizar un usuario existente
  updateUser: async (id, userData) => {
    try {
      // Asegurarse de que estamos usando 'nombre' en lugar de 'name'
      const userDataToSend = { ...userData };
      if (userDataToSend.name && !userDataToSend.nombre) {
        userDataToSend.nombre = userDataToSend.name;
        delete userDataToSend.name;
      }
      
      // Nunca loguear información sensible
      const { password, ...safeUserData } = userDataToSend;
      console.log('Actualizando usuario...'); // Sin datos sensibles

      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDataToSend)
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}`);
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
      console.error(`Error al eliminar usuario con ID ${id}`);
      throw error;
    }
  },

  // Cambiar contraseña de usuario
  changePassword: async (id, passwordData) => {
    try {
      // Nunca loguear datos de contraseñas
      console.log('Cambiando contraseña de usuario...'); // Sin datos sensibles
      
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
      console.error(`Error al cambiar contraseña del usuario con ID ${id}`);
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
      console.error(`Error al asignar rol al usuario con ID ${id}`);
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
      console.error(`Error al cambiar estado del usuario con ID ${id}`);
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
      console.error(`Error al restablecer contraseña para usuario con ID ${id}`);
      throw error;
    }
  },

  // Método para actualizar perfil (usuario actual)
  updateProfile: async (userData) => {
    try {
      // Asegurarse de nunca loguear datos sensibles
      const { password, ...safeUserData } = userData;
      console.log('Actualizando perfil de usuario...'); // Sin datos sensibles
      
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
      console.error('Error al actualizar perfil de usuario');
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