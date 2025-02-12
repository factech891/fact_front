// src/pages/settings/Settings.js
import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography, Paper } from '@mui/material';
import CompanyForm from './CompanySettings/CompanyForm';
import LogoUploader from './CompanySettings/LogoUploader';
import CompanyPreview from './CompanySettings/CompanyPreview';

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
      <Typography variant="h4" component="h1" gutterBottom>
        Configuración
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <Tab label="Información de Empresa" />
          <Tab label="Logo" />
          <Tab label="Vista Previa" />
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