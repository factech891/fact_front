// src/hooks/usePlatformAdmin.js

import { useState, useCallback } from 'react';
// Import the API service we created
import PlatformAdminApi from '../services/PlatformAdminApi';

/**
 * Custom Hook for managing platform administrator data and actions.
 * Encapsulates state for dashboard stats, companies list, loading states,
 * errors, and provides functions to interact with the PlatformAdminApi.
 */
const usePlatformAdmin = () => {
    // State for dashboard statistics
    const [dashboardStats, setDashboardStats] = useState(null);
    // State for the list of companies
    const [companies, setCompanies] = useState([]);
    // Loading state specifically for fetching dashboard stats
    const [loadingStats, setLoadingStats] = useState(false);
    // Loading state specifically for fetching the companies list
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    // General loading state for actions (extend trial, change status, etc.)
    const [loadingAction, setLoadingAction] = useState(false);
    // State to store any error messages from API calls
    const [error, setError] = useState(null);
    // State to store success messages after performing actions
    const [successMessage, setSuccessMessage] = useState(null);

    // Function to clear error and success messages (useful for UI)
    const clearMessages = useCallback(() => {
        setError(null);
        setSuccessMessage(null);
    }, []);

    // --- fetchDashboardStats CORREGIDA ---
    const fetchDashboardStats = useCallback(async () => {
        setLoadingStats(true);
        clearMessages();
        try {
            const data = await PlatformAdminApi.getDashboardStats();
            if (data.success) {
                // Usar los datos directamente tal como vienen del backend
                // Ya no necesitamos modificar nada aquí
                setDashboardStats(data.stats);
            } else {
                throw new Error(data.message || 'Failed to fetch dashboard stats');
            }
        } catch (err) {
            console.error("Hook error fetching stats:", err);
            setError(err.message || 'Error al obtener estadísticas');
            setDashboardStats(null); // Resetear stats en caso de error
        } finally {
            setLoadingStats(false);
        }
    }, [clearMessages]);
    // --- FIN fetchDashboardStats CORREGIDA ---


    // --- Funciones existentes (sin cambios recientes) ---
    const fetchCompanies = useCallback(async () => {
        setLoadingCompanies(true);
        clearMessages();
        try {
            const data = await PlatformAdminApi.getCompanies();
            if (data.success) {
                setCompanies(data.companies || []);
            } else {
                throw new Error(data.message || 'Failed to fetch companies list');
            }
        } catch (err) {
            console.error("Hook error fetching companies:", err);
            setError(err.message || 'Error al listar compañías');
            setCompanies([]);
        } finally {
            setLoadingCompanies(false);
        }
    }, [clearMessages]);

    const extendCompanyTrial = useCallback(async (companyId, days) => {
        setLoadingAction(true);
        clearMessages();
        let success = false;
        try {
            const data = await PlatformAdminApi.extendTrial(companyId, days);
            if (data.success) {
                setSuccessMessage(data.message || 'Período de prueba modificado con éxito.');
                await fetchCompanies(); // Re-fetch after action
                success = true;
            } else {
                throw new Error(data.message || 'Failed to modify trial period');
            }
        } catch (err) {
            console.error("Hook error extending trial:", err);
            setError(err.message || 'Error al modificar período de prueba');
        } finally {
            setLoadingAction(false);
        }
        return success;
    }, [clearMessages, fetchCompanies]);

    const changeCompanySubscriptionStatus = useCallback(async (companyId, status) => {
        setLoadingAction(true);
        clearMessages();
        let success = false;
        try {
            const data = await PlatformAdminApi.changeSubscriptionStatus(companyId, status);
            if (data.success) {
                setSuccessMessage(data.message || 'Estado de suscripción cambiado con éxito.');
                await fetchCompanies(); // Re-fetch after action
                success = true;
            } else {
                throw new Error(data.message || 'Failed to change subscription status');
            }
        } catch (err) {
            console.error("Hook error changing status:", err);
            setError(err.message || 'Error al cambiar estado de suscripción');
        } finally {
            setLoadingAction(false);
        }
        return success;
    }, [clearMessages, fetchCompanies]);

    const toggleCompanyActiveState = useCallback(async (companyId, active) => {
        setLoadingAction(true);
        clearMessages();
        let success = false;
        try {
            const data = await PlatformAdminApi.toggleCompanyActive(companyId, active);
            if (data.success) {
                setSuccessMessage(data.message || `Compañía ${active ? 'activada' : 'desactivada'} con éxito.`);
                await fetchCompanies(); // Re-fetch after action
                success = true;
            } else {
                throw new Error(data.message || 'Failed to toggle company active state');
            }
        } catch (err) {
            console.error("Hook error toggling active:", err);
            setError(err.message || 'Error al activar/desactivar compañía');
        } finally {
            setLoadingAction(false);
        }
        return success;
    }, [clearMessages, fetchCompanies]);

    const sendCompanyNotification = useCallback(async (companyId, notificationData) => {
        setLoadingAction(true); // Start action loading
        clearMessages(); // Clear previous messages
        let success = false;
        try {
            // Call the API service function
            const data = await PlatformAdminApi.sendNotification(companyId, notificationData);

            if (data.success) {
                setSuccessMessage(data.message || 'Notificación enviada con éxito.');
                success = true;
            } else {
                throw new Error(data.message || 'Failed to send notification');
            }
        } catch (err) {
            console.error("Hook error sending notification:", err);
            setError(err.message || 'Error al enviar la notificación');
        } finally {
            setLoadingAction(false); // Stop action loading
        }
        return success; // Return success status for UI feedback
    }, [clearMessages]);
    // --- FIN Funciones existentes ---


    // Return all state values and functions needed by components
    return {
        dashboardStats,
        companies,
        loadingStats,
        loadingCompanies,
        loadingAction,
        error,
        successMessage,
        fetchDashboardStats, // <-- Función corregida
        fetchCompanies,
        extendCompanyTrial,
        changeCompanySubscriptionStatus,
        toggleCompanyActiveState,
        sendCompanyNotification,
        clearMessages
    };
};

export default usePlatformAdmin;