import React from 'react';
// src/pages/invoices/InvoicePreview/InvoicePreview.js
import { useState, useEffect, useRef } from 'react';
import {
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box
} from '@mui/material';
import { Download, Close } from '@mui/icons-material';
import { InvoiceHeader } from './InvoiceHeader';
import { ClientInfo } from './ClientInfo';
import { InvoiceItemsTable } from './InvoiceItemsTable';
import { InvoiceTotals } from './InvoiceTotals';
import { InvoiceFooter } from './InvoiceFooter';
import { InvoiceStyleSelector } from './InvoiceStyleSelector';
import { invoiceThemes } from './invoiceThemes';
import { generatePDF } from '../../../utils/pdfGenerator';
import { useCompany } from '../../../hooks/useCompany';

const getStyles = (theme) => ({
  invoiceContainer: {
    padding: '0',
    backgroundColor: theme.background?.primary || '#ffffff',
    width: '210mm',     // Ancho A4
    minHeight: '297mm', // Alto A4
    margin: '0 auto',
    position: 'relative',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    border: '1px solid #e0e0e0',
    color: theme.text?.primary || '#333333',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    overflow: 'hidden',
    borderRadius: '4px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: theme.gradient || 'linear-gradient(135deg, #003366 0%, #004080 100%)'
    }
  },
  content: {
    padding: '20px 25px',
    paddingBottom: '150px', // Espacio para el footer
    position: 'relative'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1100,
    color: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.3)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.5)',
    }
  },
  actionButton: {
    padding: '12px 24px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 500,
    minWidth: '180px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
});

export const InvoicePreview = ({ open, onClose, invoice }) => {
  const [currentStyle, setCurrentStyle] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const theme = invoiceThemes[currentStyle];
  const styles = getStyles(theme);
  const { company, loading } = useCompany();
  const invoiceRef = useRef(null);

  // Este efecto es para depuración - muestra lo que se está recibiendo
  useEffect(() => {
    if (invoice) {
      console.log("Invoice recibida en Preview:", JSON.stringify(invoice, null, 2));
    }
  }, [invoice]);

  const handleDownload = async () => {
    if (!invoice) {
      setNotification({
        open: true,
        message: 'Error: No hay datos de factura para generar PDF',
        severity: 'error'
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Asegurar que las imágenes están completamente cargadas antes de generar el PDF
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = await generatePDF(invoice);
      
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

  if (!invoice) return null;

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

  // Determinar el tipo de documento
  const documentType = invoice.tipo === 'cotizacion' ? 'COTIZACIÓN' : 'FACTURA';

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
            margin: '20px',
            overflow: 'visible', // Para que el selector de estilos pueda salir del diálogo
            position: 'relative'
          }
        }}
      >
        <Button 
          onClick={onClose}
          sx={styles.closeButton}
          size="small"
          color="error"
        >
          <Close />
        </Button>

        {/* Solo selector de estilos */}
        <InvoiceStyleSelector
          currentStyle={currentStyle}
          onStyleChange={setCurrentStyle}
        />

        <DialogContent sx={{ padding: 0, position: 'relative' }} id="invoice-preview">
          {loading ? (
            <Box sx={styles.loadingContainer}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper 
              sx={styles.invoiceContainer} 
              elevation={3}
              ref={invoiceRef}
            >
              <InvoiceHeader
                invoice={invoice}
                empresa={empresaData}
                theme={theme}
                documentType={documentType}
              />
              <Box sx={styles.content}>
                <ClientInfo
                  client={invoice.client}
                  theme={theme}
                />
                {invoice.items && invoice.items.length > 0 && (
                  <InvoiceItemsTable
                    items={invoice.items}
                    moneda={invoice.moneda}
                    theme={theme}
                  />
                )}
                <InvoiceTotals
                  invoice={invoice}
                  theme={theme}
                />
              </Box>
              <InvoiceFooter
                invoice={invoice}
                theme={theme}
              />
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{
          padding: '20px',
          borderTop: '1px solid #e0e0e7',
          justifyContent: 'center',
          background: '#f8f9fa'
        }}>
          {/* Solo botón de descarga */}
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownload}
            disabled={loading || isGenerating}
            sx={{ 
              ...styles.actionButton,
              backgroundColor: theme.primary || '#003366',
              '&:hover': {
                backgroundColor: theme.secondary || '#004080',
              }
            }}
          >
            {isGenerating ? 'GENERANDO PDF...' : 'DESCARGAR PDF'}
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

export default InvoicePreview;