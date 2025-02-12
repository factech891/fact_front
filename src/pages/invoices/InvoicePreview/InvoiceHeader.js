// src/pages/invoices/InvoicePreview/InvoiceHeader.js
import { Grid, Typography, Box } from '@mui/material';

const getStyles = (theme) => ({
  header: {
    backgroundColor: theme.primary,
    background: theme.gradient,
    color: 'white',
    padding: '20px',
    position: 'relative',
    minHeight: '140px',
    marginBottom: '20px'
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '10px'
  },
  logoContainer: {
    width: '60px',
    height: '60px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
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
    marginBottom: '5px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  companyText: {
    color: 'white',
    fontSize: theme.fontSize.small,
    lineHeight: 1.4,
    opacity: '0.9',
    whiteSpace: 'pre-line'
  },
  invoiceBox: {
    backgroundColor: theme.background.primary,
    padding: '15px',
    borderRadius: '6px',
    color: theme.primary,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.border}`,
    position: 'relative',
    width: '200px',
    height: 'fit-content'
  },
  invoiceTitle: {
    color: theme.primary,
    fontWeight: '600',
    fontSize: theme.fontSize.subtitle,
    marginBottom: '10px',
    textAlign: 'center'
  },
  invoiceData: {
    textAlign: 'center',
    '& > *': {
      margin: '6px 0',
      color: theme.text.primary,
      fontSize: theme.fontSize.small
    }
  }
});

export const InvoiceHeader = ({ invoice, empresa, theme }) => {
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
          {empresa.logoUrl && (
            <Box sx={styles.logoContainer}>
              <img
                src={empresa.logoUrl}
                alt={`Logo de ${empresa.nombre}`}
                style={styles.logo}
                className="company-logo"
                crossOrigin="anonymous"
                loading="eager"
              />
            </Box>
          )}
          <Box sx={styles.companyInfo}>
            <Typography sx={styles.companyName}>
              {empresa.nombre || 'Nombre Empresa'}
            </Typography>
            <Typography sx={styles.companyText}>
              {empresa.direccion || 'Dirección no especificada'}
            </Typography>
            <Typography sx={styles.companyText}>
              RIF: {empresa.rif || 'RIF no especificado'}
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
      <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
        <Box sx={styles.invoiceBox}>
          <Typography sx={styles.invoiceTitle}>
            FACTURA
          </Typography>
          <Box sx={styles.invoiceData}>
            <Typography>
              N°: {invoice.numero || invoice.number || 'No especificado'}
            </Typography>
            <Typography>
              Fecha: {formatDate(invoice.fecha || invoice.date || new Date())}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default InvoiceHeader;