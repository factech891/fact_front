// src/pages/invoices/InvoicePreview/InvoiceHeader.js
import { Grid, Typography, Box } from '@mui/material';

const getStyles = (theme) => ({
  header: {
    backgroundColor: theme.primary,
    background: theme.gradient,
    color: 'white',
    padding: '20px',
    position: 'relative',
    height: '120px',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '95%',
      height: '1px',
      background: 'linear-gradient(to right, transparent, #ffffff80, transparent)'
    }
  },
  companyInfo: {
    padding: '10px',
    borderLeft: '1px solid rgba(255, 255, 255, 0.2)'
  },
  companyName: {
    color: 'white',
    fontWeight: '600',
    fontSize: theme.fontSize.title,
    marginBottom: '10px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  companyText: {
    color: 'white',
    fontSize: theme.fontSize.small,
    marginBottom: '6px',
    opacity: '0.9'
  },
  invoiceBox: {
    backgroundColor: theme.background.primary,
    padding: '15px',
    borderRadius: '6px',
    color: theme.primary,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.border}`,
    position: 'relative',
    marginTop: '-5px',
    width: '200px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: theme.gradient
    }
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
      fontSize: theme.fontSize.body
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
    <Grid container sx={styles.header}>
      <Grid item xs={7}>
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
          <Typography sx={styles.companyText}>
            Tel: {empresa.telefono}
          </Typography>
          <Typography sx={styles.companyText}>
            Email: {empresa.email}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={styles.invoiceBox}>
          <Typography sx={styles.invoiceTitle}>
            FACTURA
          </Typography>
          <Box sx={styles.invoiceData}>
            <Typography>
              N°: {invoice.numero || invoice.number}
            </Typography>
            <Typography>
              Fecha: {formatDate(invoice.fecha || invoice.date)}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default InvoiceHeader;