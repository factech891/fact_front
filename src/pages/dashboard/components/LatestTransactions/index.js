// src/pages/dashboard/components/LatestTransactions/index.js
// (Importaciones y estilos como estaban)
import React, { useState, useContext } from 'react'; // Importar useContext
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AuthContext from '../../../../context/AuthContext'; // Asegúrate que la ruta sea correcta

const LatestTransactions = ({ invoices, clients }) => {
  // Usar el contexto de autenticación para acceder a hasRole
  const { hasRole } = useContext(AuthContext);

  // Estilo para botones de acción principal (como estaba)
  const actionButtonStyle = {
    borderRadius: '50px',
    color: 'white',
    fontWeight: 600,
    padding: '8px 22px',
    textTransform: 'none',
    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
    transition: 'all 0.2s ease-in-out',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)',
      backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
      backgroundColor: 'transparent',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 10px rgba(79, 172, 254, 0.4)',
    },
    '&.Mui-disabled': {
      backgroundImage: 'linear-gradient(to right, #919191 0%, #b7b7b7 100%)',
      color: 'rgba(255, 255, 255, 0.6)',
    }
  };

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        bgcolor: '#1E1E1E',
        border: '1px solid #333',
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': { color: '#888' },
            '& .Mui-selected': { color: 'white' },
            '& .MuiTabs-indicator': { backgroundColor: '#4477CE' }
          }}
        >
          <Tab label="FACTURAS RECIENTES" />
          <Tab label="CLIENTES RECIENTES" />
        </Tabs>
      </Box>

      {/* Contenido de Facturas Recientes */}
      {tabValue === 0 && (
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="white">Facturas Recientes</Typography>
            {/* === MODIFICACIÓN AQUÍ === */}
            {/* Mostrar botón solo si el usuario NO es 'visor' */}
            {!hasRole('visor') && (
              <Button
                onClick={() => window.location.href = '/invoices?action=new'}
                startIcon={<AddIcon />}
                variant="contained"
                sx={{
                  ...actionButtonStyle
                }}
              >
                NUEVA FACTURA
              </Button>
            )}
            {/* === FIN MODIFICACIÓN === */}
          </Box>

          {/* (Resto de la tabla de facturas como estaba) */}
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 700, width: '100%' }}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
                bgcolor: '#2A2A2A',
                borderRadius: 1,
                p: 2,
                fontWeight: 'bold'
              }}>
                <Typography variant="subtitle2" color="#CCC">Nº Factura</Typography>
                <Typography variant="subtitle2" color="#CCC">Cliente</Typography>
                <Typography variant="subtitle2" color="#CCC">Fecha</Typography>
                <Typography variant="subtitle2" color="#CCC">Total</Typography>
                <Typography variant="subtitle2" color="#CCC">Moneda</Typography>
                <Typography variant="subtitle2" color="#CCC">Estado</Typography>
              </Box>

              {invoices?.length > 0 ? (
                invoices.map((factura) => (
                  <Box key={factura.id} sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
                    p: 2,
                    borderBottom: '1px solid #333'
                  }}>
                    <Typography variant="body2" color="white">{factura.id}</Typography>
                    <Typography variant="body2" color="white">{factura.cliente}</Typography>
                    <Typography variant="body2" color="white">{factura.fecha}</Typography>
                    <Typography variant="body2" color="white">{factura.total.toLocaleString()}</Typography>
                    <Typography variant="body2" color="white">{factura.moneda}</Typography>
                    <Typography
                      variant="body2"
                      color="white"
                      sx={{ textWrap: 'nowrap' }}
                    >
                      {factura.estado}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="white">No hay facturas disponibles</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Contenido de Clientes Recientes */}
      {tabValue === 1 && (
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="white">Clientes Recientes</Typography>
            {/* === MODIFICACIÓN AQUÍ === */}
            {/* Mostrar botón solo si el usuario NO es 'visor' */}
            {!hasRole('visor') && (
              <Button
                onClick={() => window.location.href = '/clients?action=new'}
                startIcon={<AddIcon />}
                variant="contained"
                sx={{
                  ...actionButtonStyle
                }}
              >
                NUEVO CLIENTE
              </Button>
            )}
            {/* === FIN MODIFICACIÓN === */}
          </Box>

          {/* (Resto de la tabla de clientes como estaba) */}
           <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 800, width: '100%' }}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 2fr 1fr',
                bgcolor: '#2A2A2A',
                borderRadius: 1,
                p: 2,
                fontWeight: 'bold'
              }}>
                <Typography variant="subtitle2" color="#CCC">Nombre</Typography>
                <Typography variant="subtitle2" color="#CCC">Correo</Typography>
                <Typography variant="subtitle2" color="#CCC">Documento</Typography>
                <Typography variant="subtitle2" color="#CCC" align="right">Facturas</Typography>
              </Box>

              {clients?.length > 0 ? (
                clients.map((cliente) => (
                  <Box key={cliente.id} sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 2fr 1fr',
                    p: 2,
                    borderBottom: '1px solid #333'
                  }}>
                    <Typography variant="body2" color="white">{cliente.nombre}</Typography>
                    <Typography
                      variant="body2"
                      color="white"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {cliente.email ? `📧 ${cliente.email}` : ''}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="white"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {cliente.documento ? `📝 ${cliente.documento}` : ''}
                    </Typography>
                    <Typography variant="body2" color="white" align="right">{cliente.facturas}</Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="white">No hay clientes disponibles</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default LatestTransactions;