// src/pages/platformAdmin/Companies.js
import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

// Importar el hook personalizado
import usePlatformAdmin from '../../hooks/usePlatformAdmin';
// Importar el componente de la tabla
import CompanyTable from '../../components/platformAdmin/CompanyTable'; // Asegúrate que la ruta sea correcta

const PlatformAdminCompanies = () => {
    // Usar el hook para obtener datos y estados de las compañías
    const {
        companies,
        loadingCompanies,
        error,
        fetchCompanies,
        clearMessages,
        extendCompanyTrial,
        changeCompanySubscriptionStatus,
        toggleCompanyActiveState,
        sendCompanyNotification, // <-- ¡AÑADIR AQUÍ para extraer la función del hook!
        successMessage,
        loadingAction
    } = usePlatformAdmin(); // Ahora sí extraemos la función

    // useEffect para cargar los datos cuando el componente se monta
    useEffect(() => {
        fetchCompanies();
        return () => clearMessages();
    }, [fetchCompanies, clearMessages]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Gestión de Compañías
            </Typography>

            {/* Mostrar error si existe al cargar la lista */}
            {error && !loadingCompanies && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>
                    {typeof error === 'string' ? error : 'Error al cargar la lista de compañías.'}
                </Alert>
            )}

             {/* Mostrar mensaje de éxito si una acción fue exitosa */}
             {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessages}>
                    {successMessage}
                </Alert>
            )}


            {/* Mostrar indicador de carga mientras se obtienen las compañías */}
            {loadingCompanies ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Cargando compañías...</Typography>
                </Box>
            ) : (
                // Renderizar la tabla si la carga finalizó
                <CompanyTable
                    companies={companies}
                    onExtendTrial={extendCompanyTrial}
                    onChangeStatus={changeCompanySubscriptionStatus} // Asegúrate que esta prop se use si es necesaria
                    onToggleActive={toggleCompanyActiveState}
                    sendCompanyNotification={sendCompanyNotification} // <-- Ahora sí se pasa la función correcta
                    loadingAction={loadingAction}
                    refreshCompanies={fetchCompanies}
                />
            )}
        </Box>
    );
};

export default PlatformAdminCompanies;