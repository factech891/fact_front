// src/services/InvoicesApi.js
import { API_BASE_URL, handleResponse, getAuthHeaders } from './api';

export const fetchInvoices = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices?populate=client,items.product`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error al obtener las facturas:', error);
        throw error;
    }
};

export const saveInvoice = async (invoice) => {
    try {
        // Siempre usar POST para ambos casos (crear y actualizar)
        const url = `${API_BASE_URL}/invoices`;
        // Mapeo de items (asegurando enviar solo ID del producto)
        const formattedItems = invoice.items.map(item => ({
            product: item.product?._id || item.product,  // Enviar ObjectID válido
            quantity: Number(item.quantity) || 0,        // Forzar a Number
            price: Number(item.price) || 0,              // Forzar a Number
            taxExempt: Boolean(item.taxExempt) || false  // Forzar a Boolean
        }));
        // Asegurar que la fecha esté en formato ISO completo
        const formattedDate = invoice.date ? 
            (invoice.date.includes('T') ? 
                invoice.date : 
                `${invoice.date}T12:00:00.000Z`) 
            : new Date().toISOString();
        // Estructura final de datos a enviar, simplificada y con tipos adecuados
        const invoiceData = {
            // Si es actualización, incluir el _id
            ...(invoice._id && { _id: invoice._id }),
            
            // Campos esenciales
            number: invoice.number || '',
            status: invoice.status || 'draft',
            client: invoice.client?._id || invoice.client,
            date: formattedDate,
            items: formattedItems,
            
            // Campos financieros (asegurar números)
            subtotal: Number(invoice.subtotal) || 0,
            tax: Number(invoice.tax) || 0,
            total: Number(invoice.total) || 0,
            
            // Campos adicionales con valores por defecto
            moneda: invoice.moneda || 'VES',
            condicionesPago: invoice.condicionesPago || 'Contado',
            diasCredito: Number(invoice.diasCredito) || 0,
            notes: invoice.notes || '',
            terms: invoice.terms || ''
        };
        // CAMBIO CLAVE: Convertir documentType a minúsculas
        if (invoice.documentType) {
            invoiceData.documentType = invoice.documentType.toLowerCase();
        }
        console.log(`>>> [POST] Enviando datos a ${url}:`, invoiceData);
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(invoiceData),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error en saveInvoice:', error);
        throw error;
    }
};

export const deleteInvoice = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error en deleteInvoice:', error);
        // Si es un error de permisos, estandarizar el mensaje
        if (error.message.includes('permiso') || error.message.includes('acceso')) {
            throw new Error('Sin acceso.');
        }
        throw error;
    }
};

export const generatePDF = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices/${id}/pdf`, {
            headers: getAuthHeaders('application/pdf')
        });

        if (!response.ok) {
            return handleResponse(response);
        }

        const blob = await response.blob();

        // Verificar si el blob es de tipo PDF
        if (blob.type !== 'application/pdf') {
             console.error('La respuesta no fue un PDF válido. Tipo recibido:', blob.type);
             // Intentar leer como texto por si es un mensaje de error
             const errorText = await blob.text();
             console.error('Contenido de la respuesta (texto):', errorText);
             throw new Error('El servidor no devolvió un archivo PDF. Verifique los logs del servidor.');
        }

        const pdfUrl = URL.createObjectURL(blob);
        // Abrir en una nueva pestaña
        window.open(pdfUrl, '_blank');
        // Opcional: Revocar la URL después de un tiempo para liberar memoria
        // setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);

        return { success: true };
    } catch (error) {
        console.error('Error en generatePDF:', error);
        throw error;
    }
};

export const updateInvoiceStatus = async (id, newStatus) => {
    try {
        // Validar que el estado sea uno de los esperados por el backend (en minúsculas)
        const validStatuses = ['draft', 'pending', 'paid', 'partial', 'overdue', 'cancelled'];
        const statusToSend = newStatus.toLowerCase();
        if (!validStatuses.includes(statusToSend)) {
             console.error('Intento de enviar estado no válido:', newStatus);
             throw new Error(`Estado "${newStatus}" no es válido.`);
        }

        const response = await fetch(`${API_BASE_URL}/invoices/${id}/status`, {
            method: 'PATCH', // Usar PATCH para actualizaciones parciales como el estado
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: statusToSend }), // Enviar solo el campo a actualizar
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error al actualizar estado de factura:', error);
        throw error;
    }
};