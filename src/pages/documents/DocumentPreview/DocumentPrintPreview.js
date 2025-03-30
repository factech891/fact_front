// src/pages/documents/DocumentPreview/DocumentPrintPreview.js
import { useState } from 'react';
import {
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Download } from '@mui/icons-material';

// Importamos los componentes exactos de InvoicePreview
import { InvoiceHeader } from '../../invoices/InvoicePreview/InvoiceHeader';
import { ClientInfo } from '../../invoices/InvoicePreview/ClientInfo';
import { InvoiceItemsTable } from '../../invoices/InvoicePreview/InvoiceItemsTable';
import { InvoiceTotals } from '../../invoices/InvoicePreview/InvoiceTotals';
import { InvoiceFooter } from '../../invoices/InvoicePreview/InvoiceFooter';
import { InvoiceStyleSelector } from '../../invoices/InvoicePreview/InvoiceStyleSelector';
import { invoiceThemes } from '../../invoices/InvoicePreview/invoiceThemes';
import { generatePDF } from '../../../utils/pdfGenerator';
import { useCompany } from '../../../hooks/useCompany';
import { DOCUMENT_TYPE_NAMES } from '../constants/documentTypes';

// Mismos estilos que InvoicePreview
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

const DocumentPrintPreview = ({ open, onClose, document }) => {
  const [currentStyle, setCurrentStyle] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const theme = invoiceThemes[currentStyle];
  const styles = getStyles(theme);
  const { company, loading } = useCompany();
  
  console.log("Company data in preview:", company); // Para depuración
  console.log("Document in preview:", document); // Para depuración

  // Función para obtener el título del documento según su tipo
  const getDocumentTitle = (doc) => {
    if (!doc) return 'Documento';
    return DOCUMENT_TYPE_NAMES[doc.type] || 'Documento';
  };

  const handleDownload = async () => {
    if (!document) {
      setNotification({
        open: true,
        message: 'Error: No hay datos del documento para generar PDF',
        severity: 'error'
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Asegurar que las imágenes están completamente cargadas antes de generar el PDF
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Adaptar el documento al formato esperado por generatePDF
      const documentForPDF = {
        ...document,
        // Mapeo de campos para compatibilidad
        number: document.documentNumber,
        tax: document.taxAmount,
        moneda: document.currency
      };
      
      // Si tu función generatePDF acepta un segundo parámetro para el título
      const result = await generatePDF(documentForPDF, getDocumentTitle(document));
      
      if (result.success) {
        setNotification({
          open: true,
          message: `${getDocumentTitle(document)} generado correctamente`,
          severity: 'success'
        });
      } else {
        setNotification({
          open: true,
          message: `Error al generar el PDF: ${result.error || 'Desconocido'}`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      setNotification({
        open: true,
        message: `Error al generar el PDF: ${error.message || 'Desconocido'}`,
        severity: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (!document) return null;

  // Preparar datos de la empresa
  const empresaData = company ? {
    nombre: company.nombre,
    direccion: company.direccion,
    rif: company.rif,
    telefono: company.telefono,
    email: company.email,
    logoUrl: company.logoUrl
  } : {
    nombre: 'Tu Empresa',
    direccion: 'Dirección de la empresa',
    rif: 'J-123456789',
    telefono: '+58 424-1234567',
    email: 'info@tuempresa.com'
  };

  // Adaptar documento al formato esperado por los componentes de factura
  const documentForDisplay = {
    ...document,
    numero: document.documentNumber,
    number: document.documentNumber,
    fecha: document.date,
    date: document.date,
    status: document.status,
    client: document.client,
    items: document.items && document.items.map(item => ({
      codigo: item.code || item.codigo,
      descripcion: item.description || item.descripcion,
      cantidad: item.quantity || item.cantidad || 1,
      precioUnitario: item.price || item.precioUnitario || 0,
      exentoIva: item.taxExempt || item.exentoIva || false
    })),
    subtotal: document.subtotal,
    tax: document.taxAmount,
    total: document.total,
    moneda: document.currency,
    condicionesPago: document.paymentTerms || 'Contado'
  };

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
        <DialogContent sx={{ padding: 0 }} id="document-preview">
          <InvoiceStyleSelector
            currentStyle={currentStyle}
            onStyleChange={setCurrentStyle}
            className="style-selector"
          />
          {loading ? (
            <div style={styles.loadingContainer}>
              <CircularProgress />
            </div>
          ) : (
            <Paper sx={styles.invoiceContainer}>
              <InvoiceHeader
                invoice={documentForDisplay}
                empresa={empresaData}
                theme={theme}
                documentType={getDocumentTitle(document)}
              />
              <div style={styles.content}>
                <ClientInfo
                  client={documentForDisplay.client}
                  theme={theme}
                />
                {documentForDisplay.items && documentForDisplay.items.length > 0 && (
                  <InvoiceItemsTable
                    items={documentForDisplay.items}
                    moneda={documentForDisplay.moneda}
                    theme={theme}
                  />
                )}
                <InvoiceTotals
                  invoice={documentForDisplay}
                  theme={theme}
                />
              </div>
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
          justifyContent: 'center'
        }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownload}
            disabled={loading || isGenerating}
            size="large"
            sx={{ minWidth: '150px' }}
          >
            {isGenerating ? 'Generando...' : 'Descargar PDF'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DocumentPrintPreview;