// utils/pdfGenerator.js - NUEVA VERSIÓN CON HTML2CANVAS
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (invoice, options = {}) => {
  const {
    fileName = `factura_${invoice.number || 'nueva'}.pdf`,
  } = options;

  try {
    console.log('Generando PDF con html2canvas...');
    
    // Seleccionar el elemento de la vista previa que queremos capturar
    const element = document.getElementById('invoice-preview');
    
    if (!element) {
      throw new Error('No se pudo encontrar el elemento de vista previa de factura');
    }
    
    // Ocultar elementos que no queremos en el PDF (como el selector de estilos)
    const styleSelector = element.querySelector('.style-selector');
    if (styleSelector) {
      styleSelector.style.display = 'none';
    }
    
    // Configurar opciones para html2canvas
    const canvas = await html2canvas(element.querySelector('div.MuiPaper-root'), {
      scale: 2, // Mayor escala para mejor calidad
      useCORS: true, // Permite cargar imágenes de otros dominios (como logos)
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Restaurar elementos ocultos
    if (styleSelector) {
      styleSelector.style.display = '';
    }
    
    // Crear PDF con formato A4
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Dimensiones de la página A4 en mm
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calcular dimensiones para mantener la proporción
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    
    let imgWidth = pdfWidth;
    let imgHeight = pdfWidth / ratio;
    
    // Si la altura calculada es mayor que la altura del PDF, ajustamos
    if (imgHeight > pdfHeight) {
      imgHeight = pdfHeight;
      imgWidth = imgHeight * ratio;
    }
    
    // Centrar la imagen si no ocupa todo el ancho
    const x = (pdfWidth - imgWidth) / 2;
    
    // Añadir la imagen al PDF
    pdf.addImage(imgData, 'PNG', x, 0, imgWidth, imgHeight);
    
    // Si la factura es más larga que una página, podemos añadir páginas adicionales
    if (canvasHeight > pdfHeight * (canvasWidth / pdfWidth)) {
      // Calculamos cuántas páginas necesitamos
      const pageCount = Math.ceil(canvasHeight / (canvasWidth * pdfHeight / pdfWidth));
      
      // Si son más de una página, añadimos las páginas adicionales
      for (let i = 1; i < pageCount; i++) {
        pdf.addPage();
        pdf.addImage(
          imgData, 
          'PNG', 
          x, 
          -(i * pdfHeight), // Posición vertical negativa para "desplazar" hacia arriba
          imgWidth, 
          imgHeight
        );
      }
    }
    
    // Guardar PDF
    pdf.save(fileName);
    
    console.log('PDF generado correctamente:', fileName);
    return { success: true, fileName };
    
  } catch (error) {
    console.error('Error generando PDF:', error);
    alert("Error al generar PDF: " + error.message);
    return { success: false, error: error.message };
  }
};