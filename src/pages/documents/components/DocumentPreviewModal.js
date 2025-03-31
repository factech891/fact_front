// src/pages/documents/components/DocumentPreviewModal.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Transform as TransformIcon
} from '@mui/icons-material';
import { getDocument, convertToInvoice } from '../../../services/DocumentsApi';
import { useCompany } from '../../../hooks/useCompany';
import { DOCUMENT_TYPE_NAMES, DOCUMENT_STATUS } from '../constants/documentTypes';

// Importamos los componentes de factura
import { InvoiceHeader } from '../../invoices/InvoicePreview/InvoiceHeader';
import { ClientInfo } from '../../invoices/InvoicePreview/ClientInfo';
import { InvoiceItemsTable } from '../../invoices/InvoicePreview/InvoiceItemsTable';
import { InvoiceTotals } from '../../invoices/InvoicePreview/InvoiceTotals';
import { InvoiceFooter } from '../../invoices/InvoicePreview/InvoiceFooter'; // Importación corregida
import { InvoiceStyleSelector } from '../../invoices/InvoicePreview/InvoiceStyleSelector';
import { invoiceThemes } from '../../invoices/InvoicePreview/invoiceThemes';
import { generatePDF } from '../../../utils/pdfGenerator';

// Estilos para el contenedor de la factura
const getStyles = (theme) => ({
  invoiceContainer: {
    padding: '0',
    backgroundColor: theme.background.primary,
    width: '210mm',     // Ancho A4
    minHeight: '297mm', // Alto A4
    margin: '0 auto',
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: theme.gradient
    }
  },
  content: {
    padding: '20px 25px',
    paddingBottom: '200px',
    position: 'relative'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  }
});

