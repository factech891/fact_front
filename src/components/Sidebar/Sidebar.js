import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

function Sidebar() {
    return (
        <Box sx={{ width: '240px', backgroundColor: '#2a3b4c', color: '#fff', padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Menú
            </Typography>
            <nav>
                <NavLink to="/" exact activeStyle={{ fontWeight: 'bold' }} style={{ color: '#fff', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>
                    Dashboard
                </NavLink>
                <NavLink to="/invoices" activeStyle={{ fontWeight: 'bold' }} style={{ color: '#fff', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>
                    Facturas
                </NavLink>
                <NavLink to="/clients" activeStyle={{ fontWeight: 'bold' }} style={{ color: '#fff', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>
                    Clientes
                </NavLink>
                <NavLink to="/products" activeStyle={{ fontWeight: 'bold' }} style={{ color: '#fff', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>
                    Productos
                </NavLink>
            </nav>
        </Box>
    );
}

export default Sidebar;
