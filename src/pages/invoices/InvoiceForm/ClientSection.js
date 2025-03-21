// src/pages/invoices/InvoiceForm/ClientSection.js
import { 
    Card, Typography, Divider, Grid, Autocomplete, TextField,
    FormControl, InputLabel, Select, MenuItem, InputAdornment,
    Collapse, Box
  } from '@mui/material';
  import { 
    CreditCard as CreditCardIcon,
    Money as MoneyIcon,
    CalendarToday as CalendarIcon,
    Payment as PaymentIcon
  } from '@mui/icons-material';
  import { CURRENCY_LIST } from '../constants/taxRates';
  
  const ClientSection = ({ 
    client, 
    moneda, 
    condicionesPago, 
    diasCredito, 
    clients, 
    errors,
    onClientChange,
    onMonedaChange, 
    onCondicionesChange, 
    onDiasCreditoChange 
  }) => {
    return (
      <Card sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Datos del Cliente
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={clients}
              getOptionLabel={(option) => `${option.nombre} - ${option.rif}`}
              value={client}
              onChange={(_, client) => onClientChange(client)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cliente"
                  error={!!errors.client}
                  helperText={errors.client}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel>Moneda</InputLabel>
              <Select
                value={moneda}
                onChange={(e) => onMonedaChange(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CreditCardIcon color="primary" sx={{ mr: 1 }} />
                  </InputAdornment>
                }
              >
                {CURRENCY_LIST.map((currency) => (
                  <MenuItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel>Condiciones de Pago</InputLabel>
              <Select
                value={condicionesPago}
                onChange={(e) => onCondicionesChange(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <PaymentIcon color="primary" sx={{ mr: 1 }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="Contado">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MoneyIcon fontSize="small" sx={{ mr: 1 }} />
                    Contado
                  </Box>
                </MenuItem>
                <MenuItem value="Crédito">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                    Crédito
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Campo de días de crédito condicional */}
          <Grid item xs={12} md={6} lg={4}>
            <Collapse in={condicionesPago === 'Crédito'} unmountOnExit>
              <FormControl fullWidth error={!!errors.diasCredito}>
                <TextField
                  label="Días de Crédito"
                  type="number"
                  value={diasCredito}
                  onChange={(e) => onDiasCreditoChange(parseInt(e.target.value) || '')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        días
                      </InputAdornment>
                    )
                  }}
                  error={!!errors.diasCredito}
                  helperText={errors.diasCredito}
                />
              </FormControl>
            </Collapse>
          </Grid>
        </Grid>
      </Card>
    );
  };
  
  export default ClientSection;