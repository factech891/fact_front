// src/pages/documents/components/DocumentFormModal.js
// MODIFICADO: Ahora es un wrapper alrededor de UnifiedDocumentForm

import React from 'react';
import { useClients } from '../../../hooks/useClients';
import { useProducts } from '../../../hooks/useProducts';
import { getDocument, createDocument, updateDocument } from '../../../services/DocumentsApi';

// Importar el nuevo formulario unificado
import UnifiedDocumentForm from '../UnifiedDocumentForm';

/**
 * Wrapper para mantener compatibilidad con el código existente
 * Este componente simplemente redirige todas las operaciones al nuevo formulario unificado
 */
const DocumentFormModal = ({ open, onClose, documentId = null }) => {
  // Hooks necesarios - mantenemos la misma estructura que el componente original
  const { clients } = useClients();
  const { products } = useProducts();
  
  // Variables para debuggear
  console.log("DocumentFormModal abierto como wrapper:", open);
  console.log("DocumentFormModal documentId:", documentId);

  // Este manejador simula el formato anterior de onClose
  const handleClose = (success = false) => {
    console.log("DocumentFormModal: cerrando con success =", success);
    if (onClose) {
      onClose(success);
    }
  };

  // Manejador para guardar
  const handleSaveDocument = async (documentData) => {
    console.log("DocumentFormModal: guardando documento", documentData);
    try {
      let result;
      if (documentId) {
        result = await updateDocument(documentId, documentData);
      } else {
        result = await createDocument(documentData);
      }
      console.log("Documento guardado exitosamente:", result);
      return Promise.resolve(); // Devolver promesa resuelta para que UnifiedDocumentForm cierre
    } catch (error) {
      console.error('Error al guardar documento:', error);
      return Promise.reject(error); // Devolver promesa rechazada
    }
  };

  return (
    <UnifiedDocumentForm
      open={open}
      onClose={handleClose}
      initialData={documentId ? { _id: documentId } : null} // Pasamos solo el ID, el componente buscará los datos
      onSave={handleSaveDocument}
      clients={clients}
      products={products}
      isInvoice={false}
    />
  );
};

export default DocumentFormModal;