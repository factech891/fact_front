import React from 'react';
// src/services/InvoicesApi.js
const API_BASE_URL = 'http://localhost:5002/api'; // Asegúrate que esta URL sea correcta

export const fetchInvoices = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices?populate=client,items.product`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Añadir si usas autenticación
            }
        });
        if (!response.ok) {
            throw new Error(`Error al obtener las facturas: ${response.status}`);
        }
        return response.json();
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
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(invoiceData),
        });
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: `Error HTTP ${response.status}: ${response.statusText}` };
            }
            console.error('Error del backend:', errorData);
            throw new Error(errorData.message || `Error HTTP ${response.status}: ${response.statusText}`);
        }
        if (response.status === 204) {
           return {}; 
        }
        return response.json();
    } catch (error) {
        console.error('Error en saveInvoice:', error);
        throw error;
    }
};

export const deleteInvoice = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
            }
        });

        // Status 204 (No Content) también es éxito para DELETE
        if (!response.ok && response.status !== 204) {
             let errorData;
             try {
                 errorData = await response.json();
             } catch (e) {
                 errorData = { message: `Error HTTP ${response.status}: ${response.statusText}` };
             }
             console.error('Error del backend al eliminar:', errorData);
             throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        // No intentar parsear JSON si es 204
        return response.status === 204 ? { success: true } : response.json();
    } catch (error) {
        console.error('Error en deleteInvoice:', error);
        throw error;
    }
};

export const generatePDF = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices/${id}/pdf`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
            }
        });

        if (!response.ok) {
             let errorData;
             try {
                 errorData = await response.json();
             } catch (e) {
                 errorData = { message: `Error HTTP ${response.status}: ${response.statusText}` };
             }
             console.error('Error del backend al generar PDF:', errorData);
             throw new Error(errorData.message || `Error al generar PDF: ${response.status}`);
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

    } catch (error) {
        console.error('Error en generatePDF:', error);
        // Puedes mostrar un mensaje más amigable al usuario aquí
        throw error; // Re-lanzar para manejo superior si es necesario
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
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
            },
            body: JSON.stringify({ status: statusToSend }), // Enviar solo el campo a actualizar
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: `Error HTTP ${response.status}: ${response.statusText}` };
            }
            console.error('Error del backend al actualizar estado:', errorData);
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        return response.json(); // Devolver la factura actualizada
    } catch (error) {
        console.error('Error al actualizar estado de factura:', error);
        throw error;
    }
};