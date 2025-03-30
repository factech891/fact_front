// src/pages/invoices/InvoicePreview/InvoiceHeader.js
import { Grid, Typography, Box } from '@mui/material';

const getStyles = (theme) => ({
  header: {
    backgroundColor: theme.primary,
    background: theme.gradient,
    color: 'white',
    padding: '20px',
    position: 'relative',
    minHeight: '120px',
    marginBottom: '20px'
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  companyInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  companyName: {
    color: 'white',
    fontWeight: '600',
    fontSize: theme.fontSize.title,
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  companyText: {
    color: 'white',
    fontSize: theme.fontSize.small,
    lineHeight: 1.4,
    opacity: '0.9'
  },
  invoiceBox: {
    backgroundColor: theme.background.primary,
    padding: '12px',
    borderRadius: '6px',
    color: theme.primary,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.border}`,
    position: 'relative',
    width: '200px',
    height: '140px', // Altura fija para mejor control del espacio
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
    height: '140%',
    opacity: 0.2,
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
    height: '100%' // Asegura que ocupe todo el espacio
  },
  invoiceHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0
  },
  invoiceTitle: {
    color: theme.primary,
    fontWeight: '700',
    fontSize: theme.fontSize.subtitle,
    textAlign: 'center',
    marginBottom: 0,  // Quitamos el margen inferior
    lineHeight: 1.2  // Ajustamos el line-height para que esté más junto
  },
  invoiceNumber: {
    color: theme.text.primary,
    fontSize: theme.fontSize.small,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 0,
    lineHeight: 1.2  // Ajustamos el line-height para que esté más junto
  },
  invoiceDate: {
    color: theme.text.primary,
    fontSize: theme.fontSize.small,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 'auto', // Empuja la fecha hacia abajo
    paddingTop: '10px' // Espacio adicional arriba de la fecha
  }
});

export const InvoiceHeader = ({ invoice, empresa, theme, documentType = 'FACTURA' }) => {
  if (!invoice) return null;

  const styles = getStyles(theme);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Grid container sx={styles.header} spacing={2}>
      <Grid item xs={8}>
        <Box sx={styles.leftSection}>
          <Box sx={styles.companyInfo}>
            <Typography sx={styles.companyName}>
              {empresa.nombre}
            </Typography>
            <Typography sx={styles.companyText}>
              {empresa.direccion}
            </Typography>
            <Typography sx={styles.companyText}>
              RIF: {empresa.rif}
            </Typography>
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
                className="company-logo-background"
                crossOrigin="anonymous"
              />
            </Box>
          )}
          {/* Contenido del documento - Aquí usamos documentType en lugar de "FACTURA" */}
          <Box sx={styles.invoiceContent}>
            <Box sx={styles.invoiceHeader}>
              <Typography sx={styles.invoiceTitle}>
                {documentType}
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