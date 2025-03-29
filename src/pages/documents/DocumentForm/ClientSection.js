import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  Autocomplete,
  Button,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import {
  Person as PersonIcon,
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const ClientSection = ({ formData, onChange, clients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState(clients || []);

  // Handle client selection
  const handleClientSelect = (event, newValue) => {
    onChange('client', newValue?._id);
  };

  // Handle search term change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter clients
    if (value) {
      const filtered = clients.filter(client => 
        client.name.toLowerCase().includes(value.toLowerCase()) ||
        client.taxId?.toLowerCase().includes(value.toLowerCase()) ||
        client.email?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  };

  // Get selected client object
  const selectedClient = clients?.find(client => client._id === formData.client);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Información del Cliente
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Client Selection */}
        <Grid item xs={12}>
          <Autocomplete
            id="client-select"
            options={clients || []}
            getOptionLabel={(option) => option.name || ''}
            value={selectedClient || null}
            onChange={handleClientSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar Cliente"
                variant="outlined"
                size="small"
                fullWidth
                helperText="Seleccione un cliente existente o cree uno nuevo"
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <Typography variant="body1">{option.name}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {option.taxId}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                </Box>
              </li>
            )}
          />
        </Grid>

        {/* Selected Client Details */}
        {selectedClient && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">{selectedClient.name}</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>CIF/NIF:</strong> {selectedClient.taxId || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {selectedClient.email || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Teléfono:</strong> {selectedClient.phone || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Dirección:</strong> {selectedClient.address || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Ciudad:</strong> {selectedClient.city || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Código Postal:</strong> {selectedClient.postalCode || '-'}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button size="small" color="primary">
                  Editar Cliente
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Create New Client Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => console.log('Crear nuevo cliente')}
            >
              Crear Nuevo Cliente
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientSection;