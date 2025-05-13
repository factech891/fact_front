// src/context/AuthContext.js (actualizado para que platform_admin ignore las verificaciones de estado de empresa/suscripción)
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

  // Efecto para verificar el token almacenado al cargar la aplicación (MODIFICADO)
  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      setError(null);
      if (token) {
        try {
          const data = await authApi.getMe(token);
          if (data.success) {
            const fetchedUser = data.user;
            const companyData = data.company;
            const subscriptionData = data.subscription;

            // --- INICIO MODIFICACIÓN: Verificar estado de empresa/suscripción SOLO si NO es platform_admin ---
            const isPlatformAdmin = fetchedUser && (fetchedUser.role === 'platform_admin' || fetchedUser.roles?.includes('platform_admin'));

            if (!isPlatformAdmin) {
              // Si NO es admin de plataforma, aplicar las verificaciones
              if (companyData && (!companyData.active || (subscriptionData && ['cancelled', 'expired'].includes(subscriptionData.status?.toLowerCase())))) {
                // Token válido pero empresa inactiva o suscripción cancelada/expirada para usuario normal
                console.warn(`Acceso bloqueado para usuario ${fetchedUser?.email}: Empresa inactiva (${!companyData.active}) o suscripción inválida (${subscriptionData?.status})`);
                localStorage.removeItem('token');
                setToken(null);
                setCurrentUser(null);
                setCompany(null);
                setSubscription(null);
                setError('La empresa asociada a su cuenta está desactivada o su suscripción ha finalizado.');
                setLoading(false);
                navigate('/auth/login');
                return; // Salir de la función verifyToken
              }
            }
            // --- FIN MODIFICACIÓN ---

            // Si la verificación pasa (o es admin), continuar...
            const userId = fetchedUser.id || fetchedUser._id;
            if (userId) {
              const avatarKey = `userAvatar_${userId}`;
              const savedAvatar = localStorage.getItem(avatarKey);
              if (savedAvatar && (!fetchedUser.selectedAvatarUrl || fetchedUser.selectedAvatarUrl !== savedAvatar)) {
                fetchedUser.selectedAvatarUrl = savedAvatar;
                console.log(`Cargando avatar específico para usuario ${userId} desde localStorage`);
              }
            }

            setCurrentUser(fetchedUser);
            setCompany(companyData);
            setSubscription(subscriptionData);

          } else {
            localStorage.removeItem('token');
            setToken(null);
            setCurrentUser(null);
            setCompany(null);
            setSubscription(null);
          }
        } catch (error) {
          console.error('Error verificando token:', error);
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
  }, [token, navigate]); // Dependencias mantenidas

  // Función para iniciar sesión (MODIFICADA)
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authApi.login({ email, password });

      if (response.success) {
        const { token: responseToken, user, company: companyData, subscription: subscriptionData } = response;

        // --- INICIO MODIFICACIÓN: Verificar estado de empresa/suscripción SOLO si NO es platform_admin ---
        const isPlatformAdmin = user && (user.role === 'platform_admin' || user.roles?.includes('platform_admin'));

        if (!isPlatformAdmin) {
          // Si NO es admin de plataforma, aplicar las verificaciones
          if (companyData && (!companyData.active || (subscriptionData && ['cancelled', 'expired'].includes(subscriptionData.status?.toLowerCase())))) {
            const loginError = new Error('La empresa asociada a su cuenta está desactivada o su suscripción ha finalizado.');
            // @ts-ignore
            loginError.companyInactive = true;
            throw loginError;
          }
        }
        // --- FIN MODIFICACIÓN ---

        // Si la verificación pasa (o es admin), guardar token y estado
        localStorage.setItem('token', responseToken);
        setToken(responseToken);
        setCurrentUser(user);
        setCompany(companyData);
        setSubscription(subscriptionData);

        return { user, company: companyData, subscription: subscriptionData };

      } else {
        // Manejo de otros errores de la respuesta API (como needsVerification)
        if (response.needsVerification) {
            const verificationError = new Error(response.message || 'Email no verificado');
            // @ts-ignore
            verificationError.needsVerification = true;
            throw verificationError;
        }
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      // @ts-ignore
      setError(error.message || 'Error desconocido durante el login.');
      throw error;
    }
  };

  // Función para registrar una nueva empresa/usuario (sin cambios respecto a base)
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authApi.register(userData);

      if (response.success) {
        const { token: responseToken, user, company: companyData, subscription: subscriptionData } = response;

        // Guardar token en localStorage y estado
        localStorage.setItem('token', responseToken);
        setToken(responseToken);
        setCurrentUser(user);
        setCompany(companyData);
        setSubscription(subscriptionData);

        return { user, company: companyData, subscription: subscriptionData };
      } else {
        throw new Error(response.message || 'Error en el registro');
      }
    } catch (error) {
      // @ts-ignore
      setError(error.message);
      throw error;
    }
  };

  // Función para cerrar sesión (sin cambios respecto a base)
  const logout = () => {
    if (currentUser && (currentUser.id || currentUser._id)) {
       const userId = currentUser.id || currentUser._id;
       localStorage.removeItem(`userAvatar_${userId}`);
       console.log(`Avatar específico de localStorage eliminado para usuario ${userId} al cerrar sesión.`);
    }
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setCompany(null);
    setSubscription(null);
    navigate('/auth/login');
  };

  // Función para solicitar recuperación de contraseña (sin cambios respecto a base)
  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await authApi.forgotPassword(email);
      if (!response.success) {
        throw new Error(response.message || 'Error al procesar la solicitud');
      }
      return response;
    } catch (error) {
      // @ts-ignore
      setError(error.message);
      throw error;
    }
  };

  // Función para restablecer contraseña con token (sin cambios respecto a base)
  const resetPassword = async (resetToken, newPassword) => {
    try {
      setError(null);
      const response = await authApi.resetPassword(resetToken, newPassword);
      if (!response.success) {
        throw new Error(response.message || 'Error al restablecer la contraseña');
      }
      return response;
    } catch (error) {
      // @ts-ignore
      setError(error.message);
      throw error;
    }
  };

  // Función para cambiar contraseña del usuario actual (sin cambios respecto a base)
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const response = await authApi.changePassword(currentPassword, newPassword, token);
      if (!response.success) {
        throw new Error(response.message || 'Error al cambiar la contraseña');
      }
      return response;
    } catch (error) {
      // @ts-ignore
      setError(error.message);
      throw error;
    }
  };

  // Función para actualizar los datos del usuario en el contexto (sin cambios respecto a base)
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

  // Verificar si el usuario tiene un rol específico (sin cambios respecto a base)
  const hasRole = (role) => {
    if (!currentUser) return false;

    if (currentUser.roles && Array.isArray(currentUser.roles)) {
      return currentUser.roles.includes(role);
    }

    // Compatibilidad por si solo viene el campo 'role'
    if (currentUser.role) {
      return currentUser.role === role;
    }

    return false;
  };

  // Obtener página inicial según rol (sin cambios respecto a base)
  const getHomePageByRole = () => {
    if (!currentUser) return '/auth/login';

    // Asegurar que hasRole se usa para verificar
    if (hasRole('platform_admin')) {
       return '/platform-admin'; // Redirigir admin a su dashboard
    }
    if (hasRole('facturador')) {
      return '/invoices';
    }

    return '/'; // Página por defecto
  };

  // Función para solicitar verificación de correo (sin cambios respecto a base)
  const requestEmailVerification = async (email) => {
    try {
      setError(null);
      const response = await authApi.requestEmailVerification(email);
      return response;
    } catch (error) {
      // @ts-ignore
      setError(error.message);
      throw error;
    }
  };

  // Función para verificar correo con token (sin cambios respecto a base)
  const verifyEmail = async (verificationToken) => {
    try {
      setError(null);
      const response = await authApi.verifyEmail(verificationToken);
      return response;
    } catch (error) {
      // @ts-ignore
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
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;