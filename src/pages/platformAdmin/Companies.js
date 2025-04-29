// src/pages/platformAdmin/Companies.js
import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

// Importar el hook personalizado
import usePlatformAdmin from '../../hooks/usePlatformAdmin';
// Importar el componente de la tabla (lo crearemos a continuación)
import CompanyTable from '../../components/platformAdmin/CompanyTable';

const PlatformAdminCompanies = () => {
    // Usar el hook para obtener datos y estados de las compañías
    const {
        companies,
        loadingCompanies,
        error,
        fetchCompanies,
        clearMessages,
        // También necesitaremos las funciones de acción más adelante
        extendCompanyTrial,
        changeCompanySubscriptionStatus,
        toggleCompanyActiveState,
        successMessage, // Para mostrar mensajes de éxito
        loadingAction // Para saber si una acción está en progreso
    } = usePlatformAdmin();

    // useEffect para cargar los datos cuando el componente se monta
    useEffect(() => {
        fetchCompanies();
        // Limpiar mensajes al desmontar (opcional)
        return () => clearMessages();
    }, [fetchCompanies, clearMessages]); // Dependencias del useEffect

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
                    // Pasaremos las funciones de acción a la tabla para los botones
                    onExtendTrial={extendCompanyTrial}
                    onChangeStatus={changeCompanySubscriptionStatus}
                    onToggleActive={toggleCompanyActiveState}
                    loadingAction={loadingAction} // Para deshabilitar botones mientras una acción ocurre
                    refreshCompanies={fetchCompanies} // Para recargar la tabla después de una acción
                />
            )}
        </Box>
    );
};

export default PlatformAdminCompanies;