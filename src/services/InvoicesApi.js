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
        const method = invoice._id ? 'PUT' : 'POST';
        const url = invoice._id
            ? `${API_BASE_URL}/invoices/${invoice._id}`
            : `${API_BASE_URL}/invoices`;

        // Mapeo de items (asegurando enviar solo ID del producto)
        const formattedItems = invoice.items.map(item => ({
            product: item.product?._id || item.product,  // Enviar ObjectID válido
            quantity: item.quantity || 0,                // Asegurar número
            price: item.price || 0,                      // Asegurar número
            // No es necesario enviar subtotal de item, backend recalcula
            taxExempt: item.taxExempt || false           // Enviar estado de exención
        }));

        // Estructura final de datos a enviar, alineada con el modelo del backend
        const invoiceData = {
            // Campos de identificación y estado
            number: invoice.number, // El backend puede generar si es POST y está vacío
            status: invoice.status || 'draft', // Estado del documento

            // Campos de cliente y fechas
            client: invoice.client?._id || invoice.client, // Enviar ObjectID válido
            date: invoice.date || new Date().toISOString().split('T')[0], // Fecha del documento

            // Campos de items y financieros
            items: formattedItems, // Array de items formateados
            subtotal: invoice.subtotal, // Subtotal calculado en frontend (backend puede recalcular/validar)
            tax: invoice.tax,           // Impuesto calculado (backend puede recalcular/validar)
            total: invoice.total,         // Total calculado (backend puede recalcular/validar)
            moneda: invoice.moneda || 'VES', // Moneda del documento

            // Campos de condiciones y configuración
            condicionesPago: invoice.condicionesPago || 'Contado', // Términos de pago
            diasCredito: invoice.diasCredito || 0, // Días de crédito (usar 0 si es Contado)

             // ---> ¡¡CORRECCIÓN AQUÍ!! <---
            notes: invoice.notes || '', // Incluir las notas del formulario
            terms: invoice.terms || ''  // Incluir los términos del formulario

            // Campo opcional para backend (si lo usas para lógica de número)
            // usePrefix: invoice.usePrefix || 'INV' // Puedes omitir si el backend lo maneja internamente
        };

        // Si es una creación (POST) y no se envió un número, podemos quitarlo
        // para que el backend lo genere. Si es PUT, debe ir el número.
        if (method === 'POST' && !invoiceData.number) {
            delete invoiceData.number;
        }
         // Si es una creación (POST), no necesitamos enviar el _id en el cuerpo
         if (method === 'POST') {
             delete invoiceData._id; // Mongoose lo ignora, pero es más limpio
         }


        console.log(`>>> [${method}] Enviando datos a ${url}:`, invoiceData); // Log detallado antes de enviar

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
            },
            body: JSON.stringify(invoiceData), // Enviar el objeto invoiceData completo
        });

        if (!response.ok) {
            // Intentar obtener más detalles del error del backend
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                // Si el cuerpo no es JSON válido
                errorData = { message: `Error HTTP ${response.status}: ${response.statusText}` };
            }
            console.error('Error del backend:', errorData);
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        // Si la respuesta es OK pero no tiene contenido (ej. 204 No Content)
        if (response.status === 204) {
           return {}; // Devuelve un objeto vacío o algo indicativo de éxito sin datos
        }

        return response.json(); // Devuelve los datos de la factura guardada/actualizada
    } catch (error) {
        console.error('Error en saveInvoice:', error);
        // Re-lanzar el error para que el componente que llama pueda manejarlo
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