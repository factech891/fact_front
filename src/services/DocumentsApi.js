import api from './api';

export const DocumentsApi = {
  // Get all documents
  getDocuments: async () => {
    try {
      const response = await api.get('/documents');
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Get pending documents (for dashboard)
  getPendingDocuments: async () => {
    try {
      const response = await api.get('/documents/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending documents:', error);
      throw error;
    }
  },

  // Get a single document by ID
  getDocument: async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error);
      throw error;
    }
  },

  // Create a new document
  createDocument: async (documentData) => {
    try {
      const response = await api.post('/documents', documentData);
      return response.data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Update an existing document
  updateDocument: async (id, documentData) => {
    try {
      const response = await api.put(`/documents/${id}`, documentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating document ${id}:`, error);
      throw error;
    }
  },

  // Delete a document
  deleteDocument: async (id) => {
    try {
      const response = await api.delete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error);
      throw error;
    }
  },

  // Convert document to invoice
  convertToInvoice: async (id, invoiceData) => {
    try {
      const response = await api.post(`/documents/${id}/convert-to-invoice`, invoiceData);
      return response.data;
    } catch (error) {
      console.error(`Error converting document ${id} to invoice:`, error);
      throw error;
    }
  },

  // Generate PDF for a document
  generatePDF: async (id) => {
    try {
      const response = await api.get(`/documents/${id}/pdf`, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error(`Error generating PDF for document ${id}:`, error);
      throw error;
    }
  },

  // Send document by email
  sendByEmail: async (id, emailData) => {
    try {
      const response = await api.post(`/documents/${id}/send`, emailData);
      return response.data;
    } catch (error) {
      console.error(`Error sending document ${id} by email:`, error);
      throw error;
    }
  }
};