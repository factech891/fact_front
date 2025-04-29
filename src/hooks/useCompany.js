// src/hooks/useCompany.js (actualizado para ignorar platform_admin)
import { useState, useEffect, useCallback } from 'react'; // Añadir useCallback
import { companyApi } from '../services/api';
import { useAuth } from '../context/AuthContext'; // Importar useAuth

export const useCompany = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true); // Empezar como true
  const [error, setError] = useState(null);

  // Obtener el usuario actual y el estado de carga de la autenticación
  const { currentUser, loading: authLoading } = useAuth();

  // --- IMPORTANTE: Usa el mismo rol que definiste en otros archivos ---
  const PLATFORM_ADMIN_ROLE = 'platform_admin';

  // --- Función para obtener datos de la empresa (modificada) ---
  const fetchCompany = useCallback(async () => {
    // No hacer nada si la autenticación aún está cargando o no hay usuario
    if (authLoading || !currentUser) {
      // Si no hay usuario pero la carga de auth terminó, significa que no está logueado
      if (!authLoading && !currentUser) {
          setLoading(false);
          setCompany(null);
          setError(null); // No es un error, simplemente no hay sesión
      }
      // Si authLoading es true, esperamos a que termine
      return;
    }

    // Si el usuario es platform_admin, no cargar datos de empresa
    if (currentUser.role === PLATFORM_ADMIN_ROLE) {
      console.log('useCompany: Usuario es platform_admin, omitiendo carga de datos de empresa.');
      setCompany(null); // Asegurar que no haya datos de empresa
      setError(null);
      setLoading(false); // Terminar la carga
      return; // Salir de la función
    }

    // Si es un usuario normal, proceder a cargar datos de la empresa
    setLoading(true); // Asegurarse de poner loading en true antes de la llamada
    setError(null); // Limpiar errores previos
    try {
      console.log('1. Intentando obtener información de la empresa (usuario normal)...');
      const data = await companyApi.get(); // Asume que esta API obtiene la empresa del usuario logueado
      console.log('2. Datos de la empresa recibidos:', data);
      setCompany(data);
    } catch (error) {
      console.error('Error al obtener información de la empresa:', error);
      setError(error.message);
      setCompany(null); // Limpiar datos en caso de error
    } finally {
      setLoading(false); // Terminar la carga en cualquier caso
    }
  // Dependencias: currentUser y authLoading para reaccionar a cambios de sesión/rol
  }, [currentUser, authLoading, PLATFORM_ADMIN_ROLE]);


  // --- Funciones de acción (save, upload, updateTheme) ---
  // Estas funciones también deberían idealmente verificar el rol,
  // pero la modificación principal para arreglar la navegación es en fetchCompany.
  // Por ahora, las dejamos como están, asumiendo que no se llamarán
  // desde componentes visibles para platform_admin que requieran datos de una empresa específica.

  const saveCompany = async (companyData) => {
    // Opcional: Añadir verificación de rol aquí si es necesario
    // if (currentUser?.role === PLATFORM_ADMIN_ROLE) return;
    try {
      console.log('3. Intentando guardar información de la empresa:', companyData);
      const savedCompany = await companyApi.update(companyData);
      console.log('4. Información de la empresa guardada:', savedCompany);
      setCompany(savedCompany);
      return savedCompany;
    } catch (error) {
      console.error('Error al guardar información de la empresa:', error);
      setError(error.message);
      throw error;
    }
  };

  const uploadLogo = async (file) => {
     // Opcional: Añadir verificación de rol
     // if (currentUser?.role === PLATFORM_ADMIN_ROLE) return;
    try {
      console.log('5. Intentando subir logo:', file.name);
      const result = await companyApi.uploadLogo(file);
      console.log('6. Logo subido:', result);

      // Crear objeto actualizado (asumiendo que 'company' tiene datos si no es admin)
      const updatedCompanyData = {
        ...(company || {}), // Usar objeto vacío si company es null
        logoUrl: result.url,
        logoId: result.public_id || result.logoId || ''
      };

      console.log('Actualizando empresa con nuevo logo:', updatedCompanyData);

      // Guardar en BD (solo si no es admin)
      if (currentUser?.role !== PLATFORM_ADMIN_ROLE) {
          await companyApi.update(updatedCompanyData);
          setCompany(updatedCompanyData); // Actualizar estado local
      } else {
          console.warn("uploadLogo: No se actualiza la empresa para platform_admin.");
      }

      return result;
    } catch (error) {
      console.error('Error al subir logo:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateTheme = async (settings) => {
    // Opcional: Añadir verificación de rol
    // if (currentUser?.role === PLATFORM_ADMIN_ROLE) return;
    try {
      console.log('7. Intentando actualizar tema:', settings);
      const updatedSettings = await companyApi.updateTheme(settings);
      console.log('8. Tema actualizado:', updatedSettings);
       // Actualizar estado local solo si no es admin
       if (currentUser?.role !== PLATFORM_ADMIN_ROLE) {
           setCompany(prev => ({
             ...(prev || {}), // Usar objeto vacío si prev es null
             ...updatedSettings
           }));
       } else {
           console.warn("updateTheme: No se actualiza el tema para platform_admin.");
       }
      return updatedSettings;
    } catch (error) {
      console.error('Error al actualizar tema:', error);
      setError(error.message);
      throw error;
    }
  };

  // --- useEffect para llamar a fetchCompany ---
  useEffect(() => {
    console.log('useEffect en useCompany - Evaluando si llamar a fetchCompany');
    fetchCompany();
  // La dependencia ahora está en fetchCompany a través de useCallback
  }, [fetchCompany]);

  // Devolver el estado y las funciones
  return {
    company,
    loading: loading || authLoading, // Considerar que está cargando si auth o company lo están
    error,
    saveCompany,
    uploadLogo,
    updateTheme,
    // Podrías añadir una bandera si quieres saber explícitamente si es admin
    // isPlatformAdmin: currentUser?.role === PLATFORM_ADMIN_ROLE
  };
};

export default useCompany;