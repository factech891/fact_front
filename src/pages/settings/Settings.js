// src/pages/settings/Settings.js - MODIFICADO PARA QUITAR TÍTULO
import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography, Paper } from '@mui/material';
import CompanyForm from './CompanySettings/CompanyForm';
import LogoUploader from './CompanySettings/LogoUploader';
import CompanyPreview from './CompanySettings/CompanyPreview';

// El componente TabPanel no necesita cambios
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* --- Título Eliminado --- */}
      {/* <Typography variant="h4" component="h1" gutterBottom>
        Configuración
      </Typography> */}
      {/* --- Fin Título Eliminado --- */}

      {/* El Paper con las Tabs empieza directamente */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            // Considera si quieres mantener el fondo o hacerlo transparente
            // bgcolor: 'background.paper'
          }}
        >
          <Tab label="Información de Empresa" id="settings-tab-0" aria-controls="settings-tabpanel-0" />
          <Tab label="Logo" id="settings-tab-1" aria-controls="settings-tabpanel-1" />
          <Tab label="Vista Previa" id="settings-tab-2" aria-controls="settings-tabpanel-2" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <CompanyForm />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <LogoUploader />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <CompanyPreview />
        </TabPanel>
      </Paper>
    </Box>
  );
}