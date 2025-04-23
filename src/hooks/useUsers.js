// src/hooks/useUsers.js
import { useState, useEffect } from 'react';
import { 
  usersApi,
  getUsersApi, 
  getUserByIdApi, 
  createUserApi, 
  updateUserApi, 
  deleteUserApi 
} from '../services/UsersApi';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersApi();
      // Asegurarnos de que data es un array
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err);
      console.error('Error fetching users:', err);
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
      const user = await getUserByIdApi(id);
      return user;
    } catch (err) {
      setError(err);
      console.error('Error fetching user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const createUser = async (userData) => {
    try {
      setLoading(true);
      const newUser = await createUserApi(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err);
      console.error('Error creating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      const updatedUser = await updateUserApi(id, userData);
      setUsers(prev => prev.map(user => user._id === id ? updatedUser : user));
      return updatedUser;
    } catch (err) {
      setError(err);
      console.error('Error updating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await deleteUserApi(id);
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (err) {
      setError(err);
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const toggleUserStatus = async (id, active) => {
    try {
      setLoading(true);
      const updatedUser = await updateUserApi(id, { active });
      setUsers(prev => prev.map(user => user._id === id ? updatedUser : user));
      return updatedUser;
    } catch (err) {
      setError(err);
      console.error('Error toggling user status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Para desarrollo, podemos añadir datos de muestra si no hay backend
  const addDummyData = () => {
    const dummyUsers = [
      {
        _id: '1',
        name: 'Admin Usuario',
        email: 'admin@facttech.com',
        role: 'admin',
        active: true
      },
      {
        _id: '2',
        name: 'Gerente Ejemplo',
        email: 'gerente@facttech.com',
        role: 'manager',
        active: true
      },
      {
        _id: '3',
        name: 'Usuario Normal',
        email: 'usuario@facttech.com',
        role: 'user',
        active: false
      }
    ];
    setUsers(dummyUsers);
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
    addDummyData // Exportamos esta función para usarla en desarrollo
  };
};