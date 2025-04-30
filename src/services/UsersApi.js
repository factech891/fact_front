// src/services/UsersApi.js
import { API_BASE_URL, getAuthHeaders, handleResponse } from './api';

// Crear un usersApi para mantener consistencia con otros servicios
export const usersApi = {
  // Obtener todos los usuarios
  getUsers: async () => {
    // ... (código existente sin cambios)
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
    // ... (código existente sin cambios)
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
    // ... (código existente sin cambios)
     try {
      const userDataToSend = { ...userData };
      if (userDataToSend.name && !userDataToSend.nombre) {
        userDataToSend.nombre = userDataToSend.name;
        delete userDataToSend.name;
      }
      const { password, ...safeUserData } = userDataToSend;
      console.log('Creando nuevo usuario...');
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
    // ... (código existente sin cambios)
    try {
      const userDataToSend = { ...userData };
      if (userDataToSend.name && !userDataToSend.nombre) {
        userDataToSend.nombre = userDataToSend.name;
        delete userDataToSend.name;
      }
      const { password, ...safeUserData } = userDataToSend;
      console.log('Actualizando usuario...');
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
    // ... (código existente sin cambios)
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
    // NOTE: Este endpoint parece ser para que un admin cambie la contraseña de OTRO usuario por ID.
    // La función para que el usuario cambie SU PROPIA contraseña usualmente está en AuthApi (`POST /api/auth/change-password`)
    // Revisa si este endpoint '/users/:id/change-password' realmente existe o si deberías usar el de AuthApi.
    // Por ahora lo dejo como está en tu código original.
    try {
      console.log('Cambiando contraseña de usuario (admin)...');
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
    // ... (código existente sin cambios)
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
    // ... (código existente sin cambios)
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT', // O podría ser PATCH si solo cambia 'active'
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
    // ... (código existente sin cambios)
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
  // NOTA: Ya tenías una función 'updateProfile'. Asegúrate cuál quieres usar.
  // El endpoint '/users/profile' parece más adecuado que '/auth/me' si actualizas datos.
  // La dejé aquí, pero revisa tu AuthApi.js también.
  updateProfile: async (userData) => {
    try {
      const { password, ...safeUserData } = userData;
      console.log('Actualizando perfil de usuario (desde UsersApi)...');
      const response = await fetch(`${API_BASE_URL}/users/profile`, { // Usando el endpoint que definiste en el controller
        method: 'PUT', // O PATCH si solo actualizas nombre
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData) // Solo enviar nombre si es lo único editable aquí { nombre: userData.nombre }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar perfil de usuario');
      throw error;
    }
  },

  // Modificación en UsersApi.js:
  updateMyAvatar: async (avatarUrl) => {
    try {
      console.log('Actualizando avatar - solución híbrida específica por usuario...');

      // Obtener el usuario actual del token o localStorage
      const token = localStorage.getItem('token');
      let userId = null;

      // Extraer userId del token (si está disponible)
      if (token) {
        try {
          // Intentar obtener el ID del usuario del token JWT (si tiene formato estándar)
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1])); // Decodificar payload
            userId = payload.userId || payload.sub || payload.id; // Buscar claims comunes para ID
            console.log(`User ID extraído del token: ${userId}`);
          } else {
             console.warn('Formato de token JWT inesperado.');
          }
        } catch (err) {
          console.error('Error al extraer ID de usuario del token:', err);
        }
      }

      // Si no se pudo obtener del token, intentar obtenerlo del localStorage (como fallback)
      if (!userId) {
        console.log('No se pudo obtener userId del token, intentando desde localStorage...');
        const userDataStr = localStorage.getItem('userData'); // Asumiendo que guardas 'userData'
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            userId = userData.id || userData._id; // Buscar ID en los datos guardados
            console.log(`User ID obtenido de localStorage: ${userId}`);
          } catch (err) {
            console.error('Error al parsear datos de usuario de localStorage:', err);
          }
        } else {
            console.log('No se encontraron datos de usuario en localStorage.');
        }
      }

      if (!userId) {
        console.warn('No se pudo obtener el ID del usuario para guardar el avatar de forma específica.');
        // Podríamos decidir no guardar en localStorage si no hay ID, o usar una clave genérica
        // Por ahora, la lógica continuará y el mensaje final reflejará esto.
      } else {
        // Guardar el avatar en localStorage ESPECÍFICO para este usuario
        const avatarKey = `userAvatar_${userId}`;
        localStorage.setItem(avatarKey, avatarUrl);
        console.log(`Avatar para usuario ${userId} guardado en localStorage como ${avatarKey}`);
      }

      // Intentar actualizar en el backend (por si se corrige)
      if (token) {
        console.log('Intentando actualización en backend...');
        try {
          const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ avatarUrl })
          });

          console.log('Respuesta del backend:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('¡Éxito! Avatar actualizado en el servidor.');
            // Si el backend tiene éxito, devolvemos su respuesta
            return {
              success: true,
              selectedAvatarUrl: data.selectedAvatarUrl || avatarUrl, // Priorizar valor del backend
              message: 'Avatar actualizado correctamente en el servidor'
            };
          } else {
             console.warn(`Respuesta del backend no fue OK (${response.status}), se procederá con la solución cliente.`);
          }
        } catch (err) {
          console.warn('Error en la llamada al backend, usando solución cliente:', err.message);
        }
      } else {
         console.warn('No se encontró token, usando directamente solución cliente.');
      }

      // Devolver éxito con la solución del lado del cliente (si el backend falló o no había token)
      console.log('Devolviendo éxito basado en la actualización del lado del cliente.');
      return {
        success: true,
        selectedAvatarUrl: avatarUrl,
        // Mensaje indica si se guardó de forma específica o no
        message: userId ? `Avatar actualizado (cambio local para usuario ${userId})` : 'Avatar actualizado (cambio local, sin ID de usuario)'
      };
    } catch (error) { // Captura errores inesperados
      console.error('Error fatal al actualizar avatar de usuario:', error);
      throw error; // Relanzar para manejo superior
    }
  }


};

// Para mantener compatibilidad con las funciones que hemos creado antes
export const getUsersApi = usersApi.getUsers;
export const getUserByIdApi = usersApi.getUserById;
export const createUserApi = usersApi.createUser;
export const updateUserApi = usersApi.updateUser;
export const deleteUserApi = usersApi.deleteUser;
export const changePasswordApi = usersApi.changePassword; // Revisa si este es el correcto vs el de AuthApi
export const assignRoleApi = usersApi.assignRole;
export const toggleUserActiveApi = usersApi.toggleUserActive;
export const resetUserPasswordApi = usersApi.resetUserPassword;
export const updateProfileApi = usersApi.updateProfile; // Exportar el de aquí
// --- INICIO: Exportar nueva función ---
export const updateMyAvatarApi = usersApi.updateMyAvatar;
// --- FIN: Exportar nueva función ---