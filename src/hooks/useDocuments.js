import { useState, useEffect, useCallback } from 'react';
import { 
  getDocuments, 
  getDocument, 
  createDocument, 
  updateDocument,
  deleteDocument,
  convertToInvoice,
  getPendingDocuments,
  generatePDF,
  sendByEmail
} from '../services/DocumentsApi';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);

  // Fetch all documents
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDocuments();
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error fetching documents');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single document
  const fetchDocument = useCallback(async (id) => {
    try {
      setLoading(true);
      const data = await getDocument(id);
      setCurrentDocument(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message || 'Error fetching document');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create document
  const handleCreateDocument = useCallback(async (document) => {
    try {
      setLoading(true);
      const result = await createDocument(document);
      await fetchDocuments();
      setError(null);
      return result;
    } catch (err) {
      setError(err.message || 'Error creating document');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchDocuments]);

  // Update document
  const handleUpdateDocument = useCallback(async (id, document) => {
    try {
      setLoading(true);
      const result = await updateDocument(id, document);
      await fetchDocuments();
      setError(null);
      return result;
    } catch (err) {
      setError(err.message || 'Error updating document');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchDocuments]);

  // Delete document
  const handleDeleteDocument = useCallback(async (id) => {
    try {
      setLoading(true);
      await deleteDocument(id);
      await fetchDocuments();
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || 'Error deleting document');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDocuments]);

  // Convert document to invoice
  const handleConvertToInvoice = useCallback(async (id, invoice) => {
    try {
      setLoading(true);
      const result = await convertToInvoice(id, invoice);
      await fetchDocuments();
      setError(null);
      return result;
    } catch (err) {
      setError(err.message || 'Error converting document to invoice');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchDocuments]);

  // Get pending documents (for dashboard)
  const handleGetPendingDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPendingDocuments();
      setError(null);
      return data;
    } catch (err) {
      setError(err.message || 'Error fetching pending documents');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate PDF
  const handleGeneratePDF = useCallback(async (id) => {
    try {
      await generatePDF(id);
      return true;
    } catch (err) {
      setError(err.message || 'Error generating PDF');
      return false;
    }
  }, []);

  // Send document by email
  const handleSendByEmail = useCallback(async (id, emailData) => {
    try {
      setLoading(true);
      const result = await sendByEmail(id, emailData);
      setError(null);
      return result;
    } catch (err) {
      setError(err.message || 'Error sending document by email');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    currentDocument,
    fetchDocuments,
    getDocument: fetchDocument,
    createDocument: handleCreateDocument,
    updateDocument: handleUpdateDocument,
    deleteDocument: handleDeleteDocument,
    convertToInvoice: handleConvertToInvoice,
    getPendingDocuments: handleGetPendingDocuments,
    generatePDF: handleGeneratePDF,
    sendByEmail: handleSendByEmail
  };
};

export default useDocuments;