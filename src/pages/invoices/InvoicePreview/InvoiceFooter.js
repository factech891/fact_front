// src/pages/invoices/InvoicePreview/InvoiceFooter.js
import { Typography, Box, Grid } from '@mui/material';

const styles = {
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px 25px',
    background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)',
    borderTop: '1px solid #e0e0e7',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '95%',
      height: '1px',
      background: 'linear-gradient(to right, transparent, #002855, transparent)'
    }
  },
  section: {
    marginBottom: '10px',
    padding: '0 10px'
  },
  title: {
    color: '#002855',
    fontWeight: '600',
    fontSize: '12px',
    marginBottom: '4px',
    letterSpacing: '0.5px'
  },
  content: {
    color: '#2c3e50',
    fontSize: '11px',
    lineHeight: '1.4'
  },
  bulletPoint: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '3px',
    '&::before': {
      content: '"•"',
      color: '#002855',
      marginRight: '5px',
      fontWeight: 'bold'
    }
  },
  gridContainer: {
    borderTop: '1px solid #e0e0e7',
    paddingTop: '10px',
    marginTop: '10px'
  },
  paymentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#2c3e50',
    fontSize: '11px',
    '& span': {
      fontWeight: '600',
      color: '#002855'
    }
  }
};

export const InvoiceFooter = ({ invoice }) => (
  <Box sx={styles.footer}>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Box sx={styles.section}>
          <Typography sx={styles.title}>
            Información de Pago
          </Typography>
          <Box sx={styles.paymentInfo}>
            <span>Condición:</span> {invoice.condicionesPago}
            {invoice.condicionesPago === 'Crédito' && (
              <> - <span>Plazo:</span> {invoice.diasCredito} días</>
            )}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box sx={styles.section}>
          <Typography sx={styles.title}>
            Notas Importantes
          </Typography>
          <Box sx={styles.content}>
            <Box sx={styles.bulletPoint}>
              Esta factura es un documento legal y sirve como comprobante fiscal.
            </Box>
            <Box sx={styles.bulletPoint}>
              Los precios incluyen IVA según corresponda.
            </Box>
            <Box sx={styles.bulletPoint}>
              Para cualquier consulta, contacte a nuestro departamento de atención al cliente.
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Box>
);

export default InvoiceFooter;