const DocumentPreviewModal = ({ open, onClose, documentId, onRefresh }) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStyle, setCurrentStyle] = useState('modern');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const { company } = useCompany();
  
  // Obtenemos el theme actual basado en el estilo seleccionado
  const theme = invoiceThemes[currentStyle];
  const styles = getStyles(theme);

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

  useEffect(() => {
    const fetchDocument = async () => {
      if (documentId && open) {
        try {
          setLoading(true);
          const data = await getDocument(documentId);
          console.log("Documento cargado:", data);
          setDocument(data);
        } catch (error) {
          console.error("Error al cargar documento:", error);
          setSnackbar({
            open: true,
            message: "Error al cargar el documento",
            severity: "error"
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDocument();
  }, [documentId, open]);

  // Depurar items cuando cambia el documento
  useEffect(() => {
    if (document && document.items) {
      console.log("Items del documento:", JSON.stringify(document.items, null, 2));
    }
  }, [document]);

  if (!open) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!document) {
      setSnackbar({
        open: true,
        message: 'Error: No hay datos del documento para generar PDF',
        severity: 'error'
      });
      return;
    }

    try {
      setIsGenerating(true);
      console.log("Iniciando generación de PDF...");
      
      // Asegurar que las imágenes están completamente cargadas antes de generar el PDF
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Adaptar el documento al formato esperado por generatePDF
      const documentForPDF = {
        ...document,
        numero: document.documentNumber,
        number: document.documentNumber,
        fecha: document.date,
        date: document.date,
        tax: document.taxAmount,
        moneda: document.currency,
        // Asegúrate de incluir estos campos para el tipo de documento
        type: document.type,
        documentType: getDocumentTitle(document), // Elimina las llaves
        items: document.items && document.items.map(item => ({
          codigo: item.code || item.codigo || '',
          descripcion: item.description || item.descripcion || '',
          cantidad: item.quantity || item.cantidad || 1,
          precioUnitario: item.price || item.precioUnitario || 0,
          exentoIva: item.taxExempt || item.exentoIva || false
        }))
      };
      
      console.log('Enviando documento para PDF con tipo:', documentForPDF.documentType);
      console.log("Documento preparado para PDF:", documentForPDF);

      // Mostrar qué función generatePDF está siendo llamada
      console.log("Función generatePDF:", generatePDF);
      
      // Generación del PDF con manejo de errores detallado
      let result;
      try {
        const fileName = `${getDocumentTitle(document).toLowerCase()}_${document.documentNumber || 'nuevo'}.pdf`;
        result = await generatePDF(documentForPDF, { fileName });
        console.log("Resultado de generatePDF:", result);
      } catch (pdfError) {
        console.error("Error específico en generatePDF:", pdfError);
        throw pdfError;
      }
      
      if (result && result.success) {
        setSnackbar({
          open: true,
          message: 'PDF generado correctamente',
          severity: 'success'
        });
      } else {
        throw new Error(`Error en la generación: ${result?.error || 'Desconocido'}`);
      }
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      setSnackbar({
        open: true,
        message: `Error al generar el PDF: ${error.message || 'Desconocido'}`,
        severity: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConvert = async () => {
    if (!document || !documentId) {
      setSnackbar({
        open: true,
        message: "No hay documento válido para convertir",
        severity: "error"
      });
      return;
    }
    
    try {
      setConverting(true);
      console.log("Intentando convertir documento:", documentId);
      
      await convertToInvoice(documentId);
      
      setSnackbar({
        open: true,
        message: "Documento convertido a factura exitosamente",
        severity: "success"
      });
      
      // Recargar datos si es necesario
      if (typeof onRefresh === 'function') {
        onRefresh();
      }
      
      // Cerrar el modal después de un breve retraso
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Error al convertir documento:", error);
      setSnackbar({
        open: true,
        message: "Error al convertir documento a factura",
        severity: "error"
      });
    } finally {
      setConverting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Preparar datos de la empresa
  const empresaData = company ? {
    nombre: company.nombre,
    direccion: company.direccion,
    rif: company.rif,
    telefono: company.telefono,
    email: company.email,
    logoUrl: company.logoUrl
  } : {
    nombre: 'Transporte Express',
    direccion: 'Puerto Cabello',
    rif: 'J-87789299383',
    telefono: '0663566772',
    email: 'bit@gmail.com'
  };

  // Adaptar documento al formato esperado por los componentes de factura
  const documentForDisplay = document ? {
    ...document,
    numero: document.documentNumber,
    number: document.documentNumber,
    fecha: document.date,
    date: document.date,
    status: document.status,
    client: document.client,
    items: document.items && document.items.map(item => {
      // Para depuración
      console.log("Item original:", item);
      
      // Extraer toda la información posible del item
      let codigo = '';
      if (typeof item.code === 'string' && item.code.trim() !== '') {
        codigo = item.code;
      } else if (typeof item.codigo === 'string' && item.codigo.trim() !== '') {
        codigo = item.codigo;
      } else if (item.product && typeof item.product === 'object' && item.product.code) {
        codigo = item.product.code;
      } else if (item.product && typeof item.product === 'object' && item.product.codigo) {
        codigo = item.product.codigo;
      }
      
      let descripcion = '';
      if (typeof item.description === 'string' && item.description.trim() !== '') {
        descripcion = item.description;
      } else if (typeof item.descripcion === 'string' && item.descripcion.trim() !== '') {
        descripcion = item.descripcion;
      } else if (item.product && typeof item.product === 'object') {
        if (item.product.name) descripcion = item.product.name;
        else if (item.product.nombre) descripcion = item.product.nombre;
        else if (item.product.descripcion) descripcion = item.product.descripcion;
      }
      
      if (descripcion === '') descripcion = 'Producto';
      
      const cantidad = item.quantity || item.cantidad || 1;
      const precioUnitario = item.price || item.precioUnitario || 0;
      const exentoIva = item.taxExempt || item.exentoIva || false;
      
      console.log("Código extraído:", codigo);
      console.log("Descripción extraída:", descripcion);
      
      // Creamos un objeto completo con todos los campos posibles
      return {
        codigo: codigo,
        descripcion: descripcion,
        cantidad: cantidad,
        precioUnitario: precioUnitario,
        exentoIva: exentoIva
      };
    }),
    subtotal: document.subtotal,
    tax: document.taxAmount,
    total: document.total,
    moneda: document.currency,
    condicionesPago: document.paymentTerms || 'Contado'
  } : null;

  // Imprimir los items finales para depuración
  if (documentForDisplay && documentForDisplay.items) {
    console.log("Items finales para mostrar:", JSON.stringify(documentForDisplay.items, null, 2));
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            minWidth: '595px',
            height: '842px',
            margin: '20px'
          }
        }}
      >
        <DialogTitle sx={{ px: 0, pt: 0, pb: 0, position: 'relative', minHeight: '48px' }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 9999
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" id="document-title">{getDocumentTitle(document)}</Typography> {/* Agregado */}
        </DialogTitle>
        
        <DialogContent sx={{ padding: 0 }} id="document-preview">
          <InvoiceStyleSelector
            currentStyle={currentStyle}
            onStyleChange={setCurrentStyle}
            className="style-selector"
          />
          
          {loading ? (
            <Box sx={styles.loadingContainer}>
              <CircularProgress />
            </Box>
          ) : !document ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">No se pudo cargar el documento</Typography>
            </Box>
          ) : (
            <Paper sx={styles.invoiceContainer}>
              <InvoiceHeader
                invoice={documentForDisplay}
                empresa={empresaData}
                theme={theme}
                documentType={getDocumentTitle(document)}
              />
              <Box sx={styles.content}>
                <ClientInfo
                  client={documentForDisplay.client}
                  theme={theme}
                />
                {documentForDisplay.items && documentForDisplay.items.length > 0 && (
                  <InvoiceItemsTable
                    items={documentForDisplay.items}
                    moneda={documentForDisplay.moneda || documentForDisplay.currency || 'VES'}
                    theme={theme}
                  />
                )}
                <InvoiceTotals
                  invoice={documentForDisplay}
                  theme={theme}
                />
              </Box>
              <InvoiceFooter
                invoice={documentForDisplay}
                theme={theme}
              />
            </Paper>
          )}
        </DialogContent>
        
        <DialogActions sx={{
          padding: '16px',
          borderTop: '1px solid #e0e0e7',
          gap: '10px',
          justifyContent: 'space-between'
        }}>
          <Button
            variant="outlined"
            startIcon={<TransformIcon />}
            onClick={handleConvert}
            disabled={!document || document.status === DOCUMENT_STATUS.CONVERTED || converting}
          >
            {converting ? 'Convirtiendo...' : 'Convertir a Factura'}
          </Button>
          
          <Box>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              Imprimir
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              disabled={loading || isGenerating}
            >
              {isGenerating ? 'Generando...' : 'Descargar PDF'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DocumentPreviewModal;