import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { 
  getDocuments, 
  getDocument, 
  createDocument, 
  updateDocument,
  deleteDocument,
  convertToInvoice,
  getPendingDocuments
} from '../services/DocumentsApi';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDocuments();
      console.log('Documentos cargados:', data);
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error fetching documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocument = useCallback(async (id) => {
    try {
      setLoading(true);
      const data = await getDocument(id);
      console.log('Documento individual cargado:', data);
      setCurrentDocument(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message || 'Error fetching document');
      console.error('Error en fetchDocument:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateDocument = useCallback(async (document) => {
    try {
      setLoading(true);
      const result = await createDocument(document);
      console.log('Documento creado desde API:', result);
      setDocuments((prev) => {
        const updated = [...prev, result];
        console.log('Estado actualizado de documents:', updated);
        return updated;
      });
      setError(null);
      return result;
    } catch (err) {
      setError(err.message || 'Error creating document');
      console.error('Error al crear documento:', err);
      throw err; // Lanzamos el error para que DocumentFormModal lo capture
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateDocument = useCallback(async (id, document) => {
    try {
      setLoading(true);
      const result = await updateDocument(id, document);
      setDocuments((prev) => 
        prev.map((doc) => (doc._id === id ? result : doc))
      );
      setError(null);
      return result;
    } catch (err) {
      setError(err.message || 'Error updating document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteDocument = useCallback(async (id) => {
    try {
      setLoading(true);
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || 'Error deleting document');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleConvertToInvoice = useCallback(async (id, invoice) => {
    try {
      setLoading(true);
      const result = await convertToInvoice(id, invoice);
      setDocuments((prev) => 
        prev.map((doc) => (doc._id === id ? result : doc))
      );
      setError(null);
      return result;
    } catch (err) {
      setError(err.message || 'Error converting document to invoice');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

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
    getPendingDocuments: handleGetPendingDocuments
  };
};

export default useDocuments;