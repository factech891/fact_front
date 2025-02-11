import { useState } from 'react';
import { 
  Paper, 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button 
} from '@mui/material';
import { Download, Print } from '@mui/icons-material';
import { InvoiceHeader } from './InvoiceHeader';
import { ClientInfo } from './ClientInfo';
import { InvoiceItemsTable } from './InvoiceItemsTable';
import { InvoiceTotals } from './InvoiceTotals';
import { InvoiceFooter } from './InvoiceFooter';
import { InvoiceStyleSelector } from './InvoiceStyleSelector';
import { invoiceThemes } from './invoiceThemes';
import { generatePDF } from '../../../utils/pdfGenerator';

// Hook personalizado para manejar la impresión
const useInvoicePrint = () => {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    const element = document.getElementById('invoice-preview');
    if (!element || isPrinting) return false;

    setIsPrinting(true);

    // Guardar estado original
    const originalState = {
      body: {
        overflow: document.body.style.overflow,
        height: document.body.style.height,
        position: document.body.style.position
      },
      element: {
        position: element.style.position,
        left: element.style.left,
        top: element.style.top,
        width: element.style.width,
        height: element.style.height,
        transform: element.style.transform,
        zIndex: element.style.zIndex
      },
      scrollPos: {
        x: window.scrollX,
        y: window.scrollY
      }
    };

    try {
      // Ocultar elementos no imprimibles
      const elementsToHide = document.querySelectorAll(
        '.no-print, .MuiButtonGroup-root, .MuiDialogActions-root, .style-selector'
      );
      elementsToHide.forEach(el => {
        el.dataset.originalDisplay = el.style.display;
        el.style.display = 'none';
      });

      // Aplicar estilos para impresión
      document.body.style.overflow = 'visible';
      document.body.style.height = 'auto';
      document.body.style.position = 'relative';

      element.style.position = 'fixed';
      element.style.left = '0';
      element.style.top = '0';
      element.style.width = '210mm';
      element.style.height = '297mm';
      element.style.transform = 'none';
      element.style.zIndex = '9999';

      // Preparar el documento para impresión
      await new Promise(resolve => {
        const mediaQueryList = window.matchMedia('print');
        mediaQueryList.addEventListener('change', resolve, { once: true });
        
        setTimeout(() => {
          window.print();
          resolve();
        }, 100);
      });

      // Restaurar estilos originales
      Object.entries(originalState.body).forEach(([prop, value]) => {
        document.body.style[prop] = value;
      });

      Object.entries(originalState.element).forEach(([prop, value]) => {
        element.style[prop] = value;
      });

      // Restaurar elementos ocultos
      elementsToHide.forEach(el => {
        el.style.display = el.dataset.originalDisplay;
        delete el.dataset.originalDisplay;
      });

      // Restaurar posición de scroll
      window.scrollTo(originalState.scrollPos.x, originalState.scrollPos.y);

      return true;
    } catch (error) {
      console.error('Error durante la impresión:', error);
      return false;
    } finally {
      setIsPrinting(false);
    }
  };

  return {
    printInvoice: handlePrint,
    isPrinting
  };
};

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
  }
});

export const InvoicePreview = ({ open, onClose, invoice }) => {
  const [currentStyle, setCurrentStyle] = useState('modern');
  const { printInvoice, isPrinting } = useInvoicePrint();
  const theme = invoiceThemes[currentStyle];
  const styles = getStyles(theme);

  const handleDownload = async () => {
    if (!invoice) {
      console.error('Error: No hay datos de factura para generar PDF');
      return;
    }

    const success = await generatePDF(invoice);
    if (!success) {
      console.error('Error al generar el PDF');
    }
  };

  if (!invoice) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={false}
      PaperProps={{
        sx: { 
          minWidth: '210mm',
          maxHeight: '95vh', // Altura máxima del viewport
          margin: '20px',
          overflow: 'auto' // Permite scroll si es necesario
        }
      }}
    >
      <DialogContent sx={{ 
        padding: 0,
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '4px'
        }
      }} id="invoice-preview">
        <InvoiceStyleSelector 
          currentStyle={currentStyle}
          onStyleChange={setCurrentStyle}
          className="style-selector no-print"
        />
        <Paper sx={styles.invoiceContainer}>
          <InvoiceHeader 
            invoice={invoice} 
            empresa={invoice.empresa || {
              nombre: 'Tu Empresa',
              direccion: 'Dirección de la empresa',
              rif: 'J-123456789',
              telefono: '+58 424-1234567',
              email: 'info@tuempresa.com'
            }}
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
      </DialogContent>
      <DialogActions sx={{ 
        padding: '16px', 
        borderTop: '1px solid #e0e0e7',
        gap: '10px',
        justifyContent: 'center',
        className: 'no-print'
      }}>
        <Button
          variant="outlined"
          startIcon={<Print />}
          onClick={printInvoice}
          disabled={isPrinting}
          size="large"
        >
          {isPrinting ? 'Imprimiendo...' : 'Imprimir'}
        </Button>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownload}
          size="large"
        >
          Descargar PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoicePreview;