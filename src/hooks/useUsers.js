import { useState, useEffect } from 'react';
import { 
  getUsersApi, 
  getUserByIdApi, 
  createUserApi, 
  updateUserApi, 
  deleteUserApi,
  toggleUserActiveApi,
  resetUserPasswordApi,
  updateProfileApi
} from '../services/UsersApi';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsersApi();
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success && Array.isArray(response.users)) {
        setUsers(response.users);
      } else {
        // Si no tiene la estructura esperada, usar un array vacío
        console.error('Respuesta del API no tiene el formato esperado');
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      setError(err);
      console.error('Error al obtener usuarios');
      setUsers([]); // En caso de error, establecer un array vacío
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const getUserById = async (id) => {
    try {
      setLoading(true);
      const response = await getUserByIdApi(id);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success && response.user) {
        return response.user;
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (err) {
      setError(err);
      console.error('Error al obtener usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const createUser = async (userData) => {
    try {
      setLoading(true);
      // No hacer log de datos sensibles
      console.log('Iniciando creación de usuario...');
      
      const response = await createUserApi(userData);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success && response.user) {
        setUsers(prev => [...prev, response.user]);
        return response.user;
      } else {
        throw new Error(response?.message || 'Error al crear usuario');
      }
    } catch (err) {
      setError(err);
      console.error('Error al crear usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      // No hacer log de datos sensibles
      console.log('Iniciando actualización de usuario...');
      
      const response = await updateUserApi(id, userData);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success && response.user) {
        setUsers(prev => prev.map(user => 
          user._id === id ? { ...user, ...response.user } : user
        ));
        return response.user;
      } else {
        throw new Error(response?.message || 'Error al actualizar usuario');
      }
    } catch (err) {
      setError(err);
      console.error('Error al actualizar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      const response = await deleteUserApi(id);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success) {
        setUsers(prev => prev.filter(user => user._id !== id));
        return true;
      } else {
        throw new Error(response?.message || 'Error al eliminar usuario');
      }
    } catch (err) {
      setError(err);
      console.error('Error al eliminar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const toggleUserStatus = async (id, active) => {
    try {
      setLoading(true);
      const response = await toggleUserActiveApi(id, active);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success && response.user) {
        setUsers(prev => prev.map(user => 
          user._id === id ? { ...user, ...response.user } : user
        ));
        return response.user;
      } else {
        throw new Error(response?.message || 'Error al cambiar estado del usuario');
      }
    } catch (err) {
      setError(err);
      console.error('Error al cambiar estado del usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const resetPassword = async (id) => {
    try {
      setLoading(true);
      const response = await resetUserPasswordApi(id);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success) {
        return response;
      } else {
        throw new Error(response?.message || 'Error al restablecer contraseña');
      }
    } catch (err) {
      setError(err);
      console.error('Error al restablecer contraseña');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserProfile = async (userData) => {
    try {
      setLoading(true);
      // No hacer log de datos sensibles
      console.log('Iniciando actualización de perfil...');
      
      const response = await updateProfileApi(userData);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.success && response.user) {
        return response.user;
      } else {
        throw new Error(response?.message || 'Error al actualizar perfil');
      }
    } catch (err) {
      setError(err);
      console.error('Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetPassword,
    updateUserProfile
  };
};