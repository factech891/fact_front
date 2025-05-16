// src/services/api.js
let API_BASE_URL;
if (process.env.NODE_ENV === 'production') {
  API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;
} else {
  API_BASE_URL = 'http://localhost:5002/api';
}

// Función para manejar respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    try {
      const errorBody = await response.json();
      const errorMessage = errorBody.error || errorBody.message || `Error: ${response.status}`;
      
      // Estandarizar mensajes de error de permisos
      if (response.status === 403 || 
          errorMessage.includes('permiso') || 
          errorMessage.includes('acceso') || 
          errorMessage.includes('autorizado')) {
        throw new Error('Sin acceso.');
      }
      
      // Traducir mensajes de error comunes a mensajes amigables
      if (errorMessage.includes('duplicate key') && errorMessage.includes('email')) {
        throw new Error('Este correo electrónico ya está registrado en el sistema');
      }
      
      if (errorMessage.includes('duplicate key') && errorMessage.includes('rif')) {
        throw new Error('Este RIF/Cédula ya está registrado en el sistema');
      }
      
      throw new Error(errorMessage);
    } catch (e) {
      // Si no podemos extraer el JSON o es otro tipo de error
      if (e.message === 'Sin acceso.') {
        throw e; // Ya es nuestro mensaje estandarizado
      }
      
      if (e.message && (e.message.includes('correo') || e.message.includes('RIF'))) {
        throw e; // Usar nuestro mensaje amigable ya creado
      }
      
      // Para errores 403 que no pudimos parsear
      if (response.status === 403) {
        throw new Error('Sin acceso.');
      }
      
      throw new Error(`Error ${response.status}: No se pudo procesar la solicitud`);
    }
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

// Función para obtener las cabeceras con el token de autenticación
const getAuthHeaders = (contentType = 'application/json') => {
  const headers = { 'Content-Type': contentType };
  const token = localStorage.getItem('token');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Exportamos las funciones para usar en otras partes de la aplicación
export { API_BASE_URL, handleResponse, getAuthHeaders };

// Servicios para Clientes con autenticación
export const clientsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Servicios para Productos con autenticación
export const productsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Servicios para Facturas con autenticación
export const invoicesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  downloadPDF: async (invoiceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/pdf`, {
        method: 'GET',
        headers: {
          ...getAuthHeaders('application/pdf'),
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

// Servicios para documentos/cotizaciones con autenticación
export const documentsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Servicios para Company con autenticación
export const companyApi = {
  get: async () => {
    const response = await fetch(`${API_BASE_URL}/company`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  update: async (data) => {
    const response = await fetch(`${API_BASE_URL}/company`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    
    // Para FormData no incluimos Content-Type, pero sí el token de autorización
    const headers = {};
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/company/logo`, {
      method: 'POST',
      headers,
      body: formData
    });
    return handleResponse(response);
  },
  deleteLogo: async (logoId) => {
    // MODIFICACIÓN: Codificamos el ID para manejar caracteres como "/"
    const encodedId = encodeURIComponent(logoId);
    
    const response = await fetch(`${API_BASE_URL}/company/logo/${encodedId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  updateTheme: async (settings) => {
    const response = await fetch(`${API_BASE_URL}/company/theme`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return handleResponse(response);
  }
};

// Servicios para Autenticación
export const authApi = {
  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};