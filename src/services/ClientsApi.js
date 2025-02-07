const API_BASE_URL = 'http://localhost:5002/api';

/**
 * Obtiene la lista de clientes desde el backend.
 * @returns {Promise<Array>} Lista de clientes.
 */
export const fetchClients = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/clients`);
        if (!response.ok) {
            throw new Error(`Error al obtener los clientes: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        throw error;
    }
};

/**
 * Guarda un cliente en el backend.
 * @param {Object} client - El cliente a guardar.
 * @returns {Promise<Object>} El cliente guardado.
 */
export const saveClient = async (client) => {
    try {
        const method = client.id ? 'PUT' : 'POST';
        const url = client.id 
            ? `${API_BASE_URL}/clients/${client.id}`
            : `${API_BASE_URL}/clients`;

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client),
        });

        if (!response.ok) {
            throw new Error(`Error al guardar el cliente: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error al guardar el cliente:', error);
        throw error;
    }
};

/**
 * Elimina un cliente del backend.
 * @param {string} id - El ID del cliente a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const deleteClient = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/clients/${id}`, { 
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el cliente: ${response.status}`);
        }

        // Si el backend no devuelve un JSON, retornamos un objeto vacío
        try {
            return await response.json();
        } catch {
            return {};
        }
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        throw error;
    }
};