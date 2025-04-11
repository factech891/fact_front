// src/pages/settings/Settings.js
import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography, Paper, Grid, Slider, Button } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import CompanyForm from './CompanySettings/CompanyForm';
import LogoUploader from './CompanySettings/LogoUploader';
// Quitamos completamente el import de LogoOpacityControl que estaba causando duplicación
// import LogoOpacityControl from './CompanySettings/LogoOpacityControl';

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
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab label="Información de Empresa" id="settings-tab-0" aria-controls="settings-tabpanel-0" />
          <Tab label="Logo" id="settings-tab-1" aria-controls="settings-tabpanel-1" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <CompanyForm />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <LogoUploader />
          {/* IMPORTANTE: Eliminamos la referencia a LogoOpacityControl que estaba duplicando */}
        </TabPanel>

      </Paper>
    </Box>
  );
}