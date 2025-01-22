import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import '../../styles/global.css'; // Importar global.css

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    // Datos para el gráfico de barras
    const barData = {
        labels: ['Ingresos', 'Facturas', 'Clientes'],
        datasets: [
            {
                label: 'Resumen',
                data: [12345, 45, 32],
                backgroundColor: [
                    'var(--icon-edit)', // Verde para ingresos
                    'var(--icon-view)', // Azul para facturas
                    'var(--icon-download)', // Naranja para clientes
                ],
                borderColor: [
                    'var(--icon-edit)',
                    'var(--icon-view)',
                    'var(--icon-download)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Datos para el gráfico de líneas (tendencia de ingresos)
    const lineData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Ingresos Mensuales',
                data: [5000, 7000, 9000, 12000, 10000, 11000, 13000],
                borderColor: 'var(--primary-color)', // Color primario para la línea
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fondo transparente
                fill: true,
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
            <Paper sx={{ padding: '20px', marginBottom: '20px', backgroundColor: 'var(--card-background)' }}>
                <Typography variant="h6">
                    Fecha: {fecha}
                </Typography>
                <Typography variant="h6">
                    Hora: {hora}
                </Typography>
                {ves && (
                    <Typography variant="h6" sx={{ color: 'var(--primary-color)' }}>
                        Precio VES: {ves} Bs por USD
                    </Typography>
                )}
            </Paper>

            {/* Resumen de datos */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--card-background)' }}>
                        <Typography variant="h6">Total Ingresos</Typography>
                        <Typography variant="h4" sx={{ color: 'var(--icon-edit)' }}>$12,345</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--card-background)' }}>
                        <Typography variant="h6">Facturas Emitidas</Typography>
                        <Typography variant="h4" sx={{ color: 'var(--icon-view)' }}>45</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--card-background)' }}>
                        <Typography variant="h6">Clientes Registrados</Typography>
                        <Typography variant="h4" sx={{ color: 'var(--icon-download)' }}>32</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Gráficos cuadrados uno al lado del otro */}
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
                {/* Gráfico de barras */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: '20px', backgroundColor: 'var(--card-background)', height: '400px' }}>
                        <Typography variant="h6" gutterBottom>
                            Resumen de Datos
                        </Typography>
                        <Box sx={{ height: '300px' }}> {/* Contenedor cuadrado */}
                            <Bar
                                data={barData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false, // Permite ajustar el tamaño
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Gráfico de líneas (tendencia de ingresos) */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: '20px', backgroundColor: 'var(--card-background)', height: '400px' }}>
                        <Typography variant="h6" gutterBottom>
                            Tendencia de Ingresos Mensuales
                        </Typography>
                        <Box sx={{ height: '300px' }}> {/* Contenedor cuadrado */}
                            <Line
                                data={lineData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false, // Permite ajustar el tamaño
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;