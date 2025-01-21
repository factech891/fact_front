import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';

function Sidebar() {
    return (
        <Box
            sx={{
                width: '240px',
                backgroundColor: '#256d7b',
                color: '#fff',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                Menú
            </Typography>
            <List>
                <ListItem
                    component={NavLink}
                    to="/"
                    exact
                    sx={{
                        color: '#fff',
                        textDecoration: 'none',
                        '&.active': {
                            backgroundColor: '#4b5563',
                            borderRadius: '8px',
                        },
                    }}
                >
                    <ListItemIcon>
                        <DashboardIcon sx={{ color: '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem
                    component={NavLink}
                    to="/invoices"
                    sx={{
                        color: '#fff',
                        textDecoration: 'none',
                        '&.active': {
                            backgroundColor: '#4b5563',
                            borderRadius: '8px',
                        },
                    }}
                >
                    <ListItemIcon>
                        <ReceiptIcon sx={{ color: '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Facturas" />
                </ListItem>
                <ListItem
                    component={NavLink}
                    to="/clients"
                    sx={{
                        color: '#fff',
                        textDecoration: 'none',
                        '&.active': {
                            backgroundColor: '#4b5563',
                            borderRadius: '8px',
                        },
                    }}
                >
                    <ListItemIcon>
                        <PeopleIcon sx={{ color: '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Clientes" />
                </ListItem>
                <ListItem
                    component={NavLink}
                    to="/products"
                    sx={{
                        color: '#fff',
                        textDecoration: 'none',
                        '&.active': {
                            backgroundColor: '#4b5563',
                            borderRadius: '8px',
                        },
                    }}
                >
                    <ListItemIcon>
                        <InventoryIcon sx={{ color: '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Productos" />
                </ListItem>
            </List>
        </Box>
    );
}

export default Sidebar;
