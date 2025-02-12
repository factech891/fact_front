// src/services/companyApi.js
import { api } from './api';

export const companyApi = {
  get: async () => {
    const response = await api.get('/company');
    return response.data;
  },

  update: async (companyData) => {
    const response = await api.put('/company', companyData);
    return response.data;
  },

  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await api.post('/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateInvoiceSettings: async (settings) => {
    const response = await api.put('/company/invoice-settings', settings);
    return response.data;
  }
};