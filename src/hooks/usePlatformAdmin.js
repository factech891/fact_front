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

    // Function to fetch dashboard statistics
    const fetchDashboardStats = useCallback(async () => {
        setLoadingStats(true); // Start loading
        clearMessages(); // Clear previous messages
        try {
            const data = await PlatformAdminApi.getDashboardStats();
            if (data.success) {
                setDashboardStats(data.stats); // Store the stats
            } else {
                // Handle cases where the API returns success: false but no HTTP error
                throw new Error(data.message || 'Failed to fetch dashboard stats');
            }
        } catch (err) {
            console.error("Hook error fetching stats:", err);
            setError(err.message || 'Error al obtener estadísticas'); // Store error message
            setDashboardStats(null); // Reset stats on error
        } finally {
            setLoadingStats(false); // Stop loading regardless of outcome
        }
    }, [clearMessages]); // Dependency: clearMessages

    // Function to fetch the list of all companies
    const fetchCompanies = useCallback(async () => {
        setLoadingCompanies(true); // Start loading
        clearMessages(); // Clear previous messages
        try {
            const data = await PlatformAdminApi.getCompanies();
            if (data.success) {
                setCompanies(data.companies || []); // Store the companies list
            } else {
                throw new Error(data.message || 'Failed to fetch companies list');
            }
        } catch (err) {
            console.error("Hook error fetching companies:", err);
            setError(err.message || 'Error al listar compañías'); // Store error message
            setCompanies([]); // Reset companies list on error
        } finally {
            setLoadingCompanies(false); // Stop loading
        }
    }, [clearMessages]); // Dependency: clearMessages

    // Function to extend or reduce a company's trial period
    const extendCompanyTrial = useCallback(async (companyId, days) => {
        setLoadingAction(true); // Start action loading
        clearMessages(); // Clear previous messages
        let success = false;
        try {
            const data = await PlatformAdminApi.extendTrial(companyId, days);
            if (data.success) {
                setSuccessMessage(data.message || 'Período de prueba modificado con éxito.');
                // Option 1: Re-fetch the companies list to reflect changes
                await fetchCompanies();
                // Option 2 (Alternative): Update local state directly (more complex if sorting/filtering)
                // setCompanies(prevCompanies => prevCompanies.map(c =>
                //     c.id === companyId ? { ...c, ...data.company } : c
                // ));
                success = true;
            } else {
                throw new Error(data.message || 'Failed to modify trial period');
            }
        } catch (err) {
            console.error("Hook error extending trial:", err);
            setError(err.message || 'Error al modificar período de prueba');
        } finally {
            setLoadingAction(false); // Stop action loading
        }
        return success; // Return success status for UI feedback
    }, [clearMessages, fetchCompanies]); // Dependencies: clearMessages, fetchCompanies

    // Function to change a company's subscription status
    const changeCompanySubscriptionStatus = useCallback(async (companyId, status) => {
        setLoadingAction(true); // Start action loading
        clearMessages(); // Clear previous messages
        let success = false;
        try {
            const data = await PlatformAdminApi.changeSubscriptionStatus(companyId, status);
            if (data.success) {
                setSuccessMessage(data.message || 'Estado de suscripción cambiado con éxito.');
                // Re-fetch companies list to show the updated status
                await fetchCompanies();
                success = true;
            } else {
                throw new Error(data.message || 'Failed to change subscription status');
            }
        } catch (err) {
            console.error("Hook error changing status:", err);
            setError(err.message || 'Error al cambiar estado de suscripción');
        } finally {
            setLoadingAction(false); // Stop action loading
        }
        return success; // Return success status
    }, [clearMessages, fetchCompanies]); // Dependencies: clearMessages, fetchCompanies

    // Function to activate or deactivate a company
    const toggleCompanyActiveState = useCallback(async (companyId, active) => {
        setLoadingAction(true); // Start action loading
        clearMessages(); // Clear previous messages
        let success = false;
        try {
            const data = await PlatformAdminApi.toggleCompanyActive(companyId, active);
            if (data.success) {
                setSuccessMessage(data.message || `Compañía ${active ? 'activada' : 'desactivada'} con éxito.`);
                 // Re-fetch companies list to show the updated active state
                await fetchCompanies();
                success = true;
            } else {
                throw new Error(data.message || 'Failed to toggle company active state');
            }
        } catch (err) {
            console.error("Hook error toggling active:", err);
            setError(err.message || 'Error al activar/desactivar compañía');
        } finally {
            setLoadingAction(false); // Stop action loading
        }
        return success; // Return success status
    }, [clearMessages, fetchCompanies]); // Dependencies: clearMessages, fetchCompanies

    // Return all state values and functions needed by components
    return {
        dashboardStats,
        companies,
        loadingStats,
        loadingCompanies,
        loadingAction,
        error,
        successMessage,
        fetchDashboardStats,
        fetchCompanies,
        extendCompanyTrial,
        changeCompanySubscriptionStatus,
        toggleCompanyActiveState,
        clearMessages // Expose function to clear messages manually if needed
    };
};

export default usePlatformAdmin;