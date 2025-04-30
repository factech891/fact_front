// src/services/PlatformAdminApi.js

// Import helper functions and base URL from the main api service file
import { API_BASE_URL, handleResponse, getAuthHeaders } from './api';

/**
 * Service object for interacting with the platform administrator endpoints,
 * using the shared fetch logic and authentication handling.
 */
const PlatformAdminApi = {
    /**
     * Fetches the global dashboard statistics for the platform admin.
     * Corresponds to platformAdminController.getDashboardStats in the backend.
     * @returns {Promise<Object>} A promise that resolves with the statistics object.
     * Example response data: { success: true, stats: { companies: {...}, users: {...}, expiringTrials: [...] } }
     */
    getDashboardStats: async () => {
        // Construct the full URL for the endpoint
        const url = `${API_BASE_URL}/platform-admin/stats`;
        try {
            // Make the fetch request using GET method and auth headers
            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders() // Get headers with auth token
            });
            // Process the response using the shared handler
            return handleResponse(response);
        } catch (error) {
            // Log the error for debugging (handleResponse might throw specific errors)
            console.error('Error fetching platform dashboard stats:', error.message);
            // Re-throw the error so it can be caught by the calling code (e.g., in the hook)
            throw error;
        }
    },

    /**
     * Fetches a list of all companies registered on the platform.
     * Corresponds to platformAdminController.listCompanies in the backend.
     * @returns {Promise<Object>} A promise that resolves with the list of companies.
     * Example response data: { success: true, companies: [...] }
     */
    getCompanies: async () => {
        // Construct the full URL for the endpoint
        const url = `${API_BASE_URL}/platform-admin/companies`;
        try {
            // Make the fetch request using GET method and auth headers
            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders() // Get headers with auth token
            });
            // Process the response using the shared handler
            return handleResponse(response);
        } catch (error) {
            // Log the error for debugging
            console.error('Error fetching companies list:', error.message);
            // Re-throw the error
            throw error;
        }
    },

    /**
     * Extends or reduces the trial period for a specific company.
     * Corresponds to platformAdminController.extendTrial in the backend.
     * Assumes the backend route uses POST. Adjust if it uses PUT.
     * @param {string} companyId - The ID of the company.
     * @param {number} days - The number of days to add (positive) or remove (negative). Cannot be zero.
     * @returns {Promise<Object>} A promise that resolves with the result message and updated company info.
     * Example response data: { success: true, message: "...", company: {...} }
     */
    extendTrial: async (companyId, days) => {
        // Construct the full URL for the endpoint
        const url = `${API_BASE_URL}/platform-admin/companies/extend-trial`;
        try {
            // Make the fetch request using POST method, auth headers, and JSON body
            const response = await fetch(url, {
                method: 'POST', // Or 'PUT' if your backend route is defined that way
                headers: getAuthHeaders(), // Get headers with auth token and Content-Type: application/json
                body: JSON.stringify({ companyId, days }) // Send data as JSON string
            });
            // Process the response using the shared handler
            return handleResponse(response);
        } catch (error) {
            // Log the error for debugging
            console.error('Error extending/reducing trial period:', error.message);
            // Re-throw the error
            throw error;
        }
    },

    /**
     * Changes the subscription status for a specific company.
     * Corresponds to platformAdminController.changeSubscriptionStatus in the backend.
     * Assumes the backend route uses PUT. Adjust if it uses POST.
     * @param {string} companyId - The ID of the company.
     * @param {string} status - The new status ('trial', 'active', 'expired', 'cancelled').
     * @returns {Promise<Object>} A promise that resolves with the result message and updated company info.
     * Example response data: { success: true, message: "...", company: {...} }
     */
    changeSubscriptionStatus: async (companyId, status) => {
        // Construct the full URL for the endpoint
        const url = `${API_BASE_URL}/platform-admin/companies/subscription-status`;
        try {
            // Make the fetch request using PUT method, auth headers, and JSON body
            const response = await fetch(url, {
                method: 'PUT', // Or 'POST' if your backend route is defined that way
                headers: getAuthHeaders(), // Get headers with auth token and Content-Type: application/json
                body: JSON.stringify({ companyId, status }) // Send data as JSON string
            });
            // Process the response using the shared handler
            return handleResponse(response);
        } catch (error) {
            // Log the error for debugging
            console.error('Error changing subscription status:', error.message);
            // Re-throw the error
            throw error;
        }
    },

    /**
     * Activates or deactivates a specific company (enables/disables login for its users).
     * Corresponds to platformAdminController.toggleCompanyActive in the backend.
     * Assumes the backend route uses PUT. Adjust if it uses POST.
     * @param {string} companyId - The ID of the company.
     * @param {boolean} active - The desired active state (true for active, false for inactive).
     * @returns {Promise<Object>} A promise that resolves with the result message and updated company info.
     * Example response data: { success: true, message: "...", company: {...} }
     */
    toggleCompanyActive: async (companyId, active) => {
        // Construct the full URL for the endpoint
        const url = `${API_BASE_URL}/platform-admin/companies/toggle-active`;
        try {
            // Make the fetch request using PUT method, auth headers, and JSON body
            const response = await fetch(url, {
                method: 'PUT', // Or 'POST' if your backend route is defined that way
                headers: getAuthHeaders(), // Get headers with auth token and Content-Type: application/json
                body: JSON.stringify({ companyId, active }) // Send data as JSON string
            });
            // Process the response using the shared handler
            return handleResponse(response);
        } catch (error) {
            // Log the error for debugging
            console.error('Error toggling company active state:', error.message);
            // Re-throw the error
            throw error;
        }
    },

    // --- Inicio Modificación: NUEVA FUNCIÓN para enviar notificación ---
    /**
     * Sends a custom notification to a specific company.
     * Corresponds to platformAdminController.sendNotificationToCompany in the backend.
     * @param {string} companyId - The ID of the target company.
     * @param {object} notificationData - The notification content.
     * @param {string} notificationData.title - The title of the notification.
     * @param {string} notificationData.message - The body/message of the notification.
     * @param {string} [notificationData.type='info'] - The type/severity ('info', 'warning', 'error', 'success', 'admin_message').
     * @returns {Promise<Object>} A promise that resolves with the API response (success message and created notification).
     * Example response data: { success: true, message: "...", notification: {...} }
     */
    sendNotification: async (companyId, notificationData) => {
        // Construct the full URL for the endpoint, including the companyId
        const url = `${API_BASE_URL}/platform-admin/companies/${companyId}/notify`;
        try {
            // Make the fetch request using POST method, auth headers, and JSON body
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(), // Gets Content-Type: application/json and Auth token
                body: JSON.stringify(notificationData) // Send title, message, type in the body
            });
            // Process the response using the shared handler
            return handleResponse(response);
        } catch (error) {
            // Log the error for debugging
            console.error(`Error sending notification to company ${companyId}:`, error.message);
            // Re-throw the error so it can be caught by the calling code (e.g., in the hook)
            throw error;
        }
    }
    // --- Fin Modificación: NUEVA FUNCIÓN ---
};

export default PlatformAdminApi;