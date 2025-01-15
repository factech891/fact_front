import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

function Inicio() {
    const [hora, setHora] = useState('');
    const [fecha, setFecha] = useState('');
    const [ves, setVes] = useState(null);

    // Actualizar hora y fecha cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setHora(now.toLocaleTimeString('es-VE'));
            setFecha(now.toLocaleDateString('es-VE'));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Obtener precio del VES desde una API
    useEffect(() => {
        fetch('https://api.exchangerate-api.com/v4/latest/USD')
            .then((response) => response.json())
            .then((data) => {
                const vesRate = data.rates.VES;
                setVes(vesRate.toFixed(2));
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <Container>
            <Paper sx={{ padding: '20px', marginBottom: '20px', backgroundColor: '#f5f5f5' }}>
                <Typography variant="h4" gutterBottom>
                    Bienvenido a FortFact
                </Typography>
                <Typography variant="h6">
                    Fecha: {fecha}
                </Typography>
                <Typography variant="h6">
                    Hora: {hora}
                </Typography>
                {ves && (
                    <Typography variant="h6" color="primary">
                        Precio VES: {ves} Bs por USD
                    </Typography>
                )}
            </Paper>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Link to="/facturas" style={{ textDecoration: 'none' }}>
                    <Paper sx={{ padding: '15px', textAlign: 'center', backgroundColor: '#1976d2', color: '#fff' }}>
                        Facturas
                    </Paper>
                </Link>
                <Link to="/clientes" style={{ textDecoration: 'none' }}>
                    <Paper sx={{ padding: '15px', textAlign: 'center', backgroundColor: '#43a047', color: '#fff' }}>
                        Clientes
                    </Paper>
                </Link>
                <Link to="/productos" style={{ textDecoration: 'none' }}>
                    <Paper sx={{ padding: '15px', textAlign: 'center', backgroundColor: '#f57c00', color: '#fff' }}>
                        Productos
                    </Paper>
                </Link>
            </Box>
        </Container>
    );
}

export default Inicio;