// src/pages/invoices/InvoicePreview/InvoicePreview.js
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

export const InvoicePreview = ({ open, onClose, invoice }) => {
  const [currentStyle, setCurrentStyle] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const theme = invoiceThemes[currentStyle];
  const styles = getStyles(theme);
  const { company, loading } = useCompany();

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
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
        <DialogContent sx={{ padding: 0 }} id="invoice-preview">
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
                invoice={invoice}
                empresa={empresaData}
                theme={theme}
              />
              <div style={styles.content}>
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
              </div>
              <InvoiceFooter
                invoice={invoice}
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

export default InvoicePreview;