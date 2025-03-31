// utils/pdfGenerator.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (invoice, options = {}) => {
  const {
    fileName = `factura_${invoice.number || 'nueva'}.pdf`,
  } = options;

  try {
    console.log('Generando PDF con html2canvas...');
    
    // CAMBIO 1: Intentar diferentes formas de encontrar el elemento
    let element = document.getElementById('invoice-preview');
    
    if (!element) {
      console.warn('No se encontró elemento con ID "invoice-preview", buscando alternativas...');
      
      // Intentar con el selector de la caja de diálogo
      element = document.querySelector('.MuiDialogContent-root');
      
      if (!element) {
        // Intentar con el selector del papel
        element = document.querySelector('.MuiPaper-root');
        
        if (!element) {
          throw new Error('No se pudo encontrar el elemento de vista previa de factura');
        }
      }
      
      console.log('Elemento alternativo encontrado:', element);
    }
    
    // CAMBIO 2: Buscar el elemento Paper dentro del diálogo que contiene realmente el documento
    const paperElement = element.querySelector('.MuiPaper-root');
    const targetElement = paperElement || element;
    
    // Ocultar elementos que no queremos en el PDF (como el selector de estilos)
    const styleSelector = document.querySelector('.style-selector');
    if (styleSelector) {
      styleSelector.style.display = 'none';
    }
    
    // Configurar opciones para html2canvas
    const canvas = await html2canvas(targetElement, {
      scale: 2, // Mayor escala para mejor calidad
      useCORS: true, // Permite cargar imágenes de otros dominios (como logos)
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      // Ajustar la altura al elemento real
      height: targetElement.offsetHeight,
      windowHeight: targetElement.offsetHeight
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
      imgHeight = pdfHeight * 0.9; // Usamos solo el 90% de la altura para evitar desbordes
      imgWidth = imgHeight * ratio;
    }
    
    // Centrar la imagen si no ocupa todo el ancho
    const x = (pdfWidth - imgWidth) / 2;
    
    // Añadir la imagen al PDF
    pdf.addImage(imgData, 'PNG', x, 0, imgWidth, imgHeight);
    
    // Guardamos directamente sin añadir páginas adicionales
    pdf.save(fileName);
    
    console.log('PDF generado correctamente:', fileName);
    return { success: true, fileName };
    
  } catch (error) {
    console.error('Error generando PDF:', error);
    return { success: false, error: error.message };
  }
};