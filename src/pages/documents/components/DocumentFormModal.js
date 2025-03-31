// src/pages/documents/components/DocumentPreviewModal.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Print as PrintIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

// Importar componentes y servicios
import { getDocument } from '../../../services/DocumentsApi';
import { useCompany } from '../../../hooks/useCompany';
import { DOCUMENT_TYPE_NAMES } from '../constants/documentTypes';
import InvoiceHeader from '../InvoicePrint/InvoiceHeader';
import InvoiceBody from '../InvoicePrint/InvoiceBody';
import InvoiceFooter from '../InvoicePrint/InvoiceFooter';
import ThemeSelector from '../InvoicePrint/ThemeSelector';
import { generatePDF } from '../../../utils/pdfGenerator';

const DocumentPreviewModal = ({ open, onClose, documentId, onRefresh }) => {
  // Estados
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('modern');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Obtener datos de la empresa
  const { company } = useCompany();
  
  // Función para obtener el título correcto del documento
  const getDocumentTitle = (doc) => {
    if (!doc) return 'Documento';
    
    // Esta función debe retornar el nombre correcto basado en el tipo
    switch (doc.type) {
      case 'QUOTE':
        return 'PRESUPUESTO';
      case 'PROFORMA':
        return 'FACTURA PROFORMA';
      case 'DELIVERY_NOTE':
        return 'NOTA DE ENTREGA';
      default:
        return DOCUMENT_TYPE_NAMES[doc.type] || 'DOCUMENTO';
    }
  };
  
  // Cargar documento
  useEffect(() => {
    if (documentId && open) {
      setLoading(true);
      getDocument(documentId)
        .then(data => {
          console.log('Documento cargado para vista previa:', data);
          setDocument(data);
          setError(null);
        })
        .catch(err => {
          console.error('Error al cargar documento para vista previa:', err);
          setError('Error al cargar el documento: ' + (err.message || ''));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [documentId, open]);
  
  // Preparar datos de la empresa para la visualización
  const empresaData = {
    nombre: company?.nombre || 'Tu Empresa',
    direccion: company?.direccion || 'Dirección de la empresa',
    ciudad: company?.ciudad || '',
    codigoPostal: company?.codigoPostal || '',
    rif: company?.rif || 'J-12345678',
    telefono: company?.telefono || '',
    email: company?.email || '',
    logo: company?.logo || ''
  };
  
  // Preparar documento para visualización
  const documentForDisplay = document ? {
    ...document,
    numero: document.documentNumber || 'N/A',
    client: document.client || {},
    items: document.items || []
  } : {};
  
  // Manejar cambio de tema
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };
  
  // Manejar impresión
  const handlePrint = () => {
    window.print();
  };
  
  // Manejar descarga como PDF
  const handleDownload = async () => {
    try {
      const documentForPDF = {
        ...document,
        numero: document.documentNumber,
        number: document.documentNumber,
        // Añade explícitamente el tipo de documento
        documentType: getDocumentTitle(document)
      };
      
      const result = await generatePDF(documentForPDF, {
        fileName: `${getDocumentTitle(document).toLowerCase()}_${document.documentNumber || 'nuevo'}.pdf`
      });
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Documento descargado correctamente',
          severity: 'success'
        });
      } else {
        throw new Error(result.error || 'Error al generar PDF');
      }
    } catch (error) {
      console.error('Error al descargar documento:', error);
      setSnackbar({
        open: true,
        message: 'Error al descargar el documento: ' + (error.message || ''),
        severity: 'error'
      });
    }
  };
  
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh', maxHeight: '90vh', overflow: 'auto' }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2
        }}>
          <Typography variant="h6">
            Vista Previa de Documento
          </Typography>
          <Box>
            <IconButton color="inherit" onClick={handlePrint} sx={{ mr: 1 }}>
              <PrintIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleDownload} sx={{ mr: 1 }}>
              <DownloadIcon />
            </IconButton>
            <IconButton color="inherit" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, bgcolor: '#f5f5f5' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              <Box sx={{ mb: 2 }}>
                <ThemeSelector currentTheme={theme} onChange={handleThemeChange} />
              </Box>
              
              <Box id="invoice-preview" sx={{ bgcolor: 'white', p: 4, minHeight: '70vh' }}>
                <Paper elevation={0} sx={{ p: 2 }}>
                  {/* Encabezado */}
                  <InvoiceHeader
                    invoice={documentForDisplay}
                    empresa={empresaData}
                    theme={theme}
                    documentType={getDocumentTitle(document)}
                  />
                  
                  {/* Cuerpo con items */}
                  <InvoiceBody
                    invoice={documentForDisplay}
                    theme={theme}
                  />
                  
                  {/* Pie con totales y notas */}
                  <InvoiceFooter
                    invoice={documentForDisplay}
                    empresa={empresaData}
                    theme={theme}
                  />
                </Paper>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DocumentPreviewModal;