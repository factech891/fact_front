// src/services/api.js
const API_BASE_URL = 'http://localhost:5002/api';

// Función para manejar respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  }

  return null;
};

// Servicios para Clientes
export const clientsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/clients`);
    return handleResponse(response);
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`);
    return handleResponse(response);
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// Servicios para Productos
export const productsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    return handleResponse(response);
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(response);
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// Servicios para Facturas
export const invoicesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/invoices`);
    return handleResponse(response);
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`);
    return handleResponse(response);
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },
  downloadPDF: async (invoiceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/pdf`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf'
        }
      });

      if (!response.ok) {
        throw new Error('Error al descargar el PDF');
      }

      // Obtener el blob del PDF
      const blob = await response.blob();

      // Crear URL del blob
      const url = window.URL.createObjectURL(blob);

      // Crear link temporal para la descarga
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `factura-${invoiceId}.pdf`;

      // Agregar a documento, hacer clic y limpiar
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return true;
    } catch (error) {
      console.error('Error descargando PDF:', error);
      throw error;
    }
  }
};

// Servicios para Company
export const companyApi = {
  get: async () => {
    const response = await fetch(`${API_BASE_URL}/company`);
    return handleResponse(response);
  },
  update: async (data) => {
    const response = await fetch(`${API_BASE_URL}/company`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await fetch(`${API_BASE_URL}/company/logo`, {
      method: 'POST',
      body: formData // No establecer Content-Type, fetch lo hará automáticamente
    });
    return handleResponse(response);
  },
  updateTheme: async (settings) => {
    const response = await fetch(`${API_BASE_URL}/company/theme`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return handleResponse(response);
  }
};