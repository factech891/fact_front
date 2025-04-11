// src/pages/settings/CompanySettings/LogoUploader.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Slider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { useCompany } from '../../../hooks/useCompany';
import { companyApi } from '../../../services/api';

// Estilo para botones de acción principal (copiado del CompanyForm)
const actionButtonStyle = {
  borderRadius: '50px',
  color: 'white',
  fontWeight: 600,
  padding: '8px 22px',
  textTransform: 'none',
  backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
  boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
  transition: 'all 0.2s ease-in-out',
  border: 'none',
  backgroundColor: 'transparent',
  fontSize: '14px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)',
    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    backgroundColor: 'transparent',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 10px rgba(79, 172, 254, 0.4)',
  },
  '&.Mui-disabled': {
    backgroundImage: 'linear-gradient(to right, #919191 0%, #b7b7b7 100%)',
    color: 'rgba(255, 255, 255, 0.6)',
  }
};

const LogoUploader = () => {
  const { company, loading, uploadLogo, saveCompany } = useCompany();
  const [uploadStatus, setUploadStatus] = useState({ success: false, message: '' });
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Agregamos el estado para la opacidad
  const [logoOpacity, setLogoOpacity] = useState(() => {
    const savedOpacity = localStorage.getItem('logoOpacity');
    return savedOpacity ? parseFloat(savedOpacity) : 0.35; // Valor por defecto
  });

  // Efecto para actualizar la vista previa con la opacidad guardada
  useEffect(() => {
    const logoElement = document.querySelector('.factura-preview-logo');
    if (logoElement) {
      logoElement.style.opacity = logoOpacity;
    }
  }, [logoOpacity]);

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

  // Manejador para cambiar la opacidad
  const handleOpacityChange = (event, newValue) => {
    setLogoOpacity(newValue);
    
    // Actualizar la vista previa en tiempo real
    const logoElement = document.querySelector('.factura-preview-logo');
    if (logoElement) {
      logoElement.style.opacity = newValue;
    }
  };

  // Guardar la opacidad
  const handleSaveOpacity = () => {
    localStorage.setItem('logoOpacity', logoOpacity.toString());
    setUploadStatus({
      success: true,
      message: 'Opacidad guardada exitosamente'
    });
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
          <Alert 
            severity={uploadStatus.success ? "success" : "error"}
            sx={{ width: '100%', mt: 2 }}
            onClose={() => setUploadStatus({})}
          >
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

      {/* SECCIÓN DE VISTA PREVIA DE FACTURA CON CONTROL DE OPACIDAD (lado a lado - 50/50) */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Vista Previa en Factura
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          {/* Vista previa (lado izquierdo - 50%) */}
          <Box sx={{ 
            flex: 1, 
            p: 0,
            backgroundColor: '#003366',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            minHeight: '150px',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <Box p={2}>
              <Typography variant="h5" fontWeight="bold">EMPRESA</Typography>
              <Typography variant="body2">RIF: Por definir</Typography>
              <Typography variant="body2">Email: por@definir.com</Typography>
            </Box>
            <Box 
              sx={{ 
                bgcolor: 'white', 
                p: 2, 
                borderRadius: '8px',
                width: '180px',
                height: '120px',
                position: 'relative',
                alignSelf: 'center',
                mr: 2
              }}
            >
              {(previewUrl || company?.logoUrl) && (
                <Box 
                  className="factura-preview-logo" // IMPORTANTE: Esta clase es usada para actualizar la opacidad
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: logoOpacity, // Usamos el estado de opacidad
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
          </Box>

          {/* Control de opacidad (lado derecho - 50%) */}
          <Box sx={{ 
            flex: 1, 
            p: 2,
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: 'rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Configuración del Logo en Facturas
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ajusta la opacidad del logo que aparece como marca de agua en las facturas.
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ width: '80px', flexShrink: 0 }}>
                Opacidad:
              </Typography>
              <Slider
                value={logoOpacity}
                onChange={handleOpacityChange}
                min={0.05}
                max={0.5}
                step={0.05}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                sx={{ mx: 2, flex: 1 }}
              />
              <Typography sx={{ width: '50px', textAlign: 'right' }}>
                {Math.round(logoOpacity * 100)}%
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveOpacity}
              sx={{ ...actionButtonStyle, alignSelf: 'flex-start' }}
            >
              GUARDAR
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default LogoUploader;