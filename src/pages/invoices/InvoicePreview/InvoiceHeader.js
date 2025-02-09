// src/pages/invoices/InvoicePreview/InvoiceHeader.js
import { Grid, Typography, Box } from '@mui/material';


const styles = {
  header: {
    backgroundColor: '#002855',
    background: 'linear-gradient(135deg, #002855 0%, #004a9f 100%)',
    color: 'white',
    padding: '20px', // Reducido de 30px a 20px
    position: 'relative',
    height: '120px', // Altura fija más compacta
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '95%',
      height: '1px', // Más sutil
      background: 'linear-gradient(to right, transparent, #ffffff80, transparent)'
    }
  },
  companyInfo: {
    padding: '10px', // Reducido de 15px a 10px
    borderLeft: '1px solid rgba(255, 255, 255, 0.2)' // Más sutil
  },
  companyName: {
    color: 'white',
    fontWeight: '600',
    fontSize: '22px', // Reducido de 26px a 22px
    marginBottom: '10px', // Reducido de 15px a 10px
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  companyText: {
    color: 'white',
    fontSize: '12px', // Reducido de 14px a 12px
    marginBottom: '6px', // Reducido de 8px a 6px
    opacity: '0.9'
  },
  invoiceBox: {
    backgroundColor: 'white',
    padding: '15px', // Reducido de 25px a 15px
    borderRadius: '6px', // Reducido de 8px a 6px
    color: '#002855',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Sombra más sutil
    border: '1px solid rgba(0, 0, 0, 0.1)',
    position: 'relative',
    marginTop: '-5px', // Reducido de -10px a -5px
    width: '200px', // Ancho fijo para la caja
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px', // Reducido de 4px a 3px
      background: 'linear-gradient(to right, #002855, #0057a8)'
    }
  },
  invoiceTitle: {
    color: '#002855',
    fontWeight: '600',
    fontSize: '20px', // Reducido de 24px a 20px
    marginBottom: '10px', // Reducido de 15px a 10px
    textAlign: 'center'
  },
  invoiceData: {
    textAlign: 'center',
    '& > *': {
      margin: '6px 0', // Reducido de 8px a 6px
      color: '#2c3e50',
      fontSize: '13px' // Reducido de 15px a 13px
    }
  }
};

export const InvoiceHeader = ({ invoice, empresa }) => {
  if (!invoice) return null;

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