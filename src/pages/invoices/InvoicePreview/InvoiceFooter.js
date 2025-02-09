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

  return (
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
};

export default InvoiceFooter;