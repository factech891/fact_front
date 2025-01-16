import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
    // Datos del gráfico de torta
    const pieData = {
        labels: ['Ingresos', 'Facturas', 'Clientes'],
        datasets: [
            {
                data: [12345, 45, 32],
                backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
            },
        ],
    };

    // Estados para la hora, fecha y precio del VES
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
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Bienvenido a FortFact
            </Typography>

            {/* Fecha, hora y precio del VES */}
            <Paper sx={{ padding: '20px', marginBottom: '20px', backgroundColor: '#f5f5f5' }}>
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

            {/* Resumen de datos */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">Total Ingresos</Typography>
                        <Typography variant="h4" sx={{ color: '#4caf50' }}>$12,345</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">Facturas Emitidas</Typography>
                        <Typography variant="h4" sx={{ color: '#2196f3' }}>45</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">Clientes Registrados</Typography>
                        <Typography variant="h4" sx={{ color: '#ff9800' }}>32</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Gráfico de torta */}
            <Paper sx={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Distribución de Datos
                </Typography>
                <Pie data={pieData} style={{ maxWidth: '400px', margin: '0 auto' }} />
            </Paper>
        </Box>
    );
}

export default Dashboard;
