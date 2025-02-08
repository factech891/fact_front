// src/utils/pdfGenerator.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (invoice) => {
  try {
    const element = document.getElementById('invoice-preview');
    
    if (!element) {
      throw new Error('No se encontró el elemento de la factura');
    }

    // Configuración mejorada para html2canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Mayor calidad
      useCORS: true,
      logging: true, // Activar logs para debug
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (document) => {
        // Asegurar que los estilos se apliquen correctamente
        const element = document.getElementById('invoice-preview');
        if (element) {
          element.style.padding = '20px';
          element.style.backgroundColor = '#ffffff';
        }
      }
    });

    // Configuración del PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Añadir la imagen al PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Guardar el PDF
    const fileName = `factura-${invoice.number || 'nueva'}.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error detallado al generar PDF:', error);
    throw new Error('Error al generar el PDF: ' + error.message);
  }
};