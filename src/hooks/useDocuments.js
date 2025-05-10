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
      setError(null); // Limpiar errores anteriores
      const data = await getDocuments();
      console.log('Documentos cargados:', data);
      setDocuments(data);
    } catch (err) {
      console.error('Error en fetchDocuments:', err);
      setError(err.message || 'Error fetching documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocument = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      const data = await getDocument(id);
      console.log('Documento individual cargado:', data);
      setCurrentDocument(data);
      return data;
    } catch (err) {
      console.error('Error en fetchDocument:', err);
      setError(err.message || 'Error fetching document');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateDocument = useCallback(async (document) => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      const result = await createDocument(document);
      console.log('Documento creado desde API:', result);
      setDocuments((prev) => {
        const updated = [...prev, result];
        console.log('Estado actualizado de documents:', updated);
        return updated;
      });
      return result;
    } catch (err) {
      console.error('Error al crear documento:', err);
      setError(err.message || 'Error creating document');
      throw err; // Lanzamos el error para que DocumentFormModal lo capture
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateDocument = useCallback(async (id, document) => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      const result = await updateDocument(id, document);
      setDocuments((prev) => 
        prev.map((doc) => (doc._id === id ? result : doc))
      );
      return result;
    } catch (err) {
      console.error('Error al actualizar documento:', err);
      setError(err.message || 'Error updating document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteDocument = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      await deleteDocument(id);
      // Solo actualizar el estado si la eliminación fue exitosa
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
      return { success: true, message: "Documento eliminado correctamente" };
    } catch (err) {
      console.error('Error al eliminar documento:', err);
      // Capturar específicamente el error de permisos
      const errorMessage = err.message || 'Error deleting document';
      setError(errorMessage);
      // Propagar el error para que la UI pueda manejarlo
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleConvertToInvoice = useCallback(async (id, invoice) => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      const result = await convertToInvoice(id, invoice);
      setDocuments((prev) => 
        prev.map((doc) => (doc._id === id ? result : doc))
      );
      return result;
    } catch (err) {
      console.error('Error al convertir documento a factura:', err);
      setError(err.message || 'Error converting document to invoice');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGetPendingDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      const data = await getPendingDocuments();
      return data;
    } catch (err) {
      console.error('Error al obtener documentos pendientes:', err);
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