import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Invoices from './components/Invoices/Invoices';
import Clients from './components/Clients/Clients';
import Products from './components/Products/Products';
import Sidebar from './components/Sidebar/Sidebar';
import { Box } from '@mui/material';

function App() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Contenedor principal */}
            <Box
                sx={{
                    flexGrow: 1,
                    padding: '20px',
                    backgroundColor: '#faebd7', // Fondo suave y profesional
                    backgroundImage: 'url(/path/to/background-image.jpg)', // Agrega una imagen si quieres
                    backgroundSize: 'cover', // Que la imagen ocupe todo
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            >
                {/* Aquí se renderizan las rutas */}
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="*" element={<h1>Página no encontrada</h1>} />
                </Routes>
            </Box>
        </Box>
    );
}

export default App;