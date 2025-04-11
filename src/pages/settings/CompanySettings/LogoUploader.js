// src/pages/settings/CompanySettings/LogoUploader.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCompany } from '../../../hooks/useCompany';
import { companyApi } from '../../../services/api';

const LogoUploader = () => {
  const { company, loading, uploadLogo, saveCompany } = useCompany();
  const [uploadStatus, setUploadStatus] = useState({ success: false, message: '' });
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validaciones del archivo
    if (!file.type.startsWith('image/')) {
      setUploadStatus({
        success: false,
        message: 'Por favor seleccione un archivo de imagen válido'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadStatus({
        success: false,
        message: 'El archivo es demasiado grande. El tamaño máximo es 5MB'
      });
      return;
    }

    try {
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Subir imagen
      await uploadLogo(file);
      setUploadStatus({
        success: true,
        message: 'Logo subido exitosamente'
      });
    } catch (error) {
      setUploadStatus({
        success: false,
        message: 'Error al subir el logo: ' + error.message
      });
    }
  };

  const handleRemoveLogo = async () => {
    try {
      // Si hay un ID de logo, primero eliminamos de Cloudinary
      if (company?.logoId) {
        try {
          // Usamos el método deleteLogo del API
          await companyApi.deleteLogo(company.logoId);
          console.log('Logo eliminado de Cloudinary y servidor');
        } catch (error) {
          console.error('Error eliminando logo desde servidor:', error);
        }
      }
      
      // Actualizamos la empresa en la base de datos
      await saveCompany({
        ...company,
        logoUrl: null,
        logoId: null
      });
      
      setPreviewUrl(null);
      setUploadStatus({
        success: true,
        message: 'Logo eliminado exitosamente'
      });
    } catch (error) {
      setUploadStatus({
        success: false,
        message: 'Error al eliminar el logo: ' + error.message
      });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <Typography variant="h6" gutterBottom>
          Logo de la Empresa
        </Typography>

        {/* Preview del logo */}
        {(previewUrl || company?.logoUrl) && (
          <Box
            sx={{
              width: 200,
              height: 200,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative',
              mb: 2
            }}
          >
            <img
              src={previewUrl || company?.logoUrl}
              alt="Logo de la empresa"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
        )}

        {/* Botones de acción */}
        <Box display="flex" gap={2}>
          {/* Solo mostramos el botón de subir si NO hay logo */}
          {!(previewUrl || company?.logoUrl) && (
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              disabled={loading}
            >
              Subir Logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Button>
          )}

          {/* Botón para eliminar logo existente */}
          {(previewUrl || company?.logoUrl) && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleRemoveLogo}
              disabled={loading}
            >
              Eliminar Logo
            </Button>
          )}
        </Box>

        {/* Loading indicator */}
        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Status messages */}
        {uploadStatus.message && (
          <Alert severity={uploadStatus.success ? "success" : "error"}>
            {uploadStatus.message}
          </Alert>
        )}

        {/* Información adicional */}
        <Typography variant="body2" color="text.secondary" align="center">
          Formatos aceptados: JPG, PNG, GIF
          <br />
          Tamaño máximo: 5MB
        </Typography>
      </Box>

      {/* SECCIÓN DE VISTA PREVIA DE FACTURA */}
      <Box mt={4}>
        <Typography variant="h6">Vista Previa en Factura</Typography>
        <Paper 
          sx={{ 
            p: 2, 
            mt: 2, 
            backgroundColor: '#003366',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: 600
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">EMPRESA</Typography>
            <Typography variant="body2">RIF: Por definir</Typography>
            <Typography variant="body2">Email: por@definir.com</Typography>
          </Box>
          <Box 
            sx={{ 
              bgcolor: 'white', 
              p: 2, 
              borderRadius: '8px',
              width: 180,
              height: 120,
              position: 'relative'
            }}
          >
            {(previewUrl || company?.logoUrl) && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.35,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={previewUrl || company?.logoUrl}
                  alt="Logo Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            )}
            <Box 
              sx={{ 
                position: 'relative', 
                zIndex: 1, 
                textAlign: 'center',
                color: '#003366',
                height: '100%',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <Typography fontWeight="bold">FACTURA</Typography>
                <Typography variant="body2">N°: EJEMPLO</Typography>
              </div>
              <Typography variant="body2" mt="auto">
                Fecha: {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
};

export default LogoUploader;