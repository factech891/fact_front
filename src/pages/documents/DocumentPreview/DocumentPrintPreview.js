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

// Reutilizamos los componentes de diseño de facturas
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

const getStyles = (theme) => ({
  documentContainer: {
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
  },
  documentType: {
    position: 'absolute',
    top: '10px',
    right: '25px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: theme.text.primary
  }
});

const DocumentPrintPreview = ({ open, onClose, document }) => {
  const [currentStyle, setCurrentStyle] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const theme = invoiceThemes[currentStyle];
  const styles = getStyles(theme);
  const { company, loading } = useCompany();

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
        // Aseguramos compatibilidad con el generador de PDF para facturas
        number: document.documentNumber,
        tax: document.taxAmount,
        moneda: document.currency
      };
      
      const result = await generatePDF(documentForPDF, getDocumentTitle(document));
      
      if (result.success) {
        setNotification({
          open: true,
          message: 'PDF generado correctamente',
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
  
  // Función para obtener el título del documento según su tipo
  const getDocumentTitle = (doc) => {
    if (!doc) return 'Documento';
    return DOCUMENT_TYPE_NAMES[doc.type] || 'Documento';
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
    number: document.documentNumber,
    date: document.date,
    status: document.status,
    client: document.client,
    items: document.items,
    subtotal: document.subtotal,
    tax: document.taxAmount,
    total: document.total,
    moneda: document.currency,
    condicionesPago: document.paymentTerms
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
            <Paper sx={styles.documentContainer}>
              <div style={styles.documentType}>
                {getDocumentTitle(document)}
              </div>
              <InvoiceHeader
                invoice={documentForDisplay}
                empresa={empresaData}
                theme={theme}
                // Si necesitamos personalizar el título, podríamos añadir esta prop
                documentType={getDocumentTitle(document)}
              />
              <div style={styles.content}>
                <ClientInfo
                  client={document.client}
                  theme={theme}
                />
                {document.items && document.items.length > 0 && (
                  <InvoiceItemsTable
                    items={document.items}
                    moneda={document.currency}
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