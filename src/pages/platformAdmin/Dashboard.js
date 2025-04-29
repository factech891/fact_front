// src/pages/platformAdmin/Dashboard.js (ListItemIcon importado)
import React, { useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemIcon, // <--- AÑADIDO AQUÍ
    ListItemText,
    Paper
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessIcon from '@mui/icons-material/Business';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import usePlatformAdmin from '../../hooks/usePlatformAdmin';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Componente StatCard (sin cambios)
const StatCard = ({ title, value, icon, loading, color = "primary.main" }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: `5px solid ${color}` }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                {icon}
            </Box>
            <Typography variant="h4" component="div">
                {loading ? <CircularProgress size={24} /> : value ?? '-'}
            </Typography>
        </CardContent>
    </Card>
);


const PlatformAdminDashboard = () => {
    const {
        dashboardStats,
        loadingStats,
        error,
        fetchDashboardStats,
        clearMessages
    } = usePlatformAdmin();

    useEffect(() => {
        fetchDashboardStats();
        return () => clearMessages();
    }, [fetchDashboardStats, clearMessages]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = parseISO(dateString);
            return format(date, 'dd MMM yyyy', { locale: es });
        } catch (e) {
            console.error("Error formatting date:", e);
            return 'Fecha inválida';
        }
    };

    // --- Ajuste en colores para StatCard ---
    // Usar theme.palette...main o colores directos si no están en el tema
    const primaryColor = theme => theme.palette.primary.main;
    const successColor = theme => theme.palette.success.main;
    const infoColor = theme => theme.palette.info.main;
    const secondaryColor = theme => theme.palette.secondary.main; // O un color específico como 'purple'
    const warningColor = theme => theme.palette.warning.main;
    const errorColor = theme => theme.palette.error.main;


    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Panel de Administración
            </Typography>

            {error && !loadingStats && ( // Mostrar error solo si no está cargando
                <Alert severity="error" sx={{ mb: 2 }}>
                    {/* Mostrar el mensaje de error específico */}
                    {typeof error === 'string' ? error : 'Ocurrió un error al cargar los datos.'}
                </Alert>
            )}

            <Grid container spacing={3} sx={{ mb: 4 }}>
                 <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Compañías"
                        value={dashboardStats?.companies?.total}
                        icon={<BusinessIcon color="primary" />}
                        loading={loadingStats}
                        color={primaryColor} // Usar color del tema
                    />
                </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Susc. Activas"
                        value={dashboardStats?.companies?.active}
                        icon={<CheckCircleOutlineIcon color="success" />}
                        loading={loadingStats}
                        color={successColor} // Usar color del tema
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="En Período Prueba"
                        value={dashboardStats?.companies?.trial}
                        icon={<HourglassTopIcon color="info" />}
                        loading={loadingStats}
                        color={infoColor} // Usar color del tema
                    />
                </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Usuarios (Global)"
                        value={dashboardStats?.users?.total}
                        icon={<PeopleAltIcon sx={{ color: secondaryColor }} />} // Usar color del tema
                        loading={loadingStats}
                        color={secondaryColor} // Usar color del tema
                    />
                </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Susc. Expiradas"
                        value={dashboardStats?.companies?.expired}
                        icon={<ErrorOutlineIcon color="warning" />}
                        loading={loadingStats}
                        color={warningColor} // Usar color del tema
                    />
                </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Susc. Canceladas"
                        value={dashboardStats?.companies?.cancelled}
                        icon={<CancelIcon color="error" />}
                        loading={loadingStats}
                        color={errorColor} // Usar color del tema
                    />
                </Grid>
            </Grid>

            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Períodos de Prueba Próximos a Expirar (7 días)
            </Typography>
            {loadingStats ? (
                 <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress />
                 </Box>
            ) : dashboardStats?.expiringTrials && dashboardStats.expiringTrials.length > 0 ? (
                <Paper elevation={2} sx={{ p: 2 }}>
                    <List dense>
                        {dashboardStats.expiringTrials.map((company) => (
                            <ListItem key={company.id} divider>
                                {/* Aquí se usa ListItemIcon */}
                                <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                                    <WarningAmberIcon color="warning" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={company.name || 'Nombre no disponible'}
                                    secondary={`Expira: ${formatDate(company.expiryDate)}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            ) : (
                 // Mostrar mensaje solo si no hay error y la lista está vacía
                 !error && (
                    <Typography variant="body1" color="text.secondary">
                        No hay períodos de prueba próximos a expirar.
                    </Typography>
                 )
            )}
        </Box>
    );
};

export default PlatformAdminDashboard;