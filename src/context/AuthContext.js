// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../services/AuthApi';
import { useNavigate } from 'react-router-dom';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto más fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Efecto para verificar el token almacenado al cargar la aplicación
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const userData = await authApi.verifyToken();
          setCurrentUser(userData);
        } catch (error) {
          console.error('Error verificando token:', error);
          // Token inválido o expirado, limpiar estado
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authApi.login({ email, password });
      const { token, user } = response;
      
      // Guardar token en localStorage y estado
      localStorage.setItem('token', token);
      setToken(token);
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Función para registrar una nueva empresa/usuario
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authApi.register(userData);
      const { token, user } = response;
      
      // Guardar token y usuario si el registro inicia sesión automáticamente
      if (token) {
        localStorage.setItem('token', token);
        setToken(token);
        setCurrentUser(user);
      }
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    navigate('/auth/login');
  };

  // Función para solicitar recuperación de contraseña
  const forgotPassword = async (email) => {
    try {
      setError(null);
      return await authApi.forgotPassword(email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Función para restablecer contraseña con token
  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      return await authApi.resetPassword(token, newPassword);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!currentUser || !currentUser.roles) return false;
    return currentUser.roles.includes(role);
  };

  // Proporcionar el contexto
  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;