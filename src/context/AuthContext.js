// src/context/AuthContext.js (actualizado con función hasRole mejorada)
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
  const [company, setCompany] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Efecto para verificar el token almacenado al cargar la aplicación
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const data = await authApi.getMe(token);
          if (data.success) {
            setCurrentUser(data.user);
            setCompany(data.company);
            setSubscription(data.subscription);
          } else {
            // Token inválido o expirado, limpiar estado
            localStorage.removeItem('token');
            setToken(null);
            setCurrentUser(null);
            setCompany(null);
            setSubscription(null);
          }
        } catch (error) {
          console.error('Error verificando token:', error);
          // Token inválido o expirado, limpiar estado
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
          setCompany(null);
          setSubscription(null);
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
      
      if (response.success) {
        const { token, user, company, subscription } = response;
        
        // Guardar token en localStorage y estado
        localStorage.setItem('token', token);
        setToken(token);
        setCurrentUser(user);
        setCompany(company);
        setSubscription(subscription);
        
        return { user, company, subscription };
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
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
      
      if (response.success) {
        const { token, user, company, subscription } = response;
        
        // Guardar token en localStorage y estado
        localStorage.setItem('token', token);
        setToken(token);
        setCurrentUser(user);
        setCompany(company);
        setSubscription(subscription);
        
        return { user, company, subscription };
      } else {
        throw new Error(response.message || 'Error en el registro');
      }
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
    setCompany(null);
    setSubscription(null);
    navigate('/auth/login');
  };

  // Función para solicitar recuperación de contraseña
  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await authApi.forgotPassword(email);
      if (!response.success) {
        throw new Error(response.message || 'Error al procesar la solicitud');
      }
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Función para restablecer contraseña con token
  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      const response = await authApi.resetPassword(token, newPassword);
      if (!response.success) {
        throw new Error(response.message || 'Error al restablecer la contraseña');
      }
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Función para cambiar contraseña del usuario actual
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const response = await authApi.changePassword(currentPassword, newPassword, token);
      if (!response.success) {
        throw new Error(response.message || 'Error al cambiar la contraseña');
      }
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!currentUser) return false;
    
    // Si el usuario tiene propiedad 'roles' como array
    if (currentUser.roles && Array.isArray(currentUser.roles)) {
      return currentUser.roles.includes(role);
    }
    
    // Si el usuario tiene propiedad 'role' como string
    if (currentUser.role) {
      return currentUser.role === role;
    }
    
    return false;
  };

  // Obtener página inicial según rol
  const getHomePageByRole = () => {
    if (!currentUser) return '/auth/login';
    
    // Si es facturador, va directo a facturas
    if (hasRole('facturador')) {
      return '/invoices';
    }
    
    // Para el resto de roles, mostrar dashboard
    return '/';
  };

  // Proporcionar el contexto
  const value = {
    currentUser,
    company,
    subscription,
    token,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    hasRole,
    getHomePageByRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;