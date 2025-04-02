// src/pages/invoices/InvoicePreview/InvoiceFooter.js
import { Typography, Box, Grid } from '@mui/material';

const getStyles = (theme) => ({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px 25px',
    background: `linear-gradient(to bottom, ${theme.background.secondary}, ${theme.background.primary})`,
    borderTop: `1px solid ${theme.border}`,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '95%',
      height: '1px',
      background: `linear-gradient(to right, transparent, ${theme.primary}, transparent)`
    }
  },
  section: {
    marginBottom: '10px',
    padding: '0 10px'
  },
  title: {
    color: theme.primary,
    fontWeight: '600',
    fontSize: theme.fontSize.body,
    marginBottom: '4px',
    letterSpacing: '0.5px'
  },
  content: {
    color: theme.text.primary,
    fontSize: theme.fontSize.small,
    lineHeight: '1.4'
  },
  bulletPoint: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '3px',
    '&::before': {
      content: '"•"',
      color: theme.primary,
      marginRight: '5px',
      fontWeight: 'bold'
    }
  },
  paymentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: theme.text.primary,
    fontSize: theme.fontSize.small,
    '& span': {
      fontWeight: '600',
      color: theme.primary
    }
  }
});

export const InvoiceFooter = ({ invoice, theme }) => {
  const styles = getStyles(theme);
  
  console.log("InvoiceFooter recibió:", JSON.stringify(invoice, null, 2));

  // SIEMPRE usar notas personalizadas, sin opción de volver a predeterminadas
  const renderNotes = () => {
    const notesContent = invoice.notes || "";
    const lines = notesContent.trim().length > 0 
      ? notesContent.split('\n') 
      : ["Edita estas notas personalizadas desde el formulario"];
    
    return (
      <Box sx={styles.content}>
        {lines.map((line, index) => (
          <Box key={index} sx={styles.bulletPoint}>
            {line.trim() || "•"}
          </Box>
        ))}
      </Box>
    );
  };

  // SIEMPRE mostrar términos, sin condición
  const renderTerms = () => {
    const termsContent = invoice.terms || "";
    const lines = termsContent.trim().length > 0 
      ? termsContent.split('\n') 
      : ["Edita estos términos y condiciones desde el formulario"];
    
    return (
      <Box sx={styles.section}>
        <Typography sx={styles.title}>
          Términos y Condiciones
        </Typography>
        <Box sx={styles.content}>
          {lines.map((line, index) => (
            <Box key={index} sx={styles.bulletPoint}>
              {line.trim() || "•"}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={styles.footer}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={styles.section}>
            <Typography sx={styles.title}>
              Información de Pago
            </Typography>
            <Box sx={styles.paymentInfo}>
              <span>Condición:</span> {invoice.condicionesPago || 'Contado'}
              {invoice.condicionesPago === 'Crédito' && (
                <> - <span>Plazo:</span> {invoice.diasCredito || 30} días</>
              )}
            </Box>
          </Box>
          
          {/* Siempre mostrar términos */}
          {renderTerms()}
        </Grid>
        <Grid item xs={6}>
          <Box sx={styles.section}>
            <Typography sx={styles.title}>
              Notas Importantes
            </Typography>
            {renderNotes()}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceFooter;