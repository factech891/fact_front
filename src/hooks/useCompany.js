import React from 'react';
// src/hooks/useCompany.js
import { useState, useEffect } from 'react';
import { companyApi } from '../services/api';

export const useCompany = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompany = async () => {
    try {
      console.log('1. Intentando obtener información de la empresa...');
      const data = await companyApi.get();
      console.log('2. Datos de la empresa recibidos:', data);
      setCompany(data);
    } catch (error) {
      console.error('Error al obtener información de la empresa:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveCompany = async (companyData) => {
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
    try {
      console.log('5. Intentando subir logo:', file.name);
      const result = await companyApi.uploadLogo(file);
      console.log('6. Logo subido:', result);
      
      // Creamos un objeto actualizado con los datos correctos
      const updatedCompany = {
        ...company,
        logoUrl: result.url,
        logoId: result.public_id || result.logoId || ''
      };
      
      console.log('Actualizando empresa con nuevo logo:', updatedCompany);
      
      // Guardamos en la BD a través de la API
      await companyApi.update(updatedCompany);
      
      // Actualizamos el estado local
      setCompany(updatedCompany);
      
      return result;
    } catch (error) {
      console.error('Error al subir logo:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateTheme = async (settings) => {
    try {
      console.log('7. Intentando actualizar tema:', settings);
      const updatedSettings = await companyApi.updateTheme(settings);
      console.log('8. Tema actualizado:', updatedSettings);
      setCompany(prev => ({
        ...prev,
        ...updatedSettings
      }));
      return updatedSettings;
    } catch (error) {
      console.error('Error al actualizar tema:', error);
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    console.log('useEffect en useCompany - Llamando a fetchCompany');
    fetchCompany();
  }, []);

  return {
    company,
    loading,
    error,
    saveCompany,
    uploadLogo,
    updateTheme
  };
};

export default useCompany;