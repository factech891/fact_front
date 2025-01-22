import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';

// Estilos comunes para los ListItem
const listItemStyles = {
  color: 'var(--text-light)',
  textDecoration: 'none',
  borderRadius: '8px',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'var(--secondary-color)',
  },
  '&.active': {
    backgroundColor: 'var(--secondary-color)',
    color: '#fff', // Texto blanco cuando está activo
  },
};

function Sidebar() {
  return (
    <Box
      sx={{
        width: '240px',
        backgroundColor: 'var(--primary-color)',
        color: 'var(--text-light)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 'var(--font-size-title)',
          color: '#fff', // Título en blanco para contrastar con el fondo
        }}
      >
        Menú
      </Typography>
      <List>
        {/* Dashboard */}
        <ListItem
          component={NavLink}
          to="/"
          exact
          sx={listItemStyles}
        >
          <ListItemIcon>
            <DashboardIcon sx={{ color: 'var(--text-light)' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {/* Facturas */}
        <ListItem
          component={NavLink}
          to="/invoices"
          sx={listItemStyles}
        >
          <ListItemIcon>
            <ReceiptIcon sx={{ color: 'var(--text-light)' }} />
          </ListItemIcon>
          <ListItemText primary="Facturas" />
        </ListItem>

        {/* Clientes */}
        <ListItem
          component={NavLink}
          to="/clients"
          sx={listItemStyles}
        >
          <ListItemIcon>
            <PeopleIcon sx={{ color: 'var(--text-light)' }} />
          </ListItemIcon>
          <ListItemText primary="Clientes" />
        </ListItem>

        {/* Productos */}
        <ListItem
          component={NavLink}
          to="/products"
          sx={listItemStyles}
        >
          <ListItemIcon>
            <InventoryIcon sx={{ color: 'var(--text-light)' }} />
          </ListItemIcon>
          <ListItemText primary="Productos" />
        </ListItem>
      </List>
    </Box>
  );
}

export default Sidebar;