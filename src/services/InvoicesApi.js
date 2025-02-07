const API_BASE_URL = 'http://localhost:5002/api';

export const fetchInvoices = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices?populate=client,items.product`);
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

        // Mapeo corregido de campos según el modelo
        const formattedItems = invoice.items.map(item => ({
            product: item.product?._id || item.product,  // Asegurar ObjectID válido
            quantity: item.quantity || item.cantidad,    // Adaptación de nombres
            price: item.price || item.precioUnitario,    // Adaptación de nombres
            subtotal: item.subtotal || (item.quantity * item.price) // Cálculo seguro
        }));

        // Estructura final validada con el modelo
        const invoiceData = {
            number: invoice.number,
            client: invoice.client?._id || invoice.client,
            date: invoice.date || new Date(),
            items: formattedItems,
            subtotal: invoice.subtotal,
            tax: invoice.tax || invoice.iva,
            total: invoice.total,
            status: invoice.status || 'draft'  // Valor por defecto válido
        };

        // Campos eliminados que no existen en el modelo
        delete invoiceData.moneda;
        delete invoiceData.condicionesPago;
        delete invoiceData.diasCredito;
        delete invoiceData.empresa;

        const response = await fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
            },
            body: JSON.stringify(invoiceData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
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

        if (!response.ok && response.status !== 204) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return response.status === 204 ? {} : response.json();
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
            throw new Error(`Error al generar PDF: ${response.status}`);
        }
        
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
    } catch (error) {
        console.error('Error en generatePDF:', error);
        throw error;
    }
};