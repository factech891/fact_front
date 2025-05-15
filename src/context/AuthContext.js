// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../services/AuthApi';
import { useNavigate } from 'react-router-dom';
import useInactivityTimeout from '../hooks/useInactivityTimeout'; // Importar el hook

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto más fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

// Componente para manejar la inactividad
const InactivityHandler = ({ timeout }) => {
  useInactivityTimeout(timeout);
  return null; // No renderiza nada
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
            // *** COMENTADO TEMPORALMENTE PARA RESTAURAR ACCESO ***
            // No verificamos estado de suscripción o compañía para permitir acceso
            
            // Verificar si hay un avatar guardado localmente para este usuario específico
            const userId = data.user.id || data.user._id;
            if (userId) {
              const avatarKey = `userAvatar_${userId}`;
              const savedAvatar = localStorage.getItem(avatarKey);
              
              if (savedAvatar && (!data.user.selectedAvatarUrl || data.user.selectedAvatarUrl !== savedAvatar)) {
                // Usar el avatar guardado localmente para este usuario específico
                data.user.selectedAvatarUrl = savedAvatar;
                console.log(`Cargando avatar específico para usuario ${userId} desde localStorage`);
              }
            }
            
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
        
        // *** COMENTADO TEMPORALMENTE PARA RESTAURAR ACCESO ***
        // No verificamos estado de suscripción o compañía para permitir acceso
        
        // Guardar token en localStorage y estado
        localStorage.setItem('token', token);
        setToken(token);
        setCurrentUser(user);
        setCompany(company);
        setSubscription(subscription);
        
        return { user, company, subscription };
      } else {
        // Si la API devuelve un error específico de verificación, lanzarlo
        if (response.needsVerification) {
            const error = new Error(response.message || 'Email no verificado');
            // @ts-ignore // Suprimir advertencia de TypeScript si 'response' no tiene 'data'
            error.response = { data: { needsVerification: true } }; 
            throw error;
        }
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

  // Función para actualizar los datos del usuario en el contexto
  const updateUserContext = (updatedUserData) => {
    setCurrentUser(prevUser => {
      const newUserData = {
        ...prevUser,
        ...updatedUserData
      };
      
      if (updatedUserData.selectedAvatarUrl && prevUser && (prevUser.id || prevUser._id)) {
        const userId = prevUser.id || prevUser._id;
        const avatarKey = `userAvatar_${userId}`;
        localStorage.setItem(avatarKey, updatedUserData.selectedAvatarUrl);
        console.log(`Avatar guardado específicamente para usuario ${userId} con clave ${avatarKey}`);
      }
      
      return newUserData;
    });
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!currentUser) return false;
    
    if (currentUser.roles && Array.isArray(currentUser.roles)) {
      return currentUser.roles.includes(role);
    }
    
    if (currentUser.role) {
      return currentUser.role === role;
    }
    
    return false;
  };

  // Obtener página inicial según rol
  const getHomePageByRole = () => {
    if (!currentUser) return '/auth/login';
    
    if (hasRole('facturador')) {
      return '/invoices';
    }
    
    return '/';
  };

  // Función para solicitar verificación de correo
  const requestEmailVerification = async (email) => {
    try {
      setError(null);
      // Asumimos que authApi.requestEmailVerification existe y está implementada
      const response = await authApi.requestEmailVerification(email);
      // Devolver la respuesta completa para que el componente pueda manejar 'success' u otros datos.
      return response; 
    } catch (error) {
      // @ts-ignore // Suprimir advertencia de TypeScript si error no tiene message
      setError(error.message);
      throw error;
    }
  };

  // Función para verificar correo con token
  const verifyEmail = async (verificationToken) => { // Renombrado el parámetro para evitar colisión con el 'token' del estado.
    try {
      setError(null);
      // Asumimos que authApi.verifyEmail existe y está implementada
      const response = await authApi.verifyEmail(verificationToken);
      return response;
    } catch (error) {
      // @ts-ignore // Suprimir advertencia de TypeScript si error no tiene message
      setError(error.message);
      throw error;
    }
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
    getHomePageByRole,
    updateUserContext,
    requestEmailVerification, 
    verifyEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Activar el detector de inactividad solo cuando hay un usuario autenticado */}
      {currentUser && <InactivityHandler timeout={60} />}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;