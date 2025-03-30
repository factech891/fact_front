import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import { getDocument } from '../../../services/DocumentsApi';

const DocumentPreview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(true);
  
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const data = await getDocument(id);
        setDocument(data);
        setModalOpen(true);
      } catch (err) {
        console.error('Error al cargar documento:', err);
        setError('Error al cargar el documento');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDocument();
    }
  }, [id]);
  
  const handleGoBack = () => {
    navigate('/documents');
  };
  
  const handleCloseModal = () => {
    handleGoBack(); // Vuelve a la lista cuando se cierra el modal
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mt: 2 }}>
          Volver a la lista
        </Button>
      </Box>
    );
  }
  
  return (
    <>
      <DocumentPreviewModal
        open={modalOpen}
        onClose={handleCloseModal}
        documentId={id}
      />
    </>
  );
};

export default DocumentPreview;