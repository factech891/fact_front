// src/pages/invoices/InvoicePreview/InvoiceHeader.js
import { Grid, Typography, Box } from '@mui/material';

const getStyles = (theme) => ({
  header: {
    backgroundColor: theme.primary || '#003366',
    background: theme.gradient || 'linear-gradient(135deg, #003366 0%, #004080 100%)',
    color: 'white',
    padding: '15px 25px',  // Reducido de 25px 25px 30px
    position: 'relative',
    minHeight: '110px',    // Reducido de 140px
    borderBottom: `1px solid ${theme.border || '#e0e0e0'}`,
    boxShadow: '0 1px 6px rgba(0,0,0,0.1)'
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'  // Reducido de 12px
  },
  companyInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'  // Reducido de 5px
  },
  companyName: {
    color: 'white',
    fontWeight: '700',
    fontSize: theme.fontSize.title || '22px', // Reducido de 24px
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    lineHeight: 1.2,
    marginBottom: '3px' // Reducido de 5px
  },
  companyText: {
    color: 'white',
    fontSize: theme.fontSize.small || '12px', // Reducido de 13px
    lineHeight: 1.4,
    opacity: '0.95'
  },
  invoiceBox: {
    backgroundColor: 'white',
    padding: '12px',  // Reducido de 15px
    borderRadius: '8px',
    color: theme.primary || '#003366',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
    border: `1px solid ${theme.border || '#e0e0e0'}`,
    position: 'relative',
    width: '200px',   // Reducido de 220px
    minHeight: '110px', // Reducido de 140px
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  logoBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '130%',
    opacity: 0.1,
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }
  },
  invoiceContent: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  invoiceHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0
  },
  invoiceTitle: {
    color: theme.primary || '#003366',
    fontWeight: '700',
    fontSize: theme.fontSize.subtitle || '18px',
    textAlign: 'center',
    marginBottom: '2px',
    lineHeight: 1.2
  },
  invoiceNumber: {
    color: theme.text.primary || '#333',
    fontSize: theme.fontSize.small || '13px',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: '2px',
    lineHeight: 1.2
  },
  invoiceDate: {
    color: theme.text.primary || '#333',
    fontSize: theme.fontSize.small || '13px',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: '10px'  // Reducido de 15px
  },
  logo: {
    maxWidth: '100px',  // Reducido de 120px
    maxHeight: '60px',  // Reducido de 80px
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '8px',
    display: 'block'
  }
});

export const InvoiceHeader = ({ invoice, empresa, theme, documentType }) => {
  if (!invoice) return null;

  const styles = getStyles(theme);

  const formatDate = (date) => {
    if (!date) return 'Sin fecha';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
      return new Date(date).toLocaleDateString('es-ES', options);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return date.toString();
    }
  };

  return (
    <Grid container sx={styles.header} spacing={2}>
      <Grid item xs={8}>
        <Box sx={styles.leftSection}>
          <Box sx={styles.companyInfo}>
            <Typography sx={styles.companyName}>
              {empresa.nombre}
            </Typography>
            {empresa.direccion && (
              <Typography sx={styles.companyText}>
                {empresa.direccion}
              </Typography>
            )}
            {empresa.rif && (
              <Typography sx={styles.companyText}>
                RIF: {empresa.rif}
              </Typography>
            )}
            {empresa.telefono && (
              <Typography sx={styles.companyText}>
                Tel: {empresa.telefono}
              </Typography>
            )}
            {empresa.email && (
              <Typography sx={styles.companyText}>
                Email: {empresa.email}
              </Typography>
            )}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={styles.invoiceBox}>
          {/* Logo de fondo */}
          {empresa.logoUrl && (
            <Box sx={styles.logoBackground}>
              <img
                src={empresa.logoUrl}
                alt=""
                crossOrigin="anonymous"
              />
            </Box>
          )}
          
          {/* Contenido de la factura */}
          <Box sx={styles.invoiceContent}>
            <Box sx={styles.invoiceHeader}>
              <Typography sx={styles.invoiceTitle}>
                {documentType || 'FACTURA'}
              </Typography>
              <Typography sx={styles.invoiceNumber}>
                N°: {invoice.numero || invoice.number}
              </Typography>
            </Box>
            <Typography sx={styles.invoiceDate}>
              Fecha: {formatDate(invoice.fecha || invoice.date)}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default InvoiceHeader;