import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

function Sidebar() {
    return (
        <Box sx={{ width: '240px', backgroundColor: '#2e3b55', height: '100vh', padding: '20px', color: '#fff' }}>
            <Typography variant="h6" gutterBottom>
                Menú
            </Typography>
            <NavLink to="/" style={{ color: '#fff', textDecoration: 'none', display: 'block', marginBottom: '10px' }} activeStyle={{ fontWeight: 'bold', color: '#4caf50' }}>
                Dashboard
            </NavLink>
            <NavLink to="/facturas" style={{ color: '#fff', textDecoration: 'none', display: 'block', marginBottom: '10px' }} activeStyle={{ fontWeight: 'bold', color: '#2196f3' }}>
                Facturas
            </NavLink>
            <NavLink to="/clientes" style={{ color: '#fff', textDecoration: 'none', display: 'block', marginBottom: '10px' }} activeStyle={{ fontWeight: 'bold', color: '#ff9800' }}>
                Clientes
            </NavLink>
            <NavLink to="/productos" style={{ color: '#fff', textDecoration: 'none', display: 'block', marginBottom: '10px' }} activeStyle={{ fontWeight: 'bold', color: '#ff5722' }}>
                Productos
            </NavLink>
        </Box>
    );
}

export default Sidebar;
