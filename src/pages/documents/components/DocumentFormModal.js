import React, { useState, useEffect } from 'react';
import { useClients } from '../../../hooks/useClients';
import { useProducts } from '../../../hooks/useProducts';
import { useDocuments } from '../../../hooks/useDocuments';
import UnifiedDocumentForm from '../UnifiedDocumentForm';

const DocumentFormModal = ({ open, onClose, documentId = null }) => {
  const { clients } = useClients();
  const { products } = useProducts();
  // Usamos las funciones del hook incluyendo fetchDocuments para recargar después de actualizar
  const { createDocument, updateDocument, fetchDocuments, getDocument } = useDocuments();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("DocumentFormModal abierto como wrapper:", open);
  console.log("DocumentFormModal documentId:", documentId);

  useEffect(() => {
    const fetchDocumentData = async () => {
      if (documentId && open) {
        try {
          setLoading(true);
          // Usamos getDocument del hook en lugar de importarlo directamente
          const doc = await getDocument(documentId);
          console.log("Documento cargado en DocumentFormModal:", doc);
          setInitialData(doc);
        } catch (error) {
          console.error("Error cargando documento:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setInitialData(null); // Nueva cotización
      }
    };
    fetchDocumentData();
  }, [documentId, open, getDocument]);

  const handleClose = (success = false) => {
    console.log("DocumentFormModal: cerrando con success =", success);
    if (onClose) {
      onClose(success);
    }
  };

  const handleSaveDocument = async (documentData) => {
    console.log("DocumentFormModal: guardando documento", documentData);
    try {
      let result;
      if (documentData._id) {
        result = await updateDocument(documentData._id, documentData);
        // Forzamos recarga después de actualizar
        await fetchDocuments();
      } else {
        result = await createDocument(documentData);
        // Forzamos recarga después de crear
        await fetchDocuments();
      }
      console.log("Documento guardado exitosamente:", result);
      handleClose(true); // Cerrar con éxito
      return Promise.resolve(result);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      return Promise.reject(error);
    }
  };

  if (loading) {
    return <div>Cargando documento...</div>; // Opcional: mostrar un loader
  }

  return (
    <UnifiedDocumentForm
      open={open}
      onClose={handleClose}
      initialData={initialData}
      onSave={handleSaveDocument}
      clients={clients}
      products={products}
      isInvoice={false}
    />
  );
};

export default DocumentFormModal;