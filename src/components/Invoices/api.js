const API_BASE_URL = 'http://localhost:5002/api';

/**
 * Obtiene la lista de facturas desde el backend.
 * @returns {Promise<Array>} Lista de facturas.
 */
export const fetchInvoices = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices`);
        if (!response.ok) {
            throw new Error(`Error al obtener las facturas: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error al obtener las facturas:', error);
        throw error;
    }
};

/**
 * Guarda una factura en el backend.
 * @param {Object} invoice - La factura a guardar.
 * @returns {Promise<Object>} La factura guardada.
 */
export const saveInvoice = async (invoice) => {
    try {
        const method = invoice.id ? 'PUT' : 'POST';
        const url = invoice.id 
            ? `${API_BASE_URL}/invoices/${invoice.id}`
            : `${API_BASE_URL}/invoices`;

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoice),
        });

        if (!response.ok) {
            throw new Error(`Error al guardar la factura: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error al guardar la factura:', error);
        throw error;
    }
};

/**
 * Elimina una factura del backend.
 * @param {string} id - El ID de la factura a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const deleteInvoice = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices/${id}`, { 
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la factura: ${response.status}`);
        }

        // Si el backend no devuelve un JSON, retornamos un objeto vacío
        try {
            return await response.json();
        } catch {
            return {};
        }
    } catch (error) {
        console.error('Error al eliminar la factura:', error);
        throw error;
    }
};