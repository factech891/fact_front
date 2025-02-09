// src/pages/invoices/InvoicePreview/InvoiceHeader.js
import { Grid, Typography, Box } from '@mui/material';

const styles = {
  header: {
    backgroundColor: '#002855',
    color: 'white',
    padding: '30px 20px',
    marginBottom: '20px',
    height: '150px'
  },
  companyInfo: {
    padding: '10px',
  },
  companyName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '24px',
    marginBottom: '10px'
  },
  companyText: {
    color: 'white',
    fontSize: '14px',
    marginBottom: '5px'
  },
  invoiceBox: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '4px',
    color: '#002855',
    marginTop: '-10px',
    height: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  invoiceTitle: {
    color: '#002855',
    fontWeight: 'bold',
    fontSize: '24px',
    marginBottom: '10px'
  },
  invoiceNumber: {
    fontSize: '16px',
    color: '#002855'
  },
  invoiceDate: {
    fontSize: '16px',
    color: '#002855'
  }
};

export const InvoiceHeader = ({ invoice, empresa = {} }) => {
  // Usar los datos de empresa proporcionados o los valores por defecto
  const {
    nombre = 'Tu Empresa',
    direccion = 'Dirección de la empresa',
    rif = 'J-123456789',
    telefono = '+58 424-1234567',
    email = 'info@tuempresa.com'
  } = empresa;

  if (!invoice) return null;

  // Formatear la fecha consistentemente
  const formatDate = (date) => {
    const d = date ? new Date(date) : new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <Grid container sx={styles.header}>
      <Grid item xs={6}>
        <Box sx={styles.companyInfo}>
          <Typography sx={styles.companyName}>
            {nombre}
          </Typography>
          <Typography sx={styles.companyText}>
            {direccion}
          </Typography>
          <Typography sx={styles.companyText}>
            RIF: {rif}
          </Typography>
          <Typography sx={styles.companyText}>
            Tel: {telefono}
          </Typography>
          <Typography sx={styles.companyText}>
            Email: {email}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} sx={{ textAlign: 'right' }}>
        <Box sx={styles.invoiceBox}>
          <Typography sx={styles.invoiceTitle}>
            FACTURA
          </Typography>
          <Typography sx={styles.invoiceNumber}>
            N°: {invoice.numero || 'INV-0001'}
          </Typography>
          <Typography sx={styles.invoiceDate}>
            Fecha: {formatDate(invoice.fecha)}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default InvoiceHeader;