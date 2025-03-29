import { useState, useEffect, useCallback } from 'react';
import { DocumentsApi } from '../services/DocumentsApi';

const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);

  // Fetch all documents
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await DocumentsApi.getDocuments();
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error fetching documents');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single document
  const getDocument = useCallback(async (id) => {
    try {
      setLoading(true);
      const data = await DocumentsApi.getDocument(id);
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
  const createDocument = useCallback(async (document) => {
    try {
      setLoading(true);
      const result = await DocumentsApi.createDocument(document);
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
  const updateDocument = useCallback(async (id, document) => {
    try {
      setLoading(true);
      const result = await DocumentsApi.updateDocument(id, document);
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
  const deleteDocument = useCallback(async (id) => {
    try {
      setLoading(true);
      await DocumentsApi.deleteDocument(id);
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
  const convertToInvoice = useCallback(async (id, invoice) => {
    try {
      setLoading(true);
      const result = await DocumentsApi.convertToInvoice(id, invoice);
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
  const getPendingDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await DocumentsApi.getPendingDocuments();
      setError(null);
      return data;
    } catch (err) {
      setError(err.message || 'Error fetching pending documents');
      return [];
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
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    convertToInvoice,
    getPendingDocuments
  };
};

export default useDocuments;