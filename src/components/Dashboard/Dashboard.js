import React from 'react';
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
    const pieData = {
        labels: ['Ingresos', 'Facturas', 'Clientes'],
        datasets: [
            {
                data: [12345, 45, 32],
                backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
            },
        ],
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Bienvenido a FortFact
            </Typography>

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
