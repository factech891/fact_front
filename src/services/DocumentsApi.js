const API_BASE_URL = 'http://localhost:5002/api';

/**
 * Obtiene la lista de documentos desde el backend.
 * @returns {Promise<Array>} Lista de documentos.
 */
export const getDocuments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents?populate=client`);
    if (!response.ok) {
      throw new Error(`Error al obtener los documentos: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener los documentos:', error);
    throw error;
  }
};

/**
 * Obtiene documentos pendientes para el dashboard.
 * @param {number} limit - Límite de documentos a obtener.
 * @returns {Promise<Array>} Lista de documentos pendientes.
 */
export const getPendingDocuments = async (limit = 5) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/pending?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Error al obtener documentos pendientes: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener documentos pendientes:', error);
    throw error;
  }
};

/**
 * Obtiene un documento por su ID.
 * @param {string} id - ID del documento a obtener.
 * @returns {Promise<Object>} El documento obtenido.
 */
export const getDocument = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${id}?populate=client`);
    if (!response.ok) {
      throw new Error(`Error al obtener el documento: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error al obtener documento ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo documento.
 * @param {Object} documentData - Datos del documento a crear.
 * @returns {Promise<Object>} El documento creado.
 */
export const createDocument = async (documentData) => {
  try {
    // Preparar datos para enviar
    const formattedItems = documentData.items.map(item => ({
      product: item.product?._id || item.product,
      name: item.name,
      description: item.description || '',
      quantity: item.quantity || 1,
      price: item.price || 0,
      taxRate: item.taxRate || 0,
      taxAmount: item.taxAmount || 0,
      total: item.total || 0
    }));

    const documentToSend = {
      ...documentData,
      client: documentData.client?._id || documentData.client,
      items: formattedItems
    };

    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
      },
      body: JSON.stringify(documentToSend),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error al crear documento:', error);
    throw error;
  }
};

/**
 * Actualiza un documento existente.
 * @param {string} id - ID del documento a actualizar.
 * @param {Object} documentData - Nuevos datos del documento.
 * @returns {Promise<Object>} El documento actualizado.
 */
export const updateDocument = async (id, documentData) => {
  try {
    // Preparar datos para enviar (similar a createDocument)
    const formattedItems = documentData.items.map(item => ({
      product: item.product?._id || item.product,
      name: item.name,
      description: item.description || '',
      quantity: item.quantity || 1,
      price: item.price || 0,
      taxRate: item.taxRate || 0,
      taxAmount: item.taxAmount || 0,
      total: item.total || 0
    }));

    const documentToSend = {
      ...documentData,
      client: documentData.client?._id || documentData.client,
      items: formattedItems
    };

    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
      },
      body: JSON.stringify(documentToSend),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error al actualizar documento ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un documento.
 * @param {string} id - ID del documento a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const deleteDocument = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
      }
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.status === 204 ? {} : response.json();
  } catch (error) {
    console.error(`Error al eliminar documento ${id}:`, error);
    throw error;
  }
};

/**
 * Convierte un documento a factura.
 * @param {string} id - ID del documento a convertir.
 * @param {Object} invoiceData - Datos adicionales para la factura.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const convertToInvoice = async (id, invoiceData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/convert-to-invoice`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error al convertir documento ${id} a factura:`, error);
    throw error;
  }
};

/**
 * Genera un PDF para un documento.
 * @param {string} id - ID del documento.
 * @returns {Promise<void>} Promise que representa la operación.
 */
export const generatePDF = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/pdf`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error al generar PDF: ${response.status}`);
    }
    
    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw error;
  }
};

/**
 * Envía un documento por email.
 * @param {string} id - ID del documento.
 * @param {Object} emailData - Datos para el email.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const sendByEmail = async (id, emailData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/send`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error al enviar documento ${id} por email:`, error);
    throw error;
  }
